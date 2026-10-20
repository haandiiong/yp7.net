---
title: ChatGPT、Claude、Gemini打不开怎么办？按错误与连接层级排查
createTime: 2026/06/26
dateModified: 2026/10/16
permalink: /posts/ai-tools-not-working/
tags:
  - ChatGPT打不开
  - Claude打不开
  - Gemini打不开
  - AI工具节点
  - ChatGPT机场
description: ChatGPT、Claude、Gemini打不开怎么办？先查平台状态和对应产品要求，再记录地区提示、登录验证、生成中断或API错误，按同设备、单一变量交叉验证，不凭节点国家或其他网站能打开推断原因。
---

更新时间：2026年10月16日（修订故障分类与排查顺序，核对OpenAI API官方文档；未新增平台或节点实测）

## 使用风险提示

AI 平台的可用地区、账号规则、风控策略和服务状态会变化。本文只提供排查思路，不保证任何节点、机场、账号或地区长期可用。使用前请核对 OpenAI、Anthropic、Google 等官方页面和服务条款。

本页处理已经发生的访问、登录和对话故障。先保留错误原文，不凭“Google能开”或一次换节点后的结果判定原因。还在比较客户端、预算或机场时，另看[AI工具节点选择指南](/posts/ai-tools-node-guide-2026/)；本页不按国家推荐节点。

<!-- more -->

## 先判断是哪一类问题

| 现象 | 先确认什么 | 暂时不能确定什么 |
|---|---|---|
| 多个常用网站都失败 | 本地基础网络、当前配置、客户端是否启动和订阅状态，见[Clash排查](/posts/clash-subscription-troubleshooting/) | 尚不能只据此认定机场停运 |
| 只有某个AI产品打不开 | 该产品的官方状态、支持范围与具体错误 | 其他网站成功不能证明这个产品也正常 |
| 能登录，但发送消息或生成中断 | 失败功能、发生时间、错误原文及是否可重复 | 没有相应测量，不能写成晚高峰丢包或某地区不稳 |
| 出现验证码或登录提示 | 按提示核对账号，记录设备、浏览器和操作 | 不能仅凭提示认定共享IP、换区或账号被封 |
| 只有手机App异常 | App版本、对应官方要求及同网络下的网页结果 | 网页与移动端的不同结果不能直接定位原因 |
| OpenAI API请求失败 | HTTP状态、具体错误码与请求所属项目 | 鉴权或额度错误不能直接归为节点故障 |

## 第一步：看官方状态和可用地区

先记录产品名称、网页/移动端/API、发生时间与目标功能，再从对应官方入口核对状态和访问要求：

- OpenAI 状态页：[status.openai.com](https://status.openai.com/)
- ChatGPT 支持地区：[ChatGPT Supported Countries](https://help.openai.com/en/articles/7947663-chatgpt-supported-countries)
- OpenAI API 支持地区：[OpenAI API Supported Countries and Territories](https://developers.openai.com/api/docs/supported-countries)
- Claude 可访问地区：[Where can I access Claude?](https://support.claude.com/en/articles/8461763-where-can-i-access-claude)
- Gemini 可用地区：[Where you can use the Gemini web app](https://support.google.com/gemini/answer/13575153?hl=en)

如果官方公告中的故障范围和时间对应你的情况，先按公告处理并保留记录。状态页没有对应故障，也不能单独证明自己的账号、网络与请求正常。

网页、移动端与API分别核对，不把一个产品的规则套给另一个。上面是官方查询入口；本次没有逐国核对ChatGPT、Claude或Gemini的支持名单。OpenAI API文档明确其名单适用于API服务，不能代替ChatGPT自己的说明。

## 第二步：记录明确错误 {#第二步-选择稳定节点}

区分“页面打不开”“账号不能登录”“消息发不出”“生成途中停止”和“某项功能无权限”，保存原始提示与出现时间。验证码、地区提示或一次中断都不能自动解释成同一种故障。

调用OpenAI API时，按2026年10月16日核对的[官方错误码说明](https://developers.openai.com/api/docs/guides/error-codes)区分：401检查凭据、组织或IP允许列表等具体提示；地区不支持对应的403核对API支持范围；429区分速率、余额、用量或支出限制。`APIConnectionError`再检查网络、代理、证书与防火墙。先读具体错误，不能一律用换节点处理，也不要把这些API错误码套在网页验证码上。

## 第三步：检查浏览器和账号环境

保留当前配置后，一次只改变一个因素：

1. 保持设备、账号、网络和目标功能不变，比较原浏览器与无痕窗口或干净配置，记录差异。
2. 按对应官方故障说明逐项检查扩展、站点数据及账号提示，不一开始就清空全部浏览器资料。
3. 检查客户端当前配置、策略组及目标请求的连接记录；需要时在同设备上比较另一个已知可用节点，保留时间与结果。
4. 再保持设备、账号和客户端不变，比较自己的另一网络；网页与App也分别记录版本和结果。

某个改动后恢复，只能说明这组前后记录有差异，不能单独证明是节点地区、IP共享、浏览器或平台造成。遇到账号限制和验证，按平台提示处理；不要反复换国家来代替核对要求。客户端通用故障见[订阅与连接排查](/posts/clash-subscription-troubleshooting/)，地区资料的阅读方法见[节点地区选择](/posts/proxy-node-region-guide/)。

## 第四步：用真实操作测试

不要只看“能打开首页”。复查自己确实需要、且账号有权限使用的功能：

1. 登录、发送消息、连续对话分别是否成功；需要上传或其他功能时另记结果。
2. 失败是否能在同一设备、账号、客户端与节点下重复出现，错误是否相同。
3. 网页与App分别是什么结果，不用Gmail、YouTube或其他AI产品的成功代替。
4. 在自己的常用时段复查，可包含20:00–23:00；没有丢包、抖动或响应计时的记录，就不补写数值或原因。

仍然失败时，整理产品与版本、发生时间、目标功能、具体错误、已做的单项对照和结果，向对应官方支持求助。截图与日志先遮住账号、订阅URL、Cookie、令牌和API密钥。本页没有新增节点测试；[ChatGPT记录榜](/rankings/chatgpt/#record-to-choice)的历史案例只用于理解证据边界，不能替你诊断当前故障。

## 常见问题

### ChatGPT 提示所在地区不可用怎么办

保留提示原文，确认使用的是ChatGPT网页、App还是OpenAI API，再查对应官方支持范围与账号要求。不能用其他网站能打开证明符合要求；有疑问时联系官方支持，以对应产品的现行要求为准。

### Claude 打不开是不是机场不支持

不能直接判断。先查Claude自己的官方要求与具体错误，再按同设备、单一变量做对照；ChatGPT成功或机场宣传支持AI都不能替代Claude记录。

### Gemini 能打开但回答很慢怎么办

记录是页面加载、发送消息还是生成过程中慢，以及时间、版本和具体提示。再按同设备、同目标功能重复观察，一次改变一个因素；没有测量，不直接写成某地区或晚高峰拥堵。

### 为什么 YouTube 很快，AI 工具还是不稳定

这是不同应用与操作的结果，不能从一个成功推断另一个正常，也不能据此确定原因。分别记录播放、登录、发送消息和生成结果，再按对应产品排查。

## 总结

按“平台状态与官方要求 → 明确错误 → 同设备单项对照 → 目标功能复查”排查。没有相应记录时保留未知，不凭国家名称、下载速度或一次恢复推断原因。需要重新选择服务时，再按[AI节点选择流程](/posts/ai-tools-node-guide-2026/)比较客户端、已有记录、预算与试用条件。

## 相关阅读

- [AI工具节点选择指南](/posts/ai-tools-node-guide-2026/)
- [ChatGPT机场榜](/rankings/chatgpt/)
- [机场节点地区怎么选](/posts/proxy-node-region-guide/)
- [Clash订阅链接导入失败怎么办](/posts/clash-subscription-troubleshooting/)
- [Google、YouTube、GitHub、Gmail打不开排查](/posts/google-youtube-github-gmail-not-working/)
