'use client'

import { useEffect, useRef } from 'react'

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Partículas
    const particles: Array<{
      baseX: number
      baseY: number
      x: number
      y: number
      size: number
      color: string
      angle: number
      speed: number
    }> = []

    // Colores
    const colors = [
      'rgba(59,130,246,0.7)', // azul
      'rgba(99,102,241,0.7)', // índigo
      'rgba(139,92,246,0.7)', // púrpura
      'rgba(16,185,129,0.7)', // verde
      'rgba(236,72,153,0.7)'  // rosa
    ]

    // Crear partículas con distribución uniforme según el tamaño de pantalla
    const area = canvas.width * canvas.height
    const density = 0.00003 // valor reducido para menos partículas
    const numParticles = Math.floor(area * density)
    const gridSize = Math.ceil(Math.sqrt(numParticles))
    const cellWidth = canvas.width / gridSize
    const cellHeight = canvas.height / gridSize

    for (let gx = 0; gx < gridSize; gx++) {
      for (let gy = 0; gy < gridSize; gy++) {
        // Posición base en la celda, con un pequeño desplazamiento aleatorio
        const baseX = gx * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * cellWidth * 0.5
        const baseY = gy * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * cellHeight * 0.5
        particles.push({
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          size: Math.random() * 14 + 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 1.2 + 0.3
        })
      }
    }

    // Manejo de eventos
    let mouse = { x: canvas.width / 2, y: canvas.height / 2 }

    // Animación
    const animate = () => {
      // Limpiar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Fondo degradado radial
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 100,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.2
      )
      gradient.addColorStop(0, 'rgba(59,130,246,0.15)')
      gradient.addColorStop(0.5, 'rgba(139,92,246,0.10)')
      gradient.addColorStop(1, 'rgba(255,255,255,0.05)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dibujar partículas
      particles.forEach(p => {
        // Movimiento oscilatorio
        p.angle += 0.005 * p.speed // velocidad suave
        const osc = Math.sin(p.angle) * 18 // amplitud mayor
        const osc2 = Math.cos(p.angle) * 18

        // Parallax eliminado, solo movimiento oscilatorio
        p.x = p.baseX + osc
        p.y = p.baseY + osc2

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 14
        ctx.fill()
        ctx.shadowBlur = 0
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  )
} 