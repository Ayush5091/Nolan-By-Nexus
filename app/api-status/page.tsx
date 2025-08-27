import { ApiStatusDashboard } from "@/components/api-status-dashboard"

export default function ApiStatusPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">API Status</h1>
      <p className="text-center mb-8 text-muted-foreground max-w-2xl mx-auto">
        This page shows the status of all external APIs used by the application. Make sure all APIs are properly
        configured for full functionality.
      </p>

      <ApiStatusDashboard />

      <div className="mt-10 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">API Information</h2>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium">Google Gemini API</h3>
            <p className="text-sm text-muted-foreground">
              Used for AI-powered screenplay generation and analysis. Required for the Writer and Critic features.
            </p>
          </div>

          <div>
            <h3 className="font-medium">News API</h3>
            <p className="text-sm text-muted-foreground">
              Used to fetch media-related news for the Media Trends feature. The free tier only works in development
              environments.
            </p>
          </div>

          <div>
            <h3 className="font-medium">TMDB API</h3>
            <p className="text-sm text-muted-foreground">
              Used to fetch movie data for the Directorial Insights feature. Provides information about directors and
              their films.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

