// Tipos básicos compartilhados
export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Transaction {
  id: number
  user_id: number
  category_id: number
  type: 'INCOME' | 'EXPENSE'
  amount: number
  description?: string
  date: string
  category?: Category
}

export interface Category {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
  description?: string
}

export interface Report {
  summary: {
    total_income: number
    total_expense: number
    balance: number
  }
  trends: {
    month: string
    income: number
    expense: number
  }[]
} 