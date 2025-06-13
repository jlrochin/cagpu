'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/toaster"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { AnimatedBackground } from "../../components/animated-background"
import React from "react"
import { ThemeToggle } from "@/components/theme-toggle"

// Usuarios predefinidos
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
]

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [show, setShow] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  React.useEffect(() => {
    setShow(true)
    // Ocultar scroll del body solo en login
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulamos un delay para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Buscar usuario
    const user = USERS.find(u => u.username === username && u.password === password)
    if (!user) {
      toast.error('Usuario o contraseña incorrectos')
      setIsLoading(false)
      return
    }

    // Guardar el rol en localStorage
    localStorage.setItem('role', user.role)

    toast.success("¡Inicio de sesión exitoso!")
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center relative overflow-hidden" style={{background: 'transparent'}}>
      <AnimatedBackground />
      <div className="fixed top-4 right-4 z-[9999]">
        <div className="bg-background/80 rounded-full shadow-lg border border-border flex items-center justify-center p-0.5 w-12 h-12">
          <ThemeToggle />
        </div>
      </div>
      <div className={`transition-all duration-700 ease-out ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} flex justify-center items-center w-full h-full absolute top-0 left-0`}>
        <Card className="w-[350px] bg-white dark:bg-zinc-900 shadow-2xl border border-white/30 dark:border-zinc-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Ingresa tus credenciales para acceder al sistema<br/>
              <span className="text-xs text-muted-foreground">admin/admin123 &bull; user/user123</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">Usuario</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Ingresa tu usuario"
                    required
                    className="bg-white/40 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Contraseña</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    required
                    className="bg-white/40 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-center">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-purple-600 dark:hover:from-blue-600 dark:hover:to-purple-700"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Toaster />
    </div>
  )
} 