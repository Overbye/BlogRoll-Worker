// 文件读取包
const fs = require("fs");
const fetch = require("node-fetch");
const YAML = require("yaml");
// 引入 RSS 解析第三方包
const Parser = require("rss-parser");
const parser = new Parser();
// 引入 RSS 生成器
const RSS = require("rss");
// const HttpsProxyAgent = require("https-proxy-agent");
const { XMLValidator } = require('fast-xml-parser');

// TODO: 需要重点关注和修改的配置
const opmlXmlContentTitle = "idealclover Blogroll";
const maxDataJsonItemsNumberForWeb = 120; // 保存前 120 项
const maxDataJsonItemsNumberForRSS = 40; // 对RSS保存前 40 项
var feed = new RSS({
  title: "Another RSS Reader",
  description: "假装是一个RSS阅读器",
  feed_url: "https://blogroll.axz.me/rss.xml",
  site_url: "https://blogroll.axz.me/",
  image_url: "https://blogroll.axz.me/assets/logo.png",
  docs: "https://blogroll.axz.me/",
  managingEditor: "Overbye",
  webMaster: "Overbye",
  copyright: "2024 Overbye",
  language: "cn",
  ttl: "60",
});

// 其他相关配置
const feedsYamlPath = "./config/feeds.yaml";
const opmlJsonPath = "./web/src/assets/opml.json";
const dataJsonPath = "./web/src/assets/data.json";
const linkListJsonPath = "./web/public/linkList.json";
const opmlXmlPath = "./web/public/opml.xml";
const rssXmlPath = "./web/public/rss.xml";
const opmlXmlContentOp =
  '<opml version="2.0">\n  <head>\n    <title>' +
  opmlXmlContentTitle +
  "</title>\n  </head>\n  <body>\n\n";
const opmlXmlContentEd = "\n  </body>\n</opml>";

function normalizeText(value) {
  return value == null ? "" : String(value).trim();
}

function assertHttpUrl(value, fieldName, itemNumber, required = false) {
  if (!value) {
    if (required) {
      throw new Error(`feeds.yaml 第 ${itemNumber} 项缺少 ${fieldName}`);
    }
    return;
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error(`feeds.yaml 第 ${itemNumber} 项的 ${fieldName} 不是有效 URL: ${value}`);
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`feeds.yaml 第 ${itemNumber} 项的 ${fieldName} 必须使用 HTTP(S): ${value}`);
  }
}

function loadFeedConfig(filePath) {
  const config = YAML.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
  if (!config || config.version !== 1) {
    throw new Error("feeds.yaml 缺少受支持的 version: 1");
  }
  if (!Array.isArray(config.feeds) || config.feeds.length === 0) {
    throw new Error("feeds.yaml 的 feeds 必须是非空数组");
  }

  const seenTitles = new Set();
  const seenFeedUrls = new Set();
  return config.feeds.map((item, index) => {
    const itemNumber = index + 1;
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`feeds.yaml 第 ${itemNumber} 项必须是对象`);
    }

    const normalized = {
      title: normalizeText(item.title),
      htmlUrl: normalizeText(item.htmlUrl),
      description: normalizeText(item.description),
      avatarUrl: normalizeText(item.avatarUrl),
      xmlUrl: normalizeText(item.xmlUrl),
      category: normalizeText(item.category),
    };

    if (!normalized.title) {
      throw new Error(`feeds.yaml 第 ${itemNumber} 项缺少 title`);
    }
    assertHttpUrl(normalized.htmlUrl, "htmlUrl", itemNumber, true);
    assertHttpUrl(normalized.avatarUrl, "avatarUrl", itemNumber);
    assertHttpUrl(normalized.xmlUrl, "xmlUrl", itemNumber);

    if (seenTitles.has(normalized.title)) {
      throw new Error(`feeds.yaml 包含重复 title: ${normalized.title}`);
    }
    if (normalized.xmlUrl && seenFeedUrls.has(normalized.xmlUrl)) {
      throw new Error(`feeds.yaml 包含重复 xmlUrl: ${normalized.xmlUrl}`);
    }
    seenTitles.add(normalized.title);
    if (normalized.xmlUrl) {
      seenFeedUrls.add(normalized.xmlUrl);
    }

    return normalized;
  });
}

const metaJson = loadFeedConfig(feedsYamlPath);

// rss-parser.parseURL() 返回的是解析后的 Feed，而不是带有 ok/text() 的 HTTP Response。
// 统一使用 node-fetch 获取原始响应，再交给 rss-parser.parseString() 解析。
async function fetchWithRetry(url, options = {}, retries = 1, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        timeout: 15000,
        redirect: "follow",
        ...options,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BlogRoll-Worker/1.0; +https://blogroll.axz.me/)",
          Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8",
          ...(options.headers || {}),
        },
      });

      if (response.ok) {
        return response;
      }

      lastError = new Error(`HTTP ${response.status} ${response.statusText}`);
      // 除限流和超时外，4xx 通常重试也不会恢复。
      if (response.status >= 400 && response.status < 500 && ![408, 429].includes(response.status)) {
        break;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delay * 2 ** attempt));
    }
  }

  throw lastError || new Error("Unknown fetch error");
}

async function fetchWithTimeout(resource, options = {}) {
  try {
    return await fetchWithRetry(resource, options);
  } catch (error) {
    console.error(`Error fetching URL: ${resource}. Error: ${error.message}`);
    return null;
  }
}

function validateXML(xmlData) {
  const validationResult = XMLValidator.validate(xmlData, {
    allowBooleanAttributes: true, // 处理带有布尔属性的 feeds
  });

  if (validationResult !== true) {
    console.error("Invalid XML:", validationResult.err);
    return false;
  }
  return true;
}

async function fetchFeed(url) {
  try {
    const response = await fetchWithTimeout(url);
    if (!response || !response.ok) {
      console.error(`Request failed for URL: ${url}`);
      return null;
    }
    const xmlData = await response.text();
    if (validateXML(xmlData)) {
      return xmlData;
    }
    console.error(`Invalid XML data for URL: ${url}`);
    return null;
  } catch (error) {
    console.error(`Failed to fetch URL: ${url}. Error: ${error.message}`);
    return null;
  }
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(concurrency, items.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

// console.log(metaJson);

(async () => {
  try {
    const linkListJson = {};
    await mapWithConcurrency(metaJson, 6, async (meta) => {
      try {
        // 确认网站是否可以访问
        const response = await fetchWithTimeout(meta.htmlUrl);
        const whiteList = ["Sukka"];
        if ((response && response.ok) || whiteList.includes(meta.title)) {
          meta.status = "active";
        } else {
          meta.status = "lost";
          console.log("网络异常-未成功访问网站-404: " + meta.title);
          throw "404";
        }

        try {
          // 获取网站默认URL
          if (meta.avatarUrl == "") {
            const favicon = meta.htmlUrl + "/favicon.ico";
            const response = await fetchWithTimeout(favicon);
            if (response && response.ok) {
              meta.avatarUrl = favicon;
            } else {
              console.log("未成功获取图标: " + meta.title);
            }
          }
          // 获取网站默认RSS
          if (meta.xmlUrl == "") {
            const feed = meta.htmlUrl + "/feed";
            const response = await fetchWithTimeout(feed);
            if (response && response.ok) {
              meta.xmlUrl = feed;
            } else {
              console.log("未成功获取RSS: " + meta.title);
            }
          }
        } catch (err) {
          console.log("网络异常-未成功获取信息: " + meta.title);
        }
      } catch (err) {
        meta.status = "lost";
        console.log("网络异常-未成功访问网站-500: " + meta.title);
      }
    });

    for (const meta of metaJson) {
      if (linkListJson[meta.category] == null) {
        linkListJson[meta.category] = { active: [], lost: [] };
      }
      linkListJson[meta.category][meta.status].push(meta);
    }

    // 保存 linkList.json
    console.log(metaJson);
    await fs.writeFileSync(
      linkListJsonPath,
      JSON.stringify(linkListJson, null, 2),
      {
        encoding: "utf-8",
      }
    );

    // 生成 opml.json
    const opmlJson = metaJson.map(
      ({ avatarUrl, description, category, ...rest }) => {
        return rest;
      }
    );

    // 保存 opml.json 和 opml.xml
    fs.writeFileSync(opmlJsonPath, JSON.stringify(opmlJson, null, 2), {
      encoding: "utf-8",
    });
    const opmlXmlContent =
      opmlXmlContentOp +
      opmlJson
        .map(
          (lineJson) =>
            `  <outline title="${lineJson.title}" xmlUrl="${lineJson.xmlUrl}" htmlUrl="${lineJson.htmlUrl}" />\n`
        )
        .join("") +
      opmlXmlContentEd;
    fs.writeFileSync(opmlXmlPath, opmlXmlContent, { encoding: "utf-8" });

    // 并发抓取 Feed，但限制并发数，避免对上游造成突发压力。
    const feedItems = await mapWithConcurrency(metaJson, 6, async (lineJson) => {
      if (lineJson.xmlUrl == "") {
        return [];
      }

      try {
        // 读取 RSS 的具体内容
        const xmlData = await fetchFeed(lineJson.xmlUrl);
        if (xmlData) {
          const feed = await parser.parseString(xmlData);
          console.log("xmlUrl: " + lineJson.xmlUrl);

          // 数组合并
          return feed.items.flatMap((item) => {
                if (!item.title || !item.link) {
                  return [];
                }

                const pubDate = new Date(item.pubDate ?? item.isoDate ?? item.published);
                if (Number.isNaN(pubDate.getTime())) {
                  console.error(`Invalid publication date in ${lineJson.xmlUrl}: ${item.title}`);
                  return [];
                }

                return [{
                  name: lineJson.title,
                  xmlUrl: lineJson.xmlUrl,
                  htmlUrl: lineJson.htmlUrl,
                  title: item.title,
                  link: item.link,
                  summary: item.summary ? item.summary : item.content,
                  pubDate: pubDate,
                  pubDateYYMMDD: pubDate.toISOString().split("T")[0],
                  pubDateMMDD: pubDate.toISOString().split("T")[0].slice(5),
                  pubDateYY: pubDate.toISOString().slice(0, 4),
                  pubDateMM: pubDate.toISOString().slice(5, 7),
                }];
              });
        }
      } catch (err) {
        console.error(`Failed to fetch URL: ${lineJson.xmlUrl}. Error: ${err.message}`);
      }

      return [];
    });

    let dataJson = feedItems.flat();

    // 去重
    dataJson = dataJson.filter(
      (arr, index, self) => index === self.findIndex((t) => t.title === arr.title)
    );
    // 按时间顺序排序
    dataJson.sort((itemA, itemB) => (itemA.pubDate < itemB.pubDate ? 1 : -1));
    // 默认为保存前 n 项的数据, 并保证不超过当前时间
    const curDate = new Date();
    const dataJsonSliced = dataJson.filter((item) => item.pubDate <= curDate);

    const dataJsonSlicedForWeb = dataJsonSliced
      .slice(0, Math.min(maxDataJsonItemsNumberForWeb, dataJson.length))
      .map(({ summary, ...rest }) => {
        return rest;
      });
    const dataJsonSlicedForRSS = dataJsonSliced.slice(
      0,
      Math.min(maxDataJsonItemsNumberForRSS, dataJson.length)
    );

    // 写 json 数据
    fs.writeFileSync(
      dataJsonPath,
      JSON.stringify(dataJsonSlicedForWeb, null, 2),
      {
        encoding: "utf-8",
      }
    );

    if (dataJson.length > 0) {
      feed.pubDate = dataJson[0].pubDate;
    } else {
      console.error("No valid RSS data available.");
      feed.pubDate = new Date().toISOString();
    }

    //整理 RSS 数据
    for (let item of dataJsonSlicedForRSS) {
      feed.item({
        title: item.title,
        description: item.summary,
        url: item.link, // link to the item
        author: item.name, // optional - defaults to feed author property
        date: item.pubDate.toISOString(), // any format that js Date can parse.
      });
    }

    // 保存 rss.xml 文件
    const rssXmlContent = feed.xml();
    fs.writeFileSync(rssXmlPath, rssXmlContent, { encoding: "utf-8" });
    process.exit();
  } catch (error) {
    console.error("Unhandled exception:", error);
    process.exit(1); // 确保工作流检测到失败
  }
})();
