'use client'

import { useCards } from '@/hooks/useCards'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { CreateCardDialog } from '@/components/cards/CreateCardDialog'
import { CardList } from '@/components/cards/CardList'

export default function CardsPage() {
  const { cards, isLoading } = useCards()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cartões</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cartão
        </Button>
      </div>

      <CardList cards={cards || []} />

      <CreateCardDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  )
} 