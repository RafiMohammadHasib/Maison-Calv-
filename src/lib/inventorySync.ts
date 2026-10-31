import { Lead, getLeads } from "@/lib/leads";

export interface TenantRecord {
  id: string;
  leadId?: string;
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  spaceAssigned: string;
  workstations: number;
  parkingBays: string;
  badgeIds: string[];
  leaseStart: string;
  monthlyRent: string;
  status: "active" | "onboarding" | "notice";
  isFromWonLead: boolean;
}

export interface SpaceInventoryRecord {
  id: string;
  name: string;
  category: "private" | "open" | "meeting" | "parking";
  area: string;
  capacity: string;
  price: string;
  period: string;
  status: "available" | "limited" | "occupied";
  statusText: string;
  image: string;
  parkingIncluded: boolean;
  features: string[];
  currentTenant?: {
    name: string;
    company: string;
    email: string;
    phone: string;
    leaseStart: string;
    leadId?: string;
  };
  activeBookings?: {
    leadId: string;
    name: string;
    company: string;
    date: string;
    slot?: string;
  }[];
}

// Foundational resident partner for Maison Calvé (permanent on-site partner)
const BASE_TENANTS: TenantRecord[] = [
  {
    id: "TEN-001",
    name: "Edgar Goizet",
    company: "Goizet Gestion SARL",
    role: "Partenaire Résident & Gestion Immobilière",
    email: "edgar@goizetgestion.fr",
    phone: "05 56 00 22 10",
    spaceAssigned: "Bureau Privatif Résident (Aile Est)",
    workstations: 4,
    parkingBays: "Places #1 & #2",
    badgeIds: ["BADGE-048-A", "BADGE-048-B"],
    leaseStart: "2024-01-15",
    monthlyRent: "Convention Partenaire",
    status: "active",
    isFromWonLead: false
  }
];

export function getUnifiedTenants(providedLeads?: Lead[]): TenantRecord[] {
  const leads = providedLeads || getLeads();
  const wonLeads = leads.filter((l) => l.status === "won");

  const crmTenants: TenantRecord[] = wonLeads.map((lead, idx) => {
    let spaceName = "Bureau Privatif Maison Calvé";
    let rentStr = "750 € HT / mois";
    let workstations = lead.workstationCount || 1;
    let parking = "Cour privée (place incluse)";

    if (lead.type === "private-office") {
      if (lead.officeSize?.includes("25")) {
        spaceName = "Bureau Privatif 28 m² (RDC Cour)";
        rentStr = "1 200 € HT / mois";
        workstations = 5;
        parking = "Places #3 & #4";
      } else if (lead.officeSize?.includes("17")) {
        spaceName = "Bureau Privatif 21 m² (Aile Ouest)";
        rentStr = "750 € HT / mois";
        workstations = 3;
        parking = "Place #5";
      } else {
        spaceName = lead.officeSize || "Bureau Privatif Sur-Mesure";
        rentStr = "850 € HT / mois";
        workstations = 4;
        parking = "Place #6";
      }
    } else if (lead.type === "open-space") {
      workstations = lead.workstationCount || 1;
      spaceName = `Open Space — Espace A (${workstations} poste${workstations > 1 ? "s fixes" : " fixe"})`;
      rentStr = `${workstations * 250} € HT / mois`;
      parking = workstations >= 2 ? "Place #7" : "Accès Piéton & Vélo";
    } else if (lead.type === "meeting-room") {
      spaceName = `Grande Salle de Réunion 30 m² (${lead.date ? "Réservée le " + lead.date : "Session Confirmée"})`;
      rentStr = lead.timeSlot === "full-day" ? "200 € HT (Journée)" : "120 € HT (Demi-journée)";
      workstations = lead.attendees || 8;
      parking = "Parking Visiteurs Réservé";
    }

    const badgeNum = String(idx + 10).padStart(3, "0");

    return {
      id: `TEN-${lead.id.replace("MC-2026-", "")}`,
      leadId: lead.id,
      name: lead.name,
      company: lead.company || lead.name,
      role:
        lead.type === "private-office"
          ? "Résident Bureau Privatif"
          : lead.type === "open-space"
          ? "Résident Poste Fixe"
          : "Client Salle de Réunion",
      email: lead.email,
      phone: lead.phone,
      spaceAssigned: spaceName,
      workstations,
      parkingBays: parking,
      badgeIds: [`BADGE-048-${badgeNum}`],
      leaseStart: lead.date || lead.createdAt.split("T")[0],
      monthlyRent: rentStr,
      status: "active",
      isFromWonLead: true
    };
  });

  return [...BASE_TENANTS, ...crmTenants];
}

export function getUnifiedSpaces(providedLeads?: Lead[]): SpaceInventoryRecord[] {
  const leads = providedLeads || getLeads();
  const wonLeads = leads.filter((l) => l.status === "won");

  // Private Offices logic
  const won25m = wonLeads.find((l) => l.type === "private-office" && l.officeSize?.includes("25"));
  const won17m = wonLeads.find(
    (l) => l.type === "private-office" && l.id !== won25m?.id && (l.officeSize?.includes("17") || !l.officeSize)
  );

  // Open Space logic
  const wonOpenSpaceLeads = wonLeads.filter((l) => l.type === "open-space");
  const wonDesksCount = wonOpenSpaceLeads.reduce((acc, l) => acc + (l.workstationCount || 1), 0);
  const occupiedA = Math.min(5, 2 + wonDesksCount); // Base 2 resident desks in Espace A
  const freeA = Math.max(0, 5 - occupiedA);

  // Meeting Room logic
  const wonMeetingLeads = wonLeads.filter((l) => l.type === "meeting-room");
  const primaryMeeting = wonMeetingLeads[0];

  const spaces: SpaceInventoryRecord[] = [
    {
      id: "office-17m",
      name: "Bureau Privatif 21 m²",
      category: "private",
      area: "21 m²",
      capacity: "3 à 4 postes de travail",
      price: "750 € HT",
      period: "par mois",
      status: won17m ? "occupied" : "available",
      statusText: won17m
        ? `Réservé & Occupé par ${won17m.company || won17m.name}`
        : "Disponible immédiatement",
      image: "/images/spaces/bureau-privatif-21m.png",
      parkingIncluded: true,
      currentTenant: won17m
        ? {
            name: won17m.name,
            company: won17m.company || won17m.name,
            email: won17m.email,
            phone: won17m.phone,
            leaseStart: won17m.date || won17m.createdAt.split("T")[0],
            leadId: won17m.id
          }
        : undefined,
      features: [
        "Ameublement personnalisé haut de gamme",
        "Accès sécurisé 24h/24 et 7j/7 par badge",
        "Domiciliation d'entreprise comprise (1ère année)",
        "Accès illimité cuisine équipée & sanitaires",
        "Boissons chaudes/froides & snacks inclus",
        "Internet fibre ultra haut débit dédié"
      ]
    },
    {
      id: "office-25m",
      name: "Bureau privatif 28 m²",
      category: "private",
      area: "28 m²",
      capacity: "5 à 6 postes de travail",
      price: "1 200 € HT",
      period: "par mois",
      status: won25m ? "occupied" : "available",
      statusText: won25m
        ? `Réservé & Occupé par ${won25m.company || won25m.name}`
        : "1 bureau disponible",
      image: "/images/spaces/bureau-privatif-28m.png",
      parkingIncluded: true,
      currentTenant: won25m
        ? {
            name: won25m.name,
            company: won25m.company || won25m.name,
            email: won25m.email,
            phone: won25m.phone,
            leaseStart: won25m.date || won25m.createdAt.split("T")[0],
            leadId: won25m.id
          }
        : undefined,
      features: [
        "Ameublement personnalisé haut de gamme",
        "Accès sécurisé 24h/24 et 7j/7 par badge",
        "Domiciliation d'entreprise comprise (1ère année)",
        "Accès illimité cuisine équipée & sanitaires",
        "Boissons chaudes/froides & snacks inclus",
        "Internet fibre ultra haut débit dédié"
      ]
    },
    {
      id: "open-fixe-a",
      name: "Open Space — Espace A (Poste Fixe)",
      category: "open",
      area: "35 m²",
      capacity: `5 postes résidents max (${occupiedA} occupés / ${freeA} libres)`,
      price: "250 € HT",
      period: "par mois par poste",
      status: freeA === 0 ? "occupied" : freeA <= 2 ? "limited" : "available",
      statusText:
        freeA === 0
          ? "Complet (5/5 postes résidents occupés)"
          : `${freeA} poste${freeA > 1 ? "s" : ""} disponible${freeA > 1 ? "s" : ""}`,
      image: "/images/spaces/real-open-space-fixe-4k.jpg",
      parkingIncluded: false,
      currentTenant:
        wonOpenSpaceLeads.length > 0
          ? {
              name: wonOpenSpaceLeads[0].name,
              company: wonOpenSpaceLeads[0].company || wonOpenSpaceLeads[0].name,
              email: wonOpenSpaceLeads[0].email,
              phone: wonOpenSpaceLeads[0].phone,
              leaseStart: wonOpenSpaceLeads[0].date || wonOpenSpaceLeads[0].createdAt.split("T")[0],
              leadId: wonOpenSpaceLeads[0].id
            }
          : undefined,
      features: [
        "Bureau attitré avec caisson sécurisé",
        "Accès 24/7 par badge RFID",
        "Ambiance feutrée (< 42 dB)",
        "Accès phonebox privative",
        "Café barista & thés bio inclus"
      ]
    },
    {
      id: "open-fixe-b",
      name: "Open Space — Espace B (Poste Fixe)",
      category: "open",
      area: "35 m²",
      capacity: "5 postes résidents max (3 occupés / 2 libres)",
      price: "250 € HT",
      period: "par mois par poste",
      status: "available",
      statusText: "2 postes disponibles",
      image: "/images/spaces/real-open-space-fixe-4k.jpg",
      parkingIncluded: false,
      features: [
        "Bureau attitré avec caisson sécurisé",
        "Accès 24/7 par badge RFID",
        "Ambiance feutrée (< 42 dB)",
        "Accès phonebox privative",
        "Café barista & thés bio inclus"
      ]
    },
    {
      id: "open-nomad",
      name: "Open Space — Poste Flexible Nomade",
      category: "open",
      area: "Accès nomade",
      capacity: "Sur réservation préalable",
      price: "20 € / 10 € HT",
      period: "journée (20€) / demi-journée (10€)",
      status: "available",
      statusText: "Accessible en ligne",
      image: "/images/spaces/real-open-space-nomade-4k.jpg",
      parkingIncluded: false,
      features: [
        "Fibre optique sécurisée",
        "Accès phonebox acoustique",
        "Accès libre cuisine équipée",
        "Boissons chaudes & gourmandises incluses"
      ]
    },
    {
      id: "meeting-30m",
      name: "Grande Salle de Réunion 30 m²",
      category: "meeting",
      area: "30 m²",
      capacity: "Jusqu'à 14 participants",
      price: "120 € / 200 € HT",
      period: "demi-journée (120€) / journée entière (200€)",
      status: primaryMeeting ? "occupied" : "available",
      statusText: primaryMeeting
        ? `Réservée (${wonMeetingLeads.length} réservation${wonMeetingLeads.length > 1 ? "s" : ""})`
        : "Disponible à la réservation (créneaux ouverts)",
      image: "/images/spaces/real-meeting-room-30m-4k.jpg",
      parkingIncluded: true,
      currentTenant: primaryMeeting
        ? {
            name: primaryMeeting.name,
            company: primaryMeeting.company || primaryMeeting.name,
            email: primaryMeeting.email,
            phone: primaryMeeting.phone,
            leaseStart: primaryMeeting.date || primaryMeeting.createdAt.split("T")[0],
            leadId: primaryMeeting.id
          }
        : undefined,
      activeBookings: wonMeetingLeads.map((m) => ({
        leadId: m.id,
        name: m.name,
        company: m.company || m.name,
        date: m.date || m.createdAt.split("T")[0],
        slot: m.timeSlot === "full-day" ? "Journée entière" : "Demi-journée"
      })),
      features: [
        "Écran 4K visioconférence sans fil",
        "Système audio & caméra grand angle",
        "Paperboard et feutres",
        "Pause café & thés offerts pour vos invités",
        "Places de parking cour privée réservables"
      ]
    }
  ];

  return spaces;
}

export function getInventoryMetrics(providedLeads?: Lead[]) {
  const leads = providedLeads || getLeads();
  const spaces = getUnifiedSpaces(leads);
  const tenants = getUnifiedTenants(leads);

  const privateOffices = spaces.filter((s) => s.category === "private");
  const availableSuitesCount = privateOffices.filter((s) => s.status === "available").length;
  const totalSuitesCount = privateOffices.length + 3; // total 5 private suites on property (including East Wing partner)

  // Calculate open space desks specifically
  const wonOpenSpaceLeads = leads.filter((l) => l.status === "won" && l.type === "open-space");
  const wonOpenDesks = wonOpenSpaceLeads.reduce((acc, l) => acc + (l.workstationCount || 1), 0);
  const openSpaceOccupiedCount = Math.min(10, 5 + wonOpenDesks); // Base 5 occupied across Espace A (2) & B (3)

  // Resident members (private suites + open space residents, excluding single event meeting attendees)
  const residentMembersCount = tenants
    .filter((t) => !t.spaceAssigned.toLowerCase().includes("salle") && !t.spaceAssigned.toLowerCase().includes("réunion"))
    .reduce((acc, t) => acc + (t.workstations || 1), 0);

  const occupiedSuites = privateOffices.filter((s) => s.status === "occupied").length;
  const assignedCourtyardBays = Math.min(9, 2 + occupiedSuites * 2); // 2 partner bays + 2 per occupied suite

  return {
    availableSuitesCount,
    totalSuitesCount,
    activeTenantsCount: tenants.length,
    openSpaceOccupiedCount,
    residentMembersCount,
    occupiedDesksCount: residentMembersCount,
    totalCourtyardBays: 9,
    assignedCourtyardBays
  };
}
