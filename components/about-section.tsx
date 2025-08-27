"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/glass-card"

export default function AboutSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    const gridSize = 40
    let time = 0

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01
      const pulse = Math.sin(time) * 0.2 + 0.8

      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 0.5

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.globalAlpha = pulse * 0.5
        ctx.stroke()
      }

      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.globalAlpha = pulse * 0.5
        ctx.stroke()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  const handleMouseEnter = (id: string) => {
    const video = document.getElementById(id) as HTMLVideoElement
    if (video) {
      video.play().catch(err => console.error(`Play failed for ${id}:`, err))
    }
  }

  const handleMouseLeave = (id: string) => {
    const video = document.getElementById(id) as HTMLVideoElement
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-80 z-0" />
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider title-text">About NOLAN</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            NOLAN is an advanced AI platform designed to revolutionize screenplay writing and analysis
          </p>
        </motion.div>

        {/* Video Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Writer Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="h-full p-6">
              <h3 className="text-2xl font-bold mb-4 text-center">Writer</h3>
              <div
                className="relative aspect-video mb-4 overflow-hidden rounded-lg group"
                onMouseEnter={() => handleMouseEnter("writer-video")}
                onMouseLeave={() => handleMouseLeave("writer-video")}
              >
                <img
                  src="/thumb-writer.png"
                  alt="Writer Thumbnail"
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <video
                  id="writer-video"
                  src="/vid-writer.mp4"
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
              <p className="text-gray-300 text-center">
                Watch how our Writer transforms your ideas into professionally formatted screenplays.
              </p>
            </GlassCard>
          </motion.div>

          {/* Critic Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GlassCard className="h-full p-6">
              <h3 className="text-2xl font-bold mb-4 text-center">Critic</h3>
              <div
                className="relative aspect-video mb-4 overflow-hidden rounded-lg group"
                onMouseEnter={() => handleMouseEnter("critic-video")}
                onMouseLeave={() => handleMouseLeave("critic-video")}
              >
                <img
                  src="/thumb-critic.png"
                  alt="Critic Thumbnail"
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <video
                  id="critic-video"
                  src="/vid-critic.mp4"
                  className="absolute top-0 left-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              </div>
              <p className="text-gray-300 text-center">
                See how our Critic analyzes screenplays and provides professional-level feedback.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}