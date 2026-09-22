# 湘仁禾私域会员 APP · 前端静态原型

依据《湘仁禾私域会员APP开发需求方案 v1》制作的**多页面（MPA）静态原型**，纯原生 HTML / CSS / JS，无需构建工具，双击 `index.html` 即可在浏览器整站运行，页面之间为真实链接跳转。

## 页面清单（25 个业务页 + 1 个总览）

| 模块 | 页面 |
|---|---|
| 入口与归属 | `index.html` 启动登录、`store-apply.html` 门店申请、`invite.html` 推广码与邀请 |
| 直播 | `live.html` 直播 Tab、`live-room.html` 直播间、`live-replay.html` 录播回放、`wallet.html` 我的红包、`redpacket-config.html` 市代红包配置 |
| 商城与积分 | `mall.html` 商城 Tab、`product-detail.html` 产品详情、`brand.html` 企业介绍、`news.html` 公司新闻列表、`news-detail.html` 资讯详情、`points-mall.html` 积分商城、`points.html` 我的积分、`exchange.html` 兑换与收货地址 |
| 一物一码 | `scan.html` 扫码、`lottery.html` 抽奖、`my-prizes.html` 中奖记录 |
| 数据与我的 | `promotion.html` 推广中心、`dashboard.html` 数据看板、`my-team.html` 我的团队、`profile.html` 我的、`settings.html` 设置 |
| 总览 | `sitemap.html` 全部页面缩略图看板 |

## 目录结构

```
assets/style.css    公共样式（改品牌色只需改 :root 变量）
assets/app.js       公共脚本（状态栏/导航栏/底部 Tab/弹窗/Toast/本地演示状态）
assets/gate.js      访问密码门禁（144 段时段密码的指纹校验，无明文）
check_proto.py      静态校验（HTML 标签配平 + 站内链接检查）
scripts/release.sh  一键发布（校验 → 提交 → 打标签 → 推送）
scripts/gen_gate.py 由密码表重新生成 assets/gate.js 并注入所有页面
VERSION             当前版本号（SemVer）
CHANGELOG.md        更新记录
```

## 访问密码门禁

从**任意页面**进入原型，都会先弹出全屏锁屏，需输入「当前时段」对应的 4 位数字密码：

- 一天按 10 分钟划分为 **144 个时段**（00:00–00:09 … 23:50–23:59），每段一个固定密码
- 锁屏上会显示当前所处时段（如 `当前时段 14:30 – 14:39`），按此时段到密码表中取对应密码
- 验证通过后在**同一浏览器 2 小时内免验证**（关闭页面再打开无需重输）
- 输入错误会抖动提示，不会泄露正确密码

**安全处理**：仓库中不保存任何明文密码。密码以 `sha256(固定盐 | 段序号 | 密码)` 的前 16 字节指纹形式写入 `assets/gate.js`，并再做一层字符位移混淆；运行时对用户输入做同样运算后比对指纹，因此查看页面源码无法得到密码。

**更换密码表**：修改 `scripts/gen_gate.py` 中的 `SALT`（可选），然后执行：

```bash
python scripts/gen_gate.py <密码表.md>
```

脚本会校验密码表为 144 段且时段顺序正确，生成新的 `assets/gate.js`，并自动为所有页面注入 `<script src="assets/gate.js"></script>`（已注入的会跳过）。密码表本身请勿放入本仓库。

> 说明：这是前端演示级保护，可挡住直接查看源码与未授权访问，但无法抵御专业的逆向破解；如需更高强度，应改为服务端校验。

## 版本与更新记录

仓库地址：<https://github.com/zealotxp/xiangrenhe-app>
在线预览：<https://zealotxp.github.io/xiangrenhe-app/>

每次改代码的发布流程：

1. 判断版本类型（SemVer）
   - **MAJOR** 结构级变更：页面增删/路由重构/设计系统大改
   - **MINOR** 新增页面或新增功能模块
   - **PATCH** 样式、文案、交互细节修复
2. 改 `VERSION` 文件
3. 在 `CHANGELOG.md` 顶部新增 `## [X.Y.Z] - YYYY-MM-DD`，用 Added / Changed / Fixed 分组写清改动
4. 执行发布脚本

```bash
bash scripts/release.sh "feat(home): 首页新增今日任务板块"
```

脚本会自动跑 `check_proto.py`，校验 VERSION 与 CHANGELOG 一致后提交、按 VERSION 打 `vX.Y.Z` 标签并 `push --follow-tags`。
令牌存放在仓库根目录 `.gh_token`（已 gitignore，不会提交），也可直接用 `GH_TOKEN` 环境变量覆盖。

## 演示要点

- 登录：`index.html` 走「微信授权 → 手机号验证码 → 自动绑定归属」两步，验证码填任意 6 位数字即可
- 权限规则：未绑定推广员时首页与直播 Tab 隐藏直播入口，可在 `settings.html` 的「演示：切换绑定状态」复现
- 直播：看播计时、防挂机签到倒计时、满 30 分钟且签到 2/2 才能领红包（页内有评审用演示控制卡）
- 角色视角：`profile.html` 可切换顾客 / 推广员 / 门店 / 市代 / 省代 / 总部；`dashboard.html` 可切换五级数据看板
- 演示数据存于浏览器 localStorage，清除浏览器数据即恢复初始状态

## 校验

```bash
python check_proto.py   # 要求：标签问题页 0、缺失链接 0
```

## 待确认事项

1. 品牌主色（当前占位：深墨绿 `#12463A` + 禾金 `#B98A2B`）需客户确认
2. 直播能力依赖第三方平台，哪些可对接自有后台暂未确定
3. 页面中的示例数值（30 分钟达标、¥2 红包、200 元 = 200 积分等）仅作示例，实际由后台配置
