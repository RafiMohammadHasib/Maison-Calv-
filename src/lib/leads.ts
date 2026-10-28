import fs from "fs";
import path from "path";

export type LeadType = "private-office" | "open-space" | "meeting-room" | "general";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "tour_scheduled"
  | "viewing"
  | "visited"
  | "negotiating"
  | "won"
  | "closed"
  | "lost";
export type LeadPriority = "urgent" | "high" | "normal";

export interface LeadNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  type: LeadType;
  officeSize?: string;
  workstationCount?: number;
  openSpacePlan?: "fixe" | "flexible";
  date?: string;
  timeSlot?: string;
  attendees?: number;
  meetingPurpose?: string;
  visitRequested: boolean;
  source: string; // e.g. "Book a Private Tour (Hero)", "Book a Visit (Header)", "Pricing Enquiry", "Admin Direct"
  status: LeadStatus;
  priority: LeadPriority;
  message?: string;
  createdAt: string;
  updatedAt: string;
  notes: LeadNote[];
}

const LEADS_FILE_PATH = path.join(process.cwd(), "src", "data", "crm_leads.json");

// Default authentic seed leads for Maison Calvé
const INITIAL_SEED_LEADS: Lead[] = [
  {
    id: "MC-2026-089",
    name: "Edouard de Montalembert",
    email: "e.montalembert@cabinet-avocats33.fr",
    phone: "06 42 18 90 22",
    company: "Montalembert & Associés (Avocats d'affaires)",
    type: "private-office",
    officeSize: "25 m² (5-6 postes)",
    workstationCount: 5,
    date: "2026-11-05",
    visitRequested: true,
    source: "Book a Private Tour (Hero)",
    status: "tour_scheduled",
    priority: "urgent",
    message: "Recherche un bureau de prestige et standing pour notre équipe de 5 associés. Besoin impératif de 2 places de parking dans la cour privée.",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: [
      {
        id: "note-1",
        author: "Paul (Directeur)",
        text: "Visite privée confirmée pour jeudi 5 nov à 14h30 avec dégustation café.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      }
    ]
  },
  {
    id: "MC-2026-088",
    name: "Camille Vasseur",
    email: "c.vasseur@aquitaine-capital.com",
    phone: "07 88 55 12 34",
    company: "Aquitaine Venture Capital",
    type: "private-office",
    officeSize: "17 m² (3-4 postes)",
    workstationCount: 3,
    date: "2026-11-03",
    visitRequested: true,
    source: "Book a Visit (Header)",
    status: "new",
    priority: "high",
    message: "Installation prévue début décembre. Nous souhaitons découvrir le bureau de 17m² et tester l'insonorisation.",
    createdAt: new Date(Date.now() - 3600000 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 11).toISOString(),
    notes: []
  },
  {
    id: "MC-2026-087",
    name: "Alexandre Bonnet",
    email: "alexandre@studio-archibordeaux.fr",
    phone: "06 19 82 43 00",
    company: "Studio Bonnet Architectes",
    type: "open-space",
    openSpacePlan: "fixe",
    workstationCount: 2,
    date: "2026-11-02",
    visitRequested: true,
    source: "Book a Visit (Header)",
    status: "visited",
    priority: "normal",
    message: "Deux postes fixes souhaités dans le premier open space de 5 postes. Avons visité lundi matin.",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    notes: [
      {
        id: "note-2",
        author: "Paul",
        text: "Visite très positive. Contrat de bail en cours de préparation.",
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]
  },
  {
    id: "MC-2026-086",
    name: "Hélène Mercier",
    email: "hmercier@bordeaux-consulting.fr",
    phone: "06 50 11 29 84",
    company: "Bordeaux Strategy Consulting",
    type: "meeting-room",
    timeSlot: "full-day",
    date: "2026-11-12",
    attendees: 12,
    meetingPurpose: "Comité de direction trimestriel",
    visitRequested: false,
    source: "Meeting Room Booking",
    status: "won",
    priority: "normal",
    message: "Journée complète avec formule café barista et accueil 12 personnes avec projection 4K.",
    createdAt: new Date(Date.now() - 3600000 * 52).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    notes: [
      {
        id: "note-3",
        author: "Équipe",
        text: "Paiement 200€ HT validé. Clés et code d'accès envoyés.",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]
  },
  {
    id: "MC-2026-085",
    name: "Thomas Laroche",
    email: "thomas.laroche@fintech-gironde.io",
    phone: "07 62 90 01 15",
    company: "PayGironde SAS",
    type: "private-office",
    officeSize: "17 m² (3-4 postes)",
    workstationCount: 4,
    date: "2026-11-06",
    visitRequested: true,
    source: "Book a Private Tour (Hero)",
    status: "negotiating",
    priority: "high",
    message: "Intéressé par le forfait 750€ HT avec domiciliation d'entreprise.",
    createdAt: new Date(Date.now() - 3600000 * 74).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    notes: [
      {
        id: "note-4",
        author: "Paul",
        text: "En attente de signature Kbis.",
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ]
  }
];

// In-memory cache fallback for development server
let inMemoryLeads: Lead[] | null = null;

export function getLeads(): Lead[] {
  try {
    if (fs.existsSync(LEADS_FILE_PATH)) {
      const data = fs.readFileSync(LEADS_FILE_PATH, "utf-8");
      inMemoryLeads = JSON.parse(data);
      return inMemoryLeads || [];
    }
  } catch (err) {
    console.error("Error reading leads file, using memory/seed fallback:", err);
  }

  if (!inMemoryLeads) {
    inMemoryLeads = [...INITIAL_SEED_LEADS];
    saveLeads(inMemoryLeads);
  }
  return inMemoryLeads;
}

export function saveLeads(leads: Lead[]): boolean {
  try {
    inMemoryLeads = leads;
    const dir = path.dirname(LEADS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LEADS_FILE_PATH, JSON.stringify(leads, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error saving leads to file:", err);
    return false;
  }
}

export function addLead(newLeadData: Omit<Lead, "id" | "createdAt" | "updatedAt" | "notes"> & { notes?: LeadNote[] }): Lead {
  const leads = getLeads();
  const counter = leads.length + 90;
  const newLead: Lead = {
    ...newLeadData,
    id: `MC-2026-${String(counter).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: newLeadData.notes || []
  };

  leads.unshift(newLead);
  saveLeads(leads);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Omit<Lead, "id" | "createdAt">>): Lead | null {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;

  leads[index] = {
    ...leads[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveLeads(leads);
  return leads[index];
}

export function addLeadNote(leadId: string, author: string, text: string): Lead | null {
  const leads = getLeads();
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) return null;

  const note: LeadNote = {
    id: `note-${Date.now()}`,
    author,
    text,
    createdAt: new Date().toISOString()
  };

  lead.notes.push(note);
  lead.updatedAt = new Date().toISOString();
  saveLeads(leads);
  return lead;
}

export function deleteLead(id: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  saveLeads(filtered);
  return true;
}

export function getCRMStats() {
  const leads = getLeads();
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const tourRequests = leads.filter((l) => l.visitRequested || l.source.toLowerCase().includes("tour") || l.source.toLowerCase().includes("visit")).length;
  const toursScheduled = leads.filter((l) => l.status === "tour_scheduled").length;
  const visited = leads.filter((l) => l.status === "visited").length;
  const won = leads.filter((l) => l.status === "won").length;
  const conversionRate = totalLeads > 0 ? Math.round((won / totalLeads) * 100) : 0;

  return {
    totalLeads,
    newLeads,
    tourRequests,
    toursScheduled,
    visited,
    won,
    conversionRate,
    activeOffices: "2 disponibles / 5 total",
    clientRating: "4.9 / 5",
    retentionRate: "98%"
  };
}
