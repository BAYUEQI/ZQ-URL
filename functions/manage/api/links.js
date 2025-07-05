/**
 * @api {get} /manage/api/links Get all links
 */

export async function onRequestGet(context) {
    const { request, env } = context;
    
    // 验证访问密码
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    
    if (!password || password !== env.ACCESS_PASSWORD) {
        return Response.json({ 
            success: false, 
            message: '访问密码错误' 
        }, {
            status: 403,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    try {
        // 获取所有链接，按创建时间倒序排列
        const links = await env.DB.prepare(`
            SELECT id, url, slug, create_time, expires_at, status 
            FROM links 
            ORDER BY create_time DESC
        `).all();

        return Response.json({ 
            success: true, 
            links: links.results 
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        return Response.json({ 
            success: false, 
            message: '数据库查询失败：' + error.message 
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
} 
