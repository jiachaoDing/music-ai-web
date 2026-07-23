const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export function resolveAssetUrl(url?: string) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('//')) return `http:${url}`

  const normalizedBase = API_BASE_URL.replace(/\/$/, '')
  const normalizedPath = url.startsWith('/') ? url : `/${url}`
  return `${normalizedBase}${normalizedPath}`
}

export function resolveCoverThumbnailUrl(url?: string) {
  const originalUrl = resolveAssetUrl(url)
  if (!originalUrl) return ''

  try {
    const parsedUrl = new URL(originalUrl)
    const match = parsedUrl.pathname.match(/^\/covers\/([^/]+)\.(?:jpe?g|png|webp|gif)$/i)
    if (!match) return originalUrl

    parsedUrl.pathname = `/covers/thumbnails/${match[1]}.webp`
    return parsedUrl.toString()
  } catch {
    return originalUrl
  }
}
