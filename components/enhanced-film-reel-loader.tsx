"use client"

import { motion } from "framer-motion"

export default function EnhancedFilmReelLoader({
  showInstructions = false,
  progress = 0,
}: { showInstructions?: boolean; progress?: number }) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50">
      {/* Backdrop with blur and gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/95 to-black/90 backdrop-blur-md"></div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-12">
        {/* 3D Glass Film Reel Container */}
        <div className="relative">
          {/* Glass effect background */}
          <motion.div
            className="absolute -inset-8 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 blur-xl"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Main glass container */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden backdrop-blur-sm border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"></div>

            {/* Film reel */}
            <motion.div
              className="w-full h-full relative"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              {/* Main reel */}
              <div className="absolute inset-4 rounded-full border-8 border-gray-700/80 bg-gray-800/80">
                {/* Center hole */}
                <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80 border-2 border-gray-600/80 shadow-inner"></div>

                {/* Film holes */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-5 h-5 rounded-full bg-black/80 border border-gray-600/80 shadow-inner"
                    style={{
                      top: `${50 + 35 * Math.sin((i * Math.PI) / 4)}%`,
                      left: `${50 + 35 * Math.cos((i * Math.PI) / 4)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  ></div>
                ))}
              </div>

              {/* Film strip */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-48 h-8 bg-gray-900/80 -translate-y-1/2 origin-left"
                initial={{ rotate: 0 }}
                animate={{ rotate: [-10, 10, -10] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                {/* Film holes */}
                <div className="absolute top-1/2 left-8 w-4 h-4 rounded-full bg-black/80 border border-gray-700/80 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-20 w-4 h-4 rounded-full bg-black/80 border border-gray-700/80 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-32 w-4 h-4 rounded-full bg-black/80 border border-gray-700/80 -translate-y-1/2"></div>
                <div className="absolute top-1/2 left-44 w-4 h-4 rounded-full bg-black/80 border border-gray-700/80 -translate-y-1/2"></div>
              </motion.div>
            </motion.div>

            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none"></div>
          </div>

          {/* Outer glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/10 to-red-500/10 blur-xl -z-10"></div>
        </div>

        {/* Loading text with metallic effect */}
        <div className="mt-10 text-center">
          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="text-2xl font-bold tracking-wider metallic-text"
          >
            Analyzing Screenplay
          </motion.p>

          {/* Progress indicator */}
          {progress > 0 && (
            <div className="mt-4">
              <div className="h-2 w-64 mx-auto bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="mt-2 text-white/70 font-medium">{progress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced instructions panel */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 max-w-md mx-auto px-8 py-6 rounded-xl backdrop-blur-md border border-white/20 bg-black/30"
        >
          {/* Glass effect */}
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-center text-xl font-bold mb-4 metallic-text">Analysis in Progress</h3>
            <ul className="text-white/90 space-y-3">
              <li className="flex items-start">
                <span className="mr-2 text-amber-400">•</span>
                <span className="font-medium">
                  Analyzing screenplay structure, characters, dialogue, and visual elements
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-amber-400">•</span>
                <span className="font-medium">Evaluating against professional cinematic principles</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-amber-400">•</span>
                <span className="font-medium">This may take a few minutes for longer screenplays</span>
              </li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}

