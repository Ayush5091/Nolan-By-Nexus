"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CardContent } from "@/components/ui/card"
import { generateImage } from "@/app/actions"
import { Loader2, AlertCircle, ImageIcon, Wand2, Camera, Film } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GlassCard } from "@/components/glass-card"

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await generateImage(prompt)

      if (result.success && result.data) {
        setGeneratedImage(result.data)
      } else {
        setError(result.error || "Failed to generate image. Please try again.")
      }
    } catch (err) {
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <GlassCard className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="prompt" className="text-sm font-medium text-white/80">
              Describe your cinematic scene
            </label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a description of the cinematic scene you want to generate..."
                className="flex-1 bg-white/5 border-white/20 text-white"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !prompt.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt(prompt + " cinematic lighting")}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Film className="mr-1 h-3 w-3" />
              Cinematic lighting
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt(prompt + " film noir style")}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Film className="mr-1 h-3 w-3" />
              Film noir
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPrompt(prompt + " shallow depth of field")}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <Camera className="mr-1 h-3 w-3" />
              Shallow DoF
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
                {error.includes("exceeded") && (
                  <div className="mt-2">
                    <p className="font-semibold">Alternative options:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Try again later when your credits reset</li>
                      <li>Consider upgrading to Hugging Face Pro for more credits</li>
                      <li>Use a different image generation model or service</li>
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </GlassCard>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64 mb-6"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {generatedImage && !error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-video relative overflow-hidden rounded-md">
                  <img src={generatedImage || "/placeholder.svg"} alt={prompt} className="object-cover w-full h-full" />
                </div>
                <p className="mt-4 text-sm text-white/70 italic">"{prompt}"</p>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = generatedImage
                      link.download = `cinematic-scene-${Date.now()}.png`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    Download Image
                  </Button>
                </div>
              </CardContent>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!generatedImage && !error && !isLoading && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            poster="/placeholder.svg?height=720&width=1280"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-film-crew-on-set-34490-large.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center p-6 bg-black/60 backdrop-blur-sm rounded-lg max-w-md">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-white/70" />
              <p className="text-white/80">Enter a prompt above to generate a cinematic image</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

