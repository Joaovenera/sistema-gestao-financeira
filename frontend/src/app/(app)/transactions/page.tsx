'use client'

import { useTransactions } from '@/hooks/useTransactions'
import { TransactionList } from '@/components/transactions/TransactionList'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { 
  Plus, 
  Loader2, 
  ArrowUpDown,
  CalendarDays,
  DollarSign,
  ListFilter,
} from 'lucide-react'
import { useState, useCallback } from 'react'
import { CreateTransactionDialog } from '@/components/transactions/CreateTransactionDialog'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { SearchInput } from '@/components/transactions/SearchInput'

type SortField = 'date' | 'amount' | 'description'

export default function TransactionsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [sortField, setSortField] = useState<SortField>('date')
  const [filterType, setFilterType] = useState<'all' | 'INCOME' | 'EXPENSE'>('all')
  const [filterAmount, setFilterAmount] = useState<'all' | 'high' | 'low'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const { transactions, total, isLoading, refetch } = useTransactions({
    searchQuery,
    dateRange: dateRange ? {
      from: dateRange.from,
      to: dateRange.to
    } : undefined,
    sortOrder,
    sortField,
    filterType,
    filterAmount,
    page: currentPage,
    limit: itemsPerPage
  })

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    refetch()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const totalPages = Math.ceil(total / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">Transações</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <SearchInput 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Filtro por Tipo */}
          <Select
            defaultValue="all"
            onValueChange={(value: 'all' | 'INCOME' | 'EXPENSE') => 
              setFilterType(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="INCOME">Receitas</SelectItem>
              <SelectItem value="EXPENSE">Despesas</SelectItem>
            </SelectContent>
          </Select>

          {/* Filtro por Valor */}
          <Select
            defaultValue="all"
            onValueChange={(value: 'all' | 'high' | 'low') => 
              setFilterAmount(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <DollarSign className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os valores</SelectItem>
              <SelectItem value="high">Maiores valores</SelectItem>
              <SelectItem value="low">Menores valores</SelectItem>
            </SelectContent>
          </Select>

          {/* Campo de Ordenação */}
          <Select
            defaultValue="date"
            onValueChange={(value: SortField) => 
              setSortField(value)
            }
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <CalendarDays className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Data</SelectItem>
              <SelectItem value="amount">Valor</SelectItem>
              <SelectItem value="description">Descrição</SelectItem>
            </SelectContent>
          </Select>

          {/* Direção da Ordenação */}
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortOrder === 'asc' ? 'Crescente' : 'Decrescente'}
          </Button>
        </div>
      </div>

      <TransactionList 
        transactions={transactions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <CreateTransactionDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  )
} 