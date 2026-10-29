import { NextResponse } from "next/server";
import { getLeads } from "@/lib/leads";
import { testOvhConnection, bulkSyncLeadsToOvh, isOvhBridgeConfigured } from "@/lib/ovhBridge";

export async function GET() {
  try {
    if (!isOvhBridgeConfigured()) {
      return NextResponse.json({
        configured: false,
        message: "OVH_API_BRIDGE_URL is not set or invalid in environment."
      });
    }

    const health = await testOvhConnection();
    return NextResponse.json({
      configured: true,
      ...health
    });
  } catch (err: any) {
    return NextResponse.json(
      { configured: false, error: err.message || "Failed to check OVH health" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "sync_all";

    if (action === "test") {
      const health = await testOvhConnection();
      return NextResponse.json(health);
    }

    if (action === "sync_all") {
      const allLeads = getLeads();
      const res = await bulkSyncLeadsToOvh(allLeads);

      return NextResponse.json({
        success: res.success,
        syncedCount: res.synced_count ?? allLeads.length,
        totalLocal: allLeads.length,
        stats: res.stats,
        message: res.success
          ? `${allLeads.length} leads successfully synchronized to OVH MySQL!`
          : res.error || "Failed to sync leads to OVH MySQL"
      });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("OVH Sync error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error during OVH sync" },
      { status: 500 }
    );
  }
}

