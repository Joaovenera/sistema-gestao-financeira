'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface OverviewData {
  name: string
  total: number
}

interface OverviewProps {
  data: OverviewData[]
}

export function Overview({ data }: OverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 