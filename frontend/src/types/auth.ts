export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    name: string
    email: string
  }
}

export interface AuthError {
  message: string
  errors?: Record<string, string[]>
} 