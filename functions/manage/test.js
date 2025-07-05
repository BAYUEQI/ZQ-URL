/**
 * @api {get} /manage/test Test database binding
 */

export async function onRequestGet(context) {
    const { env } = context;
    
    const dbStatus = {
        dbType: typeof env.DB,
        dbExists: env.DB !== undefined && env.DB !== null,
        accessPasswordExists: env.ACCESS_PASSWORD !== undefined && env.ACCESS_PASSWORD !== null,
        allEnvVars: Object.keys(env)
    };
    
    return Response.json({
        success: true,
        message: '数据库绑定测试',
        dbStatus: dbStatus
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
} 