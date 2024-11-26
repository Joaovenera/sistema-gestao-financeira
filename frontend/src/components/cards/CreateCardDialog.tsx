'use client'

import { useState } from 'react'
import { useCards } from '@/hooks/useCards'
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
import { toast } from 'react-hot-toast'

interface CreateCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCardDialog({ open, onOpenChange }: CreateCardDialogProps) {
  const { createCard } = useCards()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      await createCard.mutateAsync({
        name: formData.get('name') as string,
        last_digits: formData.get('last_digits') as string,
        brand: formData.get('brand') as string,
        credit_limit: Number(formData.get('credit_limit')),
        closing_day: Number(formData.get('closing_day')),
        due_day: Number(formData.get('due_day'))
      })

      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao criar cartão')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Cartão</DialogTitle>
          <DialogDescription>
            Adicione um novo cartão de crédito à sua conta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input
              id="name"
              name="name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_digits">Últimos 4 dígitos</Label>
            <Input
              id="last_digits"
              name="last_digits"
              maxLength={4}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Bandeira</Label>
            <Input
              id="brand"
              name="brand"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credit_limit">Limite</Label>
            <Input
              id="credit_limit"
              name="credit_limit"
              type="number"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="closing_day">Dia de Fechamento</Label>
              <Input
                id="closing_day"
                name="closing_day"
                type="number"
                min="1"
                max="31"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_day">Dia de Vencimento</Label>
              <Input
                id="due_day"
                name="due_day"
                type="number"
                min="1"
                max="31"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar Cartão'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 