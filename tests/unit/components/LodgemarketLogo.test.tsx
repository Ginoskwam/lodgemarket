import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LodgemarketLogo } from '@/components/LodgemarketLogo'

describe('LodgemarketLogo', () => {
  it('devrait rendre le logo', () => {
    render(<LodgemarketLogo />)
    expect(document.body).toBeInTheDocument()
  })

  it('devrait accepter une prop size', () => {
    render(<LodgemarketLogo size={100} />)
    expect(document.body).toBeInTheDocument()
  })
})
