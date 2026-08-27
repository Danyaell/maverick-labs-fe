export type CapabilityId = "catalog" | "inspect" | "build" | "analyze";

export type CapabilityAssetKey =
  | "mmx.title.logo"
  | "mmx.boss.chill-penguin"
  | "mmx.stage.stage-select"
  | "mmx.weapon.shotgun-ice";

export interface Capability {
  readonly id: CapabilityId;
  readonly title: string;
  readonly description: string;
  readonly iconAssetKey: CapabilityAssetKey;
  readonly link: {
    readonly to: string;
    readonly label: string;
  };
}

export const CAPABILITIES = [
  {
    id: "catalog",
    title: "Explore the eight-game catalog",
    description:
      "Browse all eight main Mega Man X titles in release order. Detailed stages and route planning are currently available for Mega Man X.",
    iconAssetKey: "mmx.title.logo",
    link: {
      to: "/games",
      label: "View catalog",
    },
  },
  {
    id: "inspect",
    title: "Inspect stages, Mavericks, weapons, and collectibles",
    description:
      "Explore Mega Man X's eight Maverick stages, boss weaknesses, weapon rewards, and collectible requirements.",
    iconAssetKey: "mmx.boss.chill-penguin",
    link: {
      to: "/games/MMX",
      label: "Explore Mega Man X",
    },
  },
  {
    id: "build",
    title: "Build an eight-stage route",
    description:
      "Reorder Mega Man X's eight stages with drag and drop or dedicated arrow controls, with keyboard and touch support.",
    iconAssetKey: "mmx.stage.stage-select",
    link: {
      to: "/games/MMX/route-builder",
      label: "Open Route Builder",
    },
  },
  {
    id: "analyze",
    title: "Analyze every completed route change",
    description:
      "Review difficulty, backtracking, estimated time, warnings, breakdowns, and recommendations after every completed move.",
    iconAssetKey: "mmx.weapon.shotgun-ice",
    link: {
      to: "/#demo",
      label: "See the analysis comparison",
    },
  },
] as const satisfies readonly Capability[];
