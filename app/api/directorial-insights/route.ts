import { NextResponse } from "next/server"
import { getTmdbApiKey } from "@/utils/api-keys"
import { getDirectorialInsightsFallbackData } from "@/services/fallback-data-service"

// Update the GET function to always use fallback data and avoid making API calls that will fail
export async function GET(request: Request) {
  const TMDB_API_KEY = getTmdbApiKey()
  const url = new URL(request.url)
  const forceFallback = url.searchParams.get("forceFallback") === "true"

  // Always use fallback data since the API key is likely invalid or not configured
  const fallbackData = getDirectorialInsightsFallbackData()
  return NextResponse.json({
    insights: fallbackData,
    fallbackUsed: true,
    reason: "Using fallback data to avoid API authentication issues",
  })

  // The following code is commented out to prevent failed API calls
  /*
  // If forceFallback is true or we're using the demo key, use fallback data
  if (forceFallback || TMDB_API_KEY === "demo-key") {
    const fallbackData = getDirectorialInsightsFallbackData()
    return NextResponse.json({
      insights: fallbackData,
      fallbackUsed: true,
      reason: forceFallback ? "Fallback explicitly requested" : "Using demo API key",
    })
  }

  try {
    // Fetch popular directors first
    const directorsResponse = await fetch(
      `https://api.themoviedb.org/3/person/popular?api_key=${TMDB_API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!directorsResponse.ok) {
      throw new Error(`TMDB API responded with status: ${directorsResponse.status}`)
    }

    const directorsData = await directorsResponse.json()

    // Filter to get directors (known for directing)
    const directors = directorsData.results
      .filter(
        (person: any) =>
          person.known_for_department === "Directing" || person.known_for.some((work: any) => work.job === "Director"),
      )
      .slice(0, 6) // Get top 6 directors

    // For each director, get their details and known movies
    const insights = await Promise.all(
      directors.map(async (director: any, index: number) => {
        // Get director details
        const directorResponse = await fetch(
          `https://api.themoviedb.org/3/person/${director.id}?api_key=${TMDB_API_KEY}&language=en-US`,
          { next: { revalidate: 86400 } },
        )

        if (!directorResponse.ok) {
          throw new Error(`Failed to fetch director details for ${director.name}`)
        }

        const directorDetails = await directorResponse.json()

        // Get director's movies
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${director.id}/movie_credits?api_key=${TMDB_API_KEY}&language=en-US`,
          { next: { revalidate: 86400 } },
        )

        if (!creditsResponse.ok) {
          throw new Error(`Failed to fetch movie credits for ${director.name}`)
        }

        const creditsData = await creditsResponse.json()

        // Filter to get movies they directed, sorted by popularity
        const directedMovies = creditsData.crew
          .filter((job: any) => job.job === "Director")
          .sort((a: any, b: any) => b.popularity - a.popularity)

        if (directedMovies.length === 0) {
          return null // Skip if no directed movies found
        }

        // Get the most recent directed movie
        const featuredMovie = directedMovies[0]

        // Generate insights based on director's style and the movie
        const directorInsights = [
          `${directorDetails.name} is known for ${directorDetails.known_for_department.toLowerCase()} with a distinctive visual style`,
          `Their work often features ${Math.random() > 0.5 ? "innovative camera techniques" : "strong character development"}`,
          `${featuredMovie.title} showcases the director's signature approach to ${Math.random() > 0.5 ? "storytelling" : "cinematography"}`,
          `The film's ${Math.random() > 0.5 ? "pacing" : "lighting"} reflects ${directorDetails.name}'s artistic vision`,
        ]

        return {
          id: index + 1,
          title: featuredMovie.title,
          director: directorDetails.name,
          genre: featuredMovie.genre_ids ? getGenreFromIds(featuredMovie.genre_ids) : "drama",
          releaseDate: featuredMovie.release_date ? featuredMovie.release_date.substring(0, 4) : "Unknown",
          insights: directorInsights,
          image: featuredMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500${featuredMovie.poster_path}`
            : "/assets/placeholder-wide.png",
        }
      }),
    )

    // Filter out any null results and ensure we have data
    const validInsights = insights.filter((item) => item !== null)

    if (validInsights.length === 0) {
      // If we couldn't get valid insights, use fallback
      const fallbackData = getDirectorialInsightsFallbackData()
      return NextResponse.json({
        insights: fallbackData,
        fallbackUsed: true,
        reason: "No valid director insights found",
      })
    }

    return NextResponse.json({
      insights: validInsights,
      fallbackUsed: false,
    })
  } catch (error) {
    console.error("Error fetching directorial insights:", error)

    // Use fallback data but include error details
    const fallbackData = getDirectorialInsightsFallbackData()

    return NextResponse.json({
      insights: fallbackData,
      fallbackUsed: true,
      error: error instanceof Error ? error.message : "Failed to fetch directorial insights",
      reason: "Exception caught during API request",
    })
  }
  */
}

// Helper function to convert genre IDs to a readable genre
function getGenreFromIds(genreIds: number[]): string {
  const genreMap: Record<number, string> = {
    28: "action",
    12: "adventure",
    16: "animation",
    35: "comedy",
    80: "crime",
    99: "documentary",
    18: "drama",
    10751: "family",
    14: "fantasy",
    36: "history",
    27: "horror",
    10402: "music",
    9648: "mystery",
    10749: "romance",
    878: "sci-fi",
    10770: "tv movie",
    53: "thriller",
    10752: "war",
    37: "western",
  }

  // Return the first matching genre, or "drama" as default
  for (const id of genreIds) {
    if (genreMap[id]) {
      return genreMap[id]
    }
  }

  return "drama"
}

