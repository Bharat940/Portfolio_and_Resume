import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../app/api/contact/route'

// Mock Nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn().mockReturnValue({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' })
    })
  }
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockResolvedValue({
    success: true,
    limit: 10,
    remaining: 9,
    reset: Date.now() + 60000
  })
}))

describe('Contact API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.GMAIL_USER = 'test@gmail.com'
    process.env.GMAIL_APP_PASSWORD = 'password'
  })

  it('returns 200 for valid contact data', async () => {
    const mockReq = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.'
      })
    })

    const response = await POST(mockReq)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Transmission successfully received')
  })

  it('returns 400 for invalid email', async () => {
    const mockReq = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message that is long enough.'
      })
    })

    const response = await POST(mockReq)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid email address')
  })

  it('returns 400 for short message', async () => {
    const mockReq = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Short'
      })
    })

    const response = await POST(mockReq)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Message must be at least 10 characters')
  })

  it('returns 429 when rate limit is exceeded', async () => {
    const { rateLimit } = await import('@/lib/rate-limit')
    vi.mocked(rateLimit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000
    })

    const mockReq = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message that is long enough.'
      })
    })

    const response = await POST(mockReq)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toBe('Too many transmissions. Please wait before trying again.')
  })
})
