import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from '../components/home/Hero'

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
})
