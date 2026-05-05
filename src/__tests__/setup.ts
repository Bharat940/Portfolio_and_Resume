import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock IntersectionObserver if needed (common in Framer Motion apps)
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver
})
