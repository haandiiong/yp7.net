---
title: FlClash下载与使用教程：安卓、Windows、macOS安装与订阅导入
createTime: 2026/09/09
dateModified: 2026/09/09
permalink: /posts/flclash-guide-2026/
tags:
  - FlClash
  - FlClash下载
  - FlClash使用教程
  - 订阅配置
  - Clash教程
  - 网络工具
description: FlClash怎么用？整理官方下载安装、安卓与电脑安装包选择、URL订阅导入、节点切换、系统代理、TUN模式、WebDAV备份和常见问题，并对比Clash Verge Rev的适用场景。
---

更新时间：2026年9月9日。本文按官方正式版 **v0.8.96** 的发布文件、中文界面文案和配置流程整理；后续版本的按钮位置可能调整。

**FlClash 是支持安卓和电脑的代理客户端。** 基础使用顺序是：安装软件 → 导入订阅 → 选中配置和节点 → 启动代理 → 验证访问。软件本身不附送机场账号、套餐或可用节点，需要准备兼容的订阅或配置文件。

如果主要在电脑上使用，也可以并列参考 [Clash Verge Rev 下载与使用教程](/posts/clash-verge-guide-2026/)。两款客户端各有适用场景，本页完整介绍 FlClash 的操作，不需要先安装 Clash Verge。

<!-- more -->

## FlClash是什么？支持哪些设备？

FlClash 是基于 Clash.Meta／Mihomo 内核的开源客户端，提供订阅管理、节点选择、规则分流和多端配置管理。其界面采用 Flutter，官方列出的平台为 Android、Windows、macOS 和 Linux，支持 WebDAV 数据同步。[项目介绍](https://github.com/chen08209/FlClash)

| 设备 | 是否有官方版本 | 入门方式 |
|---|---|---|
| 安卓手机、平板 | 有 | 安装 APK，导入配置后授权 VPN 连接 |
| Windows 电脑 | 有 | 安装 EXE，启动后开启系统代理或按需使用虚拟网卡 |
| Mac | 有 | 按 Intel 或 Apple 芯片选择 DMG |
| Linux 电脑 | 有 | 按发行版和处理器选择 DEB、RPM 或 AppImage |
| iPhone、iPad | 本次官方发行包未提供 | 参考 [Shadowrocket 教程](/posts/shadowrocket-guide-2026/) |

还不清楚“机场”“节点”和“订阅”的区别，可先阅读 [机场与订阅链接入门](/posts/airport-node-subscription-guide/)。FlClash 是客户端名称，不能仅凭机场写了“通用订阅”就认定所有配置都能直接使用。

## FlClash官方下载地址与安装包选择

优先从 **[FlClash 官方最新发布页](https://github.com/chen08209/FlClash/releases/latest)** 下载。展开页面中的 **Assets**，选择与你设备匹配的安装文件；不要误把 `Source code` 源码压缩包当作安装包。

截至本文复核时，最新正式版为 [v0.8.96，2026年8月17日发布](https://github.com/chen08209/FlClash/releases/tag/v0.8.96)。后续下载以官方最新发布页为准，下面列出的是这一版本的文件识别方式。

| 系统或架构 | 文件名中的识别部分 | 怎么选 |
|---|---|---|
| 安卓 ARM64 | `android-arm64-v8a.apk` | 常见的现代安卓手机；不确定时查看设备架构 |
| 安卓 ARM 32 位 | `android-armeabi-v7a.apk` | 使用对应架构的旧设备 |
| 安卓 x86_64 | `android-x86_64.apk` | 部分模拟器或 x86 设备 |
| Windows Intel／AMD 64 位 | `windows-amd64-setup.exe` | 常见电脑使用安装版；另有 ZIP 版本 |
| Windows ARM64 | `windows-arm64-setup.exe` | Windows on ARM 设备 |
| macOS Apple 芯片 | `macos-arm64.dmg` | M 系列芯片的 Mac |
| macOS Intel 芯片 | `macos-amd64.dmg` | Intel Mac；这里的 amd64 表示 x86-64 架构 |
| Linux x86-64 | `linux-amd64.deb`、`.rpm`、`.AppImage` | 根据发行版选择 |
| Linux ARM64 | `linux-arm64.deb` | 本次发行版提供 ARM64 DEB 包 |

如果你看到“FlClash iOS版”“FlClash会员”或同名下载站，应先回到上述官方仓库核对，区分第三方服务和客户端本身。

## 安卓、Windows、macOS与Linux安装方法

### 安卓安装

1. 从官方发布页下载匹配架构的 APK。
2. 打开安装文件。如果系统提示不允许安装，只为此次使用的浏览器或文件管理器开启相应安装权限。
3. 安装完成后打开 FlClash，按下文添加订阅。
4. 首次启动 VPN 连接时，核对请求来自 FlClash，再确认系统的连接授权。

如果无法安装，先核对处理器架构、系统兼容性和文件是否下载完整；已有同名应用时，先确认来源与签名，备份配置后再决定是否更换安装来源。

### Windows安装

1. 在“设置 → 系统 → 系统信息”查看系统类型，区分 x64 和 ARM64。
2. 下载对应的 `setup.exe`，按安装向导完成安装。
3. 打开 FlClash，导入配置后启动，在仪表盘或网络设置中开启“系统代理”。
4. 如果浏览器可用但某些应用无法连接，再按下文检查“虚拟网卡”与权限。

新手优先使用安装版。使用 ZIP 版本时，应先完整解压再运行，不要直接从压缩包内启动。

### macOS安装

1. 在“关于本机”查看芯片信息，下载对应 DMG。
2. 打开 DMG，将应用放入“应用程序”后启动。
3. 导入订阅、选中配置，启动后开启系统代理。
4. 如系统阻止打开，先核对官方下载来源，再按 macOS 提示处理单个应用的授权；不要全局关闭系统安全保护。

### Linux安装

Debian／Ubuntu 系统选择匹配架构的 DEB；RPM 系发行版选择 RPM。以当前目录中已下载的安装文件为例，将下面的文件名替换为实际名称：

```bash
# Debian / Ubuntu：替换成实际下载的 DEB 文件名
sudo apt install ./FlClash-版本号-linux-amd64.deb

# RPM 系发行版：替换成实际下载的 RPM 文件名
sudo dnf install ./FlClash-版本号-linux-amd64.rpm
```

这两条命令按发行版择一使用。如果缺少托盘或快捷键依赖，请按 [官方 Linux 使用说明](https://github.com/chen08209/FlClash/blob/main/README_zh_CN.md#linux)核对；官方给出的 Debian／Ubuntu 依赖为 `libayatana-appindicator3-dev` 和 `libkeybinder-3.0-dev`，其他发行版的包名可能不同。

## FlClash怎么导入订阅？

### 方法一：复制订阅地址，通过URL导入

这是没有专用“一键导入 FlClash”按钮时也可以使用的方法。

1. 在服务商后台找到订阅区域，复制适用于 **Clash／Clash Meta／Mihomo** 的配置订阅地址。
2. 打开 FlClash 的 **“配置”** 页面，点击添加按钮，进入 **“添加配置”**。
3. 选择 **“URL”**，在 **“从URL导入”** 对话框中粘贴完整地址并提交。
4. 等待配置下载完成，确认列表出现新配置，再选中它作为当前配置。
5. 进入代理或策略组页面，确认节点已经载入，选择准备使用的节点。
6. 回到仪表盘启动，并按设备开启系统代理或 VPN。

菜单名称按 [v0.8.96 配置导入实现](https://github.com/chen08209/FlClash/blob/v0.8.96/lib/views/profiles/add.dart)核对。订阅地址通常带有个人访问凭据，请勿公开到评论区、截图或第三方转换网站。

**注册邀请链接、官网首页、后台登录地址都不是订阅地址。** 如果导入后出现 HTML、登录提示或 YAML 解析错误，先重新核对复制的地址和后台提供的格式。

### 方法二：文件或二维码导入

“添加配置”还提供 **“文件”** 和 **“二维码”** 入口：

- 已有兼容配置文件：选择“文件”，导入本地 YAML 配置。
- 后台提供订阅二维码：选择“二维码”，按设备提示扫描或读取图片。
- 二维码内容必须是可用配置地址；不能把付款码或注册邀请二维码当成订阅。

本地文件导入不等于建立了远程订阅，后续服务商更换节点时，需要重新获取配置或改用可更新的 URL 订阅。

### 一键导入没有反应怎么办？

先确认已安装 FlClash，并允许浏览器唤起应用。如果机场没有专用按钮，或点击后不能唤起客户端，直接使用上面的 URL 导入流程。

**客户端支持一键导入，不代表每个机场后台都提供对应按钮。** 能导入配置也不等于节点已经连接，仍需选中配置、启动并验证访问。

## 节点选择、规则模式与开启连接

### 选中配置，再选择策略组和节点

订阅导入成功后，先确认当前启用的是刚添加的配置。在代理页面找到实际负责流量的策略组，选择节点或自动选择策略。不同订阅的策略组名称不同，可能按用途或地区分类。

延迟测试用于辅助判断响应情况，不等于下载速度，也不能证明流媒体或 AI 服务一定可用。可以换两个节点对比自己常用的网站，再决定日常使用哪个。

### 规则、全局和直连有什么区别？

| 模式 | 行为 | 使用建议 |
|---|---|---|
| 规则 | 按当前配置的规则决定直连、代理或拒绝 | 日常使用先从此模式开始 |
| 全局 | 进入内核的流量使用全局策略组 | 临时对比排查，并确认全局组已选好节点 |
| 直连 | 进入内核的流量直接连接 | 需要直连时使用 |

规则模式的效果取决于订阅内容，并非开启后就一定“国内全部直连、国外全部代理”。这些模式与系统代理、TUN 是不同设置。[Mihomo 运行模式说明](https://wiki.metacubex.one/config/general/#运行模式)

### 电脑：系统代理与TUN怎么选？

先启动 FlClash，再开启 **“系统代理”**，让遵循系统代理设置的浏览器和应用使用它。如果某些应用不读取系统代理，可检查 **“虚拟网卡（TUN）”** 是否需要启用。

TUN 用于接收流量，接收后如何分流仍由规则和出站模式决定。桌面端启用虚拟网卡时，请按客户端要求检查管理员或辅助服务权限；不要同时运行多个客户端争用系统代理、端口和虚拟网卡。[FlClash 网络设置](https://github.com/chen08209/FlClash/blob/v0.8.96/lib/views/config/network.dart)

### 安卓：开启VPN连接

导入并选中配置后，在仪表盘确认 VPN 已启用，再启动连接并完成安卓系统授权。若修改了应用分流等 VPN 设置，按客户端提示重启连接。

如果切换到后台后经常断开，再检查手机系统是否限制 FlClash 后台活动或自动结束进程。不同品牌的设置位置不同，不必为了连接而关闭所有应用的省电保护。

## 更新订阅、升级客户端与备份

### 如何更新节点列表？

在配置卡片中使用同步入口重新获取远程配置；编辑配置时可开启 **“自动更新”** 并设置更新间隔，界面单位为分钟。套餐到期、订阅地址被重置或服务商删除节点时，自动更新不能恢复账号权限。[配置编辑说明对应源码](https://github.com/chen08209/FlClash/blob/v0.8.96/lib/views/profiles/edit.dart)

更新订阅和升级 FlClash 是两件事：前者更新服务商配置，后者更新客户端。升级前先保存配置，再从官方发布页获取匹配系统的版本。

### 如何备份或换设备？

进入 **“备份与恢复”**，可以选择本地文件备份，也可以绑定自己的 WebDAV 服务。需要远程备份时，填写服务地址、账号和密码，确认连通后再备份；另一设备安装 FlClash 后，从相同位置恢复。

恢复前先备份目标设备现有数据，并确认恢复范围。安卓 VPN 权限与电脑系统代理设置需要在各设备上分别核对。备份文件可能包含订阅凭据，应放在自己控制的存储位置。[备份与恢复功能](https://github.com/chen08209/FlClash/blob/v0.8.96/lib/views/backup_and_restore.dart)

## FlClash常见问题与排查顺序

### 导入失败、配置为空怎么办？

先检查链接是否完整、套餐是否有效，再确认后台给出的是兼容的 Clash 配置。导入报错时保留错误文字，并核对 FlClash 版本；不要连续更换多个随机转换网站。详细流程见 [Clash订阅导入失败排查](/posts/clash-subscription-troubleshooting/)。

### 有节点、有延迟，但网页打不开怎么办？

按顺序确认当前配置已选中、客户端已启动、系统代理或安卓 VPN 已启用，然后检查实际使用的策略组是否选到了可用节点。再换一个节点和目标网站交叉判断；仅有延迟结果并不能证明浏览器流量已进入客户端。

如果只有个别网站异常，可继续看 [Google、YouTube、GitHub、Gmail打不开排查](/posts/google-youtube-github-gmail-not-working/)；AI 服务问题参考 [ChatGPT、Claude、Gemini打不开排查](/posts/ai-tools-not-working/)。

### TUN无法启动或提示权限问题怎么办？

先查看客户端错误日志和权限提示，确认其他 VPN 或代理软件已经停止，再检查系统防火墙、端口和虚拟网卡冲突。桌面端可先用系统代理验证同一配置是否可用，缩小问题范围。不要把所有 TUN 错误都当成机场节点失效。

### FlClash免费吗？为什么还要购买订阅？

FlClash 客户端开源免费；节点、流量与套餐由你使用的服务商提供，或由你自行搭建。安装客户端不会自动获得付费机场服务。需要筛选服务时，可参考 [Clash与通用订阅机场榜](/rankings/clash/)，购买前确认格式、设备限制和有效期。

### FlClash和Clash Verge Rev选哪个？

| 使用需求 | 可优先阅读的教程 |
|---|---|
| 安卓手机和电脑希望使用相近的界面 | 本篇 FlClash 教程 |
| 主要使用电脑，希望了解 Rev 的配置增强与桌面功能 | [Clash Verge Rev 教程](/posts/clash-verge-guide-2026/) |
| 已经有一款运行正常，只想更换机场 | 先更新订阅，无需仅为换机场而更换客户端 |
| iPhone 或 iPad | [Shadowrocket 教程](/posts/shadowrocket-guide-2026/) |

两款客户端都采用 Mihomo 体系；具体协议与配置兼容性仍取决于所带内核版本。FlClash 也提供配置覆写功能，不能简单理解成“只能导入订阅的精简版”。选择时看设备、配置需求和操作习惯，不用 GitHub 星标数判断连接速度。[FlClash 配置覆写](https://github.com/chen08209/FlClash/tree/v0.8.96/lib/views/profiles/overwrite)、[Clash Verge Rev 功能介绍](https://github.com/clash-verge-rev/clash-verge-rev#features)

## 相关阅读

- [Clash Verge Rev下载与使用教程](/posts/clash-verge-guide-2026/)
- [Clash Meta安卓安装与订阅配置](/posts/clash-for-android-guide-2026/)
- [机场是什么：节点与订阅链接入门](/posts/airport-node-subscription-guide/)
- [Clash订阅链接导入失败怎么办](/posts/clash-subscription-troubleshooting/)
- [2026机场推荐：套餐、客户端与风险对比](/posts/jichang-tuijian/)
- [Clash与通用订阅机场筛选](/rankings/clash/)
