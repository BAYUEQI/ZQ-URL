/**
 * @api {get} /manage Manage page
 */

import managePage from '../../manage.html';

export async function onRequestGet(context) {
    const { request, env } = context;
    
    // 验证访问密码
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    
    if (!password || password !== env.ACCESS_PASSWORD) {
        return new Response(`
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <title>访问验证</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css">
                <style>
                    body {
                        background: url('https://i0.wp.com/wangwangit001.cachefly.net/wangwangit/image/master/img/%E6%B5%8B%E8%AF%952.jpg') center/cover fixed;
                        font-family: 'Arial', sans-serif;
                        color: #333;
                        min-height: 100vh;
                        margin: 0;
                    }
                    .container {
                        background-color: rgba(255, 255, 255, 0.95);
                        border-radius: 10px;
                        padding: 40px 30px 30px 30px;
                        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
                        max-width: 400px;
                        margin: 80px auto;
                        text-align: center;
                    }
                    input {
                        padding: 12px;
                        margin: 16px 0;
                        width: 100%;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 1.1em;
                        box-sizing: border-box;
                    }
                    button {
                        padding: 12px 30px;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1.1em;
                        font-weight: bold;
                        transition: background 0.2s;
                    }
                    button:hover {
                        background: #2563eb;
                    }
                    h2 {
                        font-size: 2em;
                        color: #22c55e;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>请输入访问密码</h2>
                    <form method="GET">
                        <input type="password" name="password" placeholder="请输入密码" required autofocus>
                        <br>
                        <button type="submit">进入管理面板</button>
                    </form>
                </div>
            </body>
            </html>
        `, {
            headers: {
                'Content-Type': 'text/html;charset=UTF-8',
            }
        });
    }

    // 密码正确，返回管理页面
    return new Response(managePage, {
        headers: {
            'Content-Type': 'text/html;charset=UTF-8',
        }
    });
} 
