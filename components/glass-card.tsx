"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div className={cn("glass material-card relative rounded-lg overflow-hidden", className)} onClick={onClick}>
      <div className="glass-highlight"></div>
      <div className="relative z-10">{children}</div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30 pointer-events-none"></div>
    </div>
  )
}

