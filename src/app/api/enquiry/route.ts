import { NextResponse } from "next/server";
import { z } from "zod";

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

    // Log the lead details in a production-ready structured format
    console.log("=========================================");
    console.log("🔔 [MAISON CALVÉ] NOUVELLE DEMANDE DE LEAD");
    console.log(`Type: ${data.type}`);
    console.log(`Contact: ${data.name} (${data.email} | ${data.phone})`);
    console.log(`Entreprise: ${data.company || "Non renseignée"}`);
    if (data.type === "private-office") {
      console.log(`Bureau: ${data.officeSize || "Indifférent"}`);
      console.log(`Postes estimés: ${data.workstationCount || "N/A"}`);
      console.log(`Visite souhaitée: ${data.visitRequested ? "OUI" : "NON"}`);
    } else if (data.type === "open-space") {
      console.log(`Formule: ${data.openSpacePlan}`);
      console.log(`Nombre de postes: ${data.workstationCount}`);
      console.log(`Date: ${data.date || "Dès que possible"}`);
      console.log(`Créneau: ${data.timeSlot || "N/A"}`);
    } else if (data.type === "meeting-room") {
      console.log(`Date: ${data.date}`);
      console.log(`Format: ${data.timeSlot}`);
      console.log(`Participants: ${data.attendees}`);
      console.log(`Objet: ${data.meetingPurpose}`);
    }
    console.log(`Message: ${data.message || "(Aucun message supplémentaire)"}`);
    console.log("=========================================");

    // In a production setup with RESEND_API_KEY, an email can be triggered here
    // e.g. if (process.env.RESEND_API_KEY) { await resend.emails.send(...) }

    return NextResponse.json({
      success: true,
      message: "Demande enregistrée avec succès. L'équipe Maison Calvé prendra contact très prochainement.",
      leadId: `MC-${Date.now().toString(36).toUpperCase()}`,
      receivedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erreur traitement demande Maison Calvé:", error);
    return NextResponse.json(
      { success: false, message: "Une erreur interne est survenue." },
      { status: 500 }
    );
  }
}
