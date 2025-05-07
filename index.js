// 文件读取包
const fs = require("fs");
// 引入 RSS 解析第三方包
const Parser = require("rss-parser");
const parser = new Parser({
  timeout: 30000, // 将超时时间增加到 30 秒
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
});
// 引入 RSS 生成器
const RSS = require("rss");
// const HttpsProxyAgent = require("https-proxy-agent");

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
const readmeMdPath = "./README.md";
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

// 解析 README 中的表格，转为 JSON
const pattern =
  /\| *([^\|]*) *\| *(http[^\|]*) *\| *([^\|\n]*) *\| *([^\| \n]*) *\| *([^\| \n]*) *\| *([^\| \n]*) *\|\n/g;
  // /\| *([^\|]*) *\| *(http[^\|]*) *\| *([^\|\n]*) *\| *([^\| \n]*) *\| *([^\| \n]*) *\| *([^\| \n]*) *\|/g;
const readmeMdContent = fs.readFileSync(readmeMdPath, { encoding: "utf-8" });

const metaJson = [];
let resultArray;
while ((resultArray = pattern.exec(readmeMdContent)) !== null) {
  metaJson.push({
    title: resultArray[1].trim(),
    htmlUrl: resultArray[2].trim(),
    description: resultArray[3].trim(),
    avatarUrl: resultArray[4].trim(),
    xmlUrl: resultArray[5].trim(),
    category: resultArray[6].trim(),
  });
}

// 添加重试逻辑
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    return await parser.parseURL(url);
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(url, retries - 1, delay * 2);
    }
    throw error;
  }
}

// 修改 fetchWithTimeout 函数，使用 fetchWithRetry
async function fetchWithTimeout(resource, options = {}) {
  return fetchWithRetry(resource, options);
}

// console.log(metaJson);

(async () => {
  const linkListJson = {};
  for (const meta of metaJson) {
    try {
      // 确认网站是否可以访问
      const response = await fetchWithTimeout(meta.htmlUrl);
      const whiteList = ["Sukka"];
      if (response.ok || whiteList.includes(meta["title"])) {
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
          if (response.ok) {
            meta.avatarUrl = favicon;
          } else {
            console.log("未成功获取图标: " + meta.title);
          }
        }
        // 获取网站默认RSS
        if (meta.xmlUrl == "") {
          const feed = meta.htmlUrl + "/feed";
          const response = await fetchWithTimeout(feed);
          if (response.ok) {
            meta.xmlUrl = feed;
          } else {
            console.log("未成功获取RSS: " + meta.title);
          }
        }
      } catch (err) {
        // console.log(err);
        console.log("网络异常-未成功获取信息: " + meta.title);
      }
    } catch (err) {
      // console.log(err);
      meta.status = "lost";
      console.log("网络异常-未成功访问网站-500: " + meta.title);
    }
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

  // 用于存储各项数据
  dataJson = [];

  for (const lineJson of metaJson) {
    if (lineJson.xmlUrl == "") {
      continue;
    }

    try {
      // 读取 RSS 的具体内容
      const feed = await parser.parseURL(lineJson.xmlUrl);
      console.log("xmlUrl: " + lineJson.xmlUrl);

      // 数组合并
      dataJson.push.apply(
        dataJson,
        feed.items
          .filter((item) => item.title)
          .map((item) => {
            // console.log(item)
            const pubDate = new Date(item.pubDate ?? item.published);
            // console.log(pubDate);
            return {
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
            };
          })
      );
    } catch (err) {
      // 网络超时，进行 Log 报告
      console.log(err);
      console.log("-------------------------");
      console.log("xmlUrl: " + lineJson.xmlUrl);
      console.log("-------------------------");
    }
  }

  // 去重
  // https://stackoverflow.com/questions/23507853/remove-duplicate-objects-from-json-array
  dataJson = dataJson.filter(
    (arr, index, self) => index === self.findIndex((t) => t.title === arr.title)
  );
  // 按时间顺序排序
  dataJson.sort((itemA, itemB) => (itemA.pubDate < itemB.pubDate ? 1 : -1));
  // 默认为保存前 n 项的数据, 并保证不超过当前时间
  // for (let item of dataJson) {
  //   console.log(item.title);
  // }
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

  feed.pubDate = dataJson[0].pubDate;

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
})();
