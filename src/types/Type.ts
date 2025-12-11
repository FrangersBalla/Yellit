export type User = {
  uid: string
  language: string
  email: string | null
  userName: string | null
  provider: string
  notify: boolean
}

export type AuthContextType = {
  currentUser: User | null
  loading: boolean
  // Login con Google richiede emailInput
  loginWithGoogle: (emailInput: string) => Promise<boolean>
  signUpWithGoogle: (emailInput: string, userName: string, language: string) => Promise<boolean>
  logout: () => Promise<null>
}

export interface Comment {
  id: string                // id del documento (se lo usi)
  comment: string
  userName: string
  post: string              // id del post a cui si riferisce
  createdAt: Date           // convertito da timestamp Firestore
}

export type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
  setClose: () => void
}