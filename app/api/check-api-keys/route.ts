import { NextResponse } from "next/server"
import { getNewsApiKey, getTmdbApiKey, getGeminiApiKey } from "@/utils/api-keys"

export async function GET() {
  const newsApiKey = getNewsApiKey()
  const tmdbApiKey = getTmdbApiKey()
  const geminiApiKey = getGeminiApiKey()

  // Check Gemini API
  let geminiStatus = {
    valid: false,
    message: "API key not configured",
  }

  if (geminiApiKey && geminiApiKey !== "demo-key") {
    try {
      // We can't directly test the Gemini API here as it requires client-side
      // So we just check if the key exists and has proper format
      geminiStatus = {
        valid: geminiApiKey.startsWith("AIza"),
        message: geminiApiKey.startsWith("AIza") ? "API key is properly configured" : "API key has invalid format",
      }
    } catch (error) {
      geminiStatus.message = error instanceof Error ? error.message : "Unknown error checking Gemini API"
    }
  }

  // Check News API
  let newsApiStatus = {
    valid: false,
    limited: false,
    message: "API key not configured",
  }

  if (newsApiKey && newsApiKey !== "demo-key") {
    try {
      const response = await fetch("https://newsapi.org/v2/everything?q=test&pageSize=1", {
        headers: {
          "X-Api-Key": newsApiKey,
        },
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        newsApiStatus = {
          valid: true,
          limited: false,
          message: "API is working correctly",
        }
      } else {
        const errorData = await response.json()
        newsApiStatus = {
          valid: false,
          limited: false,
          message: `Error: ${errorData.message || response.statusText}`,
        }

        // Check for developer plan limitations
        if (response.status === 426 || (errorData.message && errorData.message.includes("developer"))) {
          newsApiStatus = {
            valid: true,
            limited: true,
            message: "Developer plan detected - only works in development environment",
          }
        }
      }
    } catch (error) {
      newsApiStatus.message = error instanceof Error ? error.message : "Unknown error checking News API"
    }
  }

  // Check TMDB API
  let tmdbStatus = {
    valid: false,
    message: "API key not configured",
  }

  if (tmdbApiKey && tmdbApiKey !== "demo-key") {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&language=en-US&page=1`,
        { cache: "no-store" },
      )

      if (response.ok) {
        tmdbStatus = {
          valid: true,
          message: "API is working correctly",
        }
      } else {
        const errorData = await response.json()
        tmdbStatus = {
          valid: false,
          message: `Error: ${errorData.status_message || response.statusText}`,
        }
      }
    } catch (error) {
      tmdbStatus.message = error instanceof Error ? error.message : "Unknown error checking TMDB API"
    }
  }

  return NextResponse.json({
    gemini: geminiStatus,
    newsApi: newsApiStatus,
    tmdb: tmdbStatus,
  })
}

