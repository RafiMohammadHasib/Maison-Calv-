export type Language = "fr" | "en" | "es";

export interface LocaleContent {
  nav: {
    brandSubtitle: string;
    spaces: string;
    about: string;
    floorPlan: string;
    parking: string;
    pricing: string;
    location: string;
    faq: string;
    requestVisit: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    district: string;
    description: string;
    ctaExplore: string;
    ctaVisit: string;
    urgentBadge: string;
  };
  manifesto: {
    tag: string;
    heading: string;
    paragraph1: string;
    paragraph2: string;
    quote: string;
    quoteAuthor: string;
    values: {
      title: string;
      desc: string;
    }[];
  };
  spacesSection: {
    tag: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterOffices: string;
    filterOpenSpace: string;
    filterMeeting: string;
    filterCommon: string;
    ctaEnquire: string;
    ctaDetails: string;
    featuresIncluded: string;
    specsLabels: {
      surface: string;
      capacity: string;
      parking: string;
      access: string;
    };
    tourPrompt: string;
  };
  parkingSection: {
    tag: string;
    count: string;
    title: string;
    subtitle: string;
    description: string;
    points: {
      title: string;
      desc: string;
    }[];
    cta: string;
  };
  floorPlanSection: {
    tag: string;
    title: string;
    subtitle: string;
    instructions: string;
    roomTypes: {
      offices: string;
      openSpace: string;
      meeting: string;
      kitchen: string;
      parking: string;
    };
  };
  pricingSection: {
    tag: string;
    title: string;
    subtitle: string;
    disclaimer: string;
    viewContractInfo: string;
    commitmentNote: string;
  };
  locationSection: {
    tag: string;
    title: string;
    address: string;
    neighborhood: string;
    description: string;
    accessTitle: string;
    accessItems: {
      mode: string;
      detail: string;
    }[];
    ctaDirections: string;
  };
  enquiryModal: {
    title: string;
    subtitle: string;
    tabOffice: string;
    tabOpenSpace: string;
    tabMeeting: string;
    fieldOfficeSelect: string;
    fieldWorkstationCount: string;
    fieldWorkstationType: string;
    fieldDate: string;
    fieldSlot: string;
    fieldAttendees: string;
    fieldName: string;
    fieldCompany: string;
    fieldEmail: string;
    fieldPhone: string;
    fieldMessage: string;
    submitOffice: string;
    submitOpenSpace: string;
    submitMeeting: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    close: string;
  };
  faq: {
    tag: string;
    title: string;
    subtitle: string;
    items: {
      q: string;
      a: string;
    }[];
  };
  footer: {
    brandTagline: string;
    address: string;
    contactHours: string;
    hoursDetail: string;
    rights: string;
    privacy: string;
    legal: string;
    bordeauxSeoText: string;
  };
}

export const CONTENT: Record<Language, LocaleContent> = {
  fr: {
    nav: {
      brandSubtitle: "Peaceful Coworking",
      spaces: "Espaces",
      about: "À Propos",
      floorPlan: "Plan 3D",
      parking: "Parking",
      pricing: "Tarifs",
      location: "Localisation",
      faq: "FAQ",
      requestVisit: "Visiter",
      contact: "Contact"
    },
    hero: {
      badge: "Coworking haut de gamme - Bordeaux Fondaudège",
      title: "Maison Calvé",
      subtitle: "",
      district: "48 rue Calvé, 33000 Bordeaux",
      description: "Un espace de travail confortable, calme et haut de gamme pensé pour s’y installer dans le temps.",
      ctaExplore: "Explorer les espaces",
      ctaVisit: "Demander une visite",
      urgentBadge: "2 bureaux privatifs & postes open space disponibles"
    },
    manifesto: {
      tag: "Notre Philosophie",
      heading: "Fini le côté usine. Bienvenue dans un écosystème à taille humaine.",
      paragraph1: "Situé au 48 rue Calvé, en plein cœur du quartier recherché de Fondaudège, Maison Calvé propose une vision différente du travail partagé. Ici, pas de turnover incessant ni de halls impersonnels : nous bâtissons une communauté pérenne où les résidents se connaissent, partagent des valeurs d'excellence et s'élèvent mutuellement.",
      paragraph2: "Dans ce bel hôtel particulier bordelais alliant pierre blonde d'époque, lumière zénithale et prestations contemporaines, nous offrons un environnement calme, confortable et hautement professionnel. S'implanter à la Maison Calvé, c'est choisir de s'inscrire dans la durée.",
      quote: "Notre objectif est clair : réduire le turnover, proposer un espace calme, confortable et pro.",
      quoteAuthor: "L'équipe Maison Calvé",
      values: [
        {
          title: "Sérénité & Concentration",
          desc: "Des volumes feutrés, une acoustique soignée et des espaces calibrés pour travailler sans pollution sonore."
        },
        {
          title: "Prestations Haut de Gamme",
          desc: "Mobilier design personnalisé, café de spécialité, fibre optique dédiée, phonebox et cuisine équipée conviviale."
        },
        {
          title: "Rareté & Confort Absolu",
          desc: "9 places de parking sécurisées dans la cour pavée privée : un luxe introuvable ailleurs dans Bordeaux centre."
        }
      ]
    },
    spacesSection: {
      tag: "Collection d'Espaces",
      title: "Des espaces singuliers façonnés pour la haute exigence",
      subtitle: "Bureaux privatifs de caractère, postes résidents feutrés et salle de réunion au cœur de Bordeaux Fondaudège.",
      filterAll: "Toutes les pièces",
      filterOffices: "Bureaux privatifs",
      filterOpenSpace: "Postes de travail",
      filterMeeting: "Salle de réunion",
      filterCommon: "Espaces partagés",
      ctaEnquire: "Demander une visite privée",
      ctaDetails: "Découvrir la pièce",
      featuresIncluded: "Prestations & services inclus :",
      specsLabels: {
        surface: "Superficie",
        capacity: "Capacité",
        parking: "Stationnement",
        access: "Disponibilité & Accès"
      },
      tourPrompt: "Planifier une visite privée"
    },
    parkingSection: {
      tag: "Atout Majeur & Exclusif",
      count: "9",
      title: "Places de parking privées au 48 rue Calvé",
      subtitle: "Le confort inestimable d'arriver au bureau l'esprit libre, sans jamais chercher où se garer dans Bordeaux.",
      description: "Dans le quartier historique de Fondaudège où le stationnement sur voirie est saturé et contraignant, Maison Calvé dispose d'une cour intérieure close et pavée dotée de 9 emplacements réservés avec portail automatique et bornes de recharge.",
      points: [
        {
          title: "Accès immédiat sécurisé",
          desc: "Ouverture automatique par télécommande ou smartphone, cour sécurisée 24h/24."
        },
        {
          title: "Bornes de recharge électrique",
          desc: "Rechargez votre véhicule hybride ou 100% électrique pendant vos heures de travail."
        },
        {
          title: "Idéal pour recevoir vos clients",
          desc: "Offrez à vos partenaires et clients un accueil de premier ordre avec stationnement garanti."
        },
        {
          title: "Abri vélos & mobilités douces",
          desc: "Espace protégé pour vélos, vélos cargo et trottinettes électriques."
        }
      ],
      cta: "Réserver un bureau avec place de parking"
    },
    floorPlanSection: {
      tag: "Visite Interactive",
      title: "Plan architectural interactif",
      subtitle: "Explorez la configuration des lieux : survolez les zones pour révéler leur superficie, capacité et statut d'occupation.",
      instructions: "Survolez une pièce pour afficher ses spécifications · Cliquez pour formuler une demande de visite",
      roomTypes: {
        offices: "Bureaux privatifs",
        openSpace: "Open spaces calmes",
        meeting: "Grande salle de réunion",
        kitchen: "Cuisine & phonebox",
        parking: "Cour parking (9 places)"
      }
    },
    pricingSection: {
      tag: "Transparence & Sérénité",
      title: "Grille tarifaire claire et sans mauvaise surprise",
      subtitle: "Toutes nos formules incluent l'accès aux espaces partagés, les boissons chaudes/fraîches, la fibre ultra-rapide et l'entretien régulier.",
      disclaimer: "Tous les tarifs sont indiqués Hors Taxes (HT).",
      viewContractInfo: "Bureaux privatifs : engagement annuel privilégié pour préserver la stabilité de notre écosystème.",
      commitmentNote: "La domiciliation commerciale de votre société est offerte la première année pour toute location de bureau privatif."
    },
    locationSection: {
      tag: "Emplacement Privilégié",
      title: "Au cœur de Bordeaux Fondaudège",
      address: "48 rue Calvé, 33000 Bordeaux",
      neighborhood: "Quartier Fondaudège / Jardin Public",
      description: "Une adresse prestigieuse et paisible à deux pas des commerces réputés de la rue Fondaudège, du Jardin Public et de la place Tourny. Une accessibilité parfaite par le Tram D ou en voiture grâce à notre parking.",
      accessTitle: "Comment venir à Maison Calvé :",
      accessItems: [
        {
          mode: "Tramway Ligne D",
          detail: "Station Fondaudège Muséum ou Croix-de-Seguey à 3 minutes à pied (connexion directe Gare Saint-Jean et Quinconces)."
        },
        {
          mode: "Voiture & Parking",
          detail: "Accès facile par les boulevards et la rue Naujac / rue David Johnston. 9 places privatives sur place."
        },
        {
          mode: "Vélos & Mobilités",
          detail: "Station V3 Jardin Public / Fondaudège à proximité immédiate, abri vélos privatif dans la cour."
        },
        {
          mode: "Vie de Quartier",
          detail: "Boulangeries artisanales, brasseries bordelaises, terrasses et parcs verdoyants pour vos pauses déjeuner."
        }
      ],
      ctaDirections: "Ouvrir dans Google Maps"
    },
    enquiryModal: {
      title: "Demande d'information & Visite",
      subtitle: "Précisez votre projet afin que Paul et l'équipe Maison Calvé vous répondent dans les plus brefs délais.",
      tabOffice: "Bureau Privatif",
      tabOpenSpace: "Open Space",
      tabMeeting: "Salle de Réunion",
      fieldOfficeSelect: "Bureau souhaité",
      fieldWorkstationCount: "Nombre de postes de travail",
      fieldWorkstationType: "Formule souhaitée",
      fieldDate: "Date souhaitée",
      fieldSlot: "Créneau horaire",
      fieldAttendees: "Nombre de participants estimés",
      fieldName: "Nom et Prénom",
      fieldCompany: "Entreprise / Activité",
      fieldEmail: "Adresse email professionnelle",
      fieldPhone: "Numéro de téléphone",
      fieldMessage: "Votre message ou besoins particuliers",
      submitOffice: "Demander une visite du bureau",
      submitOpenSpace: "Demander la disponibilité open space",
      submitMeeting: "Réserver ce créneau de réunion",
      submitting: "Transmission en cours...",
      successTitle: "Demande bien reçue !",
      successMessage: "Merci pour votre intérêt pour Maison Calvé. Nous avons bien enregistré votre demande et nous vous recontacterons sous 24h pour organiser votre venue au 48 rue Calvé.",
      close: "Fermer"
    },
    faq: {
      tag: "Questions Fréquentes",
      title: "Tout ce que vous devez savoir sur Maison Calvé",
      subtitle: "Vous avez une interrogation sur nos conditions d'accès, le parking ou les formalités ? Trouvez vos réponses ici.",
      items: [
        {
          q: "Combien de bureaux privatifs sont actuellement disponibles ?",
          a: "Maison Calvé compte 5 bureaux privatifs au total. 3 sont occupés par des entreprises résidentes durables (dont Goizet Gestion). Il reste actuellement 2 bureaux disponibles : un bureau d'environ 17 m² pour 3 à 4 personnes, et un bureau d'environ 25 m² pouvant accueillir confortablement 5 à 6 personnes."
        },
        {
          q: "Comment fonctionne l'accès au parking privé de 9 places ?",
          a: "Le parking est situé directement dans la cour intérieure close du 48 rue Calvé. Les résidents des bureaux privatifs bénéficient d'un accès prioritaire avec télécommande. Des places peuvent également être réservées pour les intervenants lors de la location de la salle de réunion ou selon accord pour les postes fixes."
        },
        {
          q: "Quelle est la durée d'engagement pour un bureau privatif ?",
          a: "Dans le but de préserver un écosystème calme et sans turnover perpétuel, nous privilégions les engagements d'une durée minimale d'un an pour les bureaux privatifs. Nous échangeons directement avec chaque entreprise candidate pour aligner nos perspectives."
        },
        {
          q: "Qu'inclut la formule open space nomade à 20€ / 10€ ?",
          a: "La formule flexible vous donne accès à un poste ergonomique dans l'un de nos deux open spaces calmes (6 personnes max), l'accès à la phonebox insonorisée pour vos appels, le Wi-Fi fibre haut débit sécurisé, ainsi que la cuisine équipée avec café, thés et gourmandises en libre-service."
        },
        {
          q: "Peut-on domicilier son entreprise à la Maison Calvé ?",
          a: "Oui ! La domiciliation commerciale au 48 rue Calvé est incluse gratuitement la première année pour toute location d'un bureau privatif, et est proposée en option pour les résidents réguliers en poste fixe."
        },
        {
          q: "Quels équipements sont fournis dans la salle de réunion de 30 m² ?",
          a: "La salle dispose d'un écran 4K de dernière génération avec partage sans fil AirPlay/HDMI, d'une webcam grand angle pour réunions hybrides et visio Teams/Zoom, d'un paperboard, de la fibre optique dédiée et du service café/thé offert à tous les participants."
        }
      ]
    },
    footer: {
      brandTagline: "Espace de coworking indépendant & bureaux privatifs d'exception.",
      address: "48 rue Calvé, 33000 Bordeaux · Quartier Fondaudège",
      contactHours: "Accueil & Visites sur rendez-vous",
      hoursDetail: "Accès membres 24h/24 & 7j/7 avec badge sécurisé.",
      rights: "Tous droits réservés. Maison Calvé Coworking Bordeaux.",
      privacy: "Politique de confidentialité",
      legal: "Mentions légales",
      bordeauxSeoText: "Coworking Bordeaux · Coworking avec parking Bordeaux · Bureaux privatifs Bordeaux Fondaudège · Open space Bordeaux · Location salle de réunion Bordeaux pour formation et séminaire."
    }
  },
  en: {
    nav: {
      brandSubtitle: "Peaceful Coworking",
      spaces: "Spaces",
      about: "About Us",
      floorPlan: "3D Plan",
      parking: "Parking",
      pricing: "Rates",
      location: "Location",
      faq: "FAQ",
      requestVisit: "Book a Visit",
      contact: "Contact"
    },
    hero: {
      badge: "High-end Coworking - Bordeaux Fondaudège",
      title: "Maison Calvé",
      subtitle: "",
      district: "48 rue Calvé, 33000 Bordeaux, France",
      description: "A comfortable, calm, and high-end workspace designed to settle in over time.",
      ctaExplore: "Explore Spaces",
      ctaVisit: "Book a Private Tour",
      urgentBadge: "2 private offices & open-space desks currently available"
    },
    manifesto: {
      tag: "Our Vision",
      heading: "No corporate factories. Welcome to an intentional human-scale workspace.",
      paragraph1: "Located at 48 rue Calvé in the heart of Bordeaux's prestigious Fondaudège district, Maison Calvé offers a distinct working philosophy. Rather than endless turnover and impersonal hot-desking, we cultivate a long-term ecosystem where founders and teams know each other, share standards of excellence, and grow together.",
      paragraph2: "In this historic French mansion combining honey limestone walls, natural light, and modern amenities, we deliver a calm, comfortable, and truly professional sanctuary. Joining Maison Calvé means choosing stability and peace of mind.",
      quote: "Our objective is simple: eliminate chaotic turnover and provide a calm, comfortable, and professional home.",
      quoteAuthor: "Maison Calvé Team",
      values: [
        {
          title: "Tranquility & Deep Work",
          desc: "Soundproofed spaces, acoustic materials, and capped room sizes designed for intense focus without auditory fatigue."
        },
        {
          title: "Boutique Hospitality",
          desc: "Bespoke designer furniture, artisanal coffee, dedicated high-speed fiber, acoustic phone booths, and an equipped kitchen."
        },
        {
          title: "Ultra-Rare Convenience",
          desc: "9 secure on-site parking spots inside our private cobblestone courtyard: an unparalleled asset in central Bordeaux."
        }
      ]
    },
    spacesSection: {
      tag: "Curated Workspaces",
      title: "Distinctive workspaces sculpted for focus and distinction",
      subtitle: "Characterful private suites, serene dedicated desks, and executive meeting rooms in the heart of Bordeaux Fondaudège.",
      filterAll: "All Spaces",
      filterOffices: "Private Offices",
      filterOpenSpace: "Workstations",
      filterMeeting: "Meeting Suite",
      filterCommon: "Shared Lounges",
      ctaEnquire: "Schedule a Private Visit",
      ctaDetails: "Explore This Space",
      featuresIncluded: "Included amenities & services:",
      specsLabels: {
        surface: "Surface Area",
        capacity: "Capacity",
        parking: "On-Site Parking",
        access: "Availability & Access"
      },
      tourPrompt: "Schedule a Private Tour"
    },
    parkingSection: {
      tag: "Key Competitive Advantage",
      count: "9",
      title: "Private on-site parking spaces at 48 rue Calvé",
      subtitle: "The ultimate luxury of arriving at work seamlessly without ever circling for street parking in Bordeaux.",
      description: "In the sought-after Fondaudège area where central parking is scarce and expensive, Maison Calvé provides an enclosed cobblestone courtyard with 9 dedicated bays, an automated security gate, and electric vehicle chargers.",
      points: [
        {
          title: "Instant Keyfob Access",
          desc: "Automated gate opens smoothly via remote control or mobile app, secured 24/7."
        },
        {
          title: "Electric Vehicle Chargers",
          desc: "Recharge your EV or plug-in hybrid conveniently during work hours."
        },
        {
          title: "Host Clients with Ease",
          desc: "Provide visiting clients and board members with guaranteed premium parking."
        },
        {
          title: "Protected Bicycle Storage",
          desc: "Sheltered bays for city bikes, cargo bikes, and electric scooters."
        }
      ],
      cta: "Enquire About Office & Parking"
    },
    floorPlanSection: {
      tag: "Interactive Tour",
      title: "Interactive 3D Architectural Floor Plan",
      subtitle: "Explore the layout: hover over any zone to view dimensions, capacity, and current availability status.",
      instructions: "Hover over any space for detailed specifications · Click to request a personalized viewing",
      roomTypes: {
        offices: "Private offices",
        openSpace: "Quiet open spaces",
        meeting: "Executive meeting room",
        kitchen: "Kitchen & phonebox",
        parking: "Courtyard parking (9 bays)"
      }
    },
    pricingSection: {
      tag: "Transparency & Peace of Mind",
      title: "Straightforward pricing with zero surprises",
      subtitle: "Every plan includes access to common spaces, specialty coffee and tea, ultra-fast fiber, and regular maintenance.",
      disclaimer: "All prices are quoted excluding VAT (HT).",
      viewContractInfo: "Private offices: 1-year minimum commitment favored to preserve community stability.",
      commitmentNote: "Commercial business address domiciliation is included for free during the first year for private office leases."
    },
    locationSection: {
      tag: "Prime Bordeaux Location",
      title: "At the heart of Bordeaux Fondaudège",
      address: "48 rue Calvé, 33000 Bordeaux, France",
      neighborhood: "Fondaudège / Jardin Public Quarter",
      description: "An authentic, tranquil address moments away from the culinary boutiques of Rue Fondaudège, the lush Jardin Public, and Place Tourny. Easily reached via Tram D or by car with direct access to our private parking.",
      accessTitle: "How to reach Maison Calvé:",
      accessItems: [
        {
          mode: "Tram Line D",
          detail: "Fondaudège Muséum or Croix-de-Seguey stop 3 minutes away on foot (direct link to Saint-Jean train station and Quinconces)."
        },
        {
          mode: "Car & On-site Parking",
          detail: "Convenient access from the boulevards via Rue Naujac or Rue David Johnston. 9 private spots on-site."
        },
        {
          mode: "Cycling & Micro-mobility",
          detail: "V3 bike sharing station nearby, sheltered private bike racks in our courtyard."
        },
        {
          mode: "Vibrant Neighborhood",
          detail: "Artisanal bakeries, French bistros, leafy parks, and sunny terraces for your lunch breaks."
        }
      ],
      ctaDirections: "Open in Google Maps"
    },
    enquiryModal: {
      title: "Request Information & Arrange a Viewing",
      subtitle: "Tell us about your team and schedule so Paul and the Maison Calvé team can assist you promptly.",
      tabOffice: "Private Office",
      tabOpenSpace: "Open Space",
      tabMeeting: "Meeting Room",
      fieldOfficeSelect: "Desired Office Suite",
      fieldWorkstationCount: "Number of Workstations",
      fieldWorkstationType: "Membership Plan",
      fieldDate: "Preferred Start Date",
      fieldSlot: "Time Slot",
      fieldAttendees: "Estimated Attendees",
      fieldName: "Full Name",
      fieldCompany: "Company / Project",
      fieldEmail: "Professional Email",
      fieldPhone: "Phone Number",
      fieldMessage: "Additional requirements or notes",
      submitOffice: "Request Office Tour",
      submitOpenSpace: "Check Desk Availability",
      submitMeeting: "Request Meeting Room Slot",
      submitting: "Submitting request...",
      successTitle: "Enquiry successfully sent!",
      successMessage: "Thank you for reaching out to Maison Calvé. We have received your details and will get back to you within 24 hours to schedule your visit to 48 rue Calvé.",
      close: "Close"
    },
    faq: {
      tag: "Frequently Asked Questions",
      title: "Everything you need to know about Maison Calvé",
      subtitle: "Have questions about terms, parking availability, or office amenities? Find answers below.",
      items: [
        {
          q: "How many private offices are currently available?",
          a: "Maison Calvé houses 5 private offices in total. 3 are currently occupied by long-term resident companies (including Goizet Gestion). We currently have 2 private offices available: one of ~17 sqm (suitable for 3 to 4 desks) and one of ~25 sqm (comfortably accommodating 5 to 6 desks)."
        },
        {
          q: "How does the private 9-space parking work?",
          a: "Parking is located directly inside the secure gated courtyard at 48 rue Calvé. Private office residents receive dedicated spots with automated remote control. Spaces can also be arranged for meeting room attendees upon reservation."
        },
        {
          q: "What is the commitment term for private offices?",
          a: "To maintain an uncrowded, calm, and trustworthy ecosystem with low turnover, we look for members ready to establish themselves for at least one year. We review each application individually."
        },
        {
          q: "What is included in the flexible desk pass (€20 / €10)?",
          a: "The flexible nomadic pass grants you a workstation in one of our two quiet 6-desk open spaces, full access to acoustic phone booths, high-speed fiber Wi-Fi, and the kitchen with complimentary coffee, teas, and refreshments."
        },
        {
          q: "Can I register my business address at Maison Calvé?",
          a: "Yes! Commercial domiciliation at 48 rue Calvé is included free of charge for the first year with any private office lease, and is available as an add-on for dedicated open-space residents."
        },
        {
          q: "What equipment is provided in the 30 sqm meeting room?",
          a: "The executive meeting room includes a 4K wireless display (AirPlay/HDMI), a wide-angle video conferencing webcam for hybrid Teams/Zoom meetings, a whiteboard, high-speed fiber, and complimentary hot/cold refreshments for all guests."
        }
      ]
    },
    footer: {
      brandTagline: "Independent coworking space & bespoke private offices in Bordeaux.",
      address: "48 rue Calvé, 33000 Bordeaux, France · Fondaudège Quarter",
      contactHours: "Reception & Tours by appointment",
      hoursDetail: "24/7 keyless access for resident members.",
      rights: "All rights reserved. Maison Calvé Coworking Bordeaux.",
      privacy: "Privacy Policy",
      legal: "Legal Notices",
      bordeauxSeoText: "Coworking Bordeaux · Coworking with parking Bordeaux · Private offices Bordeaux Fondaudège · Open space Bordeaux · Meeting room rental Bordeaux for corporate workshops and seminars."
    }
  },
  es: {
    nav: {
      brandSubtitle: "Peaceful Coworking",
      spaces: "Espacios",
      about: "Sobre Nosotros",
      floorPlan: "Plano 3D",
      parking: "Parking",
      pricing: "Tarifas",
      location: "Ubicación",
      faq: "FAQ",
      requestVisit: "Visitar",
      contact: "Contacto"
    },
    hero: {
      badge: "Coworking de alta gama - Burdeos Fondaudège",
      title: "Maison Calvé",
      subtitle: "",
      district: "48 rue Calvé, 33000 Burdeos, Francia",
      description: "Un espacio de trabajo confortable, tranquilo y de alta gama pensado para establecerse en el tiempo.",
      ctaExplore: "Explorar los espacios",
      ctaVisit: "Pedir una visita privada",
      urgentBadge: "2 oficinas privadas y puestos en open space disponibles"
    },
    manifesto: {
      tag: "Nuestra Filosofía",
      heading: "Basta del modelo fábrica. Bienvenidos a un ecosistema a escala humana.",
      paragraph1: "Ubicado en el 48 rue Calvé, en el codiciado barrio de Fondaudège en Burdeos, Maison Calvé propone una visión diferente del coworking. Aquí no hay rotación caótica ni espacios anónimos: forjamos una comunidad estable donde los miembros se conocen, colaboran y progresan juntos.",
      paragraph2: "En este distinguido palacete bordelés con piedra rubia de época, luz natural y prestaciones contemporáneas, ofrecemos un entorno tranquilo, confortable y altamente profesional. Instalarse en Maison Calvé es apostar por la duración y la serenidad.",
      quote: "Nuestro objetivo es claro: reducir la rotación y ofrecer un espacio tranquilo, cómodo y profesional.",
      quoteAuthor: "Equipo Maison Calvé",
      values: [
        {
          title: "Serenidad & Concentración",
          desc: "Ambientes insonorizados y salas con aforos reducidos diseñados para trabajar sin contaminación acústica."
        },
        {
          title: "Servicios de Alta Gama",
          desc: "Mobiliario ergonómico a medida, café de especialidad, fibra óptica de alta velocidad, phonebox y cocina equipada."
        },
        {
          title: "Exclusividad & Parking",
          desc: "9 plazas de aparcamiento privadas en patio adoquinado cerrado: una comodidad inigualable en el centro de Burdeos."
        }
      ]
    },
    spacesSection: {
      tag: "Colección de Espacios",
      title: "Espacios singulares diseñados para la máxima exigencia",
      subtitle: "Oficinas privadas con carácter, puestos residentes silenciosos y salas ejecutivas en Burdeos Fondaudège.",
      filterAll: "Todos los espacios",
      filterOffices: "Oficinas privadas",
      filterOpenSpace: "Puestos de trabajo",
      filterMeeting: "Sala de reuniones",
      filterCommon: "Zonas comunes",
      ctaEnquire: "Solicitar una visita privada",
      ctaDetails: "Descubrir el espacio",
      featuresIncluded: "Servicios y equipamiento incluidos:",
      specsLabels: {
        surface: "Superficie",
        capacity: "Capacidad",
        parking: "Aparcamiento",
        access: "Disponibilidad y Acceso"
      },
      tourPrompt: "Planificar una visita privada"
    },
    parkingSection: {
      tag: "Ventaja Exclusiva",
      count: "9",
      title: "Plazas de parking privadas en el 48 rue Calvé",
      subtitle: "La tranquilidad de llegar al trabajo sin perder tiempo buscando aparcamiento en Burdeos.",
      description: "En el histórico barrio de Fondaudège, donde el aparcamiento es muy escaso y costoso, Maison Calvé dispone de un patio privado adoquinado con 9 plazas reservadas, puerta automática y cargadores para vehículos eléctricos.",
      points: [
        {
          title: "Acceso automático seguro",
          desc: "Apertura mediante mando o móvil, patio privado vigilado 24h/24."
        },
        {
          title: "Cargadores para coches eléctricos",
          desc: "Recargue su vehículo eléctrico o híbrido cómodamente durante su jornada de trabajo."
        },
        {
          title: "Ideal para recibir a sus clientes",
          desc: "Ofrezca a sus socios y clientes una bienvenida exclusiva con aparcamiento garantizado."
        },
        {
          title: "Zona protegida para bicicletas",
          desc: "Espacio resguardado para bicicletas y patinetes eléctricos en el patio."
        }
      ],
      cta: "Solicitar oficina con plaza de parking"
    },
    floorPlanSection: {
      tag: "Visita Interactiva",
      title: "Plano arquitectónico interactivo en 3D",
      subtitle: "Explore la distribución: pase el cursor por cada zona para consultar superficie, aforo y disponibilidad actual.",
      instructions: "Pase el cursor por cualquier sala para ver especificaciones · Haga clic para solicitar una visita",
      roomTypes: {
        offices: "Oficinas privadas",
        openSpace: "Open space silencioso",
        meeting: "Sala de reuniones ejecutiva",
        kitchen: "Cocina y cabina phonebox",
        parking: "Patio parking (9 plazas)"
      }
    },
    pricingSection: {
      tag: "Transparencia & Confianza",
      title: "Tarifas claras y sin cargos ocultos",
      subtitle: "Todas las modalidades incluyen acceso a zonas comunes, café y bebidas de calidad, fibra óptica de alta velocidad y limpieza diaria.",
      disclaimer: "Todas las tarifas están indicadas sin IVA (HT).",
      viewContractInfo: "Oficinas privadas: compromiso anual preferido para preservar la estabilidad de la comunidad.",
      commitmentNote: "La domiciliación comercial de su sociedad está incluida gratis el primer año con el alquiler de oficina privada."
    },
    locationSection: {
      tag: "Ubicación Privilegiada",
      title: "En el corazón de Burdeos Fondaudège",
      address: "48 rue Calvé, 33000 Burdeos, Francia",
      neighborhood: "Barrio Fondaudège / Jardín Público",
      description: "Una dirección prestigiosa y tranquila a pocos pasos de los comercios de la rue Fondaudège, del Jardín Público y de la Place Tourny. Excelente comunicación mediante el tranvía D o en coche con acceso directo a nuestro parking privado.",
      accessTitle: "Cómo llegar a Maison Calvé:",
      accessItems: [
        {
          mode: "Tranvía Línea D",
          detail: "Parada Fondaudège Muséum o Croix-de-Seguey a 3 minutos a pie (conexión directa con la estación Saint-Jean y Quinconces)."
        },
        {
          mode: "Coche y Parking Privado",
          detail: "Fácil acceso desde los bulevares por Rue Naujac o Rue David Johnston. 9 plazas privadas en el recinto."
        },
        {
          mode: "Bicicletas y Movilidad",
          detail: "Estación de bicicletas V3 muy cerca, aparcamiento privado para bicis en el patio."
        },
        {
          mode: "Vida de Barrio",
          detail: "Panaderías artesanales, restaurantes bordeleses y zonas verdes para sus pausas."
        }
      ],
      ctaDirections: "Abrir en Google Maps"
    },
    enquiryModal: {
      title: "Solicitud de Información & Visita",
      subtitle: "Detalle sus necesidades para que Paul y el equipo de Maison Calvé le respondan con la máxima brevedad.",
      tabOffice: "Oficina Privada",
      tabOpenSpace: "Open Space",
      tabMeeting: "Sala de Reuniones",
      fieldOfficeSelect: "Oficina de interés",
      fieldWorkstationCount: "Número de puestos de trabajo",
      fieldWorkstationType: "Modalidad deseada",
      fieldDate: "Fecha deseada",
      fieldSlot: "Horario preferido",
      fieldAttendees: "Número de asistentes estimados",
      fieldName: "Nombre y Apellidos",
      fieldCompany: "Empresa / Actividad",
      fieldEmail: "Correo electrónico profesional",
      fieldPhone: "Teléfono de contacto",
      fieldMessage: "Mensaje o peticiones especiales",
      submitOffice: "Solicitar visita de la oficina",
      submitOpenSpace: "Consultar disponibilidad en open space",
      submitMeeting: "Solicitar reserva de la sala",
      submitting: "Enviando solicitud...",
      successTitle: "¡Solicitud recibida con éxito!",
      successMessage: "Gracias por su interés en Maison Calvé. Hemos registrado sus datos y nos pondremos en contacto con usted en un plazo de 24h para coordinar su visita al 48 rue Calvé.",
      close: "Cerrar"
    },
    faq: {
      tag: "Preguntas Frecuentes",
      title: "Todo lo que necesita saber sobre Maison Calvé",
      subtitle: "¿Tiene dudas sobre el parking, los despachos o las condiciones? Encuentre aquí las respuestas.",
      items: [
        {
          q: "¿Cuántas oficinas privadas hay disponibles actualmente?",
          a: "Maison Calvé dispone de 5 oficinas privadas en total. 3 están ocupadas por empresas residentes estables (incluyendo Goizet Gestion). Quedan 2 oficinas disponibles: una de unos 17 m² (adecuada para 3 o 4 personas) y otra de unos 25 m² (para 5 o 6 puestos)."
        },
        {
          q: "¿Cómo funciona el parking privado de 9 plazas?",
          a: "El parking se ubica en el patio cerrado del 48 rue Calvé. Los residentes de despachos privados tienen acceso prioritario con mando. También se pueden habilitar plazas para asistentes a la sala de reuniones previa reserva."
        },
        {
          q: "¿Cuál es el compromiso de permanencia en oficina privada?",
          a: "Para conservar un ecosistema tranquilo sin rotación constante, buscamos empresas dispuestas a establecerse al menos durante un año. Evaluamos cada caso de manera personalizada."
        },
        {
          q: "¿Qué incluye el pase nómada flexible (20€ / 10€)?",
          a: "Incluye un puesto en uno de nuestros dos open spaces tranquilos (máx. 6 puestos), acceso a cabina acústica phonebox, Wi-Fi fibra de alta velocidad y café, té y refrescos gratuitos en la cocina equipada."
        },
        {
          q: "¿Se puede domiciliar la empresa en Maison Calvé?",
          a: "¡Sí! La domiciliación comercial en el 48 rue Calvé está incluida gratis durante el primer año con cualquier contrato de oficina privada, y disponible como opción para miembros de puesto fijo."
        },
        {
          q: "¿Qué equipamiento tiene la sala de reuniones de 30 m²?",
          a: "Dispone de pantalla 4K inalámbrica (AirPlay/HDMI), cámara de videoconferencia para reuniones híbridas Teams/Zoom, pizarra, fibra óptica y servicio de café y bebidas para los participantes."
        }
      ]
    },
    footer: {
      brandTagline: "Espacio de coworking independiente y oficinas privadas de prestigio en Burdeos.",
      address: "48 rue Calvé, 33000 Burdeos, Francia · Barrio Fondaudège",
      contactHours: "Recepción y visitas con cita previa",
      hoursDetail: "Acceso miembros 24 horas al día, 7 días a la semana con tarjeta electrónica.",
      rights: "Todos los derechos reservados. Maison Calvé Coworking Burdeos.",
      privacy: "Política de privacidad",
      legal: "Aviso legal",
      bordeauxSeoText: "Coworking Burdeos · Coworking con parking Burdeos · Oficinas privadas Burdeos Fondaudège · Open space Burdeos · Alquiler sala de reuniones Burdeos para formaciones y eventos de empresa."
    }
  }
};
