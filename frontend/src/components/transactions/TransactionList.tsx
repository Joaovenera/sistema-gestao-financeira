'use client'

import { formatCurrency } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { Transaction } from '@/types/transaction'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { TransactionDetails } from './TransactionDetails'

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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const memoizedTransactions = useMemo(() => transactions, [transactions])

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait" initial={false}>
        {memoizedTransactions.length > 0 ? (
          <motion.div
            key="transaction-list"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {memoizedTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.03,
                  ease: "easeOut"
                }}
                layout
                onClick={() => setSelectedTransaction(transaction)}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {transaction.type === 'income' || transaction.type === 'INCOME' ? (
                      <ArrowUpCircle className="h-8 w-8 text-green-500" />
                    ) : (
                      <ArrowDownCircle className="h-8 w-8 text-red-500" />
                    )}
                  </motion.div>
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
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center py-8 text-muted-foreground"
          >
            Nenhuma transação encontrada
          </motion.div>
        )}
      </AnimatePresence>

      <TransactionDetails
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      />
    </div>
  )
} 