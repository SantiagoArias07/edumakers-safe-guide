import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ProtectedRoute } from '../../components/router/ProtectedRoute'

const mockUseAuth = vi.fn()

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}))

function renderWithRouter(auth, initialPath = '/protected') {
  const qc = new QueryClient()
  mockUseAuth.mockReturnValue(auth)

  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Contenido protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/perfil" element={<div>Página de perfil</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    renderWithRouter({ user: { id: 1, name: 'Ana' }, loading: false })
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('redirects to /perfil when user is not authenticated', () => {
    renderWithRouter({ user: null, loading: false })
    expect(screen.getByText('Página de perfil')).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('renders nothing while auth is loading', () => {
    renderWithRouter({ user: null, loading: true })
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
    expect(screen.queryByText('Página de perfil')).not.toBeInTheDocument()
  })
})
