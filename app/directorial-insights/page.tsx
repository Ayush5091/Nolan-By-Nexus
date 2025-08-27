"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertTriangle, Info, Star, Calendar, TrendingUp } from "lucide-react"
import Image from "next/image"
import type { MovieData } from "@/services/fallback-data-service"

export default function DirectorialInsightsPage() {
  const [movieData, setMovieData] = useState<MovieData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"fallback" | "api">("fallback")
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const fetchMovieData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/movies")

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === "error") {
        throw new Error(data.message || "Unknown error occurred")
      }

      setMovieData(data.data)
      setDataSource(data.source || "fallback")
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Error fetching movie data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovieData()
  }, [])

  const handleRefresh = () => {
    fetchMovieData()
  }

  // Helper function to get genre name from ID
  const getGenreName = (genreId: number): string => {
    const genres: Record<number, string> = {
      1: "Action",
      2: "Adventure",
      3: "Animation",
      4: "Comedy",
      5: "Crime",
      6: "Documentary",
      7: "Drama",
      8: "Family",
      9: "Fantasy",
      10: "History",
    }

    return genres[genreId] || "Unknown"
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Directorial Insights</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">Last refreshed: {lastRefreshed.toLocaleTimeString()}</div>
          <Button onClick={handleRefresh} disabled={isLoading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {dataSource === "fallback" && (
        <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Using Sample Data</AlertTitle>
          <AlertDescription>
            You're currently viewing sample data. This is automatically generated content for demonstration purposes.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Films</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="acclaimed">Acclaimed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-4 w-1/3" />
                      </CardFooter>
                    </Card>
                  ))
              : movieData.map((movie) => (
                  <Card key={movie.id} className="overflow-hidden flex flex-col">
                    <div className="relative h-64 w-full">
                      <Image
                        src={movie.poster_path || "/placeholder.svg?height=300&width=200&text=Movie"}
                        alt={movie.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{movie.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {movie.release_date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm line-clamp-3">{movie.overview}</p>
                      <div className="flex items-center mt-4 gap-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm">{Math.round(movie.popularity)}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                      {movie.genre_ids.map((genreId) => (
                        <Badge key={genreId} variant="outline">
                          {getGenreName(genreId)}
                        </Badge>
                      ))}
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                    </Card>
                  ))
              : // Sort by release date (newest first)
                [...movieData]
                  .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
                  .slice(0, 6)
                  .map((movie) => (
                    <Card key={movie.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-64 w-full">
                        <Image
                          src={movie.poster_path || "/placeholder.svg?height=300&width=200&text=Recent"}
                          alt={movie.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{movie.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {movie.release_date}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{movie.overview}</p>
                        <div className="flex items-center mt-4 gap-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        {movie.genre_ids.map((genreId) => (
                          <Badge key={genreId} variant="outline">
                            {getGenreName(genreId)}
                          </Badge>
                        ))}
                      </CardFooter>
                    </Card>
                  ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                    </Card>
                  ))
              : // Sort by popularity (highest first)
                [...movieData]
                  .sort((a, b) => b.popularity - a.popularity)
                  .slice(0, 6)
                  .map((movie) => (
                    <Card key={movie.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-64 w-full">
                        <Image
                          src={movie.poster_path || "/placeholder.svg?height=300&width=200&text=Popular"}
                          alt={movie.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{movie.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Popularity: {Math.round(movie.popularity)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{movie.overview}</p>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        {movie.genre_ids.map((genreId) => (
                          <Badge key={genreId} variant="outline">
                            {getGenreName(genreId)}
                          </Badge>
                        ))}
                      </CardFooter>
                    </Card>
                  ))}
          </div>
        </TabsContent>

        <TabsContent value="acclaimed" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-64 w-full" />
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                    </Card>
                  ))
              : // Sort by vote average (highest first)
                [...movieData]
                  .sort((a, b) => b.vote_average - a.vote_average)
                  .slice(0, 6)
                  .map((movie) => (
                    <Card key={movie.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-64 w-full">
                        <Image
                          src={movie.poster_path || "/placeholder.svg?height=300&width=200&text=Acclaimed"}
                          alt={movie.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{movie.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Rating: {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{movie.overview}</p>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2">
                        {movie.genre_ids.map((genreId) => (
                          <Badge key={genreId} variant="outline">
                            {getGenreName(genreId)}
                          </Badge>
                        ))}
                      </CardFooter>
                    </Card>
                  ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

