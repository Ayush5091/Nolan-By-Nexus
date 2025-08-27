"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface MaterialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

const MaterialButton = forwardRef<HTMLButtonElement, MaterialButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative overflow-hidden rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
          "after:absolute after:h-px after:top-0 after:left-0 after:right-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent",
          {
            "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]": variant === "default",
            "bg-transparent border border-white/20 text-white hover:bg-white/10": variant === "outline",
            "bg-transparent text-white hover:bg-white/10": variant === "ghost",
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3": size === "sm",
            "h-11 px-8": size === "lg",
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
MaterialButton.displayName = "MaterialButton"

export { MaterialButton }

