/** All items that can be unlocked by reaching a level. */
export interface Unlock {
  id: string;
  type: "theme" | "badge" | "feature";
  name: string;
  description: string;
  requiredLevel: number;
}

export const ALL_UNLOCKS: Unlock[] = [
  // ── Themes ─────────────────────────────────────────────────────────
  {
    id: "theme-midnight",
    type: "theme",
    name: "Midnight Teal",
    description: "Default dark theme with teal accent",
    requiredLevel: 1,
  },
  {
    id: "theme-arctic",
    type: "theme",
    name: "Arctic Blue",
    description: "Cool blue tones with an icy accent",
    requiredLevel: 2,
  },
  {
    id: "theme-obsidian",
    type: "theme",
    name: "Obsidian",
    description: "Deep dark theme with violet accent",
    requiredLevel: 3,
  },
  {
    id: "theme-ember",
    type: "theme",
    name: "Ember",
    description: "Warm dark theme with orange accent",
    requiredLevel: 4,
  },
  {
    id: "theme-gold",
    type: "theme",
    name: "Gold Rush",
    description: "Premium golden accent for top performers",
    requiredLevel: 5,
  },
  {
    id: "theme-platinum",
    type: "theme",
    name: "Platinum",
    description: "Light theme reserved for the elite",
    requiredLevel: 6,
  },
  // ── Badges ─────────────────────────────────────────────────────────
  {
    id: "badge-associate",
    type: "badge",
    name: "Associate Badge",
    description: "Earns the Associate title next to your name",
    requiredLevel: 2,
  },
  {
    id: "badge-advisor",
    type: "badge",
    name: "Advisor Badge",
    description: "Earns the Advisor rank displayed on your dashboard",
    requiredLevel: 3,
  },
  {
    id: "badge-senior",
    type: "badge",
    name: "Senior Advisor Badge",
    description: "Gold star badge and Senior Advisor title",
    requiredLevel: 4,
  },
  {
    id: "badge-gold-closer",
    type: "badge",
    name: "Gold Closer Badge",
    description: "Exclusive gold badge displayed on your profile",
    requiredLevel: 5,
  },
  {
    id: "badge-elite",
    type: "badge",
    name: "Platinum Elite Badge",
    description: "Rarest badge — reserved for top-tier advisors only",
    requiredLevel: 6,
  },
  {
    id: "badge-diamond",
    type: "badge",
    name: "Diamond Pro Badge",
    description: "Diamond-tier recognition for elite producers",
    requiredLevel: 7,
  },
  {
    id: "badge-principal",
    type: "badge",
    name: "Principal Badge",
    description: "The pinnacle of advisor achievement",
    requiredLevel: 8,
  },
  // ── Features ───────────────────────────────────────────────────────
  {
    id: "feature-compact",
    type: "feature",
    name: "Compact Mode",
    description: "Dense information layout — more data per screen",
    requiredLevel: 4,
  },
  {
    id: "feature-ai-priority",
    type: "feature",
    name: "AI Priority Mode",
    description: "AI responses prioritised with faster turnaround",
    requiredLevel: 5,
  },
  {
    id: "feature-custom-narrative",
    type: "feature",
    name: "Custom Narrative Templates",
    description: "Save and reuse personalised suitability narratives",
    requiredLevel: 6,
  },
];

/** Returns every unlock item currently accessible at the given level */
export function getUnlockedItems(level: number): Unlock[] {
  return ALL_UNLOCKS.filter((u) => u.requiredLevel <= level);
}

/** Returns items that are newly unlocked when moving from oldLevel → newLevel */
export function getNewlyUnlocked(oldLevel: number, newLevel: number): Unlock[] {
  return ALL_UNLOCKS.filter(
    (u) => u.requiredLevel > oldLevel && u.requiredLevel <= newLevel
  );
}

export function isUnlocked(id: string, level: number): boolean {
  const item = ALL_UNLOCKS.find((u) => u.id === id);
  return item ? item.requiredLevel <= level : false;
}
