export interface AdvisorProfile {
  fullName: string;
  agency: string;
  phone: string;
  email: string;
  state: string;
  licenseNumber: string;
  npn: string;
  title: string;
}

const DEFAULTS: AdvisorProfile = {
  fullName: "Advisor",
  agency: "Financial Advisory Group",
  phone: "",
  email: "",
  state: "",
  licenseNumber: "",
  npn: "",
  title: "Senior Advisor",
};

export function getAdvisorProfile(): AdvisorProfile {
  try {
    const raw = localStorage.getItem("finbox_profile");
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        fullName: parsed.fullName || DEFAULTS.fullName,
        agency: parsed.agency || DEFAULTS.agency,
        phone: parsed.phone || DEFAULTS.phone,
        email: parsed.email || DEFAULTS.email,
        state: parsed.state || DEFAULTS.state,
        licenseNumber: parsed.licenseNumber || DEFAULTS.licenseNumber,
        npn: parsed.npn || DEFAULTS.npn,
        title: parsed.title || DEFAULTS.title,
      };
    }
  } catch {}
  return { ...DEFAULTS };
}

export function getAdvisorFirstName(): string {
  const { fullName } = getAdvisorProfile();
  return fullName.split(" ")[0] || "Advisor";
}

export function getAdvisorInitials(): string {
  const { fullName } = getAdvisorProfile();
  const parts = fullName.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] || "A").toUpperCase();
}

/**
 * Get a stable per-advisor storage key derived from email (or fallback to name).
 * Used to namespace XP, personal bests, theme preferences per advisor.
 */
export function getAdvisorKey(): string {
  try {
    const raw = localStorage.getItem("finbox_profile");
    if (raw) {
      const p = JSON.parse(raw);
      const src = (p.email || p.fullName || "").toLowerCase().replace(/[^a-z0-9]+/g, "_");
      return src.slice(0, 40) || "default";
    }
  } catch {}
  return "default";
}

export function saveAdvisorProfile(profile: Partial<AdvisorProfile>): void {
  const current = getAdvisorProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem("finbox_profile", JSON.stringify(updated));
}

/**
 * Get advisor's AnythingLLM workspace slug
 * Format: advisor-firstname-lastname
 */
export function getAdvisorWorkspaceSlug(): string {
  const { fullName } = getAdvisorProfile();
  return `advisor-${fullName.toLowerCase().replace(/\s+/g, "-")}`;
}

/**
 * Get advisor's AnythingLLM workspace name
 * Format: Advisor-FirstName LastName
 */
export function getAdvisorWorkspaceName(): string {
  const { fullName } = getAdvisorProfile();
  return `Advisor-${fullName}`;
}

/**
 * Check if current advisor is the admin (first advisor)
 */
export function isAdmin(): boolean {
  try {
    const adminEmail = localStorage.getItem("finbox_admin");
    if (!adminEmail) return false;

    const profile = getAdvisorProfile();
    return profile.email === adminEmail;
  } catch {
    return false;
  }
}

/**
 * Set the first advisor as admin
 * Should only be called during initial onboarding
 */
export function setFirstAdvisorAsAdmin(email: string): void {
  const existing = localStorage.getItem("finbox_admin");
  if (!existing) {
    localStorage.setItem("finbox_admin", email);
  }
}
