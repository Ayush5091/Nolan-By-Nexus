"use client"

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Film, Tv, Camera, RefreshCw } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
// Remove this import: import { DataSourceToggle } from "@/components/data-source-toggle"

interface MediaTrend {
  id: number
  title: string
  description: string
  source: string
  url: string
  category: string
  date: string
  image: string
}

// Update the component to always fetch live data
export default function MediaTrendsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mediaTrends, setMediaTrends] = useState<MediaTrend[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("all")
  // Remove this state: const [usingLiveData, setUsingLiveData] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [showDebugInfo, setShowDebugInfo] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})

  const CACHE_KEY = "media-trends-data"
  const CACHE_TTL = 3600 // 1 hour in seconds

  const fetchMediaTrends = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/media-trends")

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      // Check if we have trends data in the response
      if (data.trends && Array.isArray(data.trends)) {
        setMediaTrends(data.trends)
        setLastUpdated(new Date())
      } else {
        throw new Error("Invalid data format received from API")
      }
    } catch (err) {
      console.error("Error fetching media trends:", err)
      setError("Error loading data. Please try refreshing the page.")
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchMediaTrends()
  }, [])

  // Handle refresh button click
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchMediaTrends()
  }, [])

  const filteredTrends =
    activeCategory === "all" ? mediaTrends : mediaTrends.filter((trend) => trend.category === activeCategory)

  const categories = [
    { id: "all", name: "All", icon: <Film className="w-4 h-4 mr-2" /> },
    { id: "technology", name: "Technology", icon: <Tv className="w-4 h-4 mr-2" /> },
    { id: "equipment", name: "Equipment", icon: <Camera className="w-4 h-4 mr-2" /> },
    { id: "industry", name: "Industry", icon: <ExternalLink className="w-4 h-4 mr-2" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Update the back link to point to the home section */}
        <div className="mb-8">
          <Link href="/#home" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">Media Related Trends</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Stay updated with the latest trends in filmmaking, cinematography, and storytelling techniques.
          </p>
        </motion.div>

        {/* Remove the DataSourceToggle component */}

        {/* Refresh button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`flex items-center px-4 py-2 rounded-full transition-colors ${
                activeCategory === category.id ? "bg-white/20 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center mb-8 p-4 bg-red-500/20 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : filteredTrends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrends.map((trend) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <GlassCard className="h-full overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trend.image || "/assets/placeholder-wide.png"}
                      alt={trend.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        ;(e.target as HTMLImageElement).src = "/assets/placeholder-wide.png"
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-xs px-2 py-1 rounded">{trend.category}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{trend.title}</h3>
                    <p className="text-white/70 mb-4 text-sm">{trend.description}</p>
                    <div className="flex justify-between items-center text-xs text-white/50">
                      <span>{trend.source}</span>
                      <span>{trend.date}</span>
                    </div>
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-white hover:text-white/80 text-sm"
                    >
                      Read more <ExternalLink className="ml-1 w-3 h-3" />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70">No trends found for this category. Try another category.</p>
          </div>
        )}

        {/* Last updated timestamp */}
        {lastUpdated && (
          <div className="text-center mt-8 text-white/50 text-sm">Last updated: {lastUpdated.toLocaleString()}</div>
        )}
      </div>
    </div>
  )
}

