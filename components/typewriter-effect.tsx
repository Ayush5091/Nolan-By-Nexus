"use client"

import { useState, useEffect, useRef } from "react"

interface TypewriterEffectProps {
  text: string
  speed?: number
  onComplete?: () => void
}

export default function TypewriterEffect({ text, speed = 1, onComplete }: TypewriterEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const hasStartedRef = useRef(false)
  const completedTextRef = useRef("")

  useEffect(() => {
    // If the text has changed completely, reset
    if (completedTextRef.current !== text) {
      hasStartedRef.current = false
      completedTextRef.current = text
      setDisplayedText("")
      setIsComplete(false)
    }

    // Only start the animation once
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    let currentIndex = 0
    const textLength = text.length

    const interval = setInterval(() => {
      if (currentIndex < textLength) {
        setDisplayedText(text.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      {displayedText}
      {!isComplete && <span className="typewriter-cursor">|</span>}
    </div>
  )
}

