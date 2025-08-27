"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMobileDetection } from "@/hooks/use-mobile-detection"

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const { isMobile } = useMobileDetection()

  // Handle canvas particle effect
  useEffect(() => {
    // Skip canvas animation on mobile
    if (isMobile) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with a small delay to ensure DOM is ready
    setTimeout(() => {
      canvas.width = window.innerWidth || 1
      canvas.height = window.innerHeight || 1

      if (canvas.width > 0 && canvas.height > 0) {
        createParticlesFromText()
      }
    }, 100)

    // Particle class with physics-driven animation
    class Particle {
      x: number
      y: number
      size: number
      targetX: number
      targetY: number
      startX: number
      startY: number
      color: string
      speed: number
      initializing: boolean
      vx: number
      vy: number
      friction: number
      brightness: number
      metallic: boolean

      constructor(targetX: number, targetY: number) {
        // Start from random position on screen
        this.startX = Math.random() * canvas.width
        this.startY = Math.random() * canvas.height
        this.x = this.startX
        this.y = this.startY

        // Target position (part of the text)
        this.targetX = targetX
        this.targetY = targetY

        // Visual properties - increased brightness, slightly reduced opacity
        this.size = Math.random() * 1.8 + 0.7 // Slightly larger particles

        // Randomize brightness for metallic effect
        this.brightness = Math.random() * 30 + 225 // Values between 225-255 for brighter particles
        this.metallic = Math.random() > 0.7 // Some particles will have metallic effect

        // Base color with slightly reduced opacity
        this.color = `rgba(${this.brightness}, ${this.brightness}, ${this.brightness}, ${this.metallic ? 0.9 : 0.7})`

        this.speed = Math.random() * 0.08 + 0.05 // Slowed down animation
        this.initializing = true

        // Physics properties
        this.vx = 0
        this.vy = 0
        this.friction = 0.95
      }

      update(mouse: { x: number; y: number; radius: number }, touchActive: boolean) {
        if (this.initializing) {
          // Move towards target position during initialization
          const dx = this.targetX - this.x
          const dy = this.targetY - this.y
          this.x += dx * this.speed
          this.y += dy * this.speed

          // Check if particle has reached its target
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 2) {
            this.initializing = false
            this.x = this.targetX
            this.y = this.targetY
          }
        } else if (touchActive) {
          // Physics-driven touch interaction
          const dx = mouse.x - this.x
          const dy = mouse.y - this.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouse.radius) {
            // Calculate force based on distance
            const force = (mouse.radius - distance) / mouse.radius
            const directionX = dx / distance || 0
            const directionY = dy / distance || 0

            // Apply force as acceleration - increased for more pronounced effect
            this.vx -= directionX * force * 3.5
            this.vy -= directionY * force * 3.5
          }

          // Update position based on velocity
          this.x += this.vx
          this.y += this.vy

          // Apply friction to gradually slow down
          this.vx *= this.friction
          this.vy *= this.friction

          // Return to target position with a spring effect - increased for more physics
          const dx2 = this.targetX - this.x
          const dy2 = this.targetY - this.y
          this.vx += dx2 * 0.05
          this.vy += dy2 * 0.05
        }
      }

      draw() {
        if (!ctx) return

        // Add subtle metallic effect with gradient
        if (this.metallic) {
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size)
          gradient.addColorStop(0, `rgba(255, 255, 255, 0.9)`)
          gradient.addColorStop(0.5, `rgba(${this.brightness}, ${this.brightness}, ${this.brightness}, 0.8)`)
          gradient.addColorStop(1, `rgba(${this.brightness - 30}, ${this.brightness - 30}, ${this.brightness}, 0.6)`)

          ctx.fillStyle = gradient
        } else {
          ctx.fillStyle = this.color
        }

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
      }
    }

    // Create particles from text
    const particles: Particle[] = []
    const mouse = { x: 0, y: 0, radius: 100 }
    let touchActive = false
    let allParticlesFormed = false

    function createParticlesFromText() {
      // Clear existing particles
      particles.length = 0

      // Ensure canvas dimensions are valid
      if (canvas.width <= 0 || canvas.height <= 0) {
        console.warn("Canvas dimensions are invalid, skipping particle creation")
        return
      }

      // Calculate text size based on screen width
      const fontSize = Math.min(canvas.width / 6, 150)

      // Clear canvas before drawing text
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw text to get pixel data
      ctx.font = `bold ${fontSize}px "Times New Roman", serif`
      ctx.fillStyle = "white"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const text = "NOLAN"
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      // Get pixel data - only if dimensions are valid
      try {
        const textData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Sample pixels to create particles
        const sampleRate = 2 // Reduced for better performance
        for (let y = 0; y < canvas.height; y += sampleRate) {
          for (let x = 0; x < canvas.width; x += sampleRate) {
            const index = (y * canvas.width + x) * 4
            const alpha = textData.data[index + 3]

            // If pixel is part of the text (non-transparent)
            if (alpha > 128 && Math.random() > 0.7 && x > 0 && y > 0) {
              // Added x > 0 && y > 0 to prevent top left corner particle
              particles.push(new Particle(x, y))
            }
          }
        }
      } catch (error) {
        console.error("Error creating particles:", error)
      }
    }

    // Initialize particles
    createParticlesFromText()

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      let stillInitializing = false

      for (const particle of particles) {
        particle.update(mouse, touchActive)
        particle.draw()

        if (particle.initializing) {
          stillInitializing = true
        }
      }

      // Check if all particles have formed
      if (!stillInitializing && !allParticlesFormed) {
        allParticlesFormed = true
      }

      // Connect nearby particles with lines - simplified
      connectParticles()

      requestAnimationFrame(animate)
    }

    // Connect nearby particles with lines
    function connectParticles() {
      // Only process a subset of particles for connections
      const particleSubset = particles.filter(() => Math.random() > 0.95)

      for (let a = 0; a < particleSubset.length; a++) {
        for (let b = a + 1; b < particleSubset.length; b++) {
          const dx = particleSubset[a].x - particleSubset[b].x
          const dy = particleSubset[a].y - particleSubset[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 10) {
            // Slightly brighter connections
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)"
            ctx.lineWidth = 0.3
            ctx.beginPath()
            ctx.moveTo(particleSubset[a].x, particleSubset[a].y)
            ctx.lineTo(particleSubset[b].x, particleSubset[b].y)
            ctx.stroke()
          }
        }
      }
    }

    // Handle window resize
    function handleResize() {
      // Set canvas dimensions
      canvas.width = window.innerWidth || 1
      canvas.height = window.innerHeight || 1

      // Ensure dimensions are valid before creating particles
      if (canvas.width > 0 && canvas.height > 0) {
        // Small timeout to ensure canvas is ready
        setTimeout(() => {
          createParticlesFromText()
        }, 50)
      }
    }

    // Handle mouse/touch movement for physics interaction
    function handleMouseMove(e: MouseEvent) {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    function handleTouchStart() {
      touchActive = true
    }

    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX
        mouse.y = e.touches[0].clientY
      }
    }

    function handleTouchEnd() {
      touchActive = false
    }

    // Handle user interaction to dismiss splash screen
    function handleUserInteraction() {
      if (allParticlesFormed && !isFadingOut) {
        setIsFadingOut(true)
        // Start a smooth fade out
        setTimeout(() => {
          setIsVisible(false)
          // Call onComplete after animation finishes
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 1000) // Match the duration of the exit animation
        }, 100)
      }
    }

    // Add event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("click", handleUserInteraction)
    window.addEventListener("wheel", handleUserInteraction)

    // Add mouse down/up for physics interaction
    canvas.addEventListener("mousedown", () => {
      touchActive = true
    })
    canvas.addEventListener("mouseup", () => {
      touchActive = false
    })

    // Add event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchstart", handleTouchStart)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchend", handleTouchEnd)
    canvas.addEventListener("click", handleUserInteraction)
    window.addEventListener("wheel", handleUserInteraction)

    // Add mouse down/up for physics interaction
    canvas.addEventListener("mousedown", () => {
      touchActive = true
    })
    canvas.addEventListener("mouseup", () => {
      touchActive = false
    })

    // Start animation
    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      canvas.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("wheel", handleUserInteraction)
      canvas.removeEventListener("mousedown", () => {
        touchActive = true
      })
      canvas.removeEventListener("mouseup", () => {
        touchActive = false
      })
    }
  }, [isFadingOut, onComplete, isMobile]) // Added isMobile to dependencies

  // On mobile, don't show the regular splash screen
  // The MobileSplashScreen will be shown instead
  if (isMobile || !isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }} // Smooth fade out
        >
          <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-pointer" />

          <div className="relative z-10 flex flex-col items-center pointer-events-none">
            {/* Hidden text (actual text is drawn with particles) */}
            <div className="opacity-0 text-8xl md:text-9xl font-bold tracking-widest">NOLAN</div>

            {/* "by Nexus" with simple fade animation */}
            <div className="mt-24 relative">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }} // Slightly reduced opacity
                transition={{ duration: 1.5, delay: 2.2 }} // Slowed down animation
                className="text-2xl text-white font-medium tracking-wider"
              >
                by Nexus
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 3.5 }} // Delayed further to match new timing
              className="mt-8 text-sm text-white/50"
            >
              Tap or scroll to continue
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

