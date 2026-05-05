import { expect, test, describe } from 'vitest'
import { cn } from '../lib/utils'

describe('Tailwind Class Merger (cn utility)', () => {
  test('should merge standard tailwind classes', () => {
    expect(cn('px-2', 'py-2')).toBe('px-2 py-2')
  })

  test('should handle conditional classes correctly', () => {
    const isActive = true
    const isDisabled = false
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
  })

  test('should resolve tailwind conflicts (last one wins)', () => {
    // p-4 (1rem) vs p-8 (2rem) -> p-8 should win
    expect(cn('p-4', 'p-8')).toBe('p-8')
  })

  test('should handle complex merging with array/object syntax (clsx behavior)', () => {
    expect(cn('base', { 'is-loading': true, 'is-hidden': false }, ['array-class'])).toBe('base is-loading array-class')
  })
})
