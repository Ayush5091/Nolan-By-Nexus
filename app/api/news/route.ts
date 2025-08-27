import { NextResponse } from "next/server"
import { getFallbackNewsData } from "@/services/fallback-data-service"

export async function GET(request: Request) {
  try {
    // Get fallback data instead of calling the News API
    const fallbackData = getFallbackNewsData()

    return NextResponse.json({
      status: "success",
      data: fallbackData,
      source: "fallback",
    })
  } catch (error) {
    console.error("Error in news API route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch news data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

