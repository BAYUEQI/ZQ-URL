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

  // Set CORS headers for allowed origins so browsers can read API responses
  // This prevents cases where the request succeeds server-side but the client treats it as failed due to CORS
  if (origin) {
    // Reflect the requesting origin when it is whitelisted; otherwise leave unset and let the auth guard reject
    if (isWhitelisted) {
      // Use node response to avoid adding new type imports
      event.node.res.setHeader('Access-Control-Allow-Origin', origin)
      event.node.res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      event.node.res.setHeader('Vary', 'Origin')
    }
  }

  // Handle CORS preflight quickly
  const reqMethod = (event as any).method || event.node.req.method || ''
  if (reqMethod.toUpperCase() === 'OPTIONS') {
    // If origin is allowed, return 204 so browser proceeds; otherwise fall through to auth
    if (isWhitelisted) {
      event.node.res.statusCode = 204
      return ''
    }
  }

  if (event.path.startsWith('/api/') && !event.path.startsWith('/api/_')) {
    const authed = token && token === config.siteToken
    if (!authed && !isWhitelisted) {
      throw createError({
        status: 401,
        statusText: 'Unauthorized',
      })
    }
    // If authenticated (by token) but not from whitelisted origin, still allow and expose for same-origin tools
    if (authed && origin) {
      event.node.res.setHeader('Access-Control-Allow-Origin', origin)
      event.node.res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
      event.node.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      event.node.res.setHeader('Vary', 'Origin')
    }
  }

  if (token && token.length < 8) {
    throw createError({
      status: 401,
      statusText: 'Token is too short',
    })
  }
})
