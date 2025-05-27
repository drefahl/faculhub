import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString()
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/cursos`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/forum`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/forum/new`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/noticias`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/perfil`,
      lastModified: currentDate,
    },

    {
      url: `${BASE_URL}/forgot-password`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: currentDate,
    },
    {
      url: `${BASE_URL}/register`,
      lastModified: currentDate,
    },
  ]
}
