import { NextResponse } from "next/server";
import { getUnifiedTenants, getInventoryMetrics } from "@/lib/inventorySync";
import { getLeads } from "@/lib/leads";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("q") || "").toLowerCase().trim();
    const status = searchParams.get("status");

    const leads = getLeads();
    let tenants = getUnifiedTenants(leads);

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
