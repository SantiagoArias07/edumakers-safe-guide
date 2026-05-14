import { createContext, useContext, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/auth'
import { queryKeys } from '../api/keys'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()

  const { data: user, isLoading: loading } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: authApi.me,
    enabled: !!localStorage.getItem('safeguide_token'),
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      localStorage.setItem('safeguide_token', data.access_token)
      queryClient.setQueryData(queryKeys.auth.me(), data.user)
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      localStorage.setItem('safeguide_token', data.access_token)
      queryClient.setQueryData(queryKeys.auth.me(), data.user)
    },
  })

  const updateMutation = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(queryKeys.auth.me(), updatedUser)
    },
  })

  const login = useCallback(
    (email, password) => loginMutation.mutateAsync({ email, password }),
    [loginMutation]
  )

  const register = useCallback(
    (email, password, name, city) => registerMutation.mutateAsync({ email, password, name, city }),
    [registerMutation]
  )

  const logout = useCallback(() => {
    localStorage.removeItem('safeguide_token')
    queryClient.setQueryData(queryKeys.auth.me(), null)
    queryClient.clear()
  }, [queryClient])

  const updateUser = useCallback(
    (data) => updateMutation.mutateAsync(data),
    [updateMutation]
  )

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
