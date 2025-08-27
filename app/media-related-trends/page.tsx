"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertTriangle, Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { NewsArticle } from "@/services/fallback-data-service"

export default function MediaRelatedTrendsPage() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<"fallback" | "api">("fallback")
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const fetchNewsData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/news")

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status === "error") {
        throw new Error(data.message || "Unknown error occurred")
      }

      setNewsData(data.data)
      setDataSource(data.source || "fallback")
      setLastRefreshed(new Date())
    } catch (err) {
      console.error("Error fetching news data:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNewsData()
  }, [])

  const handleRefresh = () => {
    fetchNewsData()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Related Trends</h1>
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
          <TabsTrigger value="all">All News</TabsTrigger>
          <TabsTrigger value="films">Films</TabsTrigger>
          <TabsTrigger value="directors">Directors</TabsTrigger>
          <TabsTrigger value="industry">Industry</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
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
              : newsData.map((article) => (
                  <Card key={article.id} className="overflow-hidden flex flex-col">
                    <div className="relative h-48 w-full">
                      <Image
                        src={article.image || "/placeholder.svg?height=200&width=400&text=News"}
                        alt={article.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription>
                        {new Date(article.publishedAt).toLocaleDateString()} • {article.source.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm line-clamp-3">{article.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline">Media</Badge>
                      <Link
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Read more
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </TabsContent>

        <TabsContent value="films" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
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
              : // Filter articles related to films
                newsData
                  .filter(
                    (article) =>
                      article.title.toLowerCase().includes("film") ||
                      article.description.toLowerCase().includes("film") ||
                      article.title.toLowerCase().includes("cinema") ||
                      article.description.toLowerCase().includes("cinema"),
                  )
                  .map((article) => (
                    <Card key={article.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.image || "/placeholder.svg?height=200&width=400&text=Film"}
                          alt={article.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                        <CardDescription>
                          {new Date(article.publishedAt).toLocaleDateString()} • {article.source.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{article.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Badge variant="outline">Film</Badge>
                        <Link
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Read more
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
          </div>
        </TabsContent>

        <TabsContent value="directors" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
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
              : // Filter articles related to directors
                newsData
                  .filter(
                    (article) =>
                      article.title.toLowerCase().includes("director") ||
                      article.description.toLowerCase().includes("director") ||
                      article.title.toLowerCase().includes("nolan") ||
                      article.description.toLowerCase().includes("nolan"),
                  )
                  .map((article) => (
                    <Card key={article.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.image || "/placeholder.svg?height=200&width=400&text=Director"}
                          alt={article.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                        <CardDescription>
                          {new Date(article.publishedAt).toLocaleDateString()} • {article.source.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{article.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Badge variant="outline">Director</Badge>
                        <Link
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Read more
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
          </div>
        </TabsContent>

        <TabsContent value="industry" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? // Skeleton loading state
                Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <Card key={index} className="overflow-hidden">
                      <Skeleton className="h-48 w-full" />
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
              : // Filter articles related to the industry
                newsData
                  .filter(
                    (article) =>
                      article.title.toLowerCase().includes("industry") ||
                      article.description.toLowerCase().includes("industry") ||
                      article.title.toLowerCase().includes("box office") ||
                      article.description.toLowerCase().includes("box office"),
                  )
                  .map((article) => (
                    <Card key={article.id} className="overflow-hidden flex flex-col">
                      <div className="relative h-48 w-full">
                        <Image
                          src={article.image || "/placeholder.svg?height=200&width=400&text=Industry"}
                          alt={article.title}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                        <CardDescription>
                          {new Date(article.publishedAt).toLocaleDateString()} • {article.source.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-sm line-clamp-3">{article.description}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Badge variant="outline">Industry</Badge>
                        <Link
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Read more
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

