"use client"

import { useRef, useEffect } from "react"

interface Particle {
  x: number
  y: number
  size: number
  baseX: number
  baseY: number
  density: number
  color: string
  velocityX: number
  velocityY: number
  mass: number
  friction: number
  springFactor: number
}

export default function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []
    const mouse = {
      x: undefined as number | undefined,
      y: undefined as number | undefined,
      radius: 150,
      isPressed: false,
    }

    // Handle canvas sizing
    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      init()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Handle mouse movement
    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.x
      mouse.y = e.y
    }

    // Handle touch movement
    function handleTouchMove(e: TouchEvent) {
      e.preventDefault()
      mouse.x = e.touches[0].clientX
      mouse.y = e.touches[0].clientY
    }

    // Handle mouse leave
    function handleMouseLeave() {
      mouse.x = undefined
      mouse.y = undefined
    }

    // Handle mouse press for more interactive physics
    function handleMouseDown() {
      mouse.isPressed = true
    }

    function handleMouseUp() {
      mouse.isPressed = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    // Initialize particles
    function init() {
      particles = []

      // Create a grid of particles
      const particleCount = Math.min(Math.floor(window.innerWidth / 15), 100)
      const gap = Math.floor(canvas.width / particleCount)

      for (let y = 0; y < canvas.height; y += gap) {
        for (let x = 0; x < canvas.width; x += gap) {
          if (Math.random() > 0.5) {
            const size = Math.random() * 2 + 1
            const brightness = Math.random() * 50 + 205 // Brighter particles
            particles.push({
              x,
              y,
              size,
              baseX: x,
              baseY: y,
              density: Math.random() * 30 + 1,
              color: `rgba(${brightness}, ${brightness}, ${brightness}, 0.8)`,
              velocityX: 0,
              velocityY: 0,
              mass: Math.random() * 2 + 0.5, // Add mass for physics
              friction: 0.95 - Math.random() * 0.03, // Randomize friction slightly
              springFactor: 0.01 + Math.random() * 0.01, // Randomize spring factor
            })
          }
        }
      }
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Draw particle
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()

        // Calculate distance between mouse and particle
        if (mouse.x !== undefined && mouse.y !== undefined) {
          const dx = mouse.x - particle.x
          const dy = mouse.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius) {
            // Enhanced physics: stronger repulsion when mouse is pressed
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (mouse.radius - distance) / mouse.radius
            const multiplier = mouse.isPressed ? 3 : 1 // Stronger force when mouse is pressed
            const directionX = forceDirectionX * force * particle.density * multiplier
            const directionY = forceDirectionY * force * particle.density * multiplier

            // Apply force inversely proportional to mass
            particle.velocityX -= directionX / particle.mass
            particle.velocityY -= directionY / particle.mass

            // Add some randomness when mouse is pressed for more chaotic movement
            if (mouse.isPressed && Math.random() > 0.8) {
              particle.velocityX += (Math.random() - 0.5) * 2
              particle.velocityY += (Math.random() - 0.5) * 2
            }
          }
        }

        // Update particle position
        particle.x += particle.velocityX
        particle.y += particle.velocityY

        // Apply friction
        particle.velocityX *= particle.friction
        particle.velocityY *= particle.friction

        // Return to original position with spring physics
        const dx = particle.baseX - particle.x
        const dy = particle.baseY - particle.y

        // Spring force proportional to distance
        particle.velocityX += dx * particle.springFactor
        particle.velocityY += dy * particle.springFactor

        // Connect nearby particles with lines - more connections when particles are disturbed
        for (let j = i + 1; j < particles.length; j++) {
          const otherParticle = particles[j]
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Dynamic connection distance based on particle movement
          const connectionDistance =
            50 +
            Math.abs(particle.velocityX + particle.velocityY + otherParticle.velocityX + otherParticle.velocityY) * 5

          if (distance < connectionDistance) {
            // Line opacity based on distance and velocity
            const opacity = 0.2 - distance / 250 + Math.abs(particle.velocityX + particle.velocityY) * 0.05

            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(opacity, 0.5)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none" />
}

