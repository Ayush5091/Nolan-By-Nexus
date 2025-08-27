"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

export function ApiStatus() {
  const [status, setStatus] = useState<{
    valid: boolean
    issues: string[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkApiStatus() {
      try {
        const response = await fetch("/api/check-api-keys")
        const data = await response.json()
        setStatus(data)
      } catch (error) {
        console.error("Failed to check API status:", error)
        setStatus({
          valid: false,
          issues: ["Failed to check API configuration"],
        })
      } finally {
        setLoading(false)
      }
    }

    checkApiStatus()
  }, [])

  if (loading) {
    return <div className="text-sm text-white/50">Checking API configuration...</div>
  }

  if (!status) {
    return null
  }

  return (
    <div className={`mt-4 p-3 rounded-md ${status.valid ? "bg-green-900/20" : "bg-red-900/20"}`}>
      <div className="flex items-center">
        {status.valid ? (
          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
        ) : (
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
        )}
        <span className={status.valid ? "text-green-400" : "text-red-400"}>
          {status.valid ? "API configuration is valid" : "API configuration issues detected"}
        </span>
      </div>

      {!status.valid && status.issues.length > 0 && (
        <ul className="mt-2 text-sm text-red-300 ml-7">
          {status.issues.map((issue, index) => (
            <li key={index}>• {issue}</li>
          ))}
        </ul>
      )}

      {!status.valid && (
        <p className="mt-2 text-xs text-white/70 ml-7">
          Please configure the required API keys in your environment variables.
        </p>
      )}
    </div>
  )
}

