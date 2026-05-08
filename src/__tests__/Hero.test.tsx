/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Hero } from '../components/home/Hero'

type MockProps = {
  children?: React.ReactNode;
  [key: string]: unknown;
};

// Mock motion/react
vi.mock('motion/react', () => ({
  m: {
    div: ({ children, whileHover: _wh, whileTap: _wt, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: MockProps) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
    h1: ({ children, whileHover: _wh, whileTap: _wt, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: MockProps) => (
      <h1 {...props}>{children as React.ReactNode}</h1>
    ),
    p: ({ children, whileHover: _wh, whileTap: _wt, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: MockProps) => (
      <p {...props}>{children as React.ReactNode}</p>
    ),
    span: ({ children, whileHover: _wh, whileTap: _wt, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: MockProps) => (
      <span {...props}>{children as React.ReactNode}</span>
    ),
    a: ({ children, whileHover: _wh, whileTap: _wt, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: MockProps) => (
      <a {...props}>{children as React.ReactNode}</a>
    ),
  },
  AnimatePresence: ({ children }: MockProps) => <>{children}</>,
  useMotionValue: vi.fn(() => ({ set: vi.fn(), get: vi.fn() })),
  useSpring: vi.fn((v) => v),
  Variants: {},
}))

describe('Hero Component', () => {
  it('renders the main name heading', () => {
    render(<Hero />)
    const name = screen.getByText(/Bharat/i)
    const surname = screen.getByText(/Dangi/i)
    expect(name).toBeInTheDocument()
    expect(surname).toBeInTheDocument()
  })

  it('renders the tagline words', () => {
    render(<Hero />)
    // The tagline contains "Full Stack Developer"
    expect(screen.getByText(/Full/i)).toBeInTheDocument()
    expect(screen.getByText(/Stack/i)).toBeInTheDocument()
    expect(screen.getByText(/Developer/i)).toBeInTheDocument()
  })

  it('displays the core tech stack badges', () => {
    render(<Hero />)
    const techItems = ['Next.js', 'tRPC', 'PostgreSQL', 'C++', 'Docker']
    techItems.forEach(tech => {
      expect(screen.getByText(tech)).toBeInTheDocument()
    })
  })

  it('renders the call to action buttons', () => {
    render(<Hero />)
    expect(screen.getByText(/Explore Archive/i)).toBeInTheDocument()
    expect(screen.getByText(/Initialize Connection/i)).toBeInTheDocument()
  })

  it('triggers scroll when CTA buttons are clicked', () => {
    // Mock scrollIntoView
    const mockScrollIntoView = vi.fn()
    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView

    // Mock document.querySelector to return an element with scrollIntoView
    const mockElement = document.createElement('div')
    mockElement.scrollIntoView = mockScrollIntoView
    vi.spyOn(document, 'querySelector').mockReturnValue(mockElement)

    render(<Hero />)

    const exploreBtn = screen.getByText(/Explore Archive/i)
    fireEvent.click(exploreBtn)

    expect(mockScrollIntoView).toHaveBeenCalled()

    vi.restoreAllMocks()
  })
})
