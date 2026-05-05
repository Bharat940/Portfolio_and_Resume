import { expect, test, describe } from 'vitest'
import { projects } from '../data/portfolio'

describe('Portfolio Data Integrity', () => {
  test('all projects should have unique IDs', () => {
    const ids = projects.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })

  test('all projects should have at least one tag', () => {
    projects.forEach(project => {
      expect(project.tags.length).toBeGreaterThan(0)
    })
  })

  test('all projects should have a valid type (web or native)', () => {
    const validTypes = ['web', 'native']
    projects.forEach(project => {
      expect(validTypes).toContain(project.type)
    })
  })

  test('all projects should have a non-empty title and description', () => {
    projects.forEach(project => {
      expect(project.title.length).toBeGreaterThan(0)
      expect(project.description.length).toBeGreaterThan(0)
    })
  })
})
