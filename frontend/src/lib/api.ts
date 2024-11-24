'use client'

import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('@FinancialApp:token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
) 