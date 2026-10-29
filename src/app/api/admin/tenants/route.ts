import { NextResponse } from "next/server";
import { getUnifiedTenants, getInventoryMetrics, TenantRecord } from "@/lib/inventorySync";
import { getLeads } from "@/lib/leads";
import {
  isOvhBridgeConfigured,
  fetchOvhTenants,
  addOvhTenant,
  updateOvhTenant,
  deleteOvhTenant
} from "@/lib/ovhBridge";

// In-memory cache for tenants overrides
let customTenantsCache: TenantRecord[] | null = null;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const status = searchParams.get("status");

    // 1. Try fetching from OVH MySQL Database
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await fetchOvhTenants({ q: search, status: status || undefined });
        if (ovhRes.success && Array.isArray(ovhRes.tenants) && ovhRes.tenants.length > 0) {
          return NextResponse.json({
            success: true,
            source: "ovh_mysql",
            tenants: ovhRes.tenants,
            metrics: ovhRes.metrics || getInventoryMetrics(getLeads()),
            timestamp: new Date().toISOString()
          });
        }
      } catch (ovhErr) {
        console.warn("OVH tenants unreachable, using local fallback:", ovhErr);
      }
    }

    // 2. Fallback to local computation
    const leads = getLeads();
    let tenants = customTenantsCache || getUnifiedTenants(leads);

    if (search) {
      tenants = tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.company.toLowerCase().includes(search) ||
          t.email.toLowerCase().includes(search) ||
          t.spaceAssigned.toLowerCase().includes(search) ||
          t.id.toLowerCase().includes(search)
      );
    }

    if (status && status !== "all") {
      tenants = tenants.filter((t) => t.status === status);
    }

    const metrics = getInventoryMetrics(leads);

    return NextResponse.json({
      success: true,
      source: "local_cache",
      tenants,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching tenants:", err);
    return NextResponse.json(
      { success: false, message: "Erreur lors du chargement des résidents" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.company || !body.email) {
      return NextResponse.json(
        { success: false, message: "Nom, entreprise et email obligatoires." },
        { status: 400 }
      );
    }

    const leads = getLeads();
    if (!customTenantsCache) customTenantsCache = getUnifiedTenants(leads);

    const newTenant: TenantRecord = {
      id: body.id || `TEN-${String(customTenantsCache.length + 1).padStart(3, "0")}`,
      leadId: body.leadId,
      name: body.name,
      company: body.company,
      role: body.role || "Résident Partenaire",
      email: body.email,
      phone: body.phone || "",
      spaceAssigned: body.spaceAssigned || "Bureau Privatif Maison Calvé",
      workstations: Number(body.workstations) || 1,
      parkingBays: body.parkingBays || "Place cour privée",
      badgeIds: body.badgeIds || [`BADGE-048-${String(Date.now()).slice(-3)}`],
      leaseStart: body.leaseStart || new Date().toISOString().split("T")[0],
      monthlyRent: body.monthlyRent || "750 € HT / mois",
      status: body.status || "active",
      isFromWonLead: Boolean(body.isFromWonLead)
    };

    customTenantsCache.unshift(newTenant);

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await addOvhTenant(newTenant);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not sync tenant to OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Résident ajouté avec succès.",
      tenant: newTenant,
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    console.error("Error adding tenant:", err);
    return NextResponse.json({ success: false, message: "Erreur ajout résident" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID manquant" }, { status: 400 });
    }

    const leads = getLeads();
    if (!customTenantsCache) customTenantsCache = getUnifiedTenants(leads);

    const index = customTenantsCache.findIndex((t) => t.id === id);
    if (index !== -1) {
      customTenantsCache[index] = {
        ...customTenantsCache[index],
        ...updates
      };
    }

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await updateOvhTenant(id, updates);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not update tenant on OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Résident mis à jour avec succès.",
      tenant: index !== -1 ? customTenantsCache[index] : null,
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    console.error("Error updating tenant:", err);
    return NextResponse.json({ success: false, message: "Erreur mise à jour résident" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID manquant" }, { status: 400 });
    }

    const leads = getLeads();
    if (!customTenantsCache) customTenantsCache = getUnifiedTenants(leads);
    customTenantsCache = customTenantsCache.filter((t) => t.id !== id);

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await deleteOvhTenant(id);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not delete tenant on OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Résident supprimé avec succès.",
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    console.error("Error deleting tenant:", err);
    return NextResponse.json({ success: false, message: "Erreur suppression résident" }, { status: 500 });
  }
}
