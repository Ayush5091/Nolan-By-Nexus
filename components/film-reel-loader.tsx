"use client"

import { motion } from "framer-motion"

export default function FilmReelLoader({ showInstructions = false }: { showInstructions?: boolean }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 z-50">
      <div className="relative mb-8">
        {/* Simplified loader without film reel */}
        <div className="w-32 h-32 border-8 border-gray-700 rounded-full animate-spin border-t-amber-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7H20" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 12H20" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 17H20" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-white">
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="text-lg font-medium tracking-wider"
        >
          Generating...
        </motion.p>
      </div>

      {showInstructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-md mx-auto px-6 py-4 bg-white/5 backdrop-blur-sm rounded-lg mt-4"
        >
          <h3 className="text-center text-white font-medium mb-2">Generation in Progress</h3>
          <ul className="text-white/80 text-sm space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Creating your screenplay with professional formatting</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>This may take a few moments for complex ideas</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Please don't refresh the page during generation</span>
            </li>
          </ul>
        </motion.div>
      )}
    </div>
  )
}

