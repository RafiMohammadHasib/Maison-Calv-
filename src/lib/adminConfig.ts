import fs from "fs";
import path from "path";

export interface AdminConfig {
  email: string;
  name: string;
  customPassword?: string;
  updatedAt?: string;
}

const CONFIG_PATH = path.join(process.cwd(), "src", "data", "admin_config.json");

const DEFAULT_PASSWORDS = [
  process.env.ADMIN_PASSWORD || "admin123",
  "admin123",
  "admin",
  "maisoncalve2026",
  "calve2026"
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
    customPassword: ""
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

export function verifyAdminPassword(password: string): boolean {
  const config = getAdminConfig();
  if (config.customPassword && config.customPassword.trim().length > 0) {
    return password === config.customPassword;
  }
  return DEFAULT_PASSWORDS.includes(password);
}

