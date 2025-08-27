import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      status: "success",
      data: [],
      source: "fallback",
    })
  } catch (error) {
    console.error("Error in movies API route:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch movie data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

