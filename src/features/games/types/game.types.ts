export interface GameSummary {
  code: string;
  title: string;
  releaseOrder: number;
}

export interface GameDetail {
  code: string;
  title: string;
  releaseOrder: number;
  stages: Stage[];
}

export interface Stage {
  slug: string;
  name: string;
  stageOrder: number;
  imageAssetKey: string;
  boss: Boss;
  weaponReward: Weapon | null;
  collectibles: Collectible[];
}

export interface Boss {
  slug: string;
  name: string;
  imageAssetKey?: string | null;
}

export interface Weapon {
  slug: string;
  name: string;
  description?: string | null;
  imageAssetKey?: string | null;
}

export interface Collectible {
  slug: string;
  name: string;
  type: CollectibleType;
  description?: string | null;
  imageAssetKey?: string | null;
  sortOrder: number;
}

export type CollectibleType =
  | "HEART_TANK"
  | "SUB_TANK"
  | "ARMOR_UPGRADE"
  | "WEAPON_UPGRADE"
  | "RIDE_ARMOR"
  | "PART"
  | "LIFE_UP"
  | "OTHER";
