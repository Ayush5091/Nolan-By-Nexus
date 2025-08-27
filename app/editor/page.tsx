"use client"

import { useState, useEffect } from "react"
import ScreenplayEditor from "./screenplay-editor";
import { Button } from "@/components/ui/button"
import { Loader2, Save, Share } from "lucide-react"
import Navbar from "@/components/navbar" // Changed to default import
import { progressService, type ScreenplayProgress } from "@/services/progress-service"
import { useToast } from "@/hooks/use-toast"

export default function EditorPage() {
  const { toast } = useToast()
  const [screenplay, setScreenplay] = useState<string>("")
  const [title, setTitle] = useState<string>("Untitled Screenplay")
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [screenplayId, setScreenplayId] = useState<string>(`screenplay-${Date.now()}`)

  // Load auto-save preference
  useEffect(() => {
    const savedAutoSave = localStorage.getItem("autoSave") !== "false" // Default to true
    setAutoSaveEnabled(savedAutoSave)
  }, [])

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !screenplay) return

    const autoSaveTimer = setTimeout(() => {
      saveScreenplay(true)
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(autoSaveTimer)
  }, [screenplay, autoSaveEnabled])

  const saveScreenplay = async (isAutoSave = false) => {
    if (!screenplay.trim()) {
      toast({
        title: "Empty screenplay",
        description: "Cannot save an empty screenplay",
        variant: "destructive",
      })
      return
    }

    if (!isAutoSave) {
      setIsSaving(true)
    }

    try {
      // Calculate completion percentage (simplified example)
      const totalScenes = screenplay.split("EXT.").length + screenplay.split("INT.").length - 2
      const completionPercentage = Math.min(100, Math.max(5, totalScenes * 10))

      // Calculate word count
      const wordCount = screenplay.split(/\s+/).filter((word) => word.length > 0).length

      const screenplayProgress: ScreenplayProgress = {
        id: screenplayId,
        title,
        lastEdited: new Date(),
        completionPercentage,
        wordCount,
      }

      await progressService.saveScreenplayProgress("user-id-placeholder", screenplayProgress)

      if (!isAutoSave) {
        toast({
          title: "Screenplay saved",
          description: "Your screenplay has been saved successfully",
        })
      }
    } catch (error) {
      console.error("Error saving screenplay:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your screenplay",
        variant: "destructive",
      })
    } finally {
      if (!isAutoSave) {
        setIsSaving(false)
      }
    }
  }

  const handleShare = () => {
    // Implement sharing functionality
    toast({
      title: "Share feature",
      description: "Sharing functionality will be implemented soon",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 container py-6">
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0 w-full max-w-md"
            placeholder="Screenplay Title"
          />

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare} disabled={isSaving}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>

            <Button onClick={() => saveScreenplay()} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>

        <ScreenplayEditor />

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
          <p className="text-sm">
            <strong>Note:</strong> You are not logged in. Your screenplay will not be saved. Please log in to save
            your progress.
          </p>
        </div>
      </main>
    </div>
  )
}

