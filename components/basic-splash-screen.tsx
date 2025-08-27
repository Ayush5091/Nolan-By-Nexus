"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// Fallback splash screen in case the canvas version has issues
export default function BasicSplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setIsVisible(false)}
        >
          <div className="relative z-10 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-8xl md:text-9xl font-bold tracking-widest text-white"
            >
              NOLAN
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 text-xl text-white/70 font-medium tracking-widest relative"
            >
              by Nexus
              <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-black to-transparent" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

