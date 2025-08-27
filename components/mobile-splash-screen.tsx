"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function MobileSplashScreen() {
  const [activeLogoIndex, setActiveLogoIndex] = useState<number | null>(null)

  const laptopRecommendations = [
    {
      name: "MacBook",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/31039-vepmL.jpg-BN5sB8SwF98lP1OwJaxbc6CMDR9rKU.jpeg",
      url: "https://www.apple.com/macbook-pro/",
      description: "Best for creative professionals and video editing",
    },
    {
      name: "Windows",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-AiknHV33nMCcqznq7zt9jPa70Q8TUa.png",
      url: "https://www.amazon.com/s?k=windows+laptop",
      description: "Versatile options for all budgets and needs",
    },
    {
      name: "Linux",
      logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images%20%281%29-wXPsWvoKr5LUkD9gBLz3xuYCMZwbtc.png",
      url: "https://www.amazon.com/s?k=linux+laptop",
      description: "Open-source performance for developers",
    },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold tracking-wider mb-2"
      >
        NOLAN
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-white/70 mb-6"
      >
        by Nexus
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mb-8 max-w-xs"
      >
        <p className="text-white/80">
          This experience is optimized for desktop viewing. All features may be limited on mobile devices.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex flex-col gap-4"
      >
        <div className="flex justify-center space-x-8 mt-6">
          {laptopRecommendations.map((laptop, index) => (
            <a
              key={index}
              href={laptop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center transition-all duration-300"
              title={`Recommended ${laptop.name} laptops`}
              onMouseDown={() => setActiveLogoIndex(index)}
              onMouseUp={() => setActiveLogoIndex(null)}
              onMouseLeave={() => setActiveLogoIndex(null)}
            >
              <img
                src={laptop.logo || "/placeholder.svg"}
                alt={`${laptop.name} logo`}
                className="w-10 h-10 object-contain transition-all duration-200"
                style={{
                  background: "transparent",
                  transform: activeLogoIndex === index ? "scale(1.15)" : "scale(1)",
                }}
              />
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

