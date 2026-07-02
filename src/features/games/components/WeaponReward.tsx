import { getGameAssetUrl } from '../../../utils/assets'
import type { Weapon } from '../types/game.types'

interface WeaponRewardProps {
  weaponReward: Weapon | null
}

export function WeaponReward({ weaponReward }: WeaponRewardProps) {
  if (!weaponReward) {
    return null
  }

  const weaponImageUrl = getGameAssetUrl(weaponReward.imageAssetKey ?? '')

  return (
    <section>
      <h3>Weapon Reward</h3>
      <img src={weaponImageUrl || undefined} alt={weaponReward.name} />
      <p>{weaponReward.name}</p>
      {weaponReward.description ? <p>{weaponReward.description}</p> : null}
    </section>
  )
}
