import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useChat } from '../../hooks/useChat'

vi.mock('../../api/chat', () => ({
  chatApi: {
    sendMessage: vi.fn(),
  },
}))

import { chatApi } from '../../api/chat'

function wrapper({ children }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with empty messages', () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    expect(result.current.messages).toHaveLength(0)
    expect(result.current.loading).toBe(false)
    expect(result.current.emergency).toBe(false)
  })

  it('adds user message immediately on sendMessage', () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    chatApi.sendMessage.mockResolvedValueOnce({ response: 'Hola', emergency: false })

    act(() => {
      result.current.sendMessage('Necesito ayuda')
    })

    expect(result.current.messages[0]).toMatchObject({
      role: 'user',
      content: 'Necesito ayuda',
    })
  })

  it('adds assistant response after API resolves', async () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    chatApi.sendMessage.mockResolvedValueOnce({ response: 'Estoy aquí para ayudarte', emergency: false })

    act(() => {
      result.current.sendMessage('Hola')
    })

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2)
    })

    expect(result.current.messages[1]).toMatchObject({
      role: 'assistant',
      content: 'Estoy aquí para ayudarte',
    })
  })

  it('sets emergency=true when response contains [EMERGENCIA]', async () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    chatApi.sendMessage.mockResolvedValueOnce({
      response: '[EMERGENCIA] Llama al 911 ahora',
      emergency: true,
    })

    act(() => {
      result.current.sendMessage('Me está golpeando')
    })

    await waitFor(() => {
      expect(result.current.emergency).toBe(true)
    })
  })

  it('adds error message when API fails', async () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    chatApi.sendMessage.mockRejectedValueOnce({
      response: { data: { detail: 'Error de conexión' } },
    })

    act(() => {
      result.current.sendMessage('Hola')
    })

    await waitFor(() => {
      const last = result.current.messages.at(-1)
      expect(last?.isError).toBe(true)
    })
  })

  it('clears messages on clearChat', async () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    chatApi.sendMessage.mockResolvedValueOnce({ response: 'Hola', emergency: false })

    act(() => { result.current.sendMessage('Hola') })
    await waitFor(() => expect(result.current.messages).toHaveLength(2))

    act(() => { result.current.clearChat() })
    expect(result.current.messages).toHaveLength(0)
    expect(result.current.emergency).toBe(false)
  })

  it('ignores empty messages', () => {
    const { result } = renderHook(() => useChat(), { wrapper })
    act(() => { result.current.sendMessage('   ') })
    expect(chatApi.sendMessage).not.toHaveBeenCalled()
    expect(result.current.messages).toHaveLength(0)
  })
})
