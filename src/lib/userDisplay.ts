import type { Profile } from "@/contexts/AuthContext";

export const ALLOWED_EMAIL_DOMAIN = "estudante.sesisenai.org.br";
export const INVALID_DOMAIN_MESSAGE = `Use seu e-mail institucional @${ALLOWED_EMAIL_DOMAIN}`;

export function isInstitutionalEmail(email: string): boolean {
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

export function getDisplayName(profile: Profile | null, fallbackEmail?: string | null): string {
  if (profile?.name && profile.name.trim()) return profile.name.trim();
  if (fallbackEmail) return fallbackEmail.split("@")[0];
  return "Estudante";
}

export function getFirstName(profile: Profile | null, fallbackEmail?: string | null): string {
  return getDisplayName(profile, fallbackEmail).split(" ")[0];
}

export function getInitials(profile: Profile | null, fallbackEmail?: string | null): string {
  const name = getDisplayName(profile, fallbackEmail);
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
