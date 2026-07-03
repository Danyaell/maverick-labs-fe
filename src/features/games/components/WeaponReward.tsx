import styles from './WeaponReward.module.css'
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
    <section className={styles.weaponRewardContainer}>
      <h3>Weapon Reward</h3>
      <img className={styles.weaponImage} src={weaponImageUrl || undefined} alt={weaponReward.name} />
      <p>{weaponReward.name}</p>
    </section>
  )
}
