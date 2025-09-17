# ZQ-URL 配置说明

ZQ-URL 提供了一系列环境变量配置，可参考 [.env.example](../.env.example)。

> 使用 Workers 形态部署时，带有 `NUXT_PUBLIC_` 前缀的变量需要同时在 Workers 的 **Settings -> Build -> Variables and Secrets** 与 **Settings -> Variables and Secrets** 中进行配置。

## `NUXT_PUBLIC_PREVIEW_MODE`

> 若使用 Workers 部署，该变量需在 **Settings -> Build -> Variables and Secrets** 与 **Settings -> Variables and Secrets** 同步配置。

将站点设置为演示模式：生成的短链 5 分钟后过期，且不可编辑或删除。

## `NUXT_PUBLIC_SLUG_DEFAULT_LENGTH`

> 若使用 Workers 部署，该变量需在 **Settings -> Build -> Variables and Secrets** 与 **Settings -> Variables and Secrets** 同步配置。

设置系统自动生成 SLUG 的默认长度。

## `NUXT_REDIRECT_STATUS_CODE`

短链跳转的默认 HTTP 状态码为 301，可按需改为 `302`/`307`/`308`。

## `NUXT_LINK_CACHE_TTL`

跳转结果缓存 TTL（秒）。合理的缓存可加速访问，但过长会导致变更生效变慢。默认 60 秒。

## `NUXT_REDIRECT_WITH_QUERY`

是否在跳转时携带原始 URL 的查询参数。默认不携带，不建议轻易开启。

## `NUXT_HOME_URL`

默认首页为介绍页面，可设置为你的官网或博客地址。

## `NUXT_DATASET`

Workers Analytics Engine 的数据集名。除非需要迁移/清空历史数据，一般不建议修改。

## `NUXT_AI_MODEL`

配置用于 AI Slug 的模型名称。可在 [Workers AI Models](https://developers.cloudflare.com/workers-ai/models/#text-generation) 查看支持的模型。

## `NUXT_AI_PROMPT`

自定义生成 Slug 的提示词，建议保留占位符 `{slugRegex}`。

默认 Prompt：

```txt
You are a URL shortening assistant, please shorten the URL provided by the user into a SLUG. The SLUG information must come from the URL itself, do not make any assumptions. A SLUG is human-readable and should not exceed three words and can be validated using regular expressions {slugRegex} . Only the best one is returned, the format must be JSON reference {"slug": "example-slug"}
```

## `NUXT_CASE_SENSITIVE`

是否区分大小写。设为 `true` 时，`MyLink` 与 `mylink` 视为不同。

## `NUXT_LIST_QUERY_LIMIT`

Metric 列表的最大查询条数上限。

## `NUXT_DISABLE_BOT_ACCESS_LOG`

是否排除爬虫/机器人流量的统计。

## `NUXT_API_CORS`

构建时设置 `NUXT_API_CORS=true` 可为 API 启用 CORS 支持。
