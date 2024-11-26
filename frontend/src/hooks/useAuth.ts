import { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { AuthContext } from '@/providers/auth'

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  
  return context
} 