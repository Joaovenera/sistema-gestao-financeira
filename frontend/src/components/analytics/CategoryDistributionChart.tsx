'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface CategoryDistribution {
  name: string
  value: number
  percentage: number
}

interface CategoryDistributionChartProps {
  data: CategoryDistribution[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  // Garantir que data é um array e tem valores
  const chartData = data || []
  
  // Calcular o total
  const total = chartData.reduce((acc, item) => acc + item.value, 0)
  
  // Calcular as porcentagens
  const dataWithPercentages = chartData.map(item => ({
    ...item,
    percentage: total > 0 ? (item.value / total * 100) : 0
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Categoria</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithPercentages}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => 
                  `${name}: ${percentage.toFixed(1)}%`
                }
              >
                {dataWithPercentages.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => 
                  `${((value / total) * 100).toFixed(1)}%`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 