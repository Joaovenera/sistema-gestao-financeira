'use client'

import { useState } from 'react'
import { useGoals } from '@/hooks/useGoals'
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

interface CreateGoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
  const { createGoal } = useGoals()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      
      await createGoal.mutateAsync({
        name: formData.get('name') as string,
        target: Number(formData.get('target')),
        type: formData.get('type') as 'SAVING' | 'SPENDING' | 'INVESTMENT',
        deadline: formData.get('deadline') as string
      })

      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao criar meta')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Meta</DialogTitle>
          <DialogDescription>
            Crie uma nova meta financeira para acompanhar seu progresso.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Meta</Label>
            <Input
              id="name"
              name="name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select name="type" defaultValue="SAVING">
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SAVING">Economia</SelectItem>
                <SelectItem value="SPENDING">Gasto</SelectItem>
                <SelectItem value="INVESTMENT">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target">Valor Alvo</Label>
            <Input
              id="target"
              name="target"
              type="number"
              step="0.01"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Data Limite</Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar Meta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 