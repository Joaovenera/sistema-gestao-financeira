'use client'

import { formatCurrency } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Transaction } from '@/types/transaction'

interface TransactionListProps {
  transactions: Transaction[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TransactionList({
  transactions,
  currentPage,
  totalPages,
  onPageChange
}: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            {transaction.type === 'income' || transaction.type === 'INCOME' ? (
              <ArrowUpCircle className="h-8 w-8 text-green-500" />
            ) : (
              <ArrowDownCircle className="h-8 w-8 text-red-500" />
            )}
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.category_name}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p
              className={
                transaction.type === 'income' || transaction.type === 'INCOME'
                  ? 'text-green-500 font-medium'
                  : 'text-red-500 font-medium'
              }
            >
              {transaction.type === 'income' || transaction.type === 'INCOME' ? '+' : '-'}{' '}
              {formatCurrency(Number(transaction.amount))}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}

      {transactions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma transação encontrada
        </div>
      )}
    </div>
  )
} 