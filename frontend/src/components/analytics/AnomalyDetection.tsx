'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { AlertTriangle } from 'lucide-react'

interface Anomaly {
  transaction_id: number
  category_name: string
  amount: number
  date: string
  z_score: number
  average_amount: number
}

interface AnomalyDetectionProps {
  anomalies: Anomaly[]
}

export function AnomalyDetection({ anomalies }: AnomalyDetectionProps) {
  if (anomalies.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Transações Atípicas Detectadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {anomalies.map((anomaly) => (
            <div
              key={anomaly.transaction_id}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">{anomaly.category_name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(anomaly.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Valor Médio: {formatCurrency(anomaly.average_amount)}
                  </p>
                  <p className="text-sm font-medium text-destructive">
                    Valor Atual: {formatCurrency(anomaly.amount)}
                  </p>
                </div>
                <div className="text-sm text-yellow-500">
                  {(anomaly.z_score * 100).toFixed(1)}% de desvio
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 