'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, systemTheme } = useTheme()

  // Función para determinar si el modo oscuro está activo
  const isDark = () => {
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      return false
    }
    return theme === 'dark'
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Ajustar el tamaño del canvas al tamaño de la ventana
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Configuración de partículas
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    // Crear partículas
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        opacity: Math.random() * 0.5 + 0.1
      })
    }

    // Función de animación
    const animate = () => {
      const dark = isDark()
      // Limpiar el canvas con un color base según el tema
      ctx.fillStyle = dark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar gradiente de fondo según el tema
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      if (dark) {
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)') // blue-500
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)') // indigo-500
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)') // purple-500
      } else {
        gradient.addColorStop(0, 'rgba(147, 197, 253, 0.1)') // blue-300
        gradient.addColorStop(0.5, 'rgba(165, 180, 252, 0.1)') // indigo-300
        gradient.addColorStop(1, 'rgba(192, 132, 252, 0.1)') // purple-300
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Dibujar partícula con color según el tema
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = dark 
          ? `rgba(255, 255, 255, ${particle.opacity})`
          : `rgba(0, 0, 0, ${particle.opacity})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme, systemTheme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  )
} 