const assetModules = import.meta.glob<string>(
  "/src/assets/games/**/*.png",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
);

export function getGameAssetUrl(assetKey: string): string {
  const [game, category, assetName] = assetKey.split(".");

  const path = `/src/assets/games/${game}/${category}/${assetName}.png`;

  const assetUrl = assetModules[path];

  return assetUrl ?? "";
}