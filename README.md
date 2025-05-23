# BlogRoll-Worker

> Another RSS Reader



[预览链接](https://blogroll.axz.me/)



> 假装是一个 RSS 阅读器


<details>
## <summary>  如何使用 </summary>

如果你也想整一个的话，其实也不难，相对还是比较好办的

### Fork 项目

这个就不用我教了吧，看见右上角那个 fork 按钮了不，点就完事了！

生成一个自己的仓库之后好方便做更新和修改。

### 配置 CloudFlare

最重要的是先配置 CloudFlare，让整个链路先跑起来，之后的具体代码再怎么改都来得及。

CloudFlare 的网站在 [这里](https://cloudflare.com/)，注册账号之后先在左侧选中 `workers`， 注册一个 workers

然后在 [这里](https://dash.cloudflare.com/profile/api-tokens) 注册一个 api 密钥，并且在你 fork 的 GitHub 仓库中 `Settings` 的 `Secrets` 里添加一个叫 `CF_WORKERS_TOKEN` 的密钥，把刚刚申请的 api 密钥添加进去

最后进入到 [wrangler.toml](wrangler.toml) 中，修改这个文件里面的 `account_id` 和 `zone_id`，其中 `account_id` 可以在 `workers` 中获取到，而对于 `zone_id`，如果你没有自定义域名的诉求，可以在最前面加井号注释掉

修改完成并同步到 main 分支之后，GitHub Actions 应该会自动启动，观察执行情况就可以了。正常来讲应该会执行成功的。

### 本地部署与修改

外观样式DIY：

- RSS订阅：直接修改 README.md 中下方的表格就可以了
- RSS Anything:https://rss.diffbot.com/
- RSS Hub：https://rsshub.axz.me/
- RSS Proxy：https://proxy-rssfeed.axz.me/
- RSS Worker:https://rss-worker.overbye.workers.dev/rss/
- 修改 logo 等其他前端展现（已标记 TODO）
  - ./web/public/favicon.ico -- 网站 icon
  - ./src/assets/logo.png -- 页内显示 logo
  - ./src/index.html -- 页面 title
  - ./src/APP.vue -- 页内标题及 banner 文案
- 修改自动生成的 RSS 信息（已标记 TODO）：index.js

在本地想部署起来的话，直接 clone 你自己 fork 出的仓库到本地，然后作为标准 npm 项目去部署

```
# 安装依赖
npm install

# 开发
npm run dev

# 测试 RSS 获取

npm run gen

# 构建
npm run build
```

## LICENSE

项目基于 [NJU-LUG/Blogroll](https://github.com/nju-lug/blogroll) & [Friend-Link-House](https://github.com/idealclover/Friend-Link-House)，采用 [MIT Licence](./LICENSE)
</details>

<details>

## <summary>  Feed </summary>

| 名称                  | 网站                                 | 描述（选填） | 头像（默认为/favicon.ico） | RSS（默认为/feed）                                           | 分类 |
| --------------------- | ------------------------------------ | ------------ | -------------------------- | ------------------------------------------------------------ | ---- |
| 羊毛日报              | https://ym.today                     |              |                            | https://ym.today/feed                                        |      |
| 反斗限免              | http://free.apprcn.com               |              |                            | http://free.apprcn.com/feed                                  |      |
| ZAPRO · 杂铺          | https://tmioe.com                    |              |                            | https://tmioe.com/feed                                       |      |
| 限时免费              | https://xianshiyouhui.com            |              |                            | https://xianshiyouhui.com/feed                               |      |
| i3综合社区            | https://www.i3zh.com                 |              |                            | https://www.i3zh.com/feed                                    |      |
| 如有乐享              | https://51.ruyo.net                  |              |                            | https://51.ruyo.net/feed/                                    |      |
| MisakaNo の 小破站    | https://blog.misaka.rest             |              |                            | https://blog.misaka.rest/atom.xml                            |      |
| 优米格                | https://www.4spaces.org              |              |                            | https://www.4spaces.org/feed                                 |      |
| Mareep                | https://blog.mareep.net              |              |                            | https://blog.mareep.net/atom.xml                             |      |
| ahhhhfs               | https://www.ahhhhfs.com              |              |                            | https://www.ahhhhfs.com/feed.xml                             |      |
| omii                  | https://omii.top                     |              |                            | https://omii.top/feed                                        |      |
| 黑海洋wiki            | https://blog.upx8.com                |              |                            | https://blog.upx8.com/feed                                   |      |
| 煙花巷陌              | https://blog.ilue.pp.ua              |              |                            | https://blog.ilue.pp.ua/rss.xml                              |      |
| Shiina's Bulog        | https://blog.shiina.fun              |              |                            | https://blog.shiina.fun/feed                                 |      |
| 麦麦同学              | https://www.mmtx.net                 |              |                            | https://www.mmtx.net/feed                                    |      |
| 爱乐唯                | https://ilev.net                     |              |                            | https://ilev.net/?feed=rss                                   |      |
| AppInn                | https://www.applnn.cc                |              |                            | https://www.applnn.cc/feed                                   |      |
| 老白博客              | https://www.xcbtmw.com               |              |                            | https://www.xcbtmw.com/feed                                  |      |
| ooly                  | https://ooly.cc                      |              |                            | https://ooly.cc/feed                                         |      |
| 整点猫咪              | https://surge.tel                    |              |                            | https://surge.tel/rss                                        |      |
| 耕读                  | http://igdux.com                     |              |                            | http://igdux.com/feed                                        |      |
| 小五四博客            | https://blog.xiao54.com              |              |                            | https://blog.xiao54.com/feed.php                             |      |
| 小叶云                | https://www.xiaoyeyun6.com           |              |                            | https://www.xiaoyeyun6.com/index.php/feed                    |      |
| 清~幽殇               | https://isedu.top                    |              |                            | https://isedu.top/feed                                       |      |
| 享乐分享              | https://xiangleshare.com             |              |                            | https://xiangleshare.com/feed                                |      |
| 熊猫软件站            | https://www.uuzz.cc                  |              |                            | https://www.uuzz.cc/feed                                     |      |
| 倾城于你              | https://qninq.cn                     |              |                            | https://qninq.cn/feed                                        |      |
| HighPing              | https://blog.highp.ing               |              |                            | https://blog.c1oudf1are.eu.org/index.xml                     |      |
| 可汗勤政              | https://space.bilibili.com/23947287/ |              |                            | https://rss-worker.overbye.workers.dev/rss/bilibili/user/video/23947287 |      |
| TG:Newlearnerの自留地 | https://t.me/NewlearnerChannel       |              |                            | https://rss-worker.overbye.workers.dev/rss/telegram/channel/NewlearnerChannel |      |
| 火凤凰                | https://rulel.com                    |              |                            | https://rulel.com/feed                                       |      |
| 猫猫博客              | https://catcat.blog                  |              |                            | https://catcat.blog/feed                                     |      |
| 素材资源网            | https://www.sucaizy.com              |              |                            | https://www.sucaizy.com/feed                                 |      |
| 回声                  | https://iecho.cc                     |              |                            | https://iecho.cc/atom.xml                                    |      |
|                       |                                      |              |                            |                                                              |      |
|                       |                                      |              |                            |                                                              |      |
|                       |                                      |              |                            |                                                              |      |
|                       |                                      |              |                            |                                                              |      |
|                       |                                      |              |                            |                                                              |      |
