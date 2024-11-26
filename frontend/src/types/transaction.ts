export interface Transaction {
  id: number
  user_id: number
  description: string
  amount: string | number
  type: 'INCOME' | 'EXPENSE' | 'income' | 'expense'
  category_id: number
  category_name: string
  date: string
  created_at: string
  updated_at: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
  total: number
} 