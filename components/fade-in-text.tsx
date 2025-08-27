"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface FadeInTextProps {
  text: string
  delay?: number
  duration?: number
  lineDelay?: number
  className?: string
  enableFormatting?: boolean
  onComplete?: () => void
}

export default function FadeInText({
  text,
  delay = 0,
  duration = 0.5,
  lineDelay = 0.15,
  className = "",
  enableFormatting = true,
  onComplete,
}: FadeInTextProps) {
  const [lines, setLines] = useState<string[]>([])
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Split text into lines when it changes
  useEffect(() => {
    if (text) {
      // Split by line breaks and filter out empty lines
      const textLines = text.split("\n").filter((line) => line.trim().length > 0)
      setLines(textLines)
      setVisibleLines(0) // Reset visible lines when text changes
    }
  }, [text])

  // Animate lines appearing one by one
  useEffect(() => {
    if (lines.length > 0 && visibleLines < lines.length) {
      const initialDelay = visibleLines === 0 ? delay * 1000 : lineDelay * 1000

      timeoutRef.current = setTimeout(() => {
        setVisibleLines((prev) => prev + 1)
      }, initialDelay)
    } else if (visibleLines === lines.length && onComplete) {
      // Call onComplete when all lines are visible
      onComplete()
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [lines, visibleLines, delay, lineDelay, onComplete])

  // Format text with rich styling
  const formatText = (line: string) => {
    if (!enableFormatting) return line

    // Apply formatting based on patterns
    return (
      line
        // Bold text between ** markers
        .replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-white">$1</span>')
        // Italic text between * markers (but not if it's part of **)
        .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<span class="italic text-white/90">$1</span>')
        // Highlight important terms
        .replace(
          /(important|critical|essential|crucial|significant)/gi,
          '<span class="text-amber-300 font-medium">$1</span>',
        )
        // Format headings (lines that end with a colon and are short)
        .replace(/^(.{1,30}):$/gm, '<span class="text-lg font-semibold text-white/95 metallic-text">$1:</span>')
        // Format scores and ratings
        .replace(/(\d{1,2}\/\d{1,2}|\d{1,3}\/100)/g, '<span class="font-mono text-blue-300 font-bold">$1</span>')
        // Format positive terms
        .replace(
          /(excellent|outstanding|strong|effective|compelling|impressive)/gi,
          '<span class="text-green-400 font-medium">$1</span>',
        )
        // Format negative terms
        .replace(
          /(weak|problematic|confusing|unclear|lacks|missing|fails)/gi,
          '<span class="text-red-400 font-medium">$1</span>',
        )
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <AnimatePresence>
        {lines.slice(0, visibleLines).map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration }}
            className={cn(
              "mb-2",
              line.trim().startsWith("#") ? "text-xl font-bold metallic-text" : "",
              line.trim().startsWith("##") ? "text-lg font-semibold metallic-text-subtle" : "",
              line.trim().startsWith("- ") ? "pl-4" : "",
            )}
          >
            {enableFormatting ? <div dangerouslySetInnerHTML={{ __html: formatText(line) }} /> : line}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

