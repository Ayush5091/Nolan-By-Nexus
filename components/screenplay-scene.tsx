"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Edit, Trash2, Film } from "lucide-react"

interface ScreenplaySceneProps {
  index: number
  content: string
  isActive: boolean
  onSelect: () => void
  onDelete: () => void
  onEdit: () => void
  image?: string
}

export default function ScreenplayScene({
  index,
  content,
  isActive,
  onSelect,
  onDelete,
  onEdit,
  image,
}: ScreenplaySceneProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Extract scene heading from content
  const getSceneHeading = () => {
    if (!content) return `Scene ${index + 1}`

    // Try to find a scene heading (INT./EXT.)
    const lines = content.split("\n")
    const headingLine = lines.find(
      (line) => line.trim().startsWith("INT.") || line.trim().startsWith("EXT.") || line.trim().startsWith("INT/EXT."),
    )

    if (headingLine) return headingLine.trim()

    // If no heading found, use first line or default
    return lines[0]?.trim() || `Scene ${index + 1}`
  }

  // Get a short preview of the scene content
  const getContentPreview = () => {
    if (!content) return "Empty scene"

    const lines = content.split("\n").filter((line) => line.trim())
    // Skip the heading if it exists
    const startIndex =
      lines[0]?.trim().startsWith("INT.") ||
      lines[0]?.trim().startsWith("EXT.") ||
      lines[0]?.trim().startsWith("INT/EXT.")
        ? 1
        : 0

    // Get the next few lines
    return (
      lines
        .slice(startIndex, startIndex + 2)
        .join(" ")
        .substring(0, 60) + "..."
    )
  }

  // Function to format the screenplay based on theme
  const formatScreenplay = (text: string, theme: string) => {
    if (!text) return []

    // Split the text into lines
    const lines = text.split("\n")

    // Process each line based on screenplay formatting rules
    return lines.map((line, index) => {
      // Trim the line to remove leading/trailing whitespace
      const trimmedLine = line.trim()

      // Skip empty lines but preserve them in the output
      if (!trimmedLine) {
        return { type: "empty", content: "", key: `line-${index}` }
      }

      // Hollywood format
      if (theme === "hollywood") {
        // Scene headings (INT./EXT.)
        if (/^(INT\.|EXT\.|INT\/EXT\.|I\/E)/.test(trimmedLine.toUpperCase())) {
          return { type: "scene-heading", content: trimmedLine.toUpperCase(), key: `line-${index}` }
        }

        // Character names (all caps, centered)
        if (
          /^[A-Z\s]+$/.test(trimmedLine) &&
          trimmedLine.length > 1 &&
          !trimmedLine.includes("CUT TO:") &&
          !trimmedLine.includes("FADE")
        ) {
          return { type: "character", content: trimmedLine, key: `line-${index}` }
        }

        // Parentheticals (wrapped in parentheses)
        if (/^$$.+$$$/.test(trimmedLine)) {
          return { type: "parenthetical", content: trimmedLine, key: `line-${index}` }
        }

        // Transitions (right-aligned, ends with TO:)
        if (/TO:$/.test(trimmedLine) || /^FADE (IN|OUT)/.test(trimmedLine.toUpperCase())) {
          return { type: "transition", content: trimmedLine.toUpperCase(), key: `line-${index}` }
        }

        // Check if previous line was a character name to identify dialogue
        const prevLine = index > 0 ? lines[index - 1].trim() : ""
        if (index > 0 && (/^[A-Z\s]+$/.test(prevLine) || /^$$.+$$$/.test(prevLine))) {
          return { type: "dialogue", content: trimmedLine, key: `line-${index}` }
        }

        // Default to action description
        return { type: "action", content: trimmedLine, key: `line-${index}` }
      }

      // BBC format
      else if (theme === "bbc") {
        // Scene headings
        if (/^(INT\.|EXT\.|INT\/EXT\.|I\/E)/.test(trimmedLine.toUpperCase())) {
          return { type: "scene-heading-bbc", content: trimmedLine.toUpperCase(), key: `line-${index}` }
        }

        // Character names (all caps followed by colon for BBC format)
        if (/^[A-Z\s]+:/.test(trimmedLine)) {
          const [character, ...dialogueParts] = trimmedLine.split(":")
          return {
            type: "character-bbc",
            content: character.trim(),
            dialogue: dialogueParts.join(":").trim(),
            key: `line-${index}`,
          }
        }

        // Transitions
        if (/TO:$/.test(trimmedLine) || /^FADE (IN|OUT)/.test(trimmedLine.toUpperCase())) {
          return { type: "transition-bbc", content: trimmedLine.toUpperCase(), key: `line-${index}` }
        }

        // Default to action description
        return { type: "action-bbc", content: trimmedLine, key: `line-${index}` }
      }

      // Short-form content
      else {
        // Scene headings
        if (/^(INT\.|EXT\.|INT\/EXT\.|I\/E)/.test(trimmedLine.toUpperCase())) {
          return { type: "scene-heading-short", content: trimmedLine.toUpperCase(), key: `line-${index}` }
        }

        // Character names (all caps)
        if (
          /^[A-Z\s]+$/.test(trimmedLine) &&
          trimmedLine.length > 1 &&
          !trimmedLine.includes("CUT TO:") &&
          !trimmedLine.includes("FADE")
        ) {
          return { type: "character-short", content: trimmedLine, key: `line-${index}` }
        }

        // Parentheticals
        if (/^$$.+$$$/.test(trimmedLine)) {
          return { type: "parenthetical-short", content: trimmedLine, key: `line-${index}` }
        }

        // Check if previous line was a character name to identify dialogue
        const prevLine = index > 0 ? lines[index - 1].trim() : ""
        if (index > 0 && (/^[A-Z\s]+$/.test(prevLine) || /^$$.+$$$/.test(prevLine))) {
          return { type: "dialogue-short", content: trimmedLine, key: `line-${index}` }
        }

        // Default to action description
        return { type: "action-short", content: trimmedLine, key: `line-${index}` }
      }
    })
  }

  const formattedContent = formatScreenplay(content, "hollywood") // Placeholder theme

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    //This function is not used in the updated code.  Leaving it here in case it's needed later.
  }

  return (
    <motion.div
      className={`p-3 rounded-lg transition-colors ${
        isActive ? "bg-white/20" : isHovered ? "bg-white/10" : "bg-white/5"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="font-bold text-sm truncate">{getSceneHeading()}</div>
          <div className="text-xs text-white/70 mt-1 line-clamp-2">{getContentPreview()}</div>
        </div>

        {/* Show thumbnail if image exists */}
        {image && (
          <div className="ml-2 w-12 h-12 flex-shrink-0 rounded overflow-hidden">
            <img src={image || "/placeholder.svg"} alt="Scene thumbnail" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Only show controls when hovered or active */}
        {(isHovered || isActive) && (
          <div className="flex space-x-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="p-1 rounded hover:bg-white/20"
              title="Edit scene"
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
              className="p-1 rounded hover:bg-white/20"
              title="Delete scene"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Scene number indicator */}
      <div className="flex items-center mt-2 text-xs text-white/50">
        <Film size={10} className="mr-1" />
        <span>Scene {index + 1}</span>
      </div>
    </motion.div>
  )
}

