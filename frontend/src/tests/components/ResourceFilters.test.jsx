import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResourceFilters from '../../components/map/ResourceFilters'

describe('ResourceFilters', () => {
  it('renders all filter buttons', () => {
    render(<ResourceFilters active={null} onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /todos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refugio/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /legal/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /psicológico/i })).toBeInTheDocument()
  })

  it('highlights the active filter', () => {
    render(<ResourceFilters active="refugio" onChange={vi.fn()} />)
    const btn = screen.getByRole('button', { name: /refugio/i })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks all others as not pressed when one is active', () => {
    render(<ResourceFilters active="legal" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /todos/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /refugio/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with null when Todos is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ResourceFilters active="refugio" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /todos/i }))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('calls onChange with filter type when a filter is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ResourceFilters active={null} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /refugio/i }))
    expect(onChange).toHaveBeenCalledWith('refugio')
  })

  it('deselects by calling onChange with null when active filter is clicked again', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<ResourceFilters active="legal" onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: /legal/i }))
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
