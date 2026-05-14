import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthModal from '../../components/profile/AuthModal'

const mockLogin = vi.fn()
const mockRegister = vi.fn()

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    register: mockRegister,
    user: null,
    loading: false,
  }),
}))

function renderModal(props = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <AuthModal onClose={vi.fn()} {...props} />
    </QueryClientProvider>
  )
}

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login tab by default', () => {
    renderModal()
    expect(screen.getByRole('tab', { name: /iniciar sesión/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('switches to register tab and shows name field', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('tab', { name: /crear cuenta/i }))
    expect(screen.getByLabelText(/^nombre/i)).toBeInTheDocument()
  })

  it('does not call login when fields are empty', async () => {
    const user = userEvent.setup()
    renderModal()
    await user.click(screen.getByRole('button', { name: /entrar/i }))
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('calls login with correct credentials', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce({ id: 1, name: 'Test' })
    renderModal()

    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows error alert when login fails', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce({
      response: { data: { detail: 'Correo o contraseña incorrectos' } },
    })
    renderModal()

    await user.type(screen.getByLabelText(/correo electrónico/i), 'bad@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrong')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('has labelled form fields for accessibility', () => {
    renderModal()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    // password input is identifiable by placeholder since its label text is shared with show/hide button
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('has accessible show/hide password toggle', () => {
    renderModal()
    const toggle = screen.getByRole('button', { name: /mostrar contraseña/i })
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
  })
})
