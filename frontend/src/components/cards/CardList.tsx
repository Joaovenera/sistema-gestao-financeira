'use client'

import { formatCurrency } from '@/lib/utils'
import { CreditCard } from 'lucide-react'

interface Card {
  id: number
  name: string
  last_digits: string
  brand: string
  credit_limit: number
  closing_day: number
  due_day: number
}

interface CardListProps {
  cards: Card[]
}

export function CardList({ cards }: CardListProps) {
  return (
    <div className="space-y-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="font-medium">{card.name}</p>
              <p className="text-sm text-muted-foreground">
                **** **** **** {card.last_digits}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-medium">
              {formatCurrency(card.credit_limit)}
            </p>
            <p className="text-sm text-muted-foreground">
              Vence dia {card.due_day}
            </p>
          </div>
        </div>
      ))}

      {cards.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum cartão cadastrado
        </div>
      )}
    </div>
  )
} 