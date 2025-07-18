## 演示
[https://url.520jacky.dpdns.org/](https://url.520jacky.dpdns.org/)

## 使用 Cloudflare Pages 部署

1.  **Fork 本项目**
2.  **登录 Cloudflare 控制台：** [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
3.  **创建 Pages 项目：** 在您的 Cloudflare 账户中，选择 `Pages` > `创建项目` > `连接到 Git`。
4.  **选择仓库并部署：** 选择您 Fork 的项目仓库，在 `设置构建和部署` 部分保持默认设置，然后点击 `保存并部署`。
5.  **创建 D1 数据库：** 参考 [https://github.com/x-dr/telegraph-Image/blob/main/docs/manage.md](https://github.com/x-dr/telegraph-Image/blob/main/docs/manage.md) 创建一个 D1 数据库。
6.  **创建数据库表：** 在 D1 数据库控制台中执行以下 SQL 命令创建表：
```sql
DROP TABLE IF EXISTS links;
CREATE TABLE IF NOT EXISTS links (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text,
  `slug` text,
  `ua` text,
  `ip` text,
  `status` int,
  `create_time` DATE,
  `expires_at` timestamp
);
DROP TABLE IF EXISTS logs;
CREATE TABLE IF NOT EXISTS logs (
  `id` integer PRIMARY KEY NOT NULL,
  `url` text ,
  `slug` text,
  `referer` text,
  `ua` text ,
  `ip` text ,
  `create_time` DATE
);
```
7.  **绑定D1数据库:** 在page中绑定数据库,变量名为DB。
8.  **设置变量:** 名称为ACCESS_PASSWORD，值为你的密码，接着重新部署项目

## API
短链接生成
```
# POST /create
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://url.wangwangit.com"}' https://url.wangwangit.com/create

# 指定 slug
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://url.wangwangit.com","slug":"example"}' https://url.wangwangit.com/create

# 设置过期时间
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://url.wangwangit.com", "expiry": "5m"}' https://url.wangwangit.com/create

# 响应示例
{
  "slug": "<slug>",
  "link": "http://d.131213.xyz/<slug>"
}
```
