"use client"

import { X } from "lucide-react"

interface GenreTagProps {
  genre: string
  onRemove: () => void
}

export default function GenreTag({ genre, onRemove }: GenreTagProps) {
  return (
    <div className="inline-flex items-center bg-purple-900/50 text-white text-xs rounded-full px-3 py-1 border border-purple-500/30">
      <span>{genre}</span>
      <button onClick={onRemove} className="ml-2 text-white/70 hover:text-white" aria-label={`Remove ${genre} tag`}>
        <X size={12} />
      </button>
    </div>
  )
}

