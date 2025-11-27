export type User = {
  language: string
  email: string | null
  userName: string | null
  provider: string
}

export type AuthContextType = {
  currentUser: User | null
  loading: boolean
  // Login con Google richiede emailInput
  loginWithGoogle: (emailInput: string) => Promise<null>
  logout: () => Promise<null>
}