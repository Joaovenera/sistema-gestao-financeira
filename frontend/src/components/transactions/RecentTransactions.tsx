'use client'

import { Transaction } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react'

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              transaction.type === 'INCOME' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'INCOME' ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.category?.name}
              </p>
            </div>
          </div>
          <div className={`text-right ${
            transaction.type === 'INCOME' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            <p className="font-medium">
              {transaction.type === 'INCOME' ? '+' : '-'} 
              {formatCurrency(transaction.amount)}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 