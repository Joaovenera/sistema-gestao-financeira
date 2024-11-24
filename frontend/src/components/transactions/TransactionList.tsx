'use client'

import { Transaction } from "@/types"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TransactionListProps {
  transactions: Transaction[]
  limit?: number
}

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const displayTransactions = limit 
    ? transactions.slice(0, limit)
    : transactions

  return (
    <div className="space-y-4">
      {displayTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              transaction.type === 'INCOME' 
                ? 'bg-green-100 text-green-600 dark:bg-green-900' 
                : 'bg-red-100 text-red-600 dark:bg-red-900'
            }`}>
              {transaction.type === 'INCOME' ? (
                <ArrowUpIcon className="h-4 w-4" />
              ) : (
                <ArrowDownIcon className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="font-medium">{transaction.description}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{transaction.category?.name}</span>
                <span>•</span>
                <span>{format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}</span>
              </div>
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
          </div>
        </div>
      ))}
    </div>
  )
} 