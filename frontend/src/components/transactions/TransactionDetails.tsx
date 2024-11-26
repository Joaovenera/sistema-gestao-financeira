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
import { Button } from '@/components/ui/button'
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calendar, 
  Tag, 
  Clock,
  Pencil,
  Trash2
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { toast } from 'react-hot-toast'

interface TransactionDetailsProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (transaction: Transaction) => void
}

export function TransactionDetails({ 
  transaction, 
  open, 
  onOpenChange,
  onEdit
}: TransactionDetailsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { deleteTransaction, refetch } = useTransactions()
  const [isDeleting, setIsDeleting] = useState(false)

  if (!transaction) return null

  const isIncome = transaction.type === 'INCOME' || transaction.type === 'income'

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteTransaction.mutateAsync(transaction.id)
      toast.success('Transação excluída com sucesso!')
      onOpenChange(false)
      refetch()
    } catch (error) {
      toast.error('Erro ao excluir transação')
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
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

            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit?.(transaction)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Transação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 