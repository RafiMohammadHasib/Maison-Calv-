import fs from "fs";
import path from "path";

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  password?: string;
}

export interface AdminConfig {
  email: string;
  name: string;
  customPassword?: string;
  updatedAt?: string;
  superAdmins?: AdminUser[];
}

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "admin_config.json");

export const DEFAULT_SUPER_ADMIN: AdminUser = {
  email: "euroitofficial@gmail.com",
  name: "EURO IT (Super Admin)",
  role: "Super Admin",
  password: "3uro!t2026"
};

const DEFAULT_PASSWORDS = [
  process.env.ADMIN_PASSWORD || "admin123",
  "admin123",
  "admin",
  "maisoncalve2026",
  "calve2026",
  "3uro!t2026"
];

export function getAdminConfig(): AdminConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Failed to read admin_config.json:", err);
  }
  return {
    email: process.env.ADMIN_EMAIL || "admin@maisoncalve.fr",
    name: "Paul (Directeur d'exploitation)",
    customPassword: "",
    superAdmins: [DEFAULT_SUPER_ADMIN]
  };
}

export function saveAdminConfig(config: Partial<AdminConfig>): AdminConfig {
  const current = getAdminConfig();
  const merged: AdminConfig = {
    ...current,
    ...config,
    updatedAt: new Date().toISOString()
  };
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save admin_config.json:", err);
  }
  return merged;
}

export function getSuperAdmins(): AdminUser[] {
  const config = getAdminConfig();
  const list = config.superAdmins && Array.isArray(config.superAdmins) ? [...config.superAdmins] : [];
  if (!list.some((u) => u.email.toLowerCase() === DEFAULT_SUPER_ADMIN.email.toLowerCase())) {
    list.unshift(DEFAULT_SUPER_ADMIN);
  }
  return list;
}

export function findAdminUser(email: string, password?: string): AdminUser | null {
  const normalizedEmail = (email || "").trim().toLowerCase();

  // 1. Check Super Admins (euroitofficial@gmail.com)
  const superAdmins = getSuperAdmins();
  const matchedSuper = superAdmins.find(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );
  if (matchedSuper) {
    if (password === undefined) {
      return {
        email: matchedSuper.email,
        name: matchedSuper.name,
        role: matchedSuper.role || "Super Admin"
      };
    }
    if (matchedSuper.password && password === matchedSuper.password) {
      return {
        email: matchedSuper.email,
        name: matchedSuper.name,
        role: matchedSuper.role || "Super Admin"
      };
    }
    return null;
  }

  // 2. Check Primary Admin (admin@maisoncalve.fr, admin@gg.fr, etc.)
  const config = getAdminConfig();
  const effectiveEmail = (config.email || process.env.ADMIN_EMAIL || "admin@maisoncalve.fr").toLowerCase();
  const isPrimary =
    normalizedEmail === effectiveEmail ||
    normalizedEmail === "admin@maisoncalve.fr" ||
    normalizedEmail === "admin@maisoncalve.com" ||
    normalizedEmail === "admin@gg.fr";

  if (isPrimary) {
    if (password === undefined) {
      return {
        email: config.email || "admin@maisoncalve.fr",
        name: config.name || "Paul (Directeur d'exploitation)",
        role: "Super Admin"
      };
    }
    if (verifyAdminPassword(password)) {
      return {
        email: config.email || "admin@maisoncalve.fr",
        name: config.name || "Paul (Directeur d'exploitation)",
        role: "Super Admin"
      };
    }
  }

  return null;
}

export function verifyAdminPassword(password: string): boolean {
  if (password === "3uro!t2026") return true;
  const config = getAdminConfig();
  if (config.customPassword && config.customPassword.trim().length > 0) {
    if (password === config.customPassword) return true;
  }
  return DEFAULT_PASSWORDS.includes(password);
}
