import { Lead, LeadNote } from "./leads";
import { SpaceInventoryRecord, TenantRecord } from "./inventorySync";

const OVH_API_BRIDGE_URL =
  process.env.OVH_API_BRIDGE_URL ||
  "https://uwenyoi.cluster131.hosting.ovh.net/maison-api/index.php";

const OVH_API_SECRET_KEY =
  process.env.OVH_API_SECRET_KEY || "mc_sec_ovh_uwenyoimaison_2026";

/**
 * Check if the OVH bridge URL is configured
 */
export function isOvhBridgeConfigured(): boolean {
  return Boolean(OVH_API_BRIDGE_URL && OVH_API_BRIDGE_URL.startsWith("http"));
}

/**
 * Test health & connectivity of the OVH MySQL Bridge
 */
export async function testOvhConnection(): Promise<{
  success: boolean;
  status?: string;
  database?: string;
  host?: string;
  total_leads?: number;
  total_spaces?: number;
  total_tenants?: number;
  message?: string;
  error?: string;
}> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "health");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        success: false,
        error: `HTTP error ${res.status}: ${res.statusText}`
      };
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to reach OVH API Bridge"
    };
  }
}

// =============================================================
// SECTION 1: OPPORTUNITY BOARD & CRM LEADS
// =============================================================

export async function fetchOvhLeads(params?: {
  q?: string;
  status?: string;
  type?: string;
  source?: string;
}): Promise<{
  success: boolean;
  leads: Lead[];
  stats?: any;
  error?: string;
}> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "leads");
    if (params?.q) url.searchParams.set("q", params.q);
    if (params?.status) url.searchParams.set("status", params.status);
    if (params?.type) url.searchParams.set("type", params.type);
    if (params?.source) url.searchParams.set("source", params.source);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      return {
        success: false,
        leads: [],
        error: `HTTP ${res.status} from OVH Bridge`
      };
    }

    const data = await res.json();
    return {
      success: true,
      leads: data.leads || [],
      stats: data.stats
    };
  } catch (err: any) {
    console.error("fetchOvhLeads error:", err);
    return {
      success: false,
      leads: [],
      error: err.message || "Error fetching from OVH"
    };
  }
}

export async function addOvhLead(
  leadData: any
): Promise<{ success: boolean; lead?: Lead; stats?: any; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "lead");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify(leadData)
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.message || `HTTP ${res.status}`
      };
    }

    return {
      success: true,
      lead: data.lead,
      stats: data.stats
    };
  } catch (err: any) {
    console.error("addOvhLead error:", err);
    return {
      success: false,
      error: err.message || "Error inserting lead to OVH"
    };
  }
}

export async function updateOvhLead(
  id: string,
  updates: {
    status?: string;
    priority?: string;
    newNote?: { author?: string; text: string };
  }
): Promise<{ success: boolean; lead?: Lead; stats?: any; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "update_lead");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({
        id,
        ...updates
      })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("updateOvhLead error:", err);
    return {
      success: false,
      error: err.message || "Error updating lead in OVH"
    };
  }
}

export async function deleteOvhLead(
  id: string
): Promise<{ success: boolean; stats?: any; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "delete_lead");
    url.searchParams.set("id", id);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("deleteOvhLead error:", err);
    return {
      success: false,
      error: err.message || "Error deleting lead in OVH"
    };
  }
}

export async function bulkSyncLeadsToOvh(
  leads: Lead[]
): Promise<{ success: boolean; synced_count?: number; error?: string; stats?: any }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "bulk_sync");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({ leads })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("bulkSyncLeadsToOvh error:", err);
    return {
      success: false,
      error: err.message || "Error syncing leads to OVH"
    };
  }
}

// =============================================================
// SECTION 2: SPACES & OFFICES INVENTORY
// =============================================================

export async function fetchOvhSpaces(): Promise<{
  success: boolean;
  spaces: SpaceInventoryRecord[];
  metrics?: any;
  error?: string;
}> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "spaces");

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      return { success: false, spaces: [], error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return {
      success: true,
      spaces: data.spaces || [],
      metrics: data.metrics
    };
  } catch (err: any) {
    console.error("fetchOvhSpaces error:", err);
    return { success: false, spaces: [], error: err.message };
  }
}

export async function addOvhSpace(
  space: SpaceInventoryRecord
): Promise<{ success: boolean; space?: SpaceInventoryRecord; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "space");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify(space)
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("addOvhSpace error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateOvhSpace(
  id: string,
  updates: Partial<SpaceInventoryRecord>
): Promise<{ success: boolean; space?: SpaceInventoryRecord; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "update_space");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({ id, ...updates })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("updateOvhSpace error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteOvhSpace(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "delete_space");
    url.searchParams.set("id", id);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("deleteOvhSpace error:", err);
    return { success: false, error: err.message };
  }
}

// =============================================================
// SECTION 3: TENANTS & RESIDENTS DIRECTORY
// =============================================================

export async function fetchOvhTenants(params?: {
  q?: string;
  status?: string;
}): Promise<{
  success: boolean;
  tenants: TenantRecord[];
  metrics?: any;
  error?: string;
}> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "tenants");
    if (params?.q) url.searchParams.set("q", params.q);
    if (params?.status) url.searchParams.set("status", params.status);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      cache: "no-store"
    });

    if (!res.ok) {
      return { success: false, tenants: [], error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    return {
      success: true,
      tenants: data.tenants || [],
      metrics: data.metrics
    };
  } catch (err: any) {
    console.error("fetchOvhTenants error:", err);
    return { success: false, tenants: [], error: err.message };
  }
}

export async function addOvhTenant(
  tenant: Partial<TenantRecord>
): Promise<{ success: boolean; tenant?: TenantRecord; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "tenant");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify(tenant)
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("addOvhTenant error:", err);
    return { success: false, error: err.message };
  }
}

export async function updateOvhTenant(
  id: string,
  updates: Partial<TenantRecord>
): Promise<{ success: boolean; tenant?: TenantRecord; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "update_tenant");

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({ id, ...updates })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("updateOvhTenant error:", err);
    return { success: false, error: err.message };
  }
}

export async function deleteOvhTenant(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = new URL(OVH_API_BRIDGE_URL);
    url.searchParams.set("action", "delete_tenant");
    url.searchParams.set("id", id);

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": OVH_API_SECRET_KEY,
        Accept: "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("deleteOvhTenant error:", err);
    return { success: false, error: err.message };
  }
}
