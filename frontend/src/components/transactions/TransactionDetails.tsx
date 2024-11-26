'use client'

import { Transaction } from '@/types/transaction'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ArrowDownCircle, ArrowUpCircle, Calendar, Tag, Clock } from 'lucide-react'

interface TransactionDetailsProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionDetails({ 
  transaction, 
  open, 
  onOpenChange 
}: TransactionDetailsProps) {
  if (!transaction) return null

  const isIncome = transaction.type === 'INCOME' || transaction.type === 'income'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isIncome ? (
              <ArrowUpCircle className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDownCircle className="h-5 w-5 text-red-500" />
            )}
            Detalhes da Transação
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas sobre a transação selecionada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">{transaction.description}</h3>
            <p className={`text-2xl font-bold ${
              isIncome ? 'text-green-500' : 'text-red-500'
            }`}>
              {isIncome ? '+' : '-'} {formatCurrency(Number(transaction.amount))}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Tag className="h-4 w-4" />
              <span>Categoria:</span>
              <span className="font-medium text-foreground">
                {transaction.category_name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Data:</span>
              <span className="font-medium text-foreground">
                {format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Criado em:</span>
              <span className="font-medium text-foreground">
                {format(new Date(transaction.created_at), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 