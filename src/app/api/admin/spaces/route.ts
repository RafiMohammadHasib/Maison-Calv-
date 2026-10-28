import { NextResponse } from "next/server";
import { getUnifiedSpaces, getInventoryMetrics } from "@/lib/inventorySync";
import { getLeads } from "@/lib/leads";

export async function GET() {
  try {
    const leads = getLeads();
    const spaces = getUnifiedSpaces(leads);
    const metrics = getInventoryMetrics(leads);

    return NextResponse.json({
      success: true,
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
