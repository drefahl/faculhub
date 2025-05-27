import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/reset-password", "/noticias/new", "/forum/edit/*", "/noticias/edit/*"],
    },
  }
}
