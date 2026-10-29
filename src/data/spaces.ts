export interface SpaceItem {
  id: string;
  slug: string;
  name: {
    fr: string;
    en: string;
    es: string;
  };
  category: "private-office" | "open-space" | "meeting-room" | "parking" | "common-areas";
  area?: string;
  capacity: {
    fr: string;
    en: string;
    es: string;
  };
  pricing: {
    amount: number | string;
    tax: "HT" | "TTC";
    period: {
      fr: string;
      en: string;
      es: string;
    };
    note?: {
      fr: string;
      en: string;
      es: string;
    };
  };
  availability: {
    total: number;
    available: number;
    status: {
      fr: string;
      en: string;
      es: string;
    };
    badgeClass: string;
  };
  image: string;
  features: {
    fr: string[];
    en: string[];
    es: string[];
  };
  highlight: {
    fr: string;
    en: string;
    es: string;
  };
  description: {
    fr: string;
    en: string;
    es: string;
  };
}

export const SPACES: SpaceItem[] = [
  {
    id: "office-21m",
    slug: "bureau-privatif-21m",
    name: {
      fr: "Bureau Privatif 21 m²",
      en: "Private Office 21 sqm",
      es: "Oficina Privada 21 m²"
    },
    category: "private-office",
    area: "21 m²",
    capacity: {
      fr: "3 à 4 postes de travail",
      en: "3 to 4 workstations",
      es: "3 a 4 puestos de trabajo"
    },
    pricing: {
      amount: "750€",
      tax: "HT",
      period: {
        fr: "par mois",
        en: "per month",
        es: "al mes"
      },
      note: {
        fr: "Engagement annuel privilégié",
        en: "1-year commitment preferred",
        es: "Compromiso anual preferido"
      }
    },
    availability: {
      total: 5,
      available: 2,
      status: {
        fr: "Disponible immédiatement",
        en: "Immediately available",
        es: "Disponible de inmediato"
      },
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    image: "/images/spaces/real-office-21m-4k.jpg",
    features: {
      fr: [
        "Ameublement personnalisé haut de gamme",
        "Accès sécurisé 24h/24 et 7j/7",
        "Domiciliation d'entreprise comprise (1ère année)",
        "Accès illimité aux espaces communs (cuisine, sanitaires)",
        "Boissons chaudes/froides & snacks inclus",
        "Internet fibre ultra haut débit dédié"
      ],
      en: [
        "High-end bespoke furniture",
        "24/7 secure keyless access",
        "Business address domiciliation included (1st year)",
        "Unlimited access to common areas (kitchen, amenities)",
        "Complimentary hot & cold drinks and snacks",
        "Dedicated high-speed fiber internet"
      ],
      es: [
        "Mobiliario de diseño personalizado",
        "Acceso seguro 24/7",
        "Domiciliación de empresa incluida (1er año)",
        "Acceso ilimitado a zonas comunes (cocina, aseos)",
        "Bebidas calientes/frías y snacks incluidos",
        "Fibra óptica de alta velocidad dedicada"
      ]
    },
    highlight: {
      fr: "Bureau de 21 m² avec parquet chaleureux, deux luminaires en rotin et mur d'accent bleu cobalt.",
      en: "21 sqm private office with warm hardwood floors, dual woven pendant lamps, and cobalt blue accent wall.",
      es: "Oficina íntima bañada de luz natural con vistas al patio arbolado."
    },
    description: {
      fr: "Conçu pour des équipes de 3 à 4 personnes, recherchant un espace calme avec des services de qualités pour développer leur projet.",
      en: "Designed for teams of 3 to 4, seeking a quiet space with quality services to grow their business.",
      es: "Diseñado para equipos de 3 a 4 personas que buscan un espacio tranquilo con servicios de calidad para desarrollar su proyecto."
    }
  },
  {
    id: "office-28m",
    slug: "bureau-privatif-28m",
    name: {
      fr: "Bureau privatif 28 m²",
      en: "Private Office 28 sqm",
      es: "Oficina Privada 28 m²"
    },
    category: "private-office",
    area: "28 m²",
    capacity: {
      fr: "Jusqu'à 5 à 6 postes",
      en: "Up to 5 to 6 workstations",
      es: "Hasta 5 a 6 puestos"
    },
    pricing: {
      amount: "1000€",
      tax: "HT",
      period: {
        fr: "par mois",
        en: "per month",
        es: "al mes"
      },
      note: {
        fr: "Engagement annuel privilégié",
        en: "1-year commitment preferred",
        es: "Compromiso anual preferido"
      }
    },
    availability: {
      total: 5,
      available: 1,
      status: {
        fr: "1 bureau disponible",
        en: "1 office available",
        es: "1 oficina disponible"
      },
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300"
    },
    image: "/images/spaces/real-office-28m-4k.jpg",
    features: {
      fr: [
        "Ameublement personnalisé haut de gamme",
        "Accès sécurisé 24h/24 et 7j/7",
        "Domiciliation d'entreprise comprise (1ère année)",
        "Accès illimité aux espaces communs (cuisine, sanitaires)",
        "Boissons chaudes/froides & snacks inclus",
        "Internet fibre ultra haut débit dédié"
      ],
      en: [
        "High-end bespoke furniture",
        "24/7 secure keyless access",
        "Business address domiciliation included (1st year)",
        "Unlimited access to common areas (kitchen, amenities)",
        "Complimentary hot & cold drinks and snacks",
        "Dedicated high-speed fiber internet"
      ],
      es: [
        "Mobiliario de diseño personalizado",
        "Acceso seguro 24/7",
        "Domiciliación de empresa incluida (1er año)",
        "Acceso ilimitado a zonas comunes (cocina, aseos)",
        "Bebidas calientes/frías y snacks incluidos",
        "Fibra óptica de alta velocidad dedicada"
      ]
    },
    highlight: {
      fr: "Spacieux bureau de 28 m² avec lustre moderne, double ouverture lumineuse, parquet authentique et mur d'accent bleu cobalt.",
      en: "Spacious 28 sqm private office featuring a modern cluster chandelier, bright double window exposure, and authentic parquet.",
      es: "Espaciosa oficina de 28 m² con lámpara de diseño, doble ventana luminosa y suelo de madera auténtica."
    },
    description: {
      fr: "Conçu pour des équipes de 4 à 6 personnes, recherchant un espace calme avec des services de qualités pour développer leur projet.",
      en: "Designed for teams of 4 to 6, seeking a quiet space with quality services to grow their business.",
      es: "Diseñado para equipos de 4 a 6 personas que buscan un espacio tranquilo con servicios de calidad para desarrollar su proyecto."
    }
  },
  {
    id: "open-space-fixe",
    slug: "open-space-poste-fixe",
    name: {
      fr: "Open Space — Poste Fixe Dédié",
      en: "Open Space — Dedicated Desk",
      es: "Open Space — Puesto Fijo Dedicado"
    },
    category: "open-space",
    area: "2 espaces de 5 postes",
    capacity: {
      fr: "10 postes résidents au total",
      en: "10 resident desks in total",
      es: "10 puestos residentes en total"
    },
    pricing: {
      amount: "250€",
      tax: "HT",
      period: {
        fr: "par mois",
        en: "per month",
        es: "al mes"
      },
      note: {
        fr: "Sans engagement contraignant",
        en: "Flexible terms",
        es: "Condiciones flexibles"
      }
    },
    availability: {
      total: 10,
      available: 4,
      status: {
        fr: "Quelques postes disponibles",
        en: "A few desks available",
        es: "Pocos puestos disponibles"
      },
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    image: "/images/spaces/real-open-space-fixe-4k.jpg",
    features: {
      fr: [
        "Poste de travail attribué avec rangements privatifs",
        "Accessible 7j/7 et 24h/24",
        "Murs en pierre blonde bordelaise & parquet chêne",
        "Accès illimité cuisine, salle de réunion & sanitaires",
        "Possibilité de domiciliation d'entreprise",
        "Boissons chaudes, fraîches et encas inclus"
      ],
      en: [
        "Dedicated assigned workstation with private storage",
        "Accessible 24/7, 365 days a year",
        "Exposed Bordeaux limestone walls & oak parquet",
        "Unlimited access to kitchen, meeting room & amenities",
        "Company domiciliation option available",
        "All beverages and snacks included"
      ],
      es: [
        "Puesto de trabajo asignado con almacenaje privado",
        "Accesible 24 horas al día, 7 días a la semana",
        "Paredes de piedra vista bordelesa y parqué de roble",
        "Acceso ilimitado a cocina, sala de reunión y servicios",
        "Opción de domiciliación de empresa",
        "Bebidas y aperitivos incluidos"
      ]
    },
    highlight: {
      fr: "Votre bureau attitré dans un environnement feutré sans turnover incessant.",
      en: "Your personal desk in a tranquil environment free from chaotic turnover.",
      es: "Tu escritorio fijo en un ambiente sereno sin rotación constante."
    },
    description: {
      fr: "Chaque open space est limité à 5 postes pour préserver le calme acoustique, favoriser l'entraide et créer un véritable écosystème bienveillant.",
      en: "Each open space is limited to 5 desks to ensure acoustic peace, encourage genuine collaboration, and build a lasting community.",
      es: "Cada espacio abierto se limita a 5 puestos para garantizar silencio, colaboración real y comunidad duradera."
    }
  },
  {
    id: "open-space-flexible",
    slug: "open-space-nomade-flexible",
    name: {
      fr: "Open Space — Poste Flexible Nomade",
      en: "Open Space — Flexible Nomad Desk",
      es: "Open Space — Puesto Nómada Flexible"
    },
    category: "open-space",
    area: "Accès nomade",
    capacity: {
      fr: "À la journée ou demi-journée",
      en: "Daily or half-day pass",
      es: "Pase diario o media jornada"
    },
    pricing: {
      amount: "20€ / 10€",
      tax: "HT",
      period: {
        fr: "journée (20€) / demi-journée (10€)",
        en: "day (€20) / half-day (€10)",
        es: "día (20€) / media jornada (10€)"
      },
      note: {
        fr: "Tarif HT transparent",
        en: "All-inclusive rate Excl. VAT",
        es: "Precio sin IVA"
      }
    },
    availability: {
      total: 6,
      available: 3,
      status: {
        fr: "Sur demande préalable",
        en: "Upon request",
        es: "Bajo petición previa"
      },
      badgeClass: "bg-blue-100 text-blue-800 border-blue-300"
    },
    image: "/images/spaces/real-open-space-nomade-4k.jpg",
    features: {
      fr: [
        "20€ HT la journée complète (accessible 24h)",
        "10€ HT la demi-journée (matin ou après-midi)",
        "Fibre optique haut débit sécurisée",
        "Accès phonebox acoustique pour appels confidentiels",
        "Accès libre cuisine équipée et terrasse",
        "Café de spécialité, thés et gourmandises"
      ],
      en: [
        "€20 Excl. VAT full day (24h validity)",
        "€10 Excl. VAT half-day (morning or afternoon)",
        "Secure high-speed fiber Wi-Fi",
        "Acoustic phonebox access for confidential calls",
        "Equipped kitchen and courtyard access",
        "Specialty coffee, teas, and snacks"
      ],
      es: [
        "20€ sin IVA día completo (validez 24h)",
        "10€ sin IVA media jornada (mañana o tarde)",
        "Fibra óptica de alta velocidad y segura",
        "Cabina acústica para llamadas confidenciales",
        "Acceso a cocina equipada y patio",
        "Café de especialidad, tés y aperitivos"
      ]
    },
    highlight: {
      fr: "La liberté d'un bureau prestigieux à Bordeaux sans engagement à long terme.",
      en: "The freedom of a prestigious Bordeaux workspace with zero long-term commitments.",
      es: "La libertad de un espacio distinguido en Burdeos sin ataduras a largo plazo."
    },
    description: {
      fr: "Idéal pour les indépendants de passage, les télétravailleurs en quête de concentration ou les entrepreneurs en déplacement.",
      en: "Perfect for visiting remote workers, traveling founders, or professionals needing focused serenity for the day.",
      es: "Ideal para nómadas digitales, profesionales remotos o fundadores de paso que necesitan concentración."
    }
  },
  {
    id: "meeting-room",
    slug: "salle-de-reunion-30m",
    name: {
      fr: "Grande Salle de Réunion 30 m²",
      en: "Executive Meeting Room 30 sqm",
      es: "Gran Sala de Reuniones 30 m²"
    },
    category: "meeting-room",
    area: "30 m²",
    capacity: {
      fr: "Jusqu'à 12–14 personnes",
      en: "Up to 12–14 participants",
      es: "Hasta 12–14 personas"
    },
    pricing: {
      amount: "120€ / 200€",
      tax: "HT",
      period: {
        fr: "demi-journée (120€) / journée entière (200€)",
        en: "half-day (€120) / full day (€200)",
        es: "media jornada (120€) / día completo (200€)"
      },
      note: {
        fr: "Formation, séminaires & présentations",
        en: "Training, board meetings & workshops",
        es: "Formaciones, reuniones y talleres"
      }
    },
    availability: {
      total: 1,
      available: 1,
      status: {
        fr: "Réservation sur créneau",
        en: "Slot reservation on request",
        es: "Reserva de horario previa"
      },
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300"
    },
    image: "/images/spaces/real-meeting-room-30m-4k.jpg",
    features: {
      fr: [
        "120€ HT la demi-journée / 200€ HT la journée",
        "Salle de 30 m² full équipée",
        "Écran 4K de projection sans fil (AirPlay / HDMI)",
        "Système de visioconférence professionnel",
        "Paperboard, feutres et prises multiples intégrées",
        "Pause café & thés de qualité offerts pour vos invités"
      ],
      en: [
        "€120 Excl. VAT half-day / €200 Excl. VAT full day",
        "30 sqm fully equipped executive boardroom",
        "4K wireless presentation display (AirPlay / HDMI)",
        "Professional hybrid video conferencing system",
        "Whiteboard, flipchart & integrated cable management",
        "Complimentary artisanal coffee & tea breaks for guests"
      ],
      es: [
        "120€ sin IVA media jornada / 200€ sin IVA día entero",
        "Sala de 30 m² totalmente equipada",
        "Pantalla 4K para presentaciones inalámbricas",
        "Sistema de videoconferencia profesional híbrido",
        "Pizarra, rotafolios y tomas integradas",
        "Café de especialidad y té incluidos para asistentes"
      ]
    },
    highlight: {
      fr: "Recevez vos clients, formez vos équipes et organisez vos comités dans un cadre d'exception.",
      en: "Host clients, conduct workshops, and run board meetings in an extraordinary architectural setting.",
      es: "Reciba clientes, forme equipos y organice comités en un entorno arquitectónico distinguido."
    },
    description: {
      fr: "Une salle élégante et insonorisée, prête pour vos réunions d'affaires ou journées de formation.",
      en: "An elegant, soundproof space, ready for business deals or corporate training sessions.",
      es: "Una sala elegante e insonorizada, lista para acuerdos comerciales o jornadas formativas."
    }
  },
  {
    id: "parking-spaces",
    slug: "parking-prive-9-places",
    name: {
      fr: "Parking Privé Sécurisé — 9 Places",
      en: "Secure Private Parking — 9 Spaces",
      es: "Parking Privado Seguro — 9 Plazas"
    },
    category: "parking",
    area: "Cour intérieure sécurisée",
    capacity: {
      fr: "9 places de stationnement réservées",
      en: "9 dedicated courtyard parking spots",
      es: "9 plazas de aparcamiento reservadas"
    },
    pricing: {
      amount: "Inclus / Option",
      tax: "HT",
      period: {
        fr: "selon formule",
        en: "depending on plan",
        es: "según modalidad"
      },
      note: {
        fr: "Atout majeur en plein Bordeaux",
        en: "Rare premium asset in central Bordeaux",
        es: "Ventaja exclusiva en el centro de Burdeos"
      }
    },
    availability: {
      total: 9,
      available: 4,
      status: {
        fr: "Places réservables",
        en: "Spaces reservable",
        es: "Plazas disponibles"
      },
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    image: "/images/calve-parking.jpg",
    features: {
      fr: [
        "9 places dans une cour pavée fermée",
        "Portail automatique sécurisé par badge",
        "Bornes de recharge pour véhicules électriques",
        "Accès direct sans tourner dans le quartier",
        "Stationnement vélos et trottinettes abrité",
        "Idéal pour dirigeants, clients et résidents"
      ],
      en: [
        "9 dedicated spaces in an enclosed cobblestone courtyard",
        "Keyfob-secured automated security gate",
        "Electric vehicle charging stations available",
        "Direct access without circling the neighborhood",
        "Sheltered bicycle and e-scooter parking",
        "Ideal for executives, clients, and residents"
      ],
      es: [
        "9 plazas en patio adoquinado cerrado",
        "Puerta automática segura con tarjeta/mando",
        "Puntos de recarga para vehículos eléctricos",
        "Acceso directo sin buscar aparcamiento en el barrio",
        "Zona protegida para bicicletas y patinetes",
        "Ideal para directivos, clientes y residentes"
      ]
    },
    highlight: {
      fr: "Ne perdez plus 30 minutes à chercher une place : garez-vous directement au 48 rue Calvé.",
      en: "Never spend 30 minutes hunting for street parking: park directly at 48 rue Calvé.",
      es: "No pierda tiempo buscando sitio: aparque directamente en el 48 de la calle Calvé."
    },
    description: {
      fr: "Dans le quartier très prisé de Fondaudège où le stationnement est rare et payant, disposer d'un parking privé sécurisé est un avantage concurrentiel inestimable.",
      en: "In the coveted Fondaudège district where parking is scarce and costly, having private on-site parking is an unrivaled advantage.",
      es: "En el demandado barrio de Fondaudège, donde el aparcamiento escasea, contar con parking privado es una ventaja inigualable."
    }
  },
  {
    id: "common-areas",
    slug: "espaces-communs-cuisine-terrasse",
    name: {
      fr: "Cuisine équipée",
      en: "Equipped Kitchen",
      es: "Cocina Equipada"
    },
    category: "common-areas",
    area: "Espaces partagés",
    capacity: {
      fr: "Accès libre pour tous les résidents",
      en: "Open access for all members",
      es: "Acceso libre para todos los residentes"
    },
    pricing: {
      amount: "Inclus",
      tax: "HT",
      period: {
        fr: "dans toutes les formules",
        en: "in all membership plans",
        es: "en todas las modalidades"
      },
      note: {
        fr: "Café barista & thés inclus",
        en: "Specialty coffee & teas included",
        es: "Café de barista y té incluidos"
      }
    },
    availability: {
      total: 1,
      available: 1,
      status: {
        fr: "Accès permanent 24/7",
        en: "Permanent 24/7 access",
        es: "Acceso permanente 24/7"
      },
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    image: "/images/spaces/real-kitchen-4k.jpg",
    features: {
      fr: [
        "Sélection de thés biologiques, infusions et café de torréfacteur",
        "Boissons chaudes/froides et snacks à volonté pour tous",
        "Cuisine équipée : réfrigérateur, micro-ondes, lave-vaisselle"
      ],
      en: [
        "Artisanal organic teas, infusions, and specialty coffee",
        "Complimentary unlimited hot/cold drinks and snacks",
        "Fully equipped kitchen: fridge, microwave, dishwasher"
      ],
      es: [
        "Selección de tés biológicos, infusiones y café de especialidad",
        "Bebidas frías/calientes y aperitivos a voluntad para todos",
        "Cocina totalmente equipada: frigorífico, microondas, lavavajillas"
      ]
    },
    highlight: {
      fr: "L'esprit d'une maison de famille où le partage se fait sans bruit de cantine.",
      en: "The warmth of a family residence where community happens naturally without corporate noise.",
      es: "El calor de una casa señorial donde convivir con tranquilidad sin ruidos molestos."
    },
    description: {
      fr: "Profitez d’un espace conçu pour passer un bon moment au travail. Boissons chaudes/froides et sancks à volonté disponibles pour tous !",
      en: "Enjoy a space designed to spend a great time at work. Hot/cold drinks and snacks available unlimited for everyone!",
      es: "Disfrute de un espacio diseñado para pasar un buen rato en el trabajo. ¡Bebidas frías/calientes y aperitivos a voluntad para todos!"
    }
  }
];

export const BUILDING_STATS = [
  {
    number: "5",
    label: {
      fr: "Bureaux privatifs",
      en: "Private offices",
      es: "Oficinas privadas"
    },
    detail: {
      fr: "de 21 à 28 m² (2 disponibles)",
      en: "from 21 to 28 sqm (2 available)",
      es: "de 21 a 28 m² (2 disponibles)"
    }
  },
  {
    number: "10",
    label: {
      fr: "Postes en open space",
      en: "Open-space desks",
      es: "Puestos en open space"
    },
    detail: {
      fr: "2 espaces de 5 postes calmes",
      en: "2 quiet 5-desk studios",
      es: "2 espacios tranquilos de 5 puestos"
    }
  },
  {
    number: "30",
    unit: "m²",
    label: {
      fr: "Salle de réunion",
      en: "Meeting room",
      es: "Sala de reuniones"
    },
    detail: {
      fr: "Full équipée avec visioconférence",
      en: "Fully equipped with video conferencing",
      es: "Equipada con videoconferencia"
    }
  },
  {
    number: "9",
    label: {
      fr: "Places de parking",
      en: "Parking spaces",
      es: "Plazas de parking"
    },
    detail: {
      fr: "Cour privée sécurisée",
      en: "Secured private courtyard",
      es: "Patio privado seguro"
    }
  }
];
