"use client"

import type { ReactNode } from "react"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import MobileSplashScreen from "@/components/mobile-splash-screen"

export default function MobileDetectionWrapper({ children }: { children: ReactNode }) {
  const { isMobile, isClient } = useMobileDetection()

  // During server-side rendering, render children
  // This prevents hydration mismatch
  if (!isClient) {
    return <>{children}</>
  }

  // On mobile devices, show only the mobile splash screen
  if (isMobile) {
    return <MobileSplashScreen />
  }

  // On desktop, show the full site
  return <>{children}</>
}

