---
title: 使用教程：从机场入门到客户端安装与连接排错
createTime: 2026/10/29
dateModified: 2026/10/29
permalink: /guides/
article: false
sidebar: false
description: 按第一次使用、已有订阅、设备安装与故障现象查找教程，从机场和客户端的区别、购买试用，到订阅导入、应用访问和节点验证，找到适合当前步骤的下一篇指南。
---

[机场推荐](/posts/jichang-tuijian/) · [机场大全](/posts/jichang-heji/) · [风险监测](/risk-monitor/)

**先按你现在做到哪一步选择。** 还没有订阅，先了解购买和试用规则；已有订阅，直接核对后台提供的客户端与配置格式；已经能连接但某个应用打不开，按现象进入排错教程。

- **第一次使用：** 从下方[五步入门](#first-use)开始，分清客户端、订阅与节点。
- **已有订阅，要安装或换设备：** 看[按设备找教程](#devices)。软件下载和订阅套餐分别确认，安装客户端不会自动获得节点。
- **导入或连接遇到问题：** 跳到[故障排查](#troubleshooting)，先定位出错的环节。

## 第一次使用：按五步完成 {#first-use}

| 当前步骤 | 先解决的问题 | 下一篇教程 |
|---|---|---|
| 1. 了解基本概念 | 机场、节点、订阅链接和客户端分别负责什么 | [机场与订阅入门](/posts/airport-node-subscription-guide/) |
| 2. 比较并尝试服务 | 怎样核对套餐周期、试用、付款及退款条件 | [机场购买与试用流程](/posts/jichang-buying-guide/)；需要比较候选时看[机场推荐](/posts/jichang-tuijian/) |
| 3. 选择自己的使用方式 | 导入第三方订阅，还是使用服务商账号登录 | [客户端选择与官方下载入口](/posts/airport-tools/) |
| 4. 导入并启用配置 | 按设备教程添加订阅、选择配置和连接节点 | 选择下方[设备教程](#devices)；导入报错时看[订阅排查](/posts/clash-subscription-troubleshooting/) |
| 5. 验证常用功能 | 网页、登录、对话或视频是否按自己的需求工作 | [个人测速与验证方法](/posts/speedtest-vpn/)；遇到应用问题看[应用教程](#applications) |

已完成某一步，可以直接进入下一步。只有账号登录方式的服务，应按它提供的平台教程操作；有通用订阅也要确认格式与所用客户端相符。

## 按设备找教程 {#devices}

先看机场后台提供的格式和系统要求，再选对应教程。具体下载来源、版本及操作步骤在各教程中说明。

| 设备或使用方式 | 可查阅的教程 | 操作前确认 |
|---|---|---|
| iPhone / iPad | [Clash Mi](/posts/clash-mi-guide-2026/) · [Shadowrocket（小火箭）](/posts/shadowrocket-guide-2026/) | 应用商店地区、系统要求与订阅格式；已有可用软件可先沿用 |
| Android | [FlClash 安卓安装](/posts/flclash-guide-2026/#安卓安装) · [Clash Meta for Android](/posts/clash-for-android-guide-2026/) | 安装包架构、VPN连接授权及后台运行设置 |
| Windows / macOS | [FlClash](/posts/flclash-guide-2026/) · [Clash Verge Rev](/posts/clash-verge-guide-2026/)；Windows另有[v2rayN教程](/posts/v2rayn-guide-2026/) | 系统与处理器对应的安装包、后台给出的配置格式 |
| 服务商专属客户端 | [专属客户端服务资料](/rankings/dedicated-client/) | 对应系统是否受支持、登录步骤、试用范围与能否导出订阅 |

不确定选哪种软件，先回到[客户端工具指南](/posts/airport-tools/)比较使用方式。路由器使用者先看下方[进阶基础](#advanced)，确认设备和网络结构后再配置。

## 按现象排查问题 {#troubleshooting}

| 你遇到的现象 | 从哪里开始 | 先记录什么 |
|---|---|---|
| 订阅导入失败、更新失败、节点全红 | [订阅与客户端排错](/posts/clash-subscription-troubleshooting/) | 客户端、完整错误提示、套餐和流量状态；个人订阅地址不要公开 |
| Google、YouTube、GitHub或Gmail打不开 | [外网应用连接排查](/posts/google-youtube-github-gmail-not-working/) | 是所有应用都失败，还是网页、登录、播放或终端中的某一项失败 |
| 已能连接，ChatGPT、Claude或Gemini仍报错 | [AI工具打不开排查](/posts/ai-tools-not-working/) | 目标产品、操作步骤和原始错误，区分连接、账号与平台限制 |

同一设备能打开网页，不代表所有软件都经过相同代理路径。先描述失败的具体功能，再按对应教程逐层检查；购买或续费前，也可查看[机场风险记录](/risk-monitor/)。

## 应用使用与排错 {#applications}

| 目标应用 | 入门与使用 | 节点或故障问题 |
|---|---|---|
| ChatGPT及其他AI工具 | [ChatGPT使用入门](/posts/chatgpt-guide-2026/) | [AI节点选择](/posts/ai-tools-node-guide-2026/) · [打不开排查](/posts/ai-tools-not-working/) |
| TikTok | [TikTok下载、注册与环境说明](/posts/tiktok-guide-2026/) | [节点与账号环境](/posts/tiktok-vpn-recommend/) · [无网络及地区问题排查](/posts/tiktok-not-working/) |
| Telegram | [下载安装、登录、安全及代理设置](/posts/telegram-guide-2026/) | 按同篇教程的注册登录、代理和账号安全章节查找 |

节点连接成功与应用账号、地区及具体功能是否可用分别判断。需要比较已有测试资料时，可看[ChatGPT记录](/rankings/chatgpt/)和[流媒体记录](/rankings/streaming/)，并留意测试日期与实际覆盖范围。

## 进阶基础与个人验证 {#advanced}

- **想了解连接原理：** [VPN、代理与机场的区别](/posts/vpn-guide-2026/)，再看[代理协议区别](/posts/proxy-protocols-guide/)和[直连、中转、IPLC、IEPL、BGP线路区别](/posts/iplc-iepl-bgp-relay-direct-guide/)。
- **不知道选哪个地区：** [节点地区选择](/posts/proxy-node-region-guide/)，按目标应用、具体记录和自己的网络验证。
- **准备在路由器上使用：** 先看[软路由与主路由、旁路由基础](/posts/soft-router-guide-2026/)，再看[OpenWrt与OpenClash配置教程](/posts/router-vpn-setup-2026/)。
- **想比较节点表现：** [个人测速和记录方法](/posts/speedtest-vpn/)说明如何保留条件与结果；[本站推荐方法与数据来源](/methodology/)说明推荐资料和测试证据的使用范围。

::: details 其他辅助资料

以下保留站内已有的支付概念资料，供遇到相关术语时查阅：

- [USDT基础概念与风险](/posts/what-is-usdt/)
- [OKX交易所介绍与风险说明](/posts/okx-review/)

:::
