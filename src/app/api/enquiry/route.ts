import { NextResponse } from "next/server";
import { z } from "zod";
import { addLead } from "@/lib/leads";
import { isOvhBridgeConfigured, addOvhLead } from "@/lib/ovhBridge";

const enquirySchema = z.object({
  type: z.enum(["private-office", "open-space", "meeting-room"]),
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(6, "Numéro de téléphone requis"),
  company: z.string().optional().default(""),
  message: z.string().optional().default(""),
  // Space-specific fields
  officeSize: z.string().optional(),
  workstationCount: z.number().int().min(1).max(20).optional(),
  openSpacePlan: z.enum(["fixe", "flexible"]).optional(),
  timeSlot: z.enum(["morning", "afternoon", "full-day"]).optional(),
  date: z.string().optional(),
  duration: z.string().optional(),
  attendees: z.number().int().min(1).max(20).optional(),
  meetingPurpose: z.string().optional(),
  visitRequested: z.boolean().optional().default(true),
  source: z.string().optional(),
  language: z.enum(["fr", "en", "es"]).default("fr")
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const result = enquirySchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const data = result.data;

    // Determine intuitive source label
    let sourceLabel = data.source;
    if (!sourceLabel) {
      if (data.visitRequested) {
        sourceLabel = data.type === "private-office" ? "Book a Private Tour (Hero/Site)" : "Book a Visit (Site)";
      } else {
        sourceLabel = "Website Space Enquiry";
      }
    }

    // 1. Persist directly to local CRM database file
    const savedLead = addLead({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || "",
      type: data.type,
      officeSize: data.officeSize,
      workstationCount: data.workstationCount,
      openSpacePlan: data.openSpacePlan,
      date: data.date,
      timeSlot: data.timeSlot,
      attendees: data.attendees,
      meetingPurpose: data.meetingPurpose,
      visitRequested: data.visitRequested ?? true,
      source: sourceLabel,
      status: "new",
      priority: data.type === "private-office" ? "urgent" : "high",
      message: data.message
    });

    // 2. Synchronize to OVH MySQL Database Bridge
    let ovhSynced = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await addOvhLead(savedLead);
        ovhSynced = Boolean(ovhRes.success);
        if (ovhSynced) {
          console.log(`✅ [OVH DATABASE] Lead synced to uwenyoimaison.mysql.db: ${savedLead.id}`);
        }
      } catch (ovhErr) {
        console.warn("⚠️ [OVH DATABASE] Could not sync lead to OVH bridge:", ovhErr);
      }
    }

    console.log("=========================================");
    console.log(`🔔 [MAISON CALVÉ CRM] NOUVEAU LEAD ENREGISTRÉ: ${savedLead.id}`);
    console.log(`Source: ${savedLead.source}`);
    console.log(`Contact: ${savedLead.name} (${savedLead.email} | ${savedLead.phone})`);
    console.log(`Entreprise: ${savedLead.company || "Non renseignée"}`);
    console.log(`Espace: ${savedLead.type} ${savedLead.officeSize || ""}`);
    console.log(`OVH MySQL Sync: ${ovhSynced ? "SUCCESS" : "LOCAL BACKUP ONLY"}`);
    console.log("=========================================");

    return NextResponse.json({
      success: true,
      message: "Demande enregistrée avec succès. L'équipe Maison Calvé prendra contact très prochainement.",
      lead: savedLead,
      leadId: savedLead.id,
      ovhSynced,
      receivedAt: savedLead.createdAt
    });
  } catch (error) {
    console.error("Erreur traitement demande Maison Calvé:", error);
    return NextResponse.json(
      { success: false, message: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
