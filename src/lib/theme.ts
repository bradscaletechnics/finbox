import { getAdvisorKey } from "./advisor";

export interface Theme {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  /** Gradient swatch colours for the UI preview card */
  swatchA: string;
  swatchB: string;
  /** Primary hue swatch dot colour */
  primaryColor: string;
}

export const THEMES: Theme[] = [
  {
    id: "midnight",
    name: "Midnight Teal",
    description: "Default dark theme with teal accent",
    requiredLevel: 1,
    swatchA: "#0c1117",
    swatchB: "#0e2420",
    primaryColor: "#22c97a",
  },
  {
    id: "arctic",
    name: "Arctic Blue",
    description: "Cool blue tones with an icy accent",
    requiredLevel: 2,
    swatchA: "#0b111e",
    swatchB: "#0d1f3c",
    primaryColor: "#4da6ff",
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "Deep dark theme with a violet accent",
    requiredLevel: 3,
    swatchA: "#100c1c",
    swatchB: "#1a1030",
    primaryColor: "#a67cff",
  },
  {
    id: "ember",
    name: "Ember",
    description: "Warm dark theme with an orange accent",
    requiredLevel: 4,
    swatchA: "#130e08",
    swatchB: "#2a1400",
    primaryColor: "#f07030",
  },
  {
    id: "gold",
    name: "Gold Rush",
    description: "Premium golden accent for top performers",
    requiredLevel: 5,
    swatchA: "#12100a",
    swatchB: "#2a1f00",
    primaryColor: "#f5b820",
  },
  {
    id: "platinum",
    name: "Platinum",
    description: "Light theme reserved for the elite",
    requiredLevel: 6,
    swatchA: "#e8edf5",
    swatchB: "#d0daea",
    primaryColor: "#2a8f6f",
  },
];

function storageKey(): string {
  return `finbox_theme_${getAdvisorKey()}`;
}

export function getActiveThemeId(): string {
  try {
    return localStorage.getItem(storageKey()) || "midnight";
  } catch {
    return "midnight";
  }
}

export function saveThemeId(id: string): void {
  try {
    localStorage.setItem(storageKey(), id);
  } catch {}
}

export function applyTheme(id: string): void {
  document.documentElement.setAttribute("data-theme", id || "midnight");
}

export function loadAndApplyTheme(): void {
  applyTheme(getActiveThemeId());
}
