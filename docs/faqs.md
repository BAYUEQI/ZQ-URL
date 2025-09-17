# 常见问题（FAQs）

## 1. 为什么我无法创建短链？

请检查 Cloudflare KV 的绑定配置，变量名需与代码一致并使用全大写：`URL`。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare 中 KV 绑定设置" src="/docs/images/faqs-kv.png"/>
</details>

## 2. 为什么无法登录？

请检查 `NUXT_SITE_TOKEN` 是否被设置为纯数字。出于安全考虑，ZQ-URL 不支持纯数字的 Token。

## 3. 为什么看不到分析数据？

分析数据依赖 Cloudflare 侧的配置：

1. 核对 `NUXT_CF_ACCOUNT_ID` 与 `NUXT_CF_API_TOKEN` 是否正确（确保 Account ID 与部署账户一致）。
2. 确认 Workers 的 Analytics Engine 已启用。

<details>
  <summary><b>截图</b></summary>
  <img alt="Cloudflare 中 Analytics Engine 绑定设置" src="/docs/images/faqs-Analytics_engine.png"/>
</details>

## 4. 我不想用默认首页，可以直接跳转到我的博客吗？

可以。将环境变量 `NUXT_HOME_URL` 设置为你的博客或官网地址即可。

## 5. 用 NuxtHub 部署后为什么没有统计数据？

NuxtHub 的 `ANALYTICS` 指向它自己的数据集，你需要将 `NUXT_DATASET` 环境变量设置为相同的数据集名。

## 6. 为什么短链默认大小写不敏感？

这是 ZQ-URL 的设计：默认会将所有 Slug 转为小写，以避免大小写问题、提升可用性，防止用户因大小写差异导致访问失败。

如果你需要区分大小写，可将 `NUXT_CASE_SENSITIVE` 设为 `true`。

### 当 `NUXT_CASE_SENSITIVE` 为 `true` 时会发生什么？

新生成的链接将区分大小写，例如 `MyLink` 与 `mylink` 会被视为不同。随机生成的 Slug 会包含大小写字符，组合更多但对用户不够友好（因此默认不开启）。

## 7. 为什么 Metric 列表只显示最多 500 条？

为提升查询性能，我们限制了单次查询的数据量。你可以通过 `NUXT_LIST_QUERY_LIMIT` 调整上限。

## 8. 我不想统计爬虫/机器人流量

将 `NUXT_DISABLE_BOT_ACCESS_LOG` 设置为 `true` 即可。
