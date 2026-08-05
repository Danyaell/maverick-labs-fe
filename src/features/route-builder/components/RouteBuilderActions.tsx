import styles from './RouteBuilderActions.module.css'

interface RouteBuilderActionsProps {
  onReset: () => void
}

export function RouteBuilderActions({ onReset }: RouteBuilderActionsProps) {
  return (
    <div className={styles.actionsContainer}>
      <button className="button--primary" type="button" onClick={onReset}>
        Reset to default order
      </button>
    </div>
  )
}
