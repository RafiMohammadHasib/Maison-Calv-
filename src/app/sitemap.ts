import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://maisoncalve.fr";
  const lastModified = new Date();

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          fr: `${baseUrl}`,
          en: `${baseUrl}/?lang=en`,
          es: `${baseUrl}/?lang=es`
        }
      }
    },
    {
      url: `${baseUrl}/#espaces`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/#parking`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/#tarifs`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/#localisation`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7
    }
  ];
}
