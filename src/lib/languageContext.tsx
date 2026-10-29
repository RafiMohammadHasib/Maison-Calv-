"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type AdminLanguage = "fr" | "en" | "es";

interface LanguageContextType {
  language: AdminLanguage;
  setLanguage: (lang: AdminLanguage) => void;
  isFrench: boolean;
  isEnglish: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  isFrench: true,
  isEnglish: false,
  t: (key: string) => key
});

export const ADMIN_TRANSLATIONS: Record<AdminLanguage, Record<string, string>> = {
  fr: {
    // Header & Global
    "search.placeholder": "Rechercher un lead, contact, espace, résident...",
    "realtime.live": "Realtime Live",
    "btn.new": "+ Nouveau",
    "tooltip.notifications": "Notifications système",
    "tooltip.refresh": "Rafraîchir les données",
    "tooltip.logout": "Déconnexion",

    // Sidebar Groups & Items
    "nav.overview": "VUE D'ENSEMBLE",
    "nav.dashboard": "Tableau de bord",
    "nav.crm": "CRM & PIPELINE",
    "nav.pipeline": "Opportunity Board",
    "nav.tours": "Visites & Tours",
    "nav.spaces": "Bureaux & Espaces",
    "nav.spaces.avail": "2 dispos",
    "nav.tenants": "Résidents & Locataires",
    "nav.tenants.active": "4 actifs",
    "nav.content": "CONTENU & CMS",
    "nav.cms": "Éditeur du Site",
    "nav.media": "Médiathèque",
    "nav.system": "SYSTÈME & PARAMÈTRES",
    "nav.seo": "SEO & Redirections",
    "nav.settings": "Global Settings",
    "nav.view_site": "Voir le site public",
    "nav.admin_user": "Administrateur Maison Calvé",

    // New Lead Modal
    "modal.title": "Nouvelle Opportunité CRM",
    "modal.subtitle": "Enregistrer une nouvelle demande entrante ou prise de rendez-vous.",
    "modal.field.name": "Nom & Prénom *",
    "modal.field.email": "Email professionnel *",
    "modal.field.phone": "Téléphone direct *",
    "modal.field.company": "Société / Structure",
    "modal.field.type": "Type d'espace demandé",
    "modal.field.office_size": "Superficie de bureau",
    "modal.field.date": "Date souhaitée pour visite / emménagement",
    "modal.field.priority": "Niveau de priorité",
    "modal.field.message": "Message / Demande du prospect",
    "modal.field.note": "Première note interne",
    "modal.btn.cancel": "Annuler",
    "modal.btn.submit": "Créer l'opportunité",

    // Opportunity Pipeline
    "pipeline.breadcrumb": "MAISON CALVÉ CRM",
    "pipeline.title": "Opportunity Board",
    "pipeline.subtitle": "Génération de leads (Bureaux privatifs, Open Space, Salle de réunion) & visites avec gestion par étapes et glisser-déposer",
    "pipeline.search": "Rechercher un lead, adresse, service...",
    "pipeline.filter.all": "All Leads",
    "pipeline.filter.offices": "Bureaux 17-25m²",
    "pipeline.filter.open_space": "Open Space",
    "pipeline.filter.meeting": "Salle 30m²",
    "pipeline.filter.tours": "Tours & Visites",
    "pipeline.filter.won": "Won / Signed",
    "pipeline.stage.new": "New Leads",
    "pipeline.stage.contacted": "Contacted",
    "pipeline.stage.qualified": "Qualified",
    "pipeline.stage.viewing": "Viewing / Meeting",
    "pipeline.stage.won": "Won / Signed",
    "pipeline.stage.closed": "Closed",
    "pipeline.empty": "Aucun lead à cette étape",
    "pipeline.modal.title": "Détails de l'opportunité",
    "pipeline.modal.change_stage": "Changer l'étape du pipeline :",
    "pipeline.modal.history": "Historique des notes d'équipe :",
    "pipeline.modal.add_note": "Ajouter une note de suivi commercial...",
    "pipeline.modal.add_btn": "Ajouter",
    "pipeline.modal.delete": "Supprimer cette opportunité",

    // Settings
    "settings.breadcrumb": "CONFIGURATION DU SYSTÈME MAISON CALVÉ",
    "settings.title": "Settings & System Rules",
    "settings.subtitle": "Gérer l'identité de l'agence, les règles locatives, intégrations et sécurité du compte.",
    "settings.last_sync": "Dernière synchro :",
    "settings.save_btn": "Save Settings",
    "settings.saved_banner": "Paramètres et règles système enregistrés avec succès dans le cache de production !",
    "settings.tab.identity": "Identity & Agency",
    "settings.tab.rental": "Rental Rules & Rates",
    "settings.tab.database": "Base MySQL OVH",
    "settings.tab.system": "System, SEO & Social",
    "settings.tab.profile": "Profile & Security",
    "settings.identity.title": "1. Identité & Image de l'Agence",
    "settings.identity.subtitle": "Informations affichées publiquement sur le site et les mandats de location.",
    "settings.identity.public_portal": "Public Portal",
    "settings.legal.title": "2. Mentions Légales & Cartes Professionnelles (Loi Hoguet)",
    "settings.rental.title": "1. Grille Tarifaire Officielle (Prix en € HT)",
    "settings.rental.subtitle": "Tarifs affichés en direct sur le site public de Maison Calvé et les devis CRM.",
    "settings.lease.title": "2. Conditions de Bail & Politiques Résidents",
    "settings.seo.title": "1. Référencement Naturel (SEO) & Canaux Sociaux",
    "settings.profile.title": "1. Compte Administrateur & Chiffrement Sécurisé",
    "settings.backup.title": "2. Sauvegarde & Export JSON de la Base CRM",
    "settings.backup.subtitle": "Téléchargez un instantané complet de tous les leads, baux, et visites privées.",
    "settings.backup.btn": "Télécharger Sauvegarde (.json)",

    // Tours & Visits
    "tours.breadcrumb": "MAISON CALVÉ CRM & PROTOCOL",
    "tours.title": "Private Tours & Space Viewings",
    "tours.subtitle": "Planification des visites VIP, créneaux horaires, protocole d'accueil & conversion des leads au 48 rue Calvé",
    "tours.search": "Rechercher un visiteur, société, espace...",
    "tours.filter.all": "All Visits",
    "tours.filter.new": "🟡 Nouvelles demandes",
    "tours.filter.scheduled": "🟢 Programmées",
    "tours.filter.visited": "🔵 Effectuées",
    "tours.filter.won": "🏆 Signées",
    "tours.metric.total": "Total Visites",
    "tours.metric.total_sub": "Hero & Header Leads",
    "tours.metric.pending": "À Confirmer",
    "tours.metric.pending_sub": "Rappel téléphonique < 2h",
    "tours.metric.welcome": "Accueil & Barista",
    "tours.metric.welcome_val": "Café Grand Cru offert",
    "tours.metric.welcome_sub": "Hôte : Paul (Directeur)",
    "tours.metric.parking": "Cour Privative",
    "tours.metric.parking_val": "Place #1 réservable",
    "tours.metric.parking_sub": "9 places sous porche sécurisé",
    "tours.box.date": "Date & Horaire Souhaité",
    "tours.box.space": "Espace & Budget Estimé",
    "tours.box.contact": "Coordonnées Directes",
    "tours.quote_title": "Précisions & Demande Particulière :",
    "tours.protocol_title": "Protocole d'Accueil 48 Rue Calvé :",
    "tours.check.coffee": "☕ Barista offert",
    "tours.check.parking": "🚗 Place #1 cour",
    "tours.check.files": "📋 Dossier & Bail",
    "tours.check.keys": "🔑 Clés & Badge RFID",
    "tours.note_placeholder": "Ajouter une note de visite ou compte-rendu d'accueil...",
    "tours.btn_add": "Ajouter",
    "tours.btn_call": "Appeler",
    "tours.btn_email": "Email",
    "tours.btn_pipeline": "Pipeline CRM",

    // Statuses
    "status.new": "🟡 Nouvel arrivant (Non contacté)",
    "status.tour_scheduled": "🟢 Visite Programmée",
    "status.visited": "🔵 Visite Réalisée",
    "status.negotiating": "🟣 En Négociation",
    "status.won": "🏆 Contrat Signé",
    "status.closed": "⚪ Fermé / Annulé",
    "status.clean.new": "Nouvel arrivant",
    "status.clean.tour_scheduled": "Visite programmée",
    "status.clean.visited": "Visite effectuée",
    "status.clean.negotiating": "En négociation",
    "status.clean.won": "Contrat signé",
    "status.clean.closed": "Sans suite / Annulé",

    // Dashboard
    "dashboard.title": "Vue d'ensemble des opérations & Leads CRM",
    "dashboard.subtitle": "Supervision centralisée des demandes de visite, baux des bureaux privatifs et résidents.",
    "dashboard.export_csv": "Exporter CSV",
    "dashboard.metric.suites": "Suites Actives",
    "dashboard.metric.suites_sub": "17m² (750€) & 25m² (1000€) HT",
    "dashboard.metric.rating": "Satisfaction Clients",
    "dashboard.metric.rating_sub": "38 avis Google vérifiés",
    "dashboard.metric.retention": "Taux de Rétention",
    "dashboard.metric.retention_sub": "Engagement long terme privilégié",
    "dashboard.metric.leads": "Total Leads (CRM)",
    "dashboard.metric.leads_sub": "Pipeline active centralisée",
    "dashboard.metric.tours": "Demandes de Visite",
    "dashboard.metric.tours_badge": "Haute intention",
    "dashboard.metric.open_space": "Postes Open Space",
    "dashboard.metric.open_space_sub": "2 espaces calmes de 5 postes",
    "dashboard.metric.meeting": "Salle de Réunion",
    "dashboard.metric.meeting_sub": "120€ demi-j / 200€ journée (HT)",
    "dashboard.metric.parking": "Parking Privé",
    "dashboard.metric.parking_sub": "Cour fermée & sécurisée",
    "dashboard.chart.growth": "Growth Analytics +18.4%",
    "dashboard.chart.title": "Flux des leads & visites au fil des semaines",
    "dashboard.chart.subtitle": "Flux direct depuis la base de données CRM ({count} demandes enregistrées)",
    "dashboard.chart.btn.leads": "Leads",
    "dashboard.chart.btn.tours": "Visites",
    "dashboard.chart.btn.revenue": "Rev. Est. (€)",
    "dashboard.chart.w1": "Semaine 1",
    "dashboard.chart.w2": "Semaine 2",
    "dashboard.chart.w3": "Semaine 3",
    "dashboard.chart.w4": "Semaine 4",
    "dashboard.shortcuts.title": "Modules & Shortcuts",
    "dashboard.shortcuts.cloud": "Hôtel Particulier",
    "dashboard.shortcuts.cloud_status": "48 rue Calvé, Bordeaux",
    "dashboard.tab.all": "Tous les leads",
    "dashboard.tab.tours": "Demandes de Visite",
    "dashboard.tab.offices": "Bureaux 17m² & 25m²",
    "dashboard.tab.open_space": "Open Space",
    "dashboard.tab.meeting": "Salle 30 m²",
    "dashboard.tab.won": "Contrats Signés",
    "dashboard.table.title": "Répertoire Central des Leads & Visites",
    "dashboard.table.subtitle": "Suivi analytique, attribution des espaces et conversion locative",
    "dashboard.table.col_prospect": "Prospect & Société",
    "dashboard.table.col_space": "Espace & Tarif Mensuel",
    "dashboard.table.col_source": "Canal & Date Souhaitée",
    "dashboard.table.col_status": "Statut Pipeline",
    "dashboard.table.col_actions": "Actions",
    "dashboard.table.details": "Détails",
    "dashboard.table.close_details": "Fermer",
    "dashboard.table.search_placeholder": "Rechercher par nom, entreprise, email, téléphone ou ID...",
    "dashboard.table.kanban_link": "Ouvrir le Kanban",
    "dashboard.table.call": "Appeler",
    "dashboard.table.email": "Email",
    "dashboard.table.view_kanban": "Voir dans le Kanban",
    "dashboard.table.notes_count": "notes",
    "dashboard.filter.status": "Statut :",
    "dashboard.filter.all_statuses": "Tous les statuts",
    "dashboard.empty": "Aucun lead ne correspond aux filtres.",
    "dashboard.lead.message_title": "Message du contact :",
    "dashboard.lead.notes_title": "Notes de suivi internes :",
    "dashboard.lead.no_notes": "Aucune note enregistrée pour l'instant.",
    "dashboard.lead.note_placeholder": "Ajouter une note de suivi...",
    "dashboard.lead.save_note": "Enregistrer",
    "dashboard.lead.received_on": "Reçu le",
    "dashboard.lead.delete": "Supprimer le lead",
    "dashboard.lead.confirm_delete": "Confirmer la suppression de ce lead ?",

    // Spaces
    "spaces.title": "Inventaire des Espaces & Bureaux (48 rue Calvé)",
    "spaces.subtitle": "Supervision des disponibilités, baux, réservations de parking et tarifs locatifs en temps réel.",
    "spaces.view_gallery": "Voir la galerie photo",
    "spaces.metric.occupancy": "Taux d'Occupation",
    "spaces.metric.capacity": "Capacité d'Accueil",
    "spaces.metric.parking": "Places de Parking Cour",
    "spaces.metric.avg_price": "Prix Moyen Poste Fixe",

    // Tenants
    "tenants.title": "Annuaire des Résidents & Locataires",
    "tenants.subtitle": "Gestion des contrats, badges RFID, places de parking attitrées et contacts d'urgence.",
    "tenants.search": "Rechercher un résident, entreprise, place de parking, badge...",
    "tenants.metric.active": "Résidents Actifs",
    "tenants.metric.occupied": "Postes Occupés",
    "tenants.metric.parking": "Places Dédiées",
    "tenants.metric.badges": "Accès Badges RFID",
    "tenants.col.tenant": "Résident & Société",
    "tenants.col.space": "Espace & Capacité",
    "tenants.col.parking": "Parking & Badges",
    "tenants.col.lease": "Contrat & Loyer",
    "tenants.col.status": "Statut",
    "tenants.col.actions": "Actions",

    // CMS & Media
    "cms.title": "Éditeur de Contenu & Espaces (CMS)",
    "cms.subtitle": "Modifiez les textes clés, prix en ligne et badges d'urgence affichés sur la page d'accueil de Maison Calvé.",
    "cms.preview": "Prévisualiser en direct",
    "cms.saved": "Modifications enregistrées avec succès dans le cache de production !",
    "media.title": "Médiathèque & Photothèque (48 rue Calvé)",
    "media.subtitle": "Gestion des photographies architecturales haute résolution, visuels d'espaces et flux Instagram @maisoncalvebordeaux.",
    "media.filter_cat": "Catégorie :",
    "media.tab.all": "Toutes les images",
    "media.tab.hero": "Hero & Accueil",
    "media.tab.spaces": "Bureaux & Espaces",
    "media.tab.instagram": "Flux Instagram"
  },
  en: {
    // Header & Global
    "search.placeholder": "Search leads, owners, spaces, residents...",
    "realtime.live": "Realtime Live",
    "btn.new": "+ New",
    "tooltip.notifications": "System notifications",
    "tooltip.refresh": "Refresh data",
    "tooltip.logout": "Sign out",

    // Sidebar Groups & Items
    "nav.overview": "OVERVIEW",
    "nav.dashboard": "Dashboard",
    "nav.crm": "CRM & PIPELINE",
    "nav.pipeline": "Opportunity Board",
    "nav.tours": "Visits & Tours",
    "nav.spaces": "Offices & Spaces",
    "nav.spaces.avail": "2 available",
    "nav.tenants": "Tenants & Residents",
    "nav.tenants.active": "4 active",
    "nav.content": "CONTENT & CMS",
    "nav.cms": "Homepage Editor",
    "nav.media": "Media Library",
    "nav.system": "SYSTEM & SETTINGS",
    "nav.seo": "SEO & Redirects",
    "nav.settings": "Global Settings",
    "nav.view_site": "View live site",
    "nav.admin_user": "Maison Calvé Administrator",

    // New Lead Modal
    "modal.title": "New CRM Opportunity",
    "modal.subtitle": "Record a new incoming lead, tenant enquiry, or viewing appointment.",
    "modal.field.name": "Full Name *",
    "modal.field.email": "Professional Email *",
    "modal.field.phone": "Direct Phone *",
    "modal.field.company": "Company / Organization",
    "modal.field.type": "Requested Space Type",
    "modal.field.office_size": "Office Surface / Suite",
    "modal.field.date": "Desired Date for Tour / Move-in",
    "modal.field.priority": "Priority Level",
    "modal.field.message": "Prospect Message / Request",
    "modal.field.note": "First Internal Note",
    "modal.btn.cancel": "Cancel",
    "modal.btn.submit": "Create Opportunity",

    // Opportunity Pipeline
    "pipeline.breadcrumb": "MAISON CALVÉ CRM",
    "pipeline.title": "Opportunity Board",
    "pipeline.subtitle": "Space & tenant lead generation (Private Offices, Open Space, Meeting Room) & private tours with drag & drop conversion",
    "pipeline.search": "Search leads, address, service...",
    "pipeline.filter.all": "All Leads",
    "pipeline.filter.offices": "Offices 17-25m²",
    "pipeline.filter.open_space": "Open Space",
    "pipeline.filter.meeting": "Meeting Room 30m²",
    "pipeline.filter.tours": "Tours & Visits",
    "pipeline.filter.won": "Won / Signed",
    "pipeline.stage.new": "New Leads",
    "pipeline.stage.contacted": "Contacted",
    "pipeline.stage.qualified": "Qualified",
    "pipeline.stage.viewing": "Viewing / Meeting",
    "pipeline.stage.won": "Won / Signed",
    "pipeline.stage.closed": "Closed",
    "pipeline.empty": "No leads in stage",
    "pipeline.modal.title": "Opportunity Details",
    "pipeline.modal.change_stage": "Change pipeline stage:",
    "pipeline.modal.history": "Team Notes History:",
    "pipeline.modal.add_note": "Add a follow-up note...",
    "pipeline.modal.add_btn": "Add",
    "pipeline.modal.delete": "Delete Opportunity",

    // Settings
    "settings.breadcrumb": "MAISON CALVÉ SYSTEM CONFIGURATION",
    "settings.title": "Settings & System Rules",
    "settings.subtitle": "Manage agency identity, rental rules, integrations, and account security.",
    "settings.last_sync": "Last sync:",
    "settings.save_btn": "Save Settings",
    "settings.saved_banner": "Settings & system rules successfully saved in production cache!",
    "settings.tab.identity": "Identity & Agency",
    "settings.tab.rental": "Rental Rules & Rates",
    "settings.tab.database": "Base MySQL OVH",
    "settings.tab.system": "System, SEO & Social",
    "settings.tab.profile": "Profile & Security",
    "settings.identity.title": "1. Agency Identity & Branding",
    "settings.identity.subtitle": "Information displayed publicly on the website and mandate agreements.",
    "settings.identity.public_portal": "Public Portal",
    "settings.legal.title": "2. Legal Notice & Professional Licenses (Hoguet Law)",
    "settings.rental.title": "1. Official Rental Pricing (Prices in € HT)",
    "settings.rental.subtitle": "Rates displayed live on Maison Calvé public portal and CRM quotes.",
    "settings.lease.title": "2. Lease Conditions & Resident Policies",
    "settings.seo.title": "1. Search Engine Optimization (SEO) & Social Channels",
    "settings.profile.title": "1. Administrator Account & Secure Encryption",
    "settings.backup.title": "2. Database JSON Backup & Export",
    "settings.backup.subtitle": "Download a full JSON snapshot of all leads, leases, and private tours.",
    "settings.backup.btn": "Download Backup (.json)",

    // Tours & Visits
    "tours.breadcrumb": "MAISON CALVÉ CRM & PROTOCOL",
    "tours.title": "Private Tours & Space Viewings",
    "tours.subtitle": "VIP visit scheduling, calendar time-slots, reception protocol & lead conversion tracking for 48 rue Calvé",
    "tours.search": "Search visitor, company, space...",
    "tours.filter.all": "All Visits",
    "tours.filter.new": "🟡 New Requests",
    "tours.filter.scheduled": "🟢 Scheduled",
    "tours.filter.visited": "🔵 Visited",
    "tours.filter.won": "🏆 Won / Signed",
    "tours.metric.total": "Total Visits",
    "tours.metric.total_sub": "Hero & Header Leads",
    "tours.metric.pending": "To Confirm",
    "tours.metric.pending_sub": "Callback target < 2h",
    "tours.metric.welcome": "Barista Reception",
    "tours.metric.welcome_val": "Grand Cru Barista Coffee",
    "tours.metric.welcome_sub": "Host: Paul (Director)",
    "tours.metric.parking": "Private Courtyard",
    "tours.metric.parking_val": "Bay #1 Reservable",
    "tours.metric.parking_sub": "9 gated courtyard spots",
    "tours.box.date": "Desired Date & Slot",
    "tours.box.space": "Space & Estimated Budget",
    "tours.box.contact": "Direct Contact Details",
    "tours.quote_title": "Visitor Notes & Special Request:",
    "tours.protocol_title": "Welcome Protocol 48 Rue Calvé:",
    "tours.check.coffee": "☕ Barista Coffee",
    "tours.check.parking": "🚗 Bay #1 Courtyard",
    "tours.check.files": "📋 Lease Dossier",
    "tours.check.keys": "🔑 Keys & RFID Badge",
    "tours.note_placeholder": "Add a tour note or reception report...",
    "tours.btn_add": "Add Note",
    "tours.btn_call": "Call",
    "tours.btn_email": "Email",
    "tours.btn_pipeline": "Pipeline CRM",

    // Statuses
    "status.new": "🟡 New Arrival (Not Contacted)",
    "status.tour_scheduled": "🟢 Tour Scheduled",
    "status.visited": "🔵 Tour Completed",
    "status.negotiating": "🟣 In Negotiation",
    "status.won": "🏆 Contract Signed",
    "status.closed": "⚪ Closed / Cancelled",
    "status.clean.new": "New Arrival",
    "status.clean.tour_scheduled": "Tour Scheduled",
    "status.clean.visited": "Tour Completed",
    "status.clean.negotiating": "In Negotiation",
    "status.clean.won": "Contract Signed",
    "status.clean.closed": "Closed / Cancelled",

    // Dashboard
    "dashboard.title": "Operations Overview & CRM Leads",
    "dashboard.subtitle": "Centralized supervision of tour requests, private office leases, and residents.",
    "dashboard.export_csv": "Export CSV",
    "dashboard.metric.suites": "Active Suites",
    "dashboard.metric.suites_sub": "17m² (€750) & 25m² (€1,000) excl. VAT",
    "dashboard.metric.rating": "Client Satisfaction",
    "dashboard.metric.rating_sub": "38 verified Google reviews",
    "dashboard.metric.retention": "Retention Rate",
    "dashboard.metric.retention_sub": "Long-term commitment favored",
    "dashboard.metric.leads": "Total Leads (CRM)",
    "dashboard.metric.leads_sub": "Centralized active pipeline",
    "dashboard.metric.tours": "Tour Enquiries",
    "dashboard.metric.tours_badge": "High intent",
    "dashboard.metric.open_space": "Open Space Desks",
    "dashboard.metric.open_space_sub": "2 quiet spaces of 5 desks",
    "dashboard.metric.meeting": "Meeting Room",
    "dashboard.metric.meeting_sub": "€120 half-day / €200 full day (excl. VAT)",
    "dashboard.metric.parking": "Private Courtyard",
    "dashboard.metric.parking_sub": "Gated & secured courtyard",
    "dashboard.chart.growth": "Growth Analytics +18.4%",
    "dashboard.chart.title": "Lead & tour volume trend over the weeks",
    "dashboard.chart.subtitle": "Direct stream from CRM database ({count} registered enquiries)",
    "dashboard.chart.btn.leads": "Leads",
    "dashboard.chart.btn.tours": "Tours",
    "dashboard.chart.btn.revenue": "Est. Rev (€)",
    "dashboard.chart.w1": "Week 1",
    "dashboard.chart.w2": "Week 2",
    "dashboard.chart.w3": "Week 3",
    "dashboard.chart.w4": "Week 4",
    "dashboard.shortcuts.title": "Modules & Shortcuts",
    "dashboard.shortcuts.cloud": "Hôtel Particulier",
    "dashboard.shortcuts.cloud_status": "48 rue Calvé, Bordeaux",
    "dashboard.tab.all": "All Leads",
    "dashboard.tab.tours": "Tour Enquiries",
    "dashboard.tab.offices": "Offices 17m² & 25m²",
    "dashboard.tab.open_space": "Open Space",
    "dashboard.tab.meeting": "Room 30 m²",
    "dashboard.tab.won": "Won / Signed",
    "dashboard.table.title": "Central CRM & Tour Directory",
    "dashboard.table.subtitle": "Real-time pipeline tracking, space assignment and leasing conversion",
    "dashboard.table.col_prospect": "Prospect & Company",
    "dashboard.table.col_space": "Space & Monthly Rate",
    "dashboard.table.col_source": "Source & Date",
    "dashboard.table.col_status": "Pipeline Status",
    "dashboard.table.col_actions": "Actions",
    "dashboard.table.details": "Details",
    "dashboard.table.close_details": "Close",
    "dashboard.table.search_placeholder": "Search by name, company, email, phone or ID...",
    "dashboard.table.kanban_link": "Open Kanban",
    "dashboard.table.call": "Call",
    "dashboard.table.email": "Email",
    "dashboard.table.view_kanban": "View in Kanban",
    "dashboard.table.notes_count": "notes",
    "dashboard.filter.status": "Status:",
    "dashboard.filter.all_statuses": "All statuses",
    "dashboard.empty": "No leads match the filters.",
    "dashboard.lead.message_title": "Contact message:",
    "dashboard.lead.notes_title": "Internal follow-up notes:",
    "dashboard.lead.no_notes": "No notes recorded yet.",
    "dashboard.lead.note_placeholder": "Add a follow-up note...",
    "dashboard.lead.save_note": "Save Note",
    "dashboard.lead.received_on": "Received on",
    "dashboard.lead.delete": "Delete lead",
    "dashboard.lead.confirm_delete": "Confirm deletion of this lead?",

    // Spaces
    "spaces.title": "Spaces & Offices Inventory (48 rue Calvé)",
    "spaces.subtitle": "Real-time oversight of availability, leases, courtyard parking, and rental pricing.",
    "spaces.view_gallery": "View Photo Gallery",
    "spaces.metric.occupancy": "Occupancy Rate",
    "spaces.metric.capacity": "Total Capacity",
    "spaces.metric.parking": "Courtyard Parking Bays",
    "spaces.metric.avg_price": "Avg. Dedicated Desk Price",

    // Tenants
    "tenants.title": "Tenants & Residents Directory",
    "tenants.subtitle": "Management of tenant contracts, RFID access badges, assigned courtyard parking, and emergency contacts.",
    "tenants.search": "Search resident, company, parking bay, badge...",
    "tenants.metric.active": "Active Residents",
    "tenants.metric.occupied": "Occupied Desks",
    "tenants.metric.parking": "Dedicated Bays",
    "tenants.metric.badges": "Active RFID Badges",
    "tenants.col.tenant": "Resident & Company",
    "tenants.col.space": "Space & Workstations",
    "tenants.col.parking": "Parking & Badges",
    "tenants.col.lease": "Lease & Monthly Rent",
    "tenants.col.status": "Status",
    "tenants.col.actions": "Actions",

    // CMS & Media
    "cms.title": "Content & Space Editor (CMS)",
    "cms.subtitle": "Edit key hero copy, online pricing, and urgency tags displayed on the Maison Calvé website.",
    "cms.preview": "Live Preview",
    "cms.saved": "Changes successfully saved to production cache!",
    "media.title": "Media & Photo Library (48 rue Calvé)",
    "media.subtitle": "High-resolution architectural photography, space visuals, and Instagram feed assets @maisoncalvebordeaux.",
    "media.filter_cat": "Category:",
    "media.tab.all": "All Assets",
    "media.tab.hero": "Hero & Homepage",
    "media.tab.spaces": "Offices & Spaces",
    "media.tab.instagram": "Instagram Feed"
  },
  es: {
    // Falls back to EN for any missing Spanish keys
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AdminLanguage>("fr");

  useEffect(() => {
    // Check localStorage on mount
    try {
      const saved = localStorage.getItem("mc_language") as AdminLanguage | null;
      if (saved && (saved === "fr" || saved === "en")) {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
      }
    } catch {
      // Ignore storage errors in SSR or restricted iframe
    }

    const handleStorageChange = (e: CustomEvent<{ lang: AdminLanguage }>) => {
      if (e.detail?.lang && (e.detail.lang === "fr" || e.detail.lang === "en")) {
        setLanguageState(e.detail.lang);
      }
    };

    window.addEventListener("mc_language_change" as any, handleStorageChange);
    return () => {
      window.removeEventListener("mc_language_change" as any, handleStorageChange);
    };
  }, []);

  const setLanguage = (lang: AdminLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("mc_language", lang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang;
      }
      window.dispatchEvent(
        new CustomEvent("mc_language_change", { detail: { lang } })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const t = (key: string): string => {
    return ADMIN_TRANSLATIONS[language]?.[key] || ADMIN_TRANSLATIONS.fr[key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isFrench: language === "fr",
        isEnglish: language === "en",
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
