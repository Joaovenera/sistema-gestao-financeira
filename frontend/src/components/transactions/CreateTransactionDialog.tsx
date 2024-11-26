'use client'

import { useState } from 'react'
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
import { ptBR } from 'date-fns/locale'

const createTransactionSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Selecione o tipo da transação'
  }),
  category_id: z.string({
    required_error: 'Selecione uma categoria'
  }),
  amount: z.string()
    .min(1, 'Informe o valor')
    .transform(value => {
      // Remove R$ e converte vírgula para ponto
      return Number(value.replace(/[R$\s.]/g, '').replace(',', '.'))
    }),
  description: z.string()
    .min(3, 'A descrição deve ter pelo menos 3 caracteres')
    .max(50, 'A descrição deve ter no máximo 50 caracteres'),
  date: z.string({
    required_error: 'Selecione a data'
  })
})

type CreateTransactionData = z.infer<typeof createTransactionSchema>

interface CreateTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateTransactionDialog({ 
  open, 
  onOpenChange,
  onSuccess 
}: CreateTransactionDialogProps) {
  const { createTransaction } = useTransactions()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateTransactionData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      date: format(new Date(), 'yyyy-MM-dd')
    }
  })

  const selectedType = watch('type')

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  const onSubmit = async (data: CreateTransactionData) => {
    try {
      setIsLoading(true)
      await createTransaction.mutateAsync({
        ...data,
        category_id: Number(data.category_id),
        amount: Number(data.amount)
      })

      toast.success('Transação criada com sucesso!')
      handleClose()
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      toast.error('Erro ao criar transação')
    } finally {
      setIsLoading(false)
    }
  }

  // Formata o valor monetário enquanto o usuário digita
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Remove tudo que não é número
    value = (Number(value) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    setValue('amount', value)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova transação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            {isLoading ? 'Criando...' : 'Criar Transação'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 