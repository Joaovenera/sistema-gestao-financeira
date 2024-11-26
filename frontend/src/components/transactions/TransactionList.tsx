'use client'

import { formatCurrency } from '@/lib/utils'
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { Transaction } from '@/types/transaction'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { TransactionDetails } from './TransactionDetails'
import { Button } from '@/components/ui/button'
import { EditTransactionDialog } from './EditTransactionDialog'
import { useTransactions } from '@/hooks/useTransactions'

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
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null)
  const { refetch } = useTransactions()
  const memoizedTransactions = useMemo(() => transactions, [transactions])

  // Calcula os totais
  const totals = useMemo(() => {
    return memoizedTransactions.reduce((acc, transaction) => {
      const amount = Number(transaction.amount)
      if (transaction.type === 'INCOME' || transaction.type === 'income') {
        acc.income += amount
      } else {
        acc.expense += amount
      }
      acc.balance = acc.income - acc.expense
      return acc
    }, { income: 0, expense: 0, balance: 0 })
  }, [memoizedTransactions])

  return (
    <div className="space-y-6">
      {/* Resumo dos valores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Receitas</p>
          <p className="text-2xl font-bold text-green-500">
            {formatCurrency(totals.income)}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Despesas</p>
          <p className="text-2xl font-bold text-red-500">
            {formatCurrency(totals.expense)}
          </p>
        </div>
        <div className="p-4 rounded-lg border bg-card">
          <p className="text-sm text-muted-foreground">Saldo</p>
          <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(totals.balance)}
          </p>
        </div>
      </div>

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

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <TransactionDetails
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
        onEdit={(transaction) => {
          setSelectedTransaction(null)
          setTransactionToEdit(transaction)
        }}
      />

      <EditTransactionDialog
        transaction={transactionToEdit}
        open={!!transactionToEdit}
        onOpenChange={(open) => !open && setTransactionToEdit(null)}
        onSuccess={() => {
          setTransactionToEdit(null)
          refetch()
        }}
      />
    </div>
  )
} 