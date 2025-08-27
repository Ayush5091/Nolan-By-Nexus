"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Tag, Calendar, User } from "lucide-react"
import { GlassCard } from "@/components/glass-card"

interface DirectorialInsight {
  id: number
  title: string
  director: string
  genre: string
  releaseDate: string
  insights: string[]
  image: string
}

export default function DirectorialInsightsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<DirectorialInsight[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [movieData, setMovieData] = useState<DirectorialInsight[]>([])
  const [dataSource, setDataSource] = useState<string>("api")
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  useEffect(() => {
    const fetchDirectorialInsights = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/directorial-insights")

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.status === "error") {
          throw new Error(data.message || "Unknown error occurred")
        }

        setMovieData(data.insights || [])
        setDataSource(data.source || "fallback")
        setLastRefreshed(new Date())
      } catch (err) {
        console.error("Error fetching directorial insights:", err)
        // Don't set error message to avoid showing error alert
        // setError(err instanceof Error ? err.message : "An unknown error occurred")

        // Instead, just use empty array for movie data
        setMovieData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDirectorialInsights()
  }, [])

  // Only filter insights if we have data
  const filteredInsights =
    movieData.length > 0
      ? selectedGenre === "all"
        ? movieData
        : movieData.filter((insight) => insight.genre === selectedGenre)
      : []

  // Dynamically generate genre filters based on available data
  const availableGenres = ["all", ...new Set(movieData.map((insight) => insight.genre))]
  const genres = availableGenres.map((genre) => ({
    id: genre,
    name: genre === "all" ? "All Genres" : genre.charAt(0).toUpperCase() + genre.slice(1),
  }))

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
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">Directorial Insights</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Gain valuable insights into directorial choices, scene composition, and narrative structure from recent and
            upcoming films.
          </p>
        </motion.div>

        {/* Genre filters - only show if we have insights */}
        {movieData.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedGenre === genre.id ? "bg-white/20 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
                onClick={() => setSelectedGenre(genre.id)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center mb-8 p-4 bg-red-500/20 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : filteredInsights.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredInsights.map((insight) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="h-full overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/3 h-48 md:h-auto relative">
                      <img
                        src={insight.image || "/assets/placeholder-wide.png"}
                        alt={insight.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          ;(e.target as HTMLImageElement).src = "/assets/placeholder-wide.png"
                        }}
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h3 className="text-2xl font-bold mb-2">{insight.title}</h3>

                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="flex items-center text-sm text-white/70">
                          <User className="w-4 h-4 mr-1" />
                          {insight.director}
                        </div>
                        <div className="flex items-center text-sm text-white/70">
                          <Tag className="w-4 h-4 mr-1" />
                          {insight.genre}
                        </div>
                        <div className="flex items-center text-sm text-white/70">
                          <Calendar className="w-4 h-4 mr-1" />
                          {insight.releaseDate}
                        </div>
                      </div>

                      <h4 className="font-semibold mb-2 text-white/90">Directorial Techniques:</h4>
                      <ul className="space-y-2">
                        {insight.insights.map((item, idx) => (
                          <li key={idx} className="text-sm text-white/80 flex">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/70">
              {selectedGenre !== "all"
                ? "No insights found for this genre. Try another genre."
                : "No directorial insights available at this time. Please check back later."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

