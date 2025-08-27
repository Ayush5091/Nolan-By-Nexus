"use client"

export function NexusLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 2000 2000" className={`w-full h-full ${className}`} aria-label="Nexus Logo">
      <path d="M500,500h19c265.47,0,481,215.53,481,481v519h-500V500h0Z" fill="currentColor" />
      <path
        d="M1000,500h19c265.47,0,481,215.53,481,481v519h-500V500h0Z"
        transform="translate(2500 2000) rotate(180)"
        fill="currentColor"
      />
    </svg>
  )
}

