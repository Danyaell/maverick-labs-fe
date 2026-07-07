export function reorderStages<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  const nextItems = [...items]

  if (
    !Number.isInteger(fromIndex) ||
    !Number.isInteger(toIndex) ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length
  ) {
    return nextItems
  }

  if (fromIndex === toIndex) {
    return nextItems
  }

  const [movedItem] = nextItems.splice(fromIndex, 1)
  nextItems.splice(toIndex, 0, movedItem)

  return nextItems
}
