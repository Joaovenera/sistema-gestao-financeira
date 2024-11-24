'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Eye, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { api } from "@/lib/api"
import { toast } from "react-hot-toast"

interface ExportRecord {
  id: string
  format: string
  created_at: string
  file_name: string
  status: 'completed' | 'failed'
  download_url?: string
}

export function ExportHistory() {
  const [isLoading, setIsLoading] = useState(false)
  const [exports, setExports] = useState<ExportRecord[]>([])

  async function handleDownload(record: ExportRecord) {
    try {
      setIsLoading(true)
      const response = await api.get(record.download_url!, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', record.file_name)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast.error('Erro ao baixar arquivo')
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePreview(record: ExportRecord) {
    try {
      setIsLoading(true)
      const response = await api.get(`/reports/preview/${record.id}`)
      // Implementar lógica de preview baseada no formato
      console.log(response.data)
    } catch (error) {
      toast.error('Erro ao carregar preview')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Exportações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exports.map((record) => (
            <div
              key={record.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{record.file_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(record.created_at), "dd/MM/yyyy HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {record.status === 'completed' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(record)}
                      disabled={isLoading}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(record)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
                {record.status === 'failed' && (
                  <span className="text-sm text-destructive">Falhou</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 