async function errorHandling(context) {
    try {
      return await context.next();
    } catch (err) {
      return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}

function authentication(context) {
    // 只检查数据库绑定
    if (typeof context.env.DB == "undefined" || context.env.DB == null) {
      return Response.json({
        status: 200,
        msg: '仪表板已禁用。请绑定D1数据库才能使用此功能。数据库绑定状态：' + (typeof context.env.DB)
      });
    }
    // 直接放行
    return context.next();
}

export const onRequest = [errorHandling, authentication];
