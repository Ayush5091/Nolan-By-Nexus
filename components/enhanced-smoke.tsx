"use client"

import { useRef, useEffect } from "react"

export default function EnhancedSmoke() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Smoke particle class
    class SmokeParticle {
      x: number
      y: number
      radius: number
      color: string
      velocity: { x: number; y: number }
      life: number
      opacity: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.radius = Math.random() * 20 + 10
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`
        this.velocity = {
          x: Math.random() * 2 - 1,
          y: Math.random() * -2 - 1,
        }
        this.life = Math.random() * 100 + 100
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.velocity.x
        this.y += this.velocity.y

        if (this.radius > 0.1) {
          this.radius -= 0.05
        }

        this.life--

        if (this.opacity > 0) {
          this.opacity -= 0.003
        }
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.opacity
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx!.fillStyle = this.color
        ctx!.fill()
        ctx!.restore()
      }
    }

    // Array to store smoke particles
    const smokeParticles: SmokeParticle[] = []

    // Function to generate smoke
    function generateSmoke() {
      const x = Math.random() * canvas.width
      const y = canvas.height + 10

      for (let i = 0; i < 5; i++) {
        smokeParticles.push(new SmokeParticle(x, y))
      }
    }

    // Generate smoke at intervals
    const smokeInterval = setInterval(generateSmoke, 100)

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw smoke particles
      for (let i = 0; i < smokeParticles.length; i++) {
        smokeParticles[i].update()
        smokeParticles[i].draw()

        // Remove particles that are no longer visible
        if (smokeParticles[i].life <= 0 || smokeParticles[i].radius <= 0.1 || smokeParticles[i].opacity <= 0) {
          smokeParticles.splice(i, 1)
          i--
        }
      }

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Handle window resize
    function handleResize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      clearInterval(smokeInterval)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}

