/**
 * @api {delete} /manage/api/links/:id Delete link
 */

export async function onRequestDelete(context) {
    const { request, env, params } = context;
    
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
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    const linkId = params.id;

    if (!linkId) {
        return Response.json({ 
            success: false, 
            message: '缺少链接ID' 
        }, {
            status: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    try {
        // 先检查链接是否存在
        const existingLink = await env.DB.prepare(
            `SELECT id, slug FROM links WHERE id = ?`
        ).bind(Number(linkId)).first();

        if (!existingLink) {
            return Response.json({ 
                success: false, 
                message: '链接不存在' 
            }, {
                status: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        // 删除链接
        await env.DB.prepare(
            `DELETE FROM links WHERE id = ?`
        ).bind(Number(linkId)).run();

        // 同时删除相关的访问日志
        await env.DB.prepare(
            `DELETE FROM logs WHERE slug = ?`
        ).bind(existingLink.slug).run();

        return Response.json({ 
            success: true, 
            message: '删除成功' 
        }, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    } catch (error) {
        return Response.json({ 
            success: false, 
            message: '删除失败：' + error.message 
        }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
} 
