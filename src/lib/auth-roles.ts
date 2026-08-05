export type UserRole = "admin" | "customer";

const configuredAdminEmails = String(import.meta.env.VITE_ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const adminEmails = new Set(configuredAdminEmails);

export function getRoleForEmail(email: string): UserRole {
  return adminEmails.has(email.trim().toLowerCase()) ? "admin" : "customer";
}

export function hasAdminAccess(role: UserRole | null | undefined) {
  return role === "admin";
}

export function hasConfiguredAdminEmails() {
  return adminEmails.size > 0;
}
