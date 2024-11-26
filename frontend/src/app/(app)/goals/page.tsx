'use client'

import { useGoals } from '@/hooks/useGoals'
import { Button } from '@/components/ui/button'
import { Plus, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog'
import { GoalList } from '@/components/goals/GoalList'

export default function GoalsPage() {
  const { goals, isLoading } = useGoals()
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
        <h1 className="text-3xl font-bold">Metas Financeiras</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      <GoalList goals={goals || []} />

      <CreateGoalDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  )
} 