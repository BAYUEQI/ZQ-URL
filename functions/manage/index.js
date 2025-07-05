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
            <html>
            <head>
                <title>访问验证</title>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
                    .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    input { padding: 10px; margin: 10px 0; width: 200px; border: 1px solid #ddd; border-radius: 5px; }
                    button { padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; }
                    button:hover { background: #2563eb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>请输入访问密码</h2>
                    <form method="GET">
                        <input type="password" name="password" placeholder="请输入密码" required>
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
