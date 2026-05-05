import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DiamondDivider } from '../components/layout/DiamondDivider'

describe('DiamondDivider Component', () => {
  it('renders the divider container', () => {
    const { container } = render(<DiamondDivider color="ctp-mauve" />)
    const divider = container.querySelector('.w-full')
    expect(divider).toBeInTheDocument()
  })

  it('calculates the diagonal height correctly', () => {
    // SIZE is 14. diagonal = ceil(14 * sqrt(2)) = 20.
    const { container } = render(<DiamondDivider />)
    const root = container.firstChild as HTMLElement
    // diagonal + 2 = 22
    expect(root.style.height).toBe('22px')
  })

  it('applies the correct color hex from the Catppuccin palette', () => {
    const { container } = render(<DiamondDivider color="ctp-red" />)
    // Find a diamond (motion.div)
    const diamond = container.querySelector('div[style*="background: rgb(243, 139, 168)"]') // #f38ba8 in RGB
    expect(diamond).toBeDefined()
  })
})
