import { describe, it, expect, beforeEach, vi } from 'vitest'
import { rateLimit } from '../lib/rate-limit'

describe('rateLimit Utility', () => {
  beforeEach(() => {
    // Reset the internal Map in rate-limit.ts if possible, 
    // but since it's a module-level variable and not exported, 
    // we use different IPs to simulate fresh starts.
    vi.useFakeTimers()
  })

  it('should allow requests within the limit', async () => {
    const ip = '1.1.1.1'
    for (let i = 0; i < 10; i++) {
      const result = await rateLimit(ip)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(10 - (i + 1))
    }
  })

  it('should block requests exceeding the limit', async () => {
    const ip = '2.2.2.2'
    for (let i = 0; i < 10; i++) {
      await rateLimit(ip)
    }
    const result = await rateLimit(ip)
    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should reset the limit after the window size', async () => {
    const ip = '3.3.3.3'
    // Consume limit
    for (let i = 0; i < 10; i++) {
      await rateLimit(ip)
    }

    // Fast forward 61 seconds (WINDOW_SIZE is 60s)
    vi.advanceTimersByTime(61000)

    const result = await rateLimit(ip)
    expect(result.success).toBe(true)
    expect(result.remaining).toBe(9)
  })
})
