/**
 * @api {post} /create Create
 */

// Path: functions/create.js

function generateRandomString(length) {
    const characters = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

export async function onRequest(context) {
    if (context.request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400', // 24小时
            },
        });
    }
    const { request, env } = context;
    const originurl = new URL(request.url);
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("clientIP");
    const userAgent = request.headers.get("user-agent");
    const origin = `${originurl.protocol}//${originurl.hostname}`

    const options = {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timedata = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(timedata);
    
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400', // 24 hours
    };

    let url, slug, expiry, password;

    // 检查Content-Type以确定请求格式
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
        // JSON格式请求
        const jsonData = await request.json();
        url = jsonData.url;
        slug = jsonData.slug;
        expiry = jsonData.expiry;
        password = jsonData.password;
    } else if (contentType.includes('application/form-data') || contentType.includes('multipart/form-data')) {
        // FormData格式请求 (兼容sub-web项目)
        const formData = await request.formData();
        const longUrl = formData.get('longUrl');
        
        if (longUrl) {
            try {
                // 解码base64
                url = atob(longUrl);
            } catch (e) {
                return Response.json({ 
                    Code: 0, 
                    Message: 'Invalid base64 encoding' 
                }, {
                    headers: corsHeaders,
                    status: 400
                });
            }
        }
    } else {
        return Response.json({ 
            Code: 0, 
            Message: 'Unsupported content type' 
        }, {
            headers: corsHeaders,
            status: 400
        });
    }

    if (!url) return Response.json({ 
        Code: 0, 
        Message: 'Missing required parameter: url.' 
    }, {
        headers: corsHeaders,
        status: 400
    });

    // url格式检查
    if (!/^https?:\/\/.{3,}/.test(url)) {
        return Response.json({ 
            Code: 0, 
            Message: 'Illegal format: url.' 
        }, {
            headers: corsHeaders,
            status: 400
        })
    }

    // 自定义slug长度检查 2<slug<10 是否不以文件后缀结尾
    if (slug && (slug.length < 2 || slug.length > 10 || /.+\.[a-zA-Z]+$/.test(slug))) {
        return Response.json({ 
            Code: 0, 
            Message: 'Illegal length: slug, (>= 2 && <= 10), or not ending with a file extension.' 
        }, {
            headers: corsHeaders,
            status: 400
        });
    }

    try {
        // 如果自定义slug
        if (slug) {
            const existUrl = await env.DB.prepare(`SELECT url as existUrl FROM links where slug = '${slug}'`).first()

            // url & slug 是一样的。
            if (existUrl && existUrl.existUrl === url) {
                const shortUrl = `${origin}/${slug}`;
                return Response.json({ 
                    Code: 1, 
                    ShortUrl: shortUrl,
                    Message: 'Success'
                }, {
                    headers: corsHeaders,
                    status: 200
                })
            }

            // slug 已存在
            if (existUrl) {
                return Response.json({ 
                    Code: 0, 
                    Message: 'Slug already exists.' 
                }, {
                    headers: corsHeaders,
                    status: 200
                })
            }
        }

        // 目标 url 已存在
        const existSlug = await env.DB.prepare(`SELECT slug as existSlug FROM links where url = '${url}'`).first()

        // url 存在且没有自定义 slug
        if (existSlug && !slug) {
            const shortUrl = `${origin}/${existSlug.existSlug}`;
            return Response.json({ 
                Code: 1, 
                ShortUrl: shortUrl,
                Message: 'Success'
            }, {
                headers: corsHeaders,
                status: 200
            })
        }
        
        const bodyUrl = new URL(url);

        if (bodyUrl.hostname === originurl.hostname) {
            return Response.json({ 
                Code: 0, 
                Message: 'You cannot shorten a link to the same domain.' 
            }, {
                headers: corsHeaders,
                status: 400
            })
        }

        // 生成随机slug
        const slug2 = slug ? slug : generateRandomString(4);
        
        // 计算过期时间
        let expiresAt = null;
        if (expiry) {
            const expiryValue = parseInt(expiry.slice(0, -1));
            const expiryUnit = expiry.slice(-1);
        
            const now = new Date();
            switch (expiryUnit) {
                case 'm': // 添加对分钟的处理
                    now.setMinutes(now.getMinutes() + expiryValue);
                    break;
                case 'h':
                    now.setHours(now.getHours() + expiryValue);
                    break;
                case 'd':
                    now.setDate(now.getDate() + expiryValue);
                    break;
                default:
                    break;
            }
            expiresAt = now.toISOString();
        }
        
        const info = await env.DB.prepare(`INSERT INTO links (url, slug, ip, status, ua, create_time,expires_at) 
        VALUES ('${url}', '${slug2}', '${clientIP}',1, '${userAgent}', '${formattedDate}','${expiresAt}')`).run()

        const shortUrl = `${origin}/${slug2}`;
        return Response.json({ 
            Code: 1, 
            ShortUrl: shortUrl,
            Message: 'Success'
        }, {
            headers: corsHeaders,
            status: 200
        })
    } catch (e) {
        return Response.json({ 
            Code: 0, 
            Message: e.message 
        }, {
            headers: corsHeaders,
            status: 500
        })
    }
}
