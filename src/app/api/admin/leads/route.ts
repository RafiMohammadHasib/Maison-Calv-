import { NextResponse } from "next/server";
import { getLeads, addLead, updateLead, addLeadNote, deleteLead, getCRMStats, Lead } from "@/lib/leads";
import {
  isOvhBridgeConfigured,
  fetchOvhLeads,
  addOvhLead,
  updateOvhLead,
  deleteOvhLead
} from "@/lib/ovhBridge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const source = searchParams.get("source") || "all";

    // 1. Try fetching from OVH MySQL Database Bridge
    if (isOvhBridgeConfigured()) {
      try {
        const ovhResult = await fetchOvhLeads({
          q: search,
          status,
          type,
          source
        });

        if (ovhResult.success && Array.isArray(ovhResult.leads)) {
          return NextResponse.json({
            success: true,
            source: "ovh_mysql",
            leads: ovhResult.leads,
            stats: ovhResult.stats || getCRMStats(),
            timestamp: new Date().toISOString()
          });
        }
      } catch (ovhErr) {
        console.warn("OVH Bridge temporarily unreachable, falling back to local storage:", ovhErr);
      }
    }

    // 2. Fallback to local storage (crm_leads.json)
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
      source: "local_storage",
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

    // 1. Save to local storage
    const localLead = addLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company || "",
      type: body.type || "private-office",
      officeSize: body.officeSize || "21 m²",
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

    // 2. Synchronize with OVH MySQL Database
    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await addOvhLead({
          ...localLead,
          initialNote: body.initialNote
        });
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not sync new lead to OVH MySQL:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead créé avec succès.",
      lead: localLead,
      syncedWithOvh: ovhSuccess,
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

    // 1. Update local storage
    let updatedLead: Lead | null = null;

    if (newNote && newNote.text) {
      updatedLead = addLeadNote(id, newNote.author || "Administrateur", newNote.text);
    }

    if (status || priority) {
      const updates: any = {};
      if (status) updates.status = status;
      if (priority) updates.priority = priority;
      updatedLead = updateLead(id, updates);
    }

    // 2. Update OVH MySQL Database
    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await updateOvhLead(id, {
          status,
          priority,
          newNote
        });
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not sync lead update to OVH MySQL:", e);
      }
    }

    if (!updatedLead) {
      return NextResponse.json({ success: false, message: "Lead introuvable." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead mis à jour avec succès.",
      lead: updatedLead,
      syncedWithOvh: ovhSuccess,
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

    // 1. Delete locally
    const success = deleteLead(id);

    // 2. Delete on OVH MySQL
    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await deleteOvhLead(id);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not delete lead on OVH MySQL:", e);
      }
    }

    if (!success) {
      return NextResponse.json({ success: false, message: "Lead introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Lead supprimé",
      syncedWithOvh: ovhSuccess,
      stats: getCRMStats()
    });
  } catch (err) {
    console.error("Error deleting lead:", err);
    return NextResponse.json({ success: false, message: "Erreur suppression" }, { status: 500 });
  }
}
