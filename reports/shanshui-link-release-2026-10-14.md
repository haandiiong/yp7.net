# 山水云邀请入口发布（2026年10月14日）

本次仅发布山水云邀请入口、页面日期和对应公开数据，共 13 个文件。此前深度检查修复及其他改稿保留在本地，未纳入本次提交。

- 提交：[b7d237e](https://github.com/haandiiong/yp7.net/commit/b7d237eaf2cf4953e83cae83975c1f36287b3613)。
- 新邀请入口：[https://yp7.yqhyym.com](https://yp7.yqhyym.com)。
- [部署流程](https://github.com/haandiiong/yp7.net/actions/runs/38568290290)、[GitHub Pages 发布](https://github.com/haandiiong/yp7.net/actions/runs/38568387776)、[IndexNow 提交](https://github.com/haandiiong/yp7.net/actions/runs/38568406944) 均成功。

提交前在干净隔离副本中，使用该提交的原锁文件完成安装、40 项现有门禁测试、类型检查、108 页生产构建及套餐表、评测归属、生成数据、跨输出一致性、103 篇内容检查。线上 CI 使用 Node 22，所有发布步骤通过。

发布后以禁用缓存的请求核验：

- `deploy-sha.txt` 与提交完整 SHA 一致。
- [山水云评测页](https://yp7.net/posts/shanshuiyun-review-2026/) 返回 200，两个邀请锚点均为新 URL，保留 sponsored、nofollow、noopener、noreferrer。
- [机场合集](https://yp7.net/posts/jichang-heji/) 返回 200，山水云官网入口为新 URL。
- `airports.json` 的一处、`rankings.json` 的三处邀请来源均为新 URL，编辑日期为 2026-10-14。
- 两篇线上页面均未发现旧邀请入口 `nhEZN9EI`；历史核价、套餐和教程来源仍保留原记录。
