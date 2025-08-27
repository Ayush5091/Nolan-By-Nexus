"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface ThemeCardProps {
  title: string
  description: string
  videoSrc: string
  placeholderImage: string
  isSelected: boolean
  onClick: () => void
}

export default function ThemeCard({
  title,
  description,
  videoSrc,
  placeholderImage,
  isSelected,
  onClick,
}: ThemeCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg cursor-pointer ${isSelected ? "ring-2 ring-white" : ""}`}
      initial={{ scale: 1 }}
      animate={{
        scale: isHovered ? 1.05 : 1,
        y: isHovered ? -5 : 0,
      }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg">
        {/* Always show the placeholder image first */}
        <img
          src={placeholderImage || "/placeholder.svg"}
          alt={title}
          className={`w-full h-full object-cover ${videoLoaded ? "opacity-0" : "opacity-100"}`}
          style={{ position: videoLoaded ? "absolute" : "relative" }}
        />

        {/* Load video in background */}
        <video
          src={videoSrc}
          className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-300 ${videoLoaded ? "opacity-100" : "opacity-0"}`}
          loop
          muted
          autoPlay
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-white text-black rounded-full p-1">
          <Check size={16} />
        </div>
      )}
    </motion.div>
  )
}

