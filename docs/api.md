# ZQ-URL API

手写 API 文档工作量较大，待 [Nitro OpenAPI](https://nitro.unjs.io/config#openapi) 官方发布后我们将自动生成文档。

> 这里提供创建短链的示例接口；其余接口可暂通过浏览器开发者工具查看。

## 接口参考（Reference）

### 创建短链（Create Short Link）

```http
  POST /api/link/create
```

| Header          | 说明                 |
| :-------------- | :------------------ |
| `authorization` | `Bearer SinkCool`   |
| `content-type`  | `application/json`  |

#### 示例（Example）

```http
  POST /api/link/create
  HEADER authorization: Bearer SinkCool
  HEADER content-type: application/json
  BODY  {
          "url": "https://github.com/BAYUEQI/ZQ-URL/issues/14",
          "slug": "issue14"
        }
```

请求 BODY 必须是 JSON。

```http
  RESPONSE 201
  BODY  {
          "link": {
            "id": "xpqhaurv5q",
            "url": "https://github.com/BAYUEQI/ZQ-URL/issues/14",
            "slug": "issue14",
            "createdAt": 1718119809,
            "updatedAt": 1718119809
          }
        }
```

| 字段         | 类型         | 说明                                                                                       |
| :---------- | :---------- | :------------------------------------------------------------------------------------------ |
| `id`        | `string`    | 系统自动生成                                                                                |
| `url`       | `string`    | 提交的原始 URL，必填                                                                         |
| `slug`      | `string`    | 短链 Slug，可系统自动生成或使用传入值                                                         |
| `createdAt` | `timestamp` | 系统自动生成，UNIX 时间戳                                                                     |
| `updatedAt` | `timestamp` | 系统自动生成，UNIX 时间戳                                                                     |
