import { NextResponse } from "next/server";
import { getUnifiedSpaces, getInventoryMetrics, SpaceInventoryRecord } from "@/lib/inventorySync";
import { getLeads } from "@/lib/leads";
import {
  isOvhBridgeConfigured,
  fetchOvhSpaces,
  updateOvhSpace,
  addOvhSpace,
  deleteOvhSpace
} from "@/lib/ovhBridge";

// In-memory / file cache for space state overrides
let customSpacesCache: SpaceInventoryRecord[] | null = null;

export async function GET() {
  try {
    // 1. Try fetching from OVH MySQL Database
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await fetchOvhSpaces();
        if (ovhRes.success && Array.isArray(ovhRes.spaces) && ovhRes.spaces.length > 0) {
          return NextResponse.json({
            success: true,
            source: "ovh_mysql",
            spaces: ovhRes.spaces,
            metrics: ovhRes.metrics || getInventoryMetrics(getLeads()),
            timestamp: new Date().toISOString()
          });
        }
      } catch (ovhErr) {
        console.warn("OVH spaces unreachable, using local fallback:", ovhErr);
      }
    }

    // 2. Fallback to local computation
    const leads = getLeads();
    const spaces = customSpacesCache || getUnifiedSpaces(leads);
    const metrics = getInventoryMetrics(leads);

    return NextResponse.json({
      success: true,
      source: "local_cache",
      spaces,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Error fetching spaces inventory:", err);
    return NextResponse.json(
      { success: false, message: "Erreur lors du chargement des espaces" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, statusText, price, capacity, currentTenant } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID manquant." }, { status: 400 });
    }

    // Update local cache
    const leads = getLeads();
    if (!customSpacesCache) {
      customSpacesCache = getUnifiedSpaces(leads);
    }

    const index = customSpacesCache.findIndex((s) => s.id === id);
    if (index !== -1) {
      customSpacesCache[index] = {
        ...customSpacesCache[index],
        status: status ?? customSpacesCache[index].status,
        statusText: statusText ?? customSpacesCache[index].statusText,
        price: price ?? customSpacesCache[index].price,
        capacity: capacity ?? customSpacesCache[index].capacity,
        currentTenant: currentTenant !== undefined ? currentTenant : customSpacesCache[index].currentTenant
      };
    }

    // Sync to OVH MySQL Database
    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await updateOvhSpace(id, {
          status,
          statusText,
          price,
          capacity,
          currentTenant
        });
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not sync space to OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Espace mis à jour avec succès.",
      space: index !== -1 ? customSpacesCache[index] : null,
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    console.error("Error updating space:", err);
    return NextResponse.json({ success: false, message: "Erreur mise à jour espace" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name) {
      return NextResponse.json({ success: false, message: "ID et nom requis" }, { status: 400 });
    }

    if (!customSpacesCache) customSpacesCache = getUnifiedSpaces(getLeads());
    customSpacesCache.push(body);

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await addOvhSpace(body);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not add space to OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Espace créé",
      space: body,
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Erreur création espace" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "ID requis" }, { status: 400 });
    }

    if (!customSpacesCache) customSpacesCache = getUnifiedSpaces(getLeads());
    customSpacesCache = customSpacesCache.filter((s) => s.id !== id);

    let ovhSuccess = false;
    if (isOvhBridgeConfigured()) {
      try {
        const ovhRes = await deleteOvhSpace(id);
        ovhSuccess = Boolean(ovhRes.success);
      } catch (e) {
        console.warn("Could not delete space in OVH:", e);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Espace supprimé",
      syncedWithOvh: ovhSuccess
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Erreur suppression espace" }, { status: 500 });
  }
}
