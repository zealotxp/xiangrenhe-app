# 湘仁禾私域会员 APP · 前端静态原型

依据《湘仁禾私域会员APP开发需求方案 v1》制作的**多页面（MPA）静态原型**，纯原生 HTML / CSS / JS，无需构建工具，双击 `index.html` 即可在浏览器整站运行，页面之间为真实链接跳转。

## 页面清单（26 个业务页 + 1 个总览）

| 模块 | 页面 |
|---|---|
| 入口与归属 | `index.html` 启动登录、`register.html` 注册与归属、`store-apply.html` 门店申请、`invite.html` 推广码与邀请 |
| 直播 | `live.html` 直播 Tab、`live-room.html` 直播间、`live-replay.html` 录播回放、`wallet.html` 我的红包、`redpacket-config.html` 市代红包配置 |
| 商城与积分 | `mall.html` 商城 Tab、`product.html` 产品展示中心、`product-detail.html` 产品详情、`brand.html` 企业介绍、`news-detail.html` 资讯详情、`points-mall.html` 积分商城、`points.html` 我的积分、`exchange.html` 兑换与收货地址 |
| 一物一码 | `scan.html` 扫码、`lottery.html` 抽奖、`my-prizes.html` 中奖记录 |
| 数据与我的 | `promotion.html` 推广中心、`dashboard.html` 数据看板、`my-team.html` 我的团队、`profile.html` 我的、`settings.html` 设置 |
| 总览 | `sitemap.html` 全部页面缩略图看板 |

## 目录结构

```
assets/style.css    公共样式（改品牌色只需改 :root 变量）
assets/app.js       公共脚本（状态栏/导航栏/底部 Tab/弹窗/Toast/本地演示状态）
check_proto.py      静态校验（HTML 标签配平 + 站内链接检查）
VERSION / CHANGELOG.md
```

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
