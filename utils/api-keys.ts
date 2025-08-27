// This file centralizes API key management
// In production, these should be environment variables

// Update the getNewsApiKey function to use only the environment variable
export const getNewsApiKey = () => {
  return process.env.NEWS_API_KEY || "demo-key"
}

export const getTmdbApiKey = () => {
  return process.env.TMDB_API_KEY || "demo-key"
}

// Update the getGeminiApiKey function (add this function)
export const getGeminiApiKey = () => {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
}

// Function to check if API keys are properly configured
export const validateApiKeys = () => {
  const newsApiKey = getNewsApiKey()
  const tmdbApiKey = getTmdbApiKey()

  const issues = []

  if (!newsApiKey || newsApiKey === "demo-key") {
    issues.push("NEWS_API_KEY is not configured")
  } else {
    // Add a note about NewsAPI limitations
    issues.push("NOTE: NewsAPI free tier only works in development and has limited requests")
  }

  if (!tmdbApiKey || tmdbApiKey === "demo-key") {
    issues.push("TMDB_API_KEY is not configured")
  }

  return {
    valid: issues.length === 0,
    issues,
  }
}

// Information about API limitations
export const getApiLimitations = () => {
  return {
    newsApi: {
      freeTier: {
        requestLimit: "100 requests per day",
        restrictions: "Developer plan can only be used in development, not in production",
        domains: "localhost only",
        note: "For production use, a paid subscription is required",
      },
    },
    tmdb: {
      freeTier: {
        requestLimit: "1000 requests per day",
        restrictions: "None for non-commercial use",
        note: "For high-volume commercial use, consider their paid options",
      },
    },
  }
}

