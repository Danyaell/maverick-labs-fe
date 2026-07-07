import { describe, expect, test } from 'vitest'
import { reorderStages } from './reorderStages'

describe('reorderStages', () => {
  test('should move item from lower index to higher index', () => {
    const result = reorderStages(['A', 'B', 'C', 'D'], 0, 2)

    expect(result).toEqual(['B', 'C', 'A', 'D'])
  })

  test('should move item from higher index to lower index', () => {
    const result = reorderStages(['A', 'B', 'C', 'D'], 3, 1)

    expect(result).toEqual(['A', 'D', 'B', 'C'])
  })

  test('should return same array order when fromIndex equals toIndex', () => {
    const result = reorderStages(['A', 'B', 'C'], 1, 1)

    expect(result).toEqual(['A', 'B', 'C'])
  })

  test('should not mutate original array', () => {
    const items = ['A', 'B', 'C', 'D']

    const result = reorderStages(items, 0, 2)

    expect(items).toEqual(['A', 'B', 'C', 'D'])
    expect(result).not.toBe(items)
  })

  test('should handle invalid indexes safely', () => {
    const items = ['A', 'B', 'C']

    expect(reorderStages(items, -1, 2)).toEqual(items)
    expect(reorderStages(items, 0, 5)).toEqual(items)
    expect(reorderStages(items, 8, 1)).toEqual(items)
  })
})
