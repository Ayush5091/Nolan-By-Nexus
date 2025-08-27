"use client"

import { memo } from "react"
import { motion } from "framer-motion"

// Use memo to prevent unnecessary re-renders
const SimpleFilmRollLoader = memo(function SimpleFilmRollLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-[9999] bg-black/90">
      <div className="relative mb-8">
        <div className="w-32 h-32 border-8 border-gray-700 rounded-full animate-spin border-t-amber-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 17H20" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>
      </div>
      <div className="text-center text-white text-xl font-bold">
        <p>{message}</p>
      </div>
    </div>
  )
})

// Export as both default and named export
export { SimpleFilmRollLoader }
export default SimpleFilmRollLoader

