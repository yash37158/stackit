import { create, StateCreator } from "zustand"
import { persist, PersistOptions } from "zustand/middleware"
import { authService } from "@/lib/services/auth.service"

export interface User {
  id: string
  username: string
  email: string
  role: "user" | "admin"
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

type AuthStorePersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>

export const useAuthStore = create<AuthState>()(
  (persist as AuthStorePersist)(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.login({ email, password })
          localStorage.setItem('token', response.token)
          set({ 
            user: {
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              role: response.user.role as "user" | "admin"
            },
            isLoading: false 
          })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed', isLoading: false })
          throw error
        }
      },
      register: async (username: string, email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const response = await authService.register({ username, email, password })
          localStorage.setItem('token', response.token)
          set({ 
            user: {
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              role: response.user.role as "user" | "admin"
            },
            isLoading: false 
          })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Registration failed', isLoading: false })
          throw error
        }
      },
      logout: () => {
        authService.logout()
        set({ user: null })
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
    },
  ),
)
