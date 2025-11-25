/**
 * Handle SPA routing for Cloudflare Workers with assets binding
 */
addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent(event) {
  const url = new URL(event.request.url)
  const pathname = url.pathname

  try {
    // Get the asset from the ASSETS binding (configured in wrangler.toml)
    const env = event.request.env || globalThis
    const assets = env.ASSETS

    // Handle static assets (files with extensions)
    if (pathname.includes('.')) {
      const response = await assets.fetch(event.request)
      if (response.ok) {
        return response
      }
    }

    // Handle SPA routing - serve index.html for all other routes
    const indexRequest = new Request(`${url.origin}/index.html`, {
      method: event.request.method,
      headers: event.request.headers,
    })
    const response = await assets.fetch(indexRequest)

    if (response.ok) {
      return response
    }

    // If index.html not found, return 404
    return new Response('Not Found', { status: 404 })

  } catch (e) {
    return new Response('Internal Error', { status: 500 })
  }
}