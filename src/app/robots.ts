import type { MetadataRoute } from 'next'

/**
 * The dashboard is already behind the middleware guard; this keeps it out of
 * search results as well, so its existence is not advertised.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/api/'],
    },
    ...(siteUrl ? { host: siteUrl } : {}),
  }
}
