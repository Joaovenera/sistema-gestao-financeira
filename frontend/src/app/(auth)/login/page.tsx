'use client'

import { LoginForm } from '@/components/forms/LoginForm'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[400px] p-4 sm:p-6"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Bem-vindo de volta!
          </h1>
          <p className="text-muted-foreground">
            Entre na sua conta para continuar
          </p>
        </div>
        <LoginForm />
      </motion.div>
    </div>
  )
}

