-- ========================================================
-- MAISON CALVÉ — OVH CLOUD MySQL COMPLETE DATABASE SCHEMA
-- Database: uwenyoimaison (Host: uwenyoimaison.mysql.db)
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. TABLE: mc_leads (Opportunity Board & CRM Leads)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mc_leads` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `company` VARCHAR(255) DEFAULT '',
  `type` VARCHAR(64) NOT NULL DEFAULT 'private-office',
  `office_size` VARCHAR(128) DEFAULT NULL,
  `workstation_count` INT DEFAULT 1,
  `open_space_plan` VARCHAR(32) DEFAULT NULL,
  `date` VARCHAR(64) DEFAULT NULL,
  `time_slot` VARCHAR(64) DEFAULT NULL,
  `attendees` INT DEFAULT NULL,
  `meeting_purpose` TEXT DEFAULT NULL,
  `visit_requested` TINYINT(1) DEFAULT 1,
  `source` VARCHAR(255) DEFAULT 'Website Space Enquiry',
  `status` VARCHAR(64) DEFAULT 'new',
  `priority` VARCHAR(32) DEFAULT 'normal',
  `message` TEXT DEFAULT NULL,
  `created_at` VARCHAR(64) NOT NULL,
  `updated_at` VARCHAR(64) NOT NULL,
  `notes` LONGTEXT DEFAULT NULL,
  INDEX idx_status (`status`),
  INDEX idx_type (`type`),
  INDEX idx_created (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. TABLE: mc_spaces (Spaces & Offices Inventory)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mc_spaces` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(64) NOT NULL DEFAULT 'private',
  `area` VARCHAR(64) DEFAULT NULL,
  `capacity` VARCHAR(255) DEFAULT NULL,
  `price` VARCHAR(128) DEFAULT NULL,
  `period` VARCHAR(128) DEFAULT NULL,
  `status` VARCHAR(32) NOT NULL DEFAULT 'available',
  `status_text` VARCHAR(255) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `parking_included` TINYINT(1) DEFAULT 0,
  `current_tenant` LONGTEXT DEFAULT NULL,
  `features` LONGTEXT DEFAULT NULL,
  `active_bookings` LONGTEXT DEFAULT NULL,
  `updated_at` VARCHAR(64) NOT NULL,
  INDEX idx_category (`category`),
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. TABLE: mc_tenants (Tenants & Residents Directory)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mc_tenants` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `lead_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) DEFAULT '',
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64) NOT NULL,
  `space_assigned` VARCHAR(255) NOT NULL,
  `workstations` INT DEFAULT 1,
  `parking_bays` VARCHAR(255) DEFAULT '',
  `badge_ids` LONGTEXT DEFAULT NULL,
  `lease_start` VARCHAR(64) DEFAULT NULL,
  `monthly_rent` VARCHAR(128) DEFAULT '',
  `status` VARCHAR(32) NOT NULL DEFAULT 'active',
  `is_from_won_lead` TINYINT(1) DEFAULT 0,
  `updated_at` VARCHAR(64) NOT NULL,
  INDEX idx_status (`status`),
  INDEX idx_lead (`lead_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. TABLE: mc_settings (Key-Value Configuration & Rules)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mc_settings` (
  `setting_key` VARCHAR(128) NOT NULL PRIMARY KEY,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` VARCHAR(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. TABLE: mc_sync_logs (System & Audit Logs)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `mc_sync_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `action` VARCHAR(64) NOT NULL,
  `details` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(64) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- SEED 1: OPPORTUNITY BOARD (18 CURRENT ACTIVE LEADS)
INSERT INTO `mc_leads` (id, name, email, phone, company, type, office_size, workstation_count, open_space_plan, date, time_slot, attendees, meeting_purpose, visit_requested, source, status, priority, message, created_at, updated_at, notes) VALUES
('MC-2026-107', 'Rafi', 'hello@gta.com', '+33 6 015211123', 'Studio', 'private-office', '25 m² (5-6 postes)', 5, NULL, '', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'contacted', 'urgent', '', '2026-10-28T11:25:53.300Z', '2026-10-28T12:00:13.222Z', '[]'),
('MC-2026-098', 'Sophie Desgranges', 'sophie@desgranges-archi.fr', '06 33 44 55 66', 'Desgranges Architecture & Patrimoine', 'private-office', '17 m² (3-4 postes)', 3, NULL, '', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'tour_scheduled', 'urgent', 'Bonjour, nous souhaitons visiter le bureau de 17m² jeudi matin vers 10h. Merci !', '2026-10-28T07:38:46.213Z', '2026-10-28T11:46:48.229Z', '[{"id":"note-1793173203823","author":"Paul (Directeur)","text":"Visite confirmée pour jeudi 10h avec Paul (accueil café offert)","createdAt":"2026-10-28T07:40:03.823Z"}]'),
('MC-2026-097', 'Rafi', 'rafi.euroit@gmail.com', '01521112363', 'Grand Trend Agency', 'open-space', NULL, 1, 'fixe', '', 'full-day', NULL, '', 1, 'Book a Visit (Header)', 'qualified', 'high', '', '2026-10-28T06:33:53.448Z', '2026-10-28T09:33:37.363Z', '[]'),
('MC-2026-096', 'Julien Mercier', 'j.mercier@gironde-tech.fr', '06 77 12 34 56', 'Gironde Tech Studio', 'open-space', NULL, 2, 'fixe', '2026-11-08', 'morning', NULL, '', 1, 'Book a Visit (Header)', 'closed', 'high', 'Demande de visite pour tester l''ambiance calme et le wifi avant engagement résident.', '2026-10-28T06:05:43.892Z', '2026-10-28T11:39:19.999Z', '[{"id":"note-1793180002753","author":"Paul (Directeur)","text":"📞 Phone call completed: high interest","createdAt":"2026-10-28T09:33:22.753Z"}]'),
('MC-2026-095', 'Claire Delaunay', 'claire.delaunay@bordeaux-notaires.fr', '06 99 44 22 11', 'Étude Notariale Delaunay & Co', 'private-office', '25 m² (5-6 postes)', 5, NULL, '2026-11-04', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'tour_scheduled', 'urgent', 'Bonjour, nous souhaitons réserver une visite privée pour le bureau de 25m². Équipe de 5 personnes avec besoin de 2 places de parking.', '2026-10-28T06:05:31.913Z', '2026-10-28T06:06:44.541Z', '[]'),
('MC-2026-089', 'Edouard de Montalembert', 'e.montalembert@cabinet-avocats33.fr', '06 42 18 90 22', 'Montalembert & Associés (Avocats d''affaires)', 'private-office', '25 m² (5-6 postes)', 5, NULL, '2026-11-05', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'tour_scheduled', 'urgent', 'Recherche un bureau de prestige et standing pour notre équipe de 5 associés. Besoin impératif de 2 places de parking dans la cour privée.', '2026-10-28T02:03:14.761Z', '2026-10-28T04:03:14.761Z', '[{"id":"note-1","author":"Paul (Directeur)","text":"Visite privée confirmée pour jeudi 5 nov à 14h30 avec dégustation café.","createdAt":"2026-10-28T04:03:14.761Z"}]'),
('MC-2026-088', 'Camille Vasseur', 'c.vasseur@aquitaine-capital.com', '07 88 55 12 34', 'Aquitaine Venture Capital', 'private-office', '17 m² (3-4 postes)', 3, NULL, '2026-11-03', '', NULL, '', 1, 'Book a Visit (Header)', 'new', 'high', 'Installation prévue début décembre. Nous souhaitons découvrir le bureau de 17m² et tester l''insonorisation.', '2026-10-20T19:03:14.761Z', '2026-10-20T19:03:14.761Z', '[]'),
('MC-2026-087', 'Alexandre Bonnet', 'alexandre@studio-archibordeaux.fr', '06 19 82 43 00', 'Studio Bonnet Architectes', 'open-space', NULL, 2, 'fixe', '2026-10-27', '', NULL, '', 1, 'Book a Visit (Header)', 'visited', 'normal', 'Deux postes fixes souhaités dans le premier open space de 5 postes. Avons visité lundi matin.', '2026-10-20T14:30:00.000Z', '2026-10-21T09:00:00.000Z', '[{"id":"note-2","author":"Paul","text":"Visite très positive. Contrat de bail en cours de préparation.","createdAt":"2026-10-21T09:00:00.000Z"}]'),
('MC-2026-086', 'Hélène Mercier', 'hmercier@bordeaux-consulting.fr', '06 50 11 29 84', 'Bordeaux Strategy Consulting', 'meeting-room', NULL, 1, NULL, '2026-10-24', 'full-day', 12, 'Comité de direction trimestriel', 0, 'Meeting Room Booking', 'won', 'normal', 'Journée complète avec formule café barista et accueil 12 personnes avec projection 4K.', '2026-10-19T10:15:00.000Z', '2026-10-20T11:00:00.000Z', '[{"id":"note-3","author":"Équipe","text":"Paiement 200€ HT validé. Clés et code d''accès envoyés.","createdAt":"2026-10-20T11:00:00.000Z"}]'),
('MC-2026-085', 'Thomas Laroche', 'thomas.laroche@fintech-gironde.io', '07 62 90 01 15', 'PayGironde SAS', 'private-office', '17 m² (3-4 postes)', 4, NULL, '2026-10-23', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'qualified', 'high', 'Intéressé par le forfait 750€ HT avec domiciliation d''entreprise.', '2026-10-18T16:20:00.000Z', '2026-10-19T08:30:00.000Z', '[{"id":"note-4","author":"Paul","text":"En attente de signature Kbis.","createdAt":"2026-10-19T08:30:00.000Z"}]'),
('MC-2026-084', 'Duverger Mathilde', 'm.duverger@bordeaux-notariat.fr', '06 95 66 54 71', 'Étude Notariale Duverger', 'private-office', '25 m² (5-6 postes)', 5, NULL, '2026-10-21', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'contacted', 'high', 'Demande d''information pour le bureau de 25m². Échange téléphonique positif ce matin.', '2026-10-17T09:15:00.000Z', '2026-10-18T10:30:00.000Z', '[{"id":"note-5","author":"Paul (Directeur)","text":"Premier contact établi. Documentation tarifaire envoyée.","createdAt":"2026-10-18T10:30:00.000Z"}]'),
('MC-2026-083', 'Inès Akkouche', 'ines.akkouche@design-aquitaine.com', '06 59 87 91 68', 'Studio Inès Design', 'open-space', 'Poste Fixe (250€ HT)', 2, 'fixe', '2026-10-23', '', NULL, '', 1, 'Book a Visit (Header)', 'tour_scheduled', 'high', 'Visite du premier open space de 5 postes prévue ce vendredi à 14h.', '2026-10-16T14:20:00.000Z', '2026-10-17T08:00:00.000Z', '[]'),
('MC-2026-082', 'Goizet Paul', 'paul@goizetgestion.fr', '05 56 00 22 10', 'Goizet Gestion SARL', 'private-office', 'Bureau Résident Aile Est', 4, NULL, '2026-10-22', '', NULL, '', 0, 'Owner / Resident Enquiry', 'closed', 'normal', 'Gestion courante convention partenaire.', '2026-10-15T11:00:00.000Z', '2026-10-15T11:00:00.000Z', '[]'),
('MC-2026-081', 'Marc de La Tour', 'm.delatour@vignobles-conseil.fr', '06 21 44 88 90', 'Château & Vignobles Conseil', 'private-office', '17 m² (3-4 postes)', 3, NULL, '2026-10-15', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'visited', 'high', 'Recherche un bureau privatif au calme pour conseil en acquisitions viticoles.', '2026-10-13T10:15:00.000Z', '2026-10-14T14:00:00.000Z', '[{"id":"note-081","author":"Paul (Directeur)","text":"Visite réalisée avec succès. Offre commerciale 750€ HT envoyée.","createdAt":"2026-10-14T14:00:00.000Z"}]'),
('MC-2026-080', 'Sandrine Vasseur', 's.vasseur@bma-audit.fr', '06 78 90 12 34', 'BMA Audit & Commissariat', 'private-office', '25 m² (5-6 postes)', 5, NULL, '2026-10-14', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'negotiating', 'urgent', 'Audit de comptes annuels. Besoin de 5 postes et accès salle de réunion.', '2026-10-11T15:30:00.000Z', '2026-10-12T09:00:00.000Z', '[{"id":"note-080","author":"Paul (Directeur)","text":"Contrat bail dérogatoire en relecture par leur expert-comptable.","createdAt":"2026-10-12T09:00:00.000Z"}]'),
('MC-2026-079', 'Lucas Fontaine', 'lucas@alpha-design.studio', '07 45 12 39 88', 'Studio Alpha UX', 'open-space', NULL, 2, 'fixe', '2026-10-12', '', NULL, '', 1, 'Book a Visit (Header)', 'visited', 'normal', 'Recherche 2 postes résidents permanents avec fibre très haut débit.', '2026-10-09T09:00:00.000Z', '2026-10-10T18:00:00.000Z', '[{"id":"note-079","author":"Paul (Directeur)","text":"Essai d''une journée effectué. Très satisfait de l''ambiance.","createdAt":"2026-10-10T18:00:00.000Z"}]'),
('MC-2026-078', 'Élise Beaumont', 'elise.beaumont@capdigital-aquitaine.org', '06 33 21 77 40', 'Cap Digital Aquitaine', 'meeting-room', NULL, 1, NULL, '2026-10-06', '', NULL, '', 0, 'Meeting Room Booking', 'tour_scheduled', 'normal', 'Réservation salle de réunion 30m² pour assemblée générale régionale.', '2026-10-05T11:20:00.000Z', '2026-10-28T12:00:01.394Z', '[{"id":"note-078","author":"Paul","text":"Prestation facturée et réglée.","createdAt":"2026-10-06T17:00:00.000Z"}]'),
('MC-2026-077', 'Antoine Roche', 'a.roche@roche-partners.eu', '06 89 54 12 00', 'Roche & Partners M&A', 'private-office', '25 m² (5-6 postes)', 4, NULL, '2026-10-05', '', NULL, '', 1, 'Book a Private Tour (Hero)', 'contacted', 'high', 'Recherche bureau de standing secteur Fondaudège / Jardin Public.', '2026-10-03T16:45:00.000Z', '2026-10-04T10:00:00.000Z', '[{"id":"note-077","author":"Paul (Directeur)","text":"Dossier de présentation transmis par email.","createdAt":"2026-10-04T10:00:00.000Z"}]')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status), priority=VALUES(priority), updated_at=VALUES(updated_at);

-- SEED 2: SPACES & OFFICES INVENTORY (OFFICES, OPEN SPACE, MEETING ROOM, PARKING)
INSERT INTO `mc_spaces` (id, name, category, area, capacity, price, period, status, status_text, image, parking_included, current_tenant, features, active_bookings, updated_at) VALUES
('office-17m', 'Bureau Privatif 17 m²', 'private', '17 m²', '3 à 4 postes de travail', '750 € HT', 'par mois', 'available', 'Disponible immédiatement', '/images/spaces/bureau-privatif-17m.png', 1, NULL, '["Ameublement personnalisé haut de gamme","Accès sécurisé 24h/24 et 7j/7 par badge","Domiciliation d\'entreprise comprise (1ère année)","Accès illimité cuisine équipée & sanitaires","Boissons chaudes/froides & snacks inclus","Internet fibre ultra haut débit dédié"]', '[]', NOW()),
('office-25m', 'Bureau privatif 25m²', 'private', '25 m²', '5 à 6 postes de travail', '1 200 € HT', 'par mois', 'available', '1 bureau disponible', '/images/spaces/bureau-privatif-25m.png', 1, NULL, '["Ameublement personnalisé haut de gamme","Accès sécurisé 24h/24 et 7j/7 par badge","Domiciliation d\'entreprise comprise (1ère année)","Accès illimité cuisine équipée & sanitaires","Boissons chaudes/froides & snacks inclus","Internet fibre ultra haut débit dédié"]', '[]', NOW()),
('open-fixe-a', 'Open Space — Espace A (Poste Fixe)', 'open', '35 m²', '5 postes résidents max (2 occupés / 3 libres)', '250 € HT', 'par mois par poste', 'available', '3 postes disponibles', '/images/spaces/open-space-fixe.jpg', 0, NULL, '["Bureau attitré avec caisson sécurisé","Accès 24/7 par badge RFID","Ambiance feutrée (< 42 dB)","Accès phonebox privative","Café barista & thés bio inclus"]', '[]', NOW()),
('open-fixe-b', 'Open Space — Espace B (Poste Fixe)', 'open', '35 m²', '5 postes résidents max (3 occupés / 2 libres)', '250 € HT', 'par mois par poste', 'available', '2 postes disponibles', '/images/spaces/real-open-space-fixe-4k.jpg', 0, NULL, '["Bureau attitré avec caisson sécurisé","Accès 24/7 par badge RFID","Ambiance feutrée (< 42 dB)","Accès phonebox privative","Café barista & thés bio inclus"]', '[]', NOW()),
('open-nomad', 'Open Space — Poste Flexible Nomade', 'open', 'Accès nomade', 'Sur réservation préalable', '20 € / 10 € HT', 'journée (20€) / demi-journée (10€)', 'available', 'Accessible en ligne', '/images/spaces/real-open-space-nomade-4k.jpg', 0, NULL, '["Fibre optique sécurisée","Accès phonebox acoustique","Accès libre cuisine équipée","Boissons chaudes & gourmandises incluses"]', '[]', NOW()),
('meeting-30m', 'Grande Salle de Réunion 30 m²', 'meeting', '30 m²', 'Jusqu\'à 14 participants', '120 € / 200 € HT', 'demi-journée (120€) / journée entière (200€)', 'occupied', 'Réservée (1 réservation confirmée)', '/images/spaces/real-meeting-room-30m-4k.jpg', 1, '{"name":"Hélène Mercier","company":"Bordeaux Strategy Consulting","email":"hmercier@bordeaux-consulting.fr","phone":"06 50 11 29 84","leaseStart":"2026-10-24","leadId":"MC-2026-086"}', '["Écran 4K 75 pouces avec ClickShare & HDMI","Système de visioconférence Polycom HD","Machine barista espresso & sélection de thés","Table en chêne massif avec prises intégrées"]', '[{"leadId":"MC-2026-086","name":"Hélène Mercier","company":"Bordeaux Strategy Consulting","date":"2026-10-24","slot":"Journée entière"}]', NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status), price=VALUES(price), updated_at=VALUES(updated_at);

-- SEED 3: TENANTS & RESIDENTS DIRECTORY
INSERT INTO `mc_tenants` (id, lead_id, name, company, role, email, phone, space_assigned, workstations, parking_bays, badge_ids, lease_start, monthly_rent, status, is_from_won_lead, updated_at) VALUES
('TEN-001', NULL, 'Goizet Gestion SARL (Edgar Goizet)', 'Goizet Gestion SARL', 'Partenaire Résident & Gestion Immobilière', 'edgar@goizetgestion.fr', '05 56 00 22 10', 'Bureau Privatif Résident (Aile Est)', 4, 'Places #1 & #2', '["BADGE-048-A","BADGE-048-B"]', '2024-01-15', 'Convention Partenaire', 'active', 0, NOW()),
('TEN-086', 'MC-2026-086', 'Bordeaux Strategy Consulting (Hélène Mercier)', 'Bordeaux Strategy Consulting', 'Client Salle de Réunion', 'hmercier@bordeaux-consulting.fr', '06 50 11 29 84', 'Grande Salle de Réunion 30 m² (Réservée le 2026-10-24)', 12, 'Parking Visiteurs Réservé', '["BADGE-048-010"]', '2026-10-24', '200 € HT (Journée)', 'active', 1, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name), company=VALUES(company), space_assigned=VALUES(space_assigned), status=VALUES(status), updated_at=VALUES(updated_at);

SET FOREIGN_KEY_CHECKS = 1;
