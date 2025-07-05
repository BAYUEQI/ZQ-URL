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
                        background-color: rgba(255, 255, 255, 0.97);
                        border-radius: 12px;
                        padding: 38px 18px 30px 18px;
                        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.18);
                        max-width: 420px;
                        margin: 80px auto;
                        text-align: center;
                    }
                    input {
                        padding: 18px 12px;
                        margin: 22px 0 18px 0;
                        width: 100%;
                        border: 1.5px solid #ddd;
                        border-radius: 8px;
                        font-size: 1.18em;
                        box-sizing: border-box;
                        background: #f8fafc;
                        transition: border 0.2s;
                    }
                    input:focus {
                        border: 1.5px solid #22c55e;
                        outline: none;
                        background: #fff;
                    }
                    button {
                        padding: 16px 0;
                        background: #22c55e;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 1.15em;
                        font-weight: bold;
                        width: 100%;
                        margin-top: 8px;
                        transition: background 0.2s;
                        box-shadow: 0 2px 8px rgba(34,197,94,0.08);
                    }
                    button:hover, button:active {
                        background: #16a34a;
                    }
                    h2 {
                        font-size: 2.1em;
                        color: #22c55e;
                        margin-bottom: 18px;
                        font-weight: 700;
                    }
                    @media (max-width: 600px) {
                        .container {
                            max-width: 98vw;
                            padding: 18px 4px 16px 4px;
                            margin: 30px auto;
                        }
                        h2 { font-size: 1.3em; }
                        input, button { font-size: 1em; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>请输入访问密码</h2>
                    <form method="GET">
                        <input type="password" name="password" placeholder="请输入密码" required autofocus autocomplete="current-password">
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
