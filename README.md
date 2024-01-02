# BlogRoll-Worker

> Another RSS Reader



[预览链接](https://blogroll.axz.me/)



> 假装是一个 RSS 阅读器



## 如何使用

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

既然基础已经跑起来了，接下来需要把它变成自己的，需要修改的有几处，当然，具体修改哪些看你需求：

更便捷的配置化功能什么的，接下来交给学弟实现吧。

- 修改获取的链接：直接修改这个 README.md 中下方的表格就可以了
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

## Feed

| 名称               | 网站                           | 描述（选填）                                             | 头像（默认为/favicon.ico）                                   | RSS（默认为/feed）                     | 分类      |
| ------------------ | ------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- | --------- |
| 羊毛日报           | https://ym.today/              |                                                          |                                                              | https://ym.today/feed                  | friend    |
| 反斗限免           | http://free.apprcn.com         |                                                          |                                                              | http://free.apprcn.com/feed/           | friend    |
| ZAPRO · 杂铺       | https://tmioe.com              |                                                          |                                                              | https://tmioe.com/feed                 | friend    |
| 限时免费           | https://xianshiyouhui.com      |                                                          |                                                              | https://xianshiyouhui.com/feed/        | friend    |
| i3综合社区         | https://www.i3zh.com/          |                                                          |                                                              | https://www.i3zh.com/feed              | friend    |
| 如有乐享           | https://www.aneureka.cn        |                                                          |                                                              | https://51.ruyo.net/feed/              | friend    |
| MisakaNo の 小破站 | https://blog.misaka.rest       |                                                          |                                                              | https://blog.misaka.rest/atom.xml      | friend    |
| 优米格             | https://www.4spaces.org        |                                                          |                                                              | https://www.4spaces.org/feed           | friend    |
| DIYGod             | https://diygod.me              |                                                          | https://4everland.xyz/ipfs/bafybeibefx2tyow77m2wcnsh5anaaxfy7ypxbcuapb52c4h255onqp72ye | http://diygod.me/atom.xml              | net       |
| 咸鱼不咸           | https://lcblog.cn              |                                                          |                                                              |                                        | net       |
| XZYMOE'S BLOG      | https://www.xzymoe.com         |                                                          |                                                              |                                        | net       |
| Tianyun Zhang      | https://doowzs.com             | doowzs's personal blog                                   | https://njujb.com/favicon-32x32.png                          |                                        | friend    |
| 鹏鹏               | https://blog.chper.cn          |                                                          |                                                              |                                        | friend    |
| 毛若昕             | https://www.maorx.cn           | 这里是毛若昕的个人主页                                   |                                                              |                                        | friend    |
| 冰凌胧月的小窝     | https://imiku.me               | 聆听最初的声音，向往无尽的未来                           |                                                              | https://imiku.me/index.xml             | net       |
| SimpleZero         | https://mikuac.com             |                                                          |                                                              |                                        | net       |
| VicBlog            | https://ddadaal.me             |                                                          |                                                              | https://ddadaal.me/rss.xml             | friend    |
| YSZ 的个人主页     | https://yangshangzhen.com      |                                                          | https://www.yangshangzhen.com/images/avatar.png              |                                        | friend    |
| 热铁盒             | https://rthsoftware.cn         |                                                          |                                                              |                                        | friend    |
| iznauy             | https://iznauy.github.io       |                                                          | https://avatars0.githubusercontent.com/u/22297856?s=400&u=9ac5d0437ef685b62e402ed130d67d589d234f0b&v=4 |                                        | friend    |
| Literature         | https://www.literature.hk      |                                                          |                                                              |                                        | net       |
| JBESU              | https://jbesu.com              |                                                          |                                                              |                                        | friend    |
| 青空之蓝           | https://www.ixk.me             | 站在时光一端，回忆过往记忆。                             |                                                              | https://blog.ixk.me/rss.xml            | net       |
| 樱花庄的白猫       | https://2heng.xin              |                                                          | https://2heng.xin/wp-content/static/favicon-96x96.png        |                                        | net       |
| 水风车             | https://blog.shuifengche.top   |                                                          |                                                              |                                        | friend    |
| 辣椒の酱           | https://removeif.github.io     |                                                          | https://removeif.github.io/images/avatar.jpg                 |                                        | net       |
| BoBo               | https://hewanyue.com/          | BOHC is just a blog of hechao                            | https://hewanyue.com/images/favicon.ico                      | https://hewanyue.com/atom.xml          | friend    |
| Domon              | https://www.domon.cn           | Life is Simple.                                          |                                                              | https://www.domon.cn/rss               | net       |
| BOHC!              | https://hewanyue.com           |                                                          | https://hewanyue.com/images/favicon.ico                      |                                        | net       |
| SangSir            | https://sangsir.com            |                                                          |                                                              |                                        | net       |
| 恶魔菌の记事簿     | https://meow3.family.blog      |                                                          |                                                              |                                        | net       |
| 蓝小柠的博客       | https://bleshi.com             | 是可爱的蓝孩子呀—                                        |                                                              |                                        | net       |
| 宇宙よりも遠い場所 | https://kirainmoe.com          |                                                          |                                                              | https://kirainmoe.com/index.xml        | net       |
| 小太の游乐园       | https://baka.fun               |                                                          |                                                              |                                        | net       |
| NoneData           | https://www.nonedata.com       |                                                          | https://gravatar.loli.net/avatar/8195a7772cd06cfc4fa303770d577c97 |                                        | net       |
| dna049             | https://dna049.com             |                                                          |                                                              |                                        | net       |
| Mengzelev's Blog   | https://mengzelev.github.io    |                                                          | https://mengzelev.github.io/assets/moe.ico                   |                                        | friend    |
| beyondstars        | https://exploro.one            |                                                          |                                                              | https://idx.best/api/feeds/atom        | supporter |
| Sukka              | https://blog.skk.moe           |                                                          |                                                              | https://blog.skk.moe/atom.xml          | net       |
| fengkx             | https://www.fengkx.top         |                                                          | https://www.fengkx.top/images/icons/icon-128x128.png         | https://www.fengkx.top/atom.xml        | friend    |
| JosePhilo          | https://josephilo.com          |                                                          |                                                              |                                        | net       |
| 蝉时雨             | https://chanshiyu.com          |                                                          |                                                              |                                        | net       |
| ChrAlpha 的幻想乡  | https://ichr.me                |                                                          | https://cdn.jsdelivr.net/npm/ckx@0.0.1/favicon/favicon-32x32.png | https://blog.ichr.me/atom.xml          | net       |
| SpencerWoo         | https://spencerwoo.com         | https://spencerwoo.com/static/favicons/favicon-32x32.png |                                                              |                                        | supporter |
| LadderOperator     | https://ladderoperator.top     |                                                          | https://ladderoperator.top/img/favicon.jpg                   | https://ladderoperator.top/index.xml   | friend    |
| 木子的博客         | https://blog.k8s.li            |                                                          |                                                              |                                        | net       |
| c0sMx              | https://www.c0smx.com          |                                                          | https://c0smx.lajiya.cn/favicon.ico                          |                                        | net       |
| 云游君的小站       | https://www.yunyoujun.cn       |                                                          | https://www.yunyoujun.cn/favicon.svg                         | https://www.yunyoujun.cn/atom.xml      | net       |
| 猫鱼的小站         | https://2cat.net               |                                                          | https://2cat.net/wp-content/uploads/2020/04/cropped-YZSC.TAOBAO.COM-24-192x192.png | https://2cat.net/?feed=rss2            | net       |
| MiaoTony's 小窝    | https://miaotony.xyz           |                                                          |                                                              | https://miaotony.xyz/atom.xml          | net       |
| Timegg             | https://timegg.top             |                                                          | https://timegg.top/images/favicon.ico                        | https://timegg.top/index.xml           | net       |
| Aengus Blog        | https://www.aengus.top         |                                                          |                                                              |                                        | net       |
| ALID               | https://calmtime.github.io     |                                                          | https://calmtime.github.io/img/avatar-my.jpg                 |                                        | friend    |
| klaus & laura      | https://klauslaura.cn          |                                                          |                                                              |                                        | net       |
| Kant               | https://deathfugue.com/        |                                                          |                                                              | https://deathfugue.com/index.php/feed/ | net       |
| Orangex4           | https://orangex4.cool          |                                                          | https://orangex4.cool/images/icons/profile.jpg               | https://orangex4.cool/atom.xml         | friend    |
| GeRongcun          | https://www.gerongcun.xyz/blog |                                                          |                                                              |                                        | friend    |
| 王荣胜             | https://sqdxwz.com             |                                                          |                                                              |                                        | net       |
| 小丁的个人博客     | https://tding.top              |                                                          | https://tding.top/images/avatar.webp                         | https://tding.top/atom.xml             | net       |
| 风景工作室         | https://aspire.studio          |                                                          |                                                              |                                        | net       |
| Manami             | https://www.manami.top         |                                                          |                                                              |                                        | net       |
| Oasis's Blog       | https://blog.imoasis.cn        |                                                          |                                                              |                                        | net       |
| 不鉴的安全屋       | https://ryushane.com           |                                                          |                                                              |                                        | friend    |
| 吴志成的博客       | https://hitigerzzz.github.io   |                                                          |                                                              |                                        | friend    |
| 南雍随笔           | https://ydjsir.com.cn          |                                                          | https://ydjsir.com.cn/img/avatar.png                         | https://ydjsir.com.cn/atom.xml         | friend    |
| Cyris              | https://cyris.moe              |                                                          | https://cyris.moe/images/favicon.ico                         | https://sound.cyris.moe/atom.xml       | net       |
| Dejavu's Blog      | https://blog.dejavu.moe        | Not for success, just for growing.                       | https://blog.dejavu.moe/avatar.webp                          | https://blog.dejavu.moe/index.xml      | net       |
| remiliacn          | https://www.remiliacn.com      |                                                          | https://avatars.githubusercontent.com/remiliacn              |                                        | net       |
| 青鱼博客           | https://qingyu.me              |                                                          |                                                              |                                        | friend    |
| 世说新语           | https://www.wangyurui.top      |                                                          | https://i.typlog.com/wangyr45/8354037003_3266735.png?x-oss-process=style/ss | https://wangyurui.com/feed.xml         | net       |
| 送报少年           | https://okarin.cn              |                                                          |                                                              |                                        | net       |
| itsNekoDeng        | https://dyfa.top               |                                                          | https://nekodeng.gitee.io/medias/avatar.jpg                  |                                        | net       |
| LarryZhao          | https://larryzhao.com          |                                                          | https://larryzhao.com/headimg.png                            | https://feeds.feedburner.com/larryzhao | friend    |
| Pemp's Blog        | https://pemp.top               |                                                          | https://pemp.top/images/logo.jpg                             |                                        | friend    |
| SkyWT              | https://skywt.cn               |                                                          | https://blog.skywt.cn/usr/themes/Daydream/assets/img/avatar.png |                                        | net       |
| Anomie ZJU         | https://dong2000.xyz           | A blog of whatever goes                                  | https://dong2000.xyz/wombo.png                               | https://dong2000.xyz/index.xml         | net       |
| Cysime Moflu       | https://blog.cysi.me           | 再不会遇见第二个时光                                     | https://image.glaceon.net/uploads/202205012353016.jpg        | https://blog.cysi.me/index.xml         | net       |
| RK blog            | https://blog.ohtoai.fun/       | Think N Thought                                          | https://blog.ohtoai.fun/assets/avater.png                    |                                        | net       |
