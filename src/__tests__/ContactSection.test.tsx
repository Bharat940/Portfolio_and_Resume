/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ContactSection } from '../components/home/ContactSection'

// Mock motion/react
vi.mock('motion/react', () => ({
  m: {
    div: ({ children, whileHover: _wh, whileTap: _wt, whileInView: _wv, viewport: _v, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: { children?: React.ReactNode, [key: string]: unknown }) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
  },
  Variants: {},
}))

// Mock fetch
global.fetch = vi.fn()

describe('ContactSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the contact form', () => {
    render(<ContactSection />)
    expect(screen.getByLabelText(/Identity/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Signal \(Email\)/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message Payload/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Send Transmission/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<ContactSection />)
    const form = screen.getByRole('form', { name: /Contact Form/i })
    
    // In jsdom, fireEvent.click(submitBtn) might be blocked by 'required' attributes
    // fireEvent.submit bypasses that or we can just trigger it on the form.
    // However, the component relies on e.currentTarget to get FormData.
    fireEvent.submit(form)
    
    // Wait for the async validation logic to update state
    await waitFor(() => {
      expect(screen.getByText(/Identity is too short/i)).toBeInTheDocument()
      expect(screen.getByText(/Invalid frequency/i)).toBeInTheDocument()
      expect(screen.getByText(/Payload too small/i)).toBeInTheDocument()
    })
  })

  it('successfully submits the form', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    } as Response)

    render(<ContactSection />)
    
    fireEvent.change(screen.getByLabelText(/Identity/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Signal \(Email\)/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/Message Payload/i), { target: { value: 'This is a long enough message.' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Send Transmission/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Transmission Received/i)).toBeInTheDocument()
    })
  })

  it('handles submission errors', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Rate limit exceeded' }),
    } as Response)

    render(<ContactSection />)
    
    fireEvent.change(screen.getByLabelText(/Identity/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/Signal \(Email\)/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/Message Payload/i), { target: { value: 'This is a long enough message.' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Send Transmission/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/Rate limit exceeded/i)).toBeInTheDocument()
    })
  })
})
