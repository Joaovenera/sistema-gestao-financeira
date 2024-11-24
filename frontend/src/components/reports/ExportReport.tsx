'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Download, Eye, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const EXPORT_FORMATS = [
  { id: 'pdf', label: 'PDF', icon: '📄' },
  { id: 'csv', label: 'CSV', icon: '📊' },
  { id: 'xlsx', label: 'Excel', icon: '📑' },
  { id: 'json', label: 'JSON', icon: '{ }' },
]

export function ExportReport() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [format, setFormat] = useState<string>('pdf')
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [previewData, setPreviewData] = useState<any>(null)

  async function handleExport() {
    try {
      setIsLoading(true)
      const response = await api.get('/reports/export', {
        params: {
          format,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString()
        },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `relatorio-${format}.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      toast.success('Relatório exportado com sucesso!')
      setIsOpen(false)
    } catch (error) {
      toast.error('Erro ao exportar relatório')
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePreview() {
    try {
      setIsLoading(true)
      const response = await api.get('/reports/preview', {
        params: {
          format,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString()
        }
      })
      setPreviewData(response.data)
    } catch (error) {
      toast.error('Erro ao gerar preview')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Exportar Relatório</DialogTitle>
          <DialogDescription>
            Selecione o período e o formato do relatório
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Exportar</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Período</Label>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
              />
            </div>
            <div className="space-y-2">
              <Label>Formato</Label>
              <Select
                value={format}
                onValueChange={setFormat}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPORT_FORMATS.map(format => (
                    <SelectItem key={format.id} value={format.id}>
                      <span className="mr-2">{format.icon}</span>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="py-4">
            <div className="h-[300px] overflow-auto border rounded-lg p-4">
              {previewData ? (
                <pre className="text-sm">
                  {JSON.stringify(previewData, null, 2)}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Clique em "Gerar Preview" para visualizar os dados
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="outline"
            onClick={handlePreview}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
            Gerar Preview
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportando...
              </>
            ) : (
              'Exportar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 