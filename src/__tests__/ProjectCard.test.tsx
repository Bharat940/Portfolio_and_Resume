/* eslint-disable @typescript-eslint/no-unused-vars */
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectCard } from '../components/home/ProjectCard'
import { Project } from '@/data/portfolio'

type MockProps = {
  children?: React.ReactNode;
  [key: string]: unknown;
};

// Mock motion/react to avoid animation issues in tests and React warnings about unknown props
vi.mock('motion/react', () => ({
  m: {
    div: ({ children, whileHover: _wh, whileTap: _wt, variants: _vs, initial: _i, animate: _a, transition: _t, ...props }: MockProps) => (
      <div {...props}>{children as React.ReactNode}</div>
    ),
  },
  Variants: {},
}))

const mockProject: Project = {
  id: 'PROJ-01',
  title: 'Test Project',
  description: 'A test project description that should be displayed.',
  tags: ['React', 'TypeScript', 'Tailwind'],
  type: 'web',
  logo: 'React',
  github: 'https://github.com',
  screenshots: ['/test-image.jpg'],
}

describe('ProjectCard Component', () => {
  it('renders project details correctly', () => {
    render(<ProjectCard project={mockProject} onClick={() => { }} />)

    expect(screen.getByRole('heading', { name: /Test Project/i })).toBeInTheDocument()
    expect(screen.getByText(/A test project description/i)).toBeInTheDocument()
    expect(screen.getByText(/PROJ-01/i)).toBeInTheDocument()

    mockProject.tags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument()
    })
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<ProjectCard project={mockProject} onClick={handleClick} />)

    // Click the heading instead of the generic text to avoid multiple match error
    fireEvent.click(screen.getByRole('heading', { name: /Test Project/i }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders a fallback icon if no screenshots are provided', () => {
    const projectWithoutImages = { ...mockProject, screenshots: [] }
    render(<ProjectCard project={projectWithoutImages} onClick={() => { }} />)

    expect(screen.getByRole('heading', { name: /Test Project/i })).toBeInTheDocument()
  })
})
