"use client"

import { useState, memo } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, ChevronDown, ChevronUp, Film, ImageIcon } from "lucide-react"

interface SceneProps {
  index: number
  content: string
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onEdit: () => void
  image?: string
}

// Use memo to prevent unnecessary re-renders
const Scene = memo(function Scene({ index, content, isActive, onSelect, onDelete, onEdit, image }: SceneProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Extract scene heading from content
  const getSceneHeading = () => {
    if (!content) return `Scene ${index + 1}`

    const lines = content.split("\n")
    for (const line of lines) {
      if (line.includes("INT.") || line.includes("EXT.")) {
        return line.trim()
      }
    }
    return `Scene ${index + 1}`
  }

  // Get a short preview of the scene content
  const getContentPreview = () => {
    if (!content) return "Empty scene..."

    const lines = content.split("\n").filter((line) => line.trim().length > 0)
    // Skip the heading line
    const contentLines = lines.slice(1, 4)
    return contentLines.join(" ").substring(0, 100) + (content.length > 100 ? "..." : "")
  }

  return (
    <motion.div
      className={`p-3 border rounded-md mb-2 cursor-pointer transition-all ${
        isActive ? "border-amber-500 bg-amber-900/20" : isHovered ? "border-white/40 bg-white/5" : "border-white/20"
      }`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Film className="w-4 h-4 mr-2 text-amber-400" />
          <h4 className="font-medium text-sm">{getSceneHeading()}</h4>
          {image && <ImageIcon size={12} className="ml-2 text-purple-400" title="Has image" />}
        </div>
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (confirm("Are you sure you want to delete this scene?")) {
                onDelete()
              }
            }}
            className="p-1 hover:bg-white/10 rounded"
          >
            <Trash2 size={14} />
          </button>
          {isActive ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {!isActive && <p className="text-xs text-white/70 mt-1 line-clamp-2">{getContentPreview()}</p>}

      {image && !isActive && (
        <div className="mt-2 h-12 overflow-hidden rounded">
          <img src={image || "/placeholder.svg"} alt="Scene visualization" className="w-full h-full object-cover" />
        </div>
      )}
    </motion.div>
  )
})

export default Scene

