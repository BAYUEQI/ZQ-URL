export default eventHandler(async (event) => {
  const slug = getQuery(event).slug
  if (slug) {
    const { cloudflare } = event.context
    const { URL } = cloudflare.env
    const { metadata, value: link } = await URL.getWithMetadata(`link:${slug}`, { type: 'json' })
    if (link) {
      return {
        ...metadata,
        ...link,
      }
    }
  }
  throw createError({
    status: 404,
    statusText: 'Not Found',
  })
})
