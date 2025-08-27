"use client"

import { useState, useEffect } from "react"

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      // Check if the device is mobile based on screen width and user agent
      const isMobileByWidth = window.innerWidth < 768
      const isMobileByAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      setIsMobile(isMobileByWidth || isMobileByAgent)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return { isMobile, isClient }
}

