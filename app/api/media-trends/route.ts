import { NextResponse } from "next/server"
import { getNewsApiKey } from "@/utils/api-keys"
import { getMediaTrendsFallbackData } from "@/services/fallback-data-service"

// Update the GET function to attempt to fetch live data first
export async function GET(request: Request) {
  const NEWS_API_KEY = getNewsApiKey()

  try {
    // Attempt to fetch live data from the News API
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=filmmaking OR cinematography OR "film technology" OR "movie production"&language=en&sortBy=publishedAt&pageSize=12`,
      {
        headers: {
          "X-Api-Key": NEWS_API_KEY,
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      },
    )

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Check if we got valid articles
    if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
      throw new Error("No articles returned from API")
    }

    // Transform the data to match our application's format
    const formattedTrends = data.articles.map((article: any, index: number) => {
      // Categorize articles based on content
      let category = "industry"
      const title = article.title.toLowerCase()
      const description = article.description?.toLowerCase() || ""

      if (
        title.includes("technology") ||
        description.includes("technology") ||
        title.includes("virtual") ||
        description.includes("virtual")
      ) {
        category = "technology"
      } else if (
        title.includes("camera") ||
        description.includes("camera") ||
        title.includes("equipment") ||
        description.includes("equipment") ||
        title.includes("lens") ||
        description.includes("lens")
      ) {
        category = "equipment"
      } else if (
        title.includes("software") ||
        description.includes("software") ||
        title.includes("app") ||
        description.includes("app") ||
        title.includes("ai") ||
        description.includes("ai")
      ) {
        category = "software"
      }

      return {
        id: index + 1,
        title: article.title,
        description: article.description || "No description available",
        source: article.source.name,
        url: article.url,
        category: category,
        date: new Date(article.publishedAt).toISOString().split("T")[0],
        image: article.urlToImage || "/assets/placeholder-wide.png",
      }
    })

    return NextResponse.json({
      trends: formattedTrends,
      fallbackUsed: false,
    })
  } catch (error) {
    console.error("Error fetching media trends:", error)

    // Use fallback data as a last resort
    const fallbackData = getMediaTrendsFallbackData(12)

    return NextResponse.json({
      trends: fallbackData,
      fallbackUsed: true,
      error: error instanceof Error ? error.message : "Failed to fetch media trends",
    })
  }
}

