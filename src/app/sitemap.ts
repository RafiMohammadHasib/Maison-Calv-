import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://maisoncalve.fr";
  const lastModified = new Date();

  // Curated 4K architectural & space imagery for Google Image indexing
  const architecturalImages = [
    `${baseUrl}/images/calve-exterior.jpg`,
    `${baseUrl}/images/calve-parking.jpg`,
    `${baseUrl}/images/spaces/real-meeting-room-30m-4k.jpg`,
    `${baseUrl}/images/spaces/real-kitchen-4k.jpg`,
    `${baseUrl}/images/spaces/real-office-21m-4k.jpg`,
    `${baseUrl}/images/spaces/real-office-28m-4k.jpg`,
    `${baseUrl}/images/spaces/real-office-17m-wide-4k.jpg`,
    `${baseUrl}/images/spaces/real-open-space-fixe-4k.jpg`,
    `${baseUrl}/images/spaces/real-open-space-wide-4k.jpg`,
    `${baseUrl}/images/spaces/real-open-space-nomade-4k.jpg`
  ];

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          fr: `${baseUrl}/`,
          en: `${baseUrl}/?lang=en`,
          es: `${baseUrl}/?lang=es`
        }
      },
      images: architecturalImages
    },
    {
      url: `${baseUrl}/?lang=en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${baseUrl}/`,
          en: `${baseUrl}/?lang=en`,
          es: `${baseUrl}/?lang=es`
        }
      },
      images: [
        `${baseUrl}/images/calve-exterior.jpg`,
        `${baseUrl}/images/calve-parking.jpg`,
        `${baseUrl}/images/spaces/real-meeting-room-30m-4k.jpg`
      ]
    },
    {
      url: `${baseUrl}/?lang=es`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          fr: `${baseUrl}/`,
          en: `${baseUrl}/?lang=en`,
          es: `${baseUrl}/?lang=es`
        }
      },
      images: [
        `${baseUrl}/images/calve-exterior.jpg`,
        `${baseUrl}/images/calve-parking.jpg`
      ]
    }
  ];
}
