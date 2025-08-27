"use client"
import { ImageGenerator } from "@/components/image-generator"
import { SimpleFilmRollLoader } from "@/components/simple-film-roll-loader"
import FloatingPaths from "@/components/floating-paths"
import { Suspense } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ImageGeneratorPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>

      {/* Floating paths background animation */}
      <div className="absolute inset-0 z-0 opacity-30">
        <FloatingPaths />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-8">
          <Link href="/#home" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Features</span>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">Cinematic Image Generator</h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Create stunning cinematic visuals with AI. Perfect for storyboarding, concept art, or visual inspiration.
            </p>
          </div>

          <Suspense fallback={<SimpleFilmRollLoader />}>
            <ImageGenerator />
          </Suspense>

          <div className="mt-12 glass p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Tips for better results</h2>
            <ul className="list-disc pl-5 space-y-2 text-white/80">
              <li>Be specific about the visual style (e.g., "cinematic lighting", "film noir style")</li>
              <li>Include details about camera angle, lighting, and mood</li>
              <li>Use negative prompts to avoid unwanted elements</li>
              <li>Experiment with different aspect ratios for different types of shots</li>
              <li>Add director-specific references (e.g., "in the style of Christopher Nolan")</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

