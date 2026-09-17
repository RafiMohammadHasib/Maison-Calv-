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
    id: "office-17m",
    slug: "bureau-privatif-17m",
    name: {
      fr: "Bureau Privatif 17 m²",
      en: "Private Office 17 sqm",
      es: "Oficina Privada 17 m²"
    },
    category: "private-office",
    area: "17 m²",
    capacity: {
      fr: "3 à 4 postes de travail",
      en: "3 to 4 workstations",
      es: "3 a 4 puestos de trabajo"
    },
    pricing: {
      amount: "750€ à 850€",
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
    image: "/images/real/maison-calve-private-office.jpg",
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
      fr: "Bureau intimiste baigné de lumière naturelle, vue sur cour pavée arborée.",
      en: "Intimate office flooded with natural light overlooking the private leafy courtyard.",
      es: "Oficina íntima bañada de luz natural con vistas al patio arbolado."
    },
    description: {
      fr: "Conçu pour les équipes de 3 à 4 personnes recherchant calme, discrétion et prestation hôtelière haut de gamme au cœur de Bordeaux.",
      en: "Crafted for teams of 3 to 4 seeking peace, discretion, and upscale hospitality in central Bordeaux.",
      es: "Diseñado para equipos de 3 a 4 personas que buscan tranquilidad y servicios de alto nivel en el corazón de Burdeos."
    }
  },
  {
    id: "office-25m",
    slug: "bureau-privatif-25m",
    name: {
      fr: "Bureau Privatif 25–30 m²",
      en: "Private Office 25–30 sqm",
      es: "Oficina Privada 25–30 m²"
    },
    category: "private-office",
    area: "25–30 m²",
    capacity: {
      fr: "Jusqu'à 5 à 6 postes",
      en: "Up to 5 to 6 workstations",
      es: "Hasta 5 a 6 puestos"
    },
    pricing: {
      amount: "950€ à 1100€",
      tax: "HT",
      period: {
        fr: "par mois",
        en: "per month",
        es: "al mes"
      },
      note: {
        fr: "Moulures d'époque & parquet ancien",
        en: "Historic moldings & original parquet",
        es: "Molduras de época y parqué original"
      }
    },
    availability: {
      total: 5,
      available: 2,
      status: {
        fr: "1 bureau disponible",
        en: "1 office available",
        es: "1 oficina disponible"
      },
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300"
    },
    image: "/images/real/maison-calve-private-office.jpg",
    features: {
      fr: [
        "Superficie généreuse de 25 à 30 m²",
        "Ameublement ergonomique sur mesure",
        "Accès 24/7 sécurisé",
        "Domiciliation commerciale offerte la 1ère année",
        "Accès libre cuisine équipée et phonebox",
        "Barista & boissons chaudes/fraîches permanentes"
      ],
      en: [
        "Generous floor plan from 25 to 30 sqm",
        "Ergonomic bespoke furniture",
        "24/7 secure access",
        "Free commercial address domiciliation in year 1",
        "Free access to equipped kitchen and acoustic phonebox",
        "Continuous coffee, tea, and refreshment bar"
      ],
      es: [
        "Superficie espaciosa de 25 a 30 m²",
        "Mobiliario ergonómico a medida",
        "Acceso seguro 24/7",
        "Domiciliación comercial gratuita el primer año",
        "Acceso libre a cocina equipada y phonebox",
        "Café de especialidad, té y bebidas continuo"
      ]
    },
    highlight: {
      fr: "Espace de prestige avec cheminée décorative en marbre et volumes hauts sous plafond.",
      en: "Prestige workspace featuring decorative marble fireplace and high ceilings.",
      es: "Espacio de prestigio con chimenea decorativa de mármol y techos altos."
    },
    description: {
      fr: "L'écrin idéal pour une entreprise établie ou un cabinet de conseil désireux de recevoir ses clients dans un lieu d'exception.",
      en: "The ideal setting for established companies or consultancies hosting clients in an exceptional location.",
      es: "El marco ideal para empresas consolidadas o consultorías que deseen recibir a sus clientes en un lugar distinguido."
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
    area: "2 espaces de 6 postes",
    capacity: {
      fr: "12 postes résidents au total",
      en: "12 resident desks in total",
      es: "12 puestos residentes en total"
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
      total: 12,
      available: 4,
      status: {
        fr: "Quelques postes disponibles",
        en: "A few desks available",
        es: "Pocos puestos disponibles"
      },
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    image: "/images/real/maison-calve-open-space.jpg",
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
      fr: "Chaque open space est limité à 6 postes pour préserver le calme acoustique, favoriser l'entraide et créer un véritable écosystème bienveillant.",
      en: "Each open space is limited to 6 desks to ensure acoustic peace, encourage genuine collaboration, and build a lasting community.",
      es: "Cada espacio abierto se limita a 6 puestos para garantizar silencio, colaboración real y comunidad duradera."
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
      tax: "TTC",
      period: {
        fr: "journée (20€) / demi-journée (10€)",
        en: "day (€20) / half-day (€10)",
        es: "día (20€) / media jornada (10€)"
      },
      note: {
        fr: "Tarif TTC transparent",
        en: "All-inclusive VAT price",
        es: "Precio IVA incluido"
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
    image: "/images/real/maison-calve-open-space.jpg",
    features: {
      fr: [
        "20€ TTC la journée complète (accessible 24h)",
        "10€ TTC la demi-journée (matin ou après-midi)",
        "Fibre optique haut débit sécurisée",
        "Accès phonebox acoustique pour appels confidentiels",
        "Accès libre cuisine équipée et terrasse",
        "Café de spécialité, thés et gourmandises"
      ],
      en: [
        "€20 VAT incl. full day (24h validity)",
        "€10 VAT incl. half-day (morning or afternoon)",
        "Secure high-speed fiber Wi-Fi",
        "Acoustic phonebox access for confidential calls",
        "Equipped kitchen and courtyard access",
        "Specialty coffee, teas, and snacks"
      ],
      es: [
        "20€ IVA incl. día completo (validez 24h)",
        "10€ IVA incl. media jornada (mañana o tarde)",
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
      tax: "TTC",
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
    image: "/images/real/maison-calve-meeting-room.jpg",
    features: {
      fr: [
        "120€ TTC la demi-journée / 200€ TTC la journée",
        "Salle de 30 m² full équipée",
        "Écran 4K de projection sans fil (AirPlay / HDMI)",
        "Système de visioconférence professionnel",
        "Paperboard, feutres et prises multiples intégrées",
        "Pause café & thés de qualité offerts pour vos invités"
      ],
      en: [
        "€120 VAT incl. half-day / €200 VAT incl. full day",
        "30 sqm fully equipped executive boardroom",
        "4K wireless presentation display (AirPlay / HDMI)",
        "Professional hybrid video conferencing system",
        "Whiteboard, flipchart & integrated cable management",
        "Complimentary artisanal coffee & tea breaks for guests"
      ],
      es: [
        "120€ IVA incl. media jornada / 200€ IVA incl. día entero",
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
      fr: "Une salle élégante et insonorisée avec vue sur le jardin intérieur, prête pour vos réunions d'affaires ou journées de formation.",
      en: "An elegant, soundproof space overlooking the courtyard garden, ready for business deals or corporate training sessions.",
      es: "Una sala elegante e insonorizada con vistas al patio interior, lista para acuerdos comerciales o jornadas formativas."
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
      fr: "Espaces Communs & Cuisine d'Hôtes",
      en: "Common Areas & Resident Kitchen",
      es: "Zonas Comunes & Cocina de Huéspedes"
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
      tax: "TTC",
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
    image: "/images/real/maison-calve-kitchen.jpg",
    features: {
      fr: [
        "Grande table d'hôtes en chêne massif pour déjeuner ou échanger",
        "Café en grains fraîchement moulu de torréfacteur local à volonté",
        "Sélection de thés biologiques, infusions et boissons fraîches",
        "Cabines téléphoniques insonorisées (Phonebox) pour appels privés",
        "Cour pavée extérieure arborée pour vos pauses au soleil",
        "Cuisine équipée : réfrigérateur, micro-ondes, lave-vaisselle"
      ],
      en: [
        "Solid oak resident dining table for meals or relaxed discussions",
        "Unlimited freshly ground local specialty roast coffee",
        "Artisanal organic teas, infusions, and cold refreshments",
        "Private soundproof phone booths for confidential calls",
        "Leafy cobblestone courtyard for sunny coffee breaks",
        "Fully equipped kitchen: fridge, microwave, dishwasher"
      ],
      es: [
        "Gran mesa de roble para comer o conversar con compañeros",
        "Café de especialidad en grano de tostador local ilimitado",
        "Selección de tés biológicos e infusiones",
        "Cabinas telefónicas insonorizadas para llamadas privadas",
        "Patio adoquinado con plantas para relajarse al sol",
        "Cocina totalmente equipada: frigorífico, microondas, lavavajillas"
      ]
    },
    highlight: {
      fr: "L'esprit d'une maison de famille où le partage se fait sans bruit de cantine.",
      en: "The warmth of a family residence where community happens naturally without corporate noise.",
      es: "El calor de una casa señorial donde convivir con tranquilidad sin ruidos molestos."
    },
    description: {
      fr: "Au 48 rue Calvé, les espaces de convivialité prolongent vos journées : déjeunez entre pairs à la grande table d'hôtes, profitez du café de spécialité ou isolez-vous en phonebox pour vos visioconférences.",
      en: "At 48 rue Calvé, common living spaces extend your working day: lunch with peers at the communal table, enjoy specialty coffee, or step into a private phone booth for video calls.",
      es: "En el 48 rue Calvé, las zonas comunes enriquecen su día a día: almuerce en la gran mesa de roble, disfrute del mejor café o aíslese en la cabina telefónica para sus videoconferencias."
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
      fr: "de 17 à 30 m² (2 disponibles)",
      en: "from 17 to 30 sqm (2 available)",
      es: "de 17 a 30 m² (2 disponibles)"
    }
  },
  {
    number: "12",
    label: {
      fr: "Postes en open space",
      en: "Open-space desks",
      es: "Puestos en open space"
    },
    detail: {
      fr: "2 espaces de 6 postes calmes",
      en: "2 quiet 6-desk studios",
      es: "2 espacios tranquilos de 6 puestos"
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
      fr: "Cour privée sécurisée avec recharge EV",
      en: "Secured private courtyard with EV charging",
      es: "Patio privado seguro con recarga EV"
    }
  }
];
