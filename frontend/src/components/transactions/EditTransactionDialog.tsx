'use client'

import { useState, useEffect } from 'react'
import { useTransactions } from '@/hooks/useTransactions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Transaction } from '@/types/transaction'

const editTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Selecione o tipo da transação'
  }),
  category_id: z.string({
    required_error: 'Selecione uma categoria'
  }),
  amount: z.string()
    .min(1, 'Informe o valor')
    .transform(value => {
      return Number(value.replace(/[R$\s.]/g, '').replace(',', '.'))
    }),
  description: z.string()
    .min(3, 'A descrição deve ter pelo menos 3 caracteres')
    .max(50, 'A descrição deve ter no máximo 50 caracteres'),
  date: z.string({
    required_error: 'Selecione a data'
  })
})

type EditTransactionData = z.infer<typeof editTransactionSchema>

interface EditTransactionDialogProps {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditTransactionDialog({ 
  transaction,
  open, 
  onOpenChange,
  onSuccess 
}: EditTransactionDialogProps) {
  const { updateTransaction } = useTransactions()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EditTransactionData>({
    resolver: zodResolver(editTransactionSchema),
    values: transaction ? {
      type: transaction.type as 'INCOME' | 'EXPENSE',
      category_id: String(transaction.category_id),
      amount: formatCurrency(Number(transaction.amount)),
      description: transaction.description,
      date: format(new Date(transaction.date), 'yyyy-MM-dd')
    } : undefined
  })

  useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type as 'INCOME' | 'EXPENSE',
        category_id: String(transaction.category_id),
        amount: formatCurrency(Number(transaction.amount)),
        description: transaction.description,
        date: format(new Date(transaction.date), 'yyyy-MM-dd')
      })
    }
  }, [transaction, reset])

  const selectedType = watch('type')

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit = async (data: EditTransactionData) => {
    if (!transaction) return

    try {
      setIsLoading(true)
      await updateTransaction.mutateAsync({
        id: transaction.id,
        ...data,
        category_id: Number(data.category_id),
        amount: Number(data.amount)
      })

      toast.success('Transação atualizada com sucesso!')
      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao atualizar transação:', error)
      toast.error('Erro ao atualizar transação')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = (Number(value) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    setValue('amount', value)
  }

  return (
    <Dialog open={open && !!transaction} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Transação</DialogTitle>
          <DialogDescription>
            Altere os dados da transação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INCOME">Receita</SelectItem>
                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <span className="text-sm text-red-500">{errors.type.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedType === 'INCOME' ? (
                      <>
                        <SelectItem value="1">Salário</SelectItem>
                        <SelectItem value="2">Freelancer</SelectItem>
                        <SelectItem value="3">Investimentos</SelectItem>
                        <SelectItem value="4">Outros</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="5">Alimentação</SelectItem>
                        <SelectItem value="6">Transporte</SelectItem>
                        <SelectItem value="7">Moradia</SelectItem>
                        <SelectItem value="8">Lazer</SelectItem>
                        <SelectItem value="9">Saúde</SelectItem>
                        <SelectItem value="10">Educação</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category_id && (
              <span className="text-sm text-red-500">{errors.category_id.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              {...register('amount')}
              onChange={handleAmountChange}
              placeholder="R$ 0,00"
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <span className="text-sm text-red-500">{errors.amount.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              {...register('description')}
              placeholder="Ex: Compras do mês"
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <span className="text-sm text-red-500">{errors.description.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              {...register('date')}
              type="date"
              max={format(new Date(), 'yyyy-MM-dd')}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && (
              <span className="text-sm text-red-500">{errors.date.message}</span>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
} 