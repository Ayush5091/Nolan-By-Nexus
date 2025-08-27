"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"

type ApiStatus = {
  name: string
  status: "active" | "inactive" | "limited" | "checking"
  message: string
}

export function ApiStatusDashboard() {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([
    { name: "Gemini API", status: "checking", message: "Checking status..." },
    { name: "News API", status: "checking", message: "Checking status..." },
    { name: "TMDB API", status: "checking", message: "Checking status..." },
  ])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkApiStatus = async () => {
    setIsRefreshing(true)

    try {
      const response = await fetch("/api/check-api-keys")
      const data = await response.json()

      const newStatuses: ApiStatus[] = [
        {
          name: "Gemini API",
          status: data.gemini.valid ? "active" : "inactive",
          message: data.gemini.message,
        },
        {
          name: "News API",
          status: data.newsApi.valid ? (data.newsApi.limited ? "limited" : "active") : "inactive",
          message: data.newsApi.message,
        },
        {
          name: "TMDB API",
          status: data.tmdb.valid ? "active" : "inactive",
          message: data.tmdb.message,
        },
      ]

      setApiStatuses(newStatuses)
    } catch (error) {
      console.error("Failed to check API status:", error)
      setApiStatuses((prev) =>
        prev.map((api) => ({
          ...api,
          status: "inactive",
          message: "Failed to check status",
        })),
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "inactive":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "limited":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge className="bg-red-500">Inactive</Badge>
      case "limited":
        return <Badge className="bg-yellow-500">Limited</Badge>
      default:
        return <Badge className="bg-blue-500">Checking</Badge>
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>API Status Dashboard</CardTitle>
        <CardDescription>Check the status of all external APIs used by the application</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiStatuses.map((api) => (
            <div key={api.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(api.status)}
                <div>
                  <h3 className="font-medium">{api.name}</h3>
                  <p className="text-sm text-muted-foreground">{api.message}</p>
                </div>
              </div>
              {getStatusBadge(api.status)}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkApiStatus} disabled={isRefreshing} className="flex items-center gap-2">
          {isRefreshing && <RefreshCw className="h-4 w-4 animate-spin" />}
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </Button>
      </CardFooter>
    </Card>
  )
}

