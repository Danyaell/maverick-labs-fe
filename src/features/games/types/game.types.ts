export type GameSummary = {
  code: string;
  title: string;
  releaseOrder: number;
};

export type GameDetail = {
  code: string;
  title: string;
  releaseOrder: number;
  stages: Stage[];
};

export type Stage = {
  slug: string;
  name: string;
  stageOrder: number;
  imageAssetKey: string;
  boss: Boss;
  weaponReward: Weapon | null;
  collectibles: Collectible[];
};

export type Boss = {
  slug: string;
  name: string;
  imageAssetKey?: string | null;
};

export type Weapon = {
  slug: string;
  name: string;
  description?: string | null;
  imageAssetKey?: string | null;
};

export type Collectible = {
  slug: string;
  name: string;
  type: CollectibleType;
  description?: string | null;
  imageAssetKey?: string | null;
  sortOrder: number;
};

export type CollectibleType =
  | "HEART_TANK"
  | "SUB_TANK"
  | "ARMOR_UPGRADE"
  | "WEAPON_UPGRADE"
  | "RIDE_ARMOR"
  | "PART"
  | "LIFE_UP"
  | "OTHER";
