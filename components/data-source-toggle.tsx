"use client"
import { Cloud, Database } from "lucide-react"

interface DataSourceToggleProps {
  isLive: boolean
  onToggle: (useLiveData: boolean) => void
  disabled?: boolean
}

export function DataSourceToggle({ isLive, onToggle, disabled = false }: DataSourceToggleProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-white/5 rounded-full p-1 flex">
        <button
          className={`flex items-center px-4 py-2 rounded-full transition-colors ${
            isLive ? "bg-white/20 text-white" : "bg-transparent text-white/70 hover:text-white"
          }`}
          onClick={() => onToggle(true)}
          disabled={disabled || isLive}
          title={disabled ? "Live data currently unavailable" : "Use live data from API"}
        >
          <Cloud className="w-4 h-4 mr-2" />
          <span>Live Data</span>
        </button>

        <button
          className={`flex items-center px-4 py-2 rounded-full transition-colors ${
            !isLive ? "bg-white/20 text-white" : "bg-transparent text-white/70 hover:text-white"
          }`}
          onClick={() => onToggle(false)}
          disabled={disabled || !isLive}
          title="Use sample data"
        >
          <Database className="w-4 h-4 mr-2" />
          <span>Sample Data</span>
        </button>
      </div>
    </div>
  )
}

