"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import { useRouter } from "next/navigation"
import FloatingPaths from "./floating-paths"
import { Play } from "lucide-react"

export default function HomeScreen() {
  const router = useRouter()
  const videoRef = useRef<HTMLDivElement>(null)
  const [isHoveringWriter, setIsHoveringWriter] = useState(false)
  const [isHoveringCritic, setIsHoveringCritic] = useState(false)
  const [isHoveringVideo, setIsHoveringVideo] = useState(false)
  const [isClickingWriter, setIsClickingWriter] = useState(false)
  const [isClickingCritic, setIsClickingCritic] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionTarget, setTransitionTarget] = useState("")
  const [windowHeight, setWindowHeight] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)

  // Mouse position for interactive lighting effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const writerControls = useAnimation()
  const criticControls = useAnimation()

  // Track window dimensions for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
      setWindowWidth(window.innerWidth)
    }

    // Set initial value
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Track mouse position for interactive lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const handleWriterClick = () => {
    setIsClickingWriter(true)
    setIsTransitioning(true)
    setTransitionTarget("writer")

    setTimeout(() => {
      router.push("/writer")
    }, 1000) // Wait for the transition animation
  }

  const handleCriticClick = () => {
    setIsClickingCritic(true)
    setIsTransitioning(true)
    setTransitionTarget("critic")

    setTimeout(() => {
      router.push("/critic")
    }, 1000) // Wait for the transition animation
  }

  // Calculate dynamic padding based on window height to ensure buttons are visible
  const dynamicPadding = windowHeight > 800 ? "pt-24" : windowHeight > 700 ? "pt-16" : "pt-12"

  // Update the buttons container to have better spacing and alignment
  const buttonsContainerClass = "flex flex-row gap-10 justify-center items-center mb-20"

  return (
    <div id="home" className="min-h-screen bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="smoke-effect"></div>

      {/* Floating paths background animation */}
      <div className="absolute inset-0 z-0">
        <FloatingPaths />
      </div>

      {/* Cinematic transition overlay */}
      <motion.div
        className="fixed inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isTransitioning ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <div
          className={`absolute inset-0 ${
            transitionTarget === "writer"
              ? "bg-gradient-to-r from-blue-900/90 to-purple-900/90"
              : "bg-gradient-to-r from-amber-900/90 to-red-900/90"
          }`}
        >
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        </div>
      </motion.div>

      <div className={`container mx-auto px-4 relative z-10 min-h-screen flex flex-col items-center ${dynamicPadding}`}>
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-6"
        >
          <h1
            className="text-5xl md:text-7xl font-bold tracking-wider title-text mb-2"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            NOLAN
          </h1>
          <p className="text-xl text-white/70">by Nexus</p>
        </motion.div>

        {/* Cinematic description with subtle pulsating effect */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.5 }}
          className="text-center mb-8"
        >
          <div className="h-px w-1/3 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent mb-4"></div>
          <motion.h2 className="text-lg md:text-xl lg:text-2xl chromic-text uppercase pulsate-text">
            TRANSFORMING IMAGINATION INTO CINEMATIC REALITY
          </motion.h2>
          <div className="h-px w-1/3 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent mt-4"></div>
        </motion.div>

        {/* Main video - replaced with the new video */}
        <motion.div
          ref={videoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="relative w-full max-w-2xl aspect-video overflow-hidden rounded-lg mx-auto transition-all duration-300 cursor-pointer mb-12"
          style={{
            transform: `translateY(${scrollY * 0.1}px) ${isHoveringVideo ? "scale(1.02)" : "scale(1)"}`,
            boxShadow: isHoveringVideo
              ? "0 25px 60px -15px rgba(0, 0, 0, 0.9)"
              : "0 20px 50px -15px rgba(0, 0, 0, 0.8)",
          }}
          onMouseEnter={() => setIsHoveringVideo(true)}
          onMouseLeave={() => setIsHoveringVideo(false)}
        >
          {/* Inner shadow effect */}
          <div
            className="absolute inset-0 shadow-inner pointer-events-none z-30 rounded-lg"
            style={{
              boxShadow: "inset 0 0 30px 10px rgba(0, 0, 0, 0.6), inset 0 0 5px 2px rgba(0, 0, 0, 0.8)",
            }}
          ></div>

          {/* Blur mask for the background animation */}
          <div className="absolute inset-0 backdrop-blur-[2px] z-0"></div>

          {/* New video - replaced the placeholder */}
          <video
            className="absolute inset-0 w-full h-full object-cover z-10"
            autoPlay
            muted
            loop
            playsInline
            poster="/assets/placeholder-wide.png"
          >
            <source
              src="/Nolan_intro.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-black/40 z-20"></div>

          {/* Play indicator that appears on hover */}
          {/*<div
            className={`absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-300 ${
              isHoveringVideo ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>*/}
        </motion.div>

        {/* Buttons below video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className={buttonsContainerClass}
        >
          {/* Writer Button */}
          <motion.div
            className="relative group"
            animate={writerControls}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Photorealistic glow effect */}
            <div
              className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500 group-hover:duration-200"
              style={{
                background: `radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(76, 0, 255, 0.8) 0%, rgba(0, 183, 255, 0.7) 50%, rgba(76, 0, 255, 0.5) 100%)`,
                opacity: isHoveringWriter ? 0.7 : 0,
                transform: isClickingWriter ? "scale(0.98)" : "scale(1.05)",
              }}
            ></div>

            <button
              className="relative px-10 py-4 text-xl rounded-2xl backdrop-blur-sm border overflow-hidden transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 40, 0.9) 100%)",
                borderImage: "linear-gradient(to right, rgba(76, 0, 255, 0.3), rgba(0, 183, 255, 0.5)) 1",
                boxShadow: isHoveringWriter
                  ? "0 10px 25px -5px rgba(76, 0, 255, 0.4), 0 8px 10px -6px rgba(0, 183, 255, 0.3)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)",
                width: "180px",
              }}
              onMouseEnter={() => setIsHoveringWriter(true)}
              onMouseLeave={() => {
                setIsHoveringWriter(false)
                setIsClickingWriter(false)
              }}
              onMouseDown={() => setIsClickingWriter(true)}
              onMouseUp={() => setIsClickingWriter(false)}
              onClick={handleWriterClick}
            >
              <span className="relative z-10 font-montserrat tracking-wider font-bold">WRITER</span>
            </button>
          </motion.div>

          {/* Critic Button */}
          <motion.div
            className="relative group"
            animate={criticControls}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Photorealistic glow effect */}
            <div
              className="absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-70 transition duration-500 group-hover:duration-200"
              style={{
                background: `radial-gradient(circle at ${mouseX.get()}px ${mouseY.get()}px, rgba(255, 76, 0, 0.8) 0%, rgba(255, 213, 0, 0.7) 50%, rgba(255, 76, 0, 0.5) 100%)`,
                opacity: isHoveringCritic ? 0.7 : 0,
                transform: isClickingCritic ? "scale(0.98)" : "scale(1.05)",
              }}
            ></div>

            <button
              className="relative px-10 py-4 text-xl rounded-2xl backdrop-blur-sm border overflow-hidden transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(40, 20, 20, 0.9) 100%)",
                borderImage:
                  "linear-gradient(to right, rgba(255, 76, 0, 0.3), rgba(255, 213, 0, 0.5)) 120,20,0.9) 100%)",
                borderImage: "linear-gradient(to right, rgba(255, 76, 0, 0.3), rgba(255, 213, 0, 0.5)) 1",
                boxShadow: isHoveringCritic
                  ? "0 10px 25px -5px rgba(255, 76, 0, 0.4), 0 8px 10px -6px rgba(255, 213, 0, 0.3)"
                  : "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)",
                width: "180px",
              }}
              onMouseEnter={() => setIsHoveringCritic(true)}
              onMouseLeave={() => {
                setIsHoveringCritic(false)
                setIsClickingCritic(false)
              }}
              onMouseDown={() => setIsClickingCritic(true)}
              onMouseUp={() => setIsClickingCritic(false)}
              onClick={handleCriticClick}
            >
              <span className="relative z-10 font-montserrat tracking-wider font-bold">CRITIC</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

