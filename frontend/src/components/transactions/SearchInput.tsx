'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useRef, useCallback, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }, [onChange])

  // Mantém o foco e a posição do cursor após qualquer atualização
  useEffect(() => {
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart
      inputRef.current.focus()
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
        }
      })
    }
  }, [value])

  return (
    <div className="relative flex-1" onFocus={(e) => e.stopPropagation()}>
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        placeholder="Buscar transações..."
        className="pl-8"
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  )
} 