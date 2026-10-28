import { NextResponse } from "next/server";
import { getLeads, addLead, updateLead, addLeadNote, deleteLead, getCRMStats } from "@/lib/leads";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const source = searchParams.get("source");

    let leads = getLeads();

    if (search) {
      leads = leads.filter(
        (l) =>
          l.name.toLowerCase().includes(search) ||
          l.email.toLowerCase().includes(search) ||
          l.phone.toLowerCase().includes(search) ||
          (l.company && l.company.toLowerCase().includes(search)) ||
          (l.message && l.message.toLowerCase().includes(search)) ||
          l.id.toLowerCase().includes(search)
      );
    }

    if (status && status !== "all") {
      leads = leads.filter((l) => l.status === status);
    }

    if (type && type !== "all") {
      leads = leads.filter((l) => l.type === type);
    }

    if (source && source !== "all") {
      leads = leads.filter((l) => l.source.toLowerCase().includes(source.toLowerCase()));
    }

    const stats = getCRMStats();

    return NextResponse.json({
      success: true,
      leads,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching leads:", err);
    return NextResponse.json({ success: false, message: "Erreur récupération leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json(
        { success: false, message: "Le nom, email et téléphone sont obligatoires." },
        { status: 400 }
      );
    }

    const lead = addLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company || "",
      type: body.type || "private-office",
      officeSize: body.officeSize || "17 m²",
      workstationCount: Number(body.workstationCount) || 3,
      date: body.date || new Date().toISOString().split("T")[0],
      timeSlot: body.timeSlot || "morning",
      visitRequested: body.visitRequested ?? true,
      source: body.source || "Admin Direct / Manual",
      status: body.status || "new",
      priority: body.priority || "high",
      message: body.message || "",
      notes: body.initialNote
        ? [
            {
              id: `note-${Date.now()}`,
              author: "Administrateur",
              text: body.initialNote,
              createdAt: new Date().toISOString()
            }
          ]
        : []
    });

    return NextResponse.json({
      success: true,
      message: "Lead créé avec succès.",
      lead,
      stats: getCRMStats()
    });
  } catch (err) {
    console.error("Error adding lead:", err);
    return NextResponse.json({ success: false, message: "Erreur création lead" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, priority, newNote } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    let updatedLead = null;

    if (newNote && newNote.text) {
      updatedLead = addLeadNote(id, newNote.author || "Administrateur", newNote.text);
    }

    if (status || priority) {
      const updates: any = {};
      if (status) updates.status = status;
      if (priority) updates.priority = priority;
      updatedLead = updateLead(id, updates);
    }

    if (!updatedLead) {
      return NextResponse.json({ success: false, message: "Lead introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead mis à jour avec succès.",
      lead: updatedLead,
      stats: getCRMStats()
    });
  } catch (err) {
    console.error("Error updating lead:", err);
    return NextResponse.json({ success: false, message: "Erreur mise à jour" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID manquant" }, { status: 400 });
    }

    const success = deleteLead(id);
    if (!success) {
      return NextResponse.json({ success: false, message: "Lead introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead supprimé",
      stats: getCRMStats()
    });
  } catch (err) {
    console.error("Error deleting lead:", err);
    return NextResponse.json({ success: false, message: "Erreur suppression" }, { status: 500 });
  }
}
