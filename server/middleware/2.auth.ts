export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization')?.replace(/^Bearer\s+/, '')

  // 白名单来源免 Token：逗号分隔的域名列表
  const config = useRuntimeConfig(event)
  const allowOrigins = (config.allowOrigins || '').split(',')
    .map(o => o.trim())
    .filter(Boolean)

  let origin = getHeader(event, 'Origin') || ''
  if (!origin && event.node?.req?.headers?.referer) {
    try {
      origin = new URL(event.node.req.headers.referer).origin
    }
    catch {}
  }

  const isWhitelisted = origin && allowOrigins.some((o) => {
    try {
      const ao = new URL(o).origin
      return ao === origin
    }
    catch {
      // 允许配置裸域名（不带协议），回退比较 host
      try {
        const oh = new URL(origin).host
        return o === oh
      }
      catch {
        return false
      }
    }
  })

  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_')) {
    const authed = token && token === config.siteToken
    if (!authed && !isWhitelisted) {
      throw createError({
        status: 401,
        statusText: 'Unauthorized',
      })
    }
  }

  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
