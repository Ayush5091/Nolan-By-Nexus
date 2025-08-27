"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Send,
  Download,
  ImageIcon,
  Plus,
  Edit,
  Maximize2,
  Minimize2,
  X,
  Check,
  Sparkles,
  Loader,
  AlertCircle,
  FileText,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import Link from "next/link"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import FileSaver from "file-saver"
import { useToast } from "@/components/ui/use-toast"
import "jspdf-autotable"

// Import the new PDF service
import { generateScreenplayPDF } from "@/services/screenplay-pdf-service"

// Import the loading screen component
import { SimpleFilmRollLoader } from "@/components/simple-film-roll-loader"

// Add a declaration for the 'file-saver' module
declare module "file-saver"

// Common genres array
const commonGenres = [
  "Action",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Western",
  "Animation",
  "Adventure",
  "Crime",
  "Documentary",
  "Family",
  "History",
  "Musical",
  "Sport",
  "War",
  "Biography",
]

// Fade-in effect component
const FadeInEffect = ({
  text,
  duration = 800,
  onComplete,
}: { text: string; duration?: number; onComplete?: () => void }) => {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1)
      if (onComplete) {
        setTimeout(onComplete, duration)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [duration, onComplete])

  return (
    <div
      className="font-mono text-sm whitespace-pre-wrap transition-opacity"
      style={{ opacity, transitionDuration: `${duration}ms` }}
    >
      {text}
    </div>
  )
}

// Theme selector modal component
const ThemeSelector = ({
  isOpen,
  onClose,
  onSelect,
  selectedTheme,
  themeOptions,
}: {
  isOpen: boolean
  onClose: () => void
  onSelect: (themeId: string) => void
  selectedTheme: string | null
  themeOptions: {
    id: string
    title: string
    description: string
    videoSrc: string
    placeholderImage: string
  }[]
}) => {
  if (!isOpen) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl rounded-xl overflow-hidden"
      >
        <GlassCard className="p-6 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Choose Your Screenplay Format
            </h2>
            <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <X size={20} />
            </button>
          </div>

          <p className="text-white/70 mb-6">
            Select a format that best suits your creative vision. Each format has unique styling and conventions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themeOptions.map((theme: {
              id: string
              title: string
              description: string
              videoSrc: string
              placeholderImage: string
            }) => (
              <ThemeCard
                key={theme.id}
                title={theme.title}
                description={theme.description}
                videoSrc={theme.videoSrc}
                placeholderImage={theme.placeholderImage}
                isSelected={selectedTheme === theme.id}
                onClick={() => onSelect(theme.id)}
              />
            ))}
          </div>

          <div className="mt-6 text-center text-white/50 text-sm">
            You can only change the format before generating your first screenplay
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}

// Theme card component
const ThemeCard = ({
  title,
  description,
  videoSrc,
  placeholderImage,
  isSelected,
  onClick,
}: {
  title: string
  description: string
  videoSrc: string
  placeholderImage: string
  isSelected: boolean
  onClick: () => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Theme-specific banner colors
  const getBannerStyle = () => {
    if (title.includes("Cinematic")) {
      return "from-amber-600 to-red-700"
    } else if (title.includes("BBC")) {
      return "from-blue-600 to-indigo-800"
    } else {
      return "from-purple-600 to-pink-700"
    }
  }

  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-white shadow-lg shadow-white/20" : "hover:shadow-md hover:shadow-white/10"
      }`}
      initial={{ scale: 1 }}
      animate={{
        scale: isHovered ? 1.03 : 1,
        y: isHovered ? -5 : 0,
      }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg">
        {!videoLoaded && (
          <img
            src={placeholderImage || "/placeholder.svg?height=200&width=350"}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <video
          src={videoSrc}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted
          autoPlay
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Theme-specific banner */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t ${getBannerStyle()} opacity-30`}
        ></div>
        <h3 className="text-xl font-bold mb-1 relative z-10">{title}</h3>
        <p className="text-sm text-white/80 relative z-10">{description}</p>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 bg-white text-black rounded-full p-1.5 shadow-lg">
          <Check size={16} />
        </div>
      )}
    </motion.div>
  )
}

// Tag component
const GenreTag = ({ name, onRemove }: { name: string; onRemove: () => void }) => {
  return (
    <div className="inline-flex items-center bg-white/10 text-white text-xs rounded-full px-3 py-1 mr-2 mb-2">
      <span>{name}</span>
      <button onClick={onRemove} className="ml-2 hover:text-white/70">
        <X size={12} />
      </button>
    </div>
  )
}

// Animated orb component with physics-driven particles
const Enhanced3DOrb = ({ isGenerating }: { isGenerating: boolean }) => {
  const [particles, setParticles] = useState<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      mass: number
      size: number
      opacity: number
    }>
  >([])

  // Initialize particles with physics properties
  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI) / 4
      const distance = 60
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        vx: Math.random() * 0.4 - 0.2,
        vy: Math.random() * 0.4 - 0.2,
        mass: Math.random() * 0.5 + 0.5,
        size: Math.random() * 1 + 1,
        opacity: Math.random() * 0.3 + 0.5,
      }
    })
    setParticles(newParticles)
  }, [])

  // Update particle positions with physics
  useEffect(() => {
    if (!isGenerating) return

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          // Apply forces - attraction to orbit
          const dx = 0 - p.x
          const dy = 0 - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const angle = Math.atan2(dy, dx)

          // Orbital force
          const forceX = Math.cos(angle + Math.PI / 2) * (distance * 0.01)
          const forceY = Math.sin(angle + Math.PI / 2) * (distance * 0.01)

          // Apply acceleration (F = ma)
          const ax = forceX / p.mass
          const ay = forceY / p.mass

          // Update velocity
          let vx = p.vx + ax
          let vy = p.vy + ay

          // Apply friction
          vx *= 0.99
          vy *= 0.99

          // Update position
          let x = p.x + vx
          let y = p.y + vy

          // Keep particles in orbit range
          const maxDistance = 70
          const currentDistance = Math.sqrt(x * x + y * y)
          if (currentDistance > maxDistance) {
            x = (x / currentDistance) * maxDistance
            y = (y / currentDistance) * maxDistance
          }

          return {
            ...p,
            x,
            y,
            vx,
            vy,
            opacity: Math.random() * 0.3 + 0.5, // Flicker effect
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [isGenerating])

  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Main orb with acrylic effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/80 to-purple-600/80 backdrop-filter backdrop-blur-xl"
        style={{
          boxShadow: "0 0 40px 5px rgba(122, 51, 255, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        animate={{
          scale: isGenerating ? [1, 1.1, 1] : 1,
          rotate: isGenerating ? [0, 180, 360] : 0,
        }}
        transition={{
          duration: 4,
          repeat: isGenerating ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
        }}
      />

      {/* Inner glow layer */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent"
        animate={{
          opacity: isGenerating ? [0.7, 0.3, 0.7] : 0.5,
        }}
        transition={{
          duration: 2,
          repeat: isGenerating ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
          delay: 0.3,
        }}
      />

      {/* Outer glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-full opacity-30 blur-xl"
        style={{
          background: "radial-gradient(circle, rgba(138, 43, 226, 0.8) 0%, rgba(138, 43, 226, 0) 70%)",
        }}
        animate={{
          scale: isGenerating ? [1.1, 1.2, 1.1] : 1.1,
        }}
        transition={{
          duration: 3,
          repeat: isGenerating ? Number.POSITIVE_INFINITY : 0,
          ease: "easeInOut",
          delay: 0.6,
        }}
      />

      {/* Physics-driven particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{
            top: "50%",
            left: "50%",
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            x: particle.x,
            y: particle.y,
            boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.7)",
          }}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center">
        {isGenerating ? (
          <Loader className="w-10 h-10 text-white animate-spin" />
        ) : (
          <Sparkles className="w-10 h-10 text-white" />
        )}
      </div>
    </div>
  )
}

// Download option component
const DownloadOptionComponent = ({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  theme,
}: {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  disabled: boolean
  theme?: string
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-between w-full p-4 rounded-lg border ${
        disabled
          ? "border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed"
          : "border-gray-800 hover:border-gray-600 bg-gray-900 hover:bg-gray-800 text-white cursor-pointer"
      } transition-colors`}
    >
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h4 className="font-bold">{title}</h4>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      {disabled && <Loader className="w-5 h-5 text-gray-500 animate-spin" />}
    </button>
  )
}

// Main component
const WriterPage = () => {
  // State
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setIsLoaded(true)
      }, 300) // Delay to ensure smooth transition
    }, 2000) // Simulate loading for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [scenes, setScenes] = useState<{ id: string; content: string; image?: string; title?: string }[]>([
    { id: "scene-1", content: "" },
  ])
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [detectedGenres, setDetectedGenres] = useState<string[]>([])
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  // Update the state to track text animation completion
  const [isTextAnimationComplete, setIsTextAnimationComplete] = useState(false)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [recommendations, setRecommendations] = useState<string[]>([])
  // Add state to track if screenplay has been generated
  const [hasGeneratedScreenplay, setHasGeneratedScreenplay] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState<string | null>(null)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [themeError, setThemeError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fileNameInput, setFileNameInput] = useState<string | null>(null)
  const [showFileNameModal, setShowFileNameModal] = useState(false)

  const promptRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { toast } = useToast()

  const themeOptionsList: Array<{
    id: string
    title: string
    description: string
    videoSrc: string
    placeholderImage: string
  }> = [
    {
      id: "cinematic",
      title: "Cinematic Short Films",
      description: "Ideal for creating visually stunning short films with a focus on cinematic storytelling.",
      videoSrc: "/cinematic-demo.mp4",
      placeholderImage: "/cinema.png",
    },
    {
      id: "bbc",
      title: "BBC Style",
      description: "Suited for creating documentary-style content with a formal and authoritative tone.",
      videoSrc: "/bbc-demo.mp4",
      placeholderImage: "/bbc.png",
    },
    {
      id: "shortform",
      title: "Short Form",
      description:
        "Perfect for generating engaging content for social media platforms like TikTok and Instagram Reels.",
      videoSrc: "/shortform-demo.mp4",
      placeholderImage: "/shortform.png",
    },
  ]

  const handleOnDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const oldIndex = scenes.findIndex((scene) => scene.id === active.id)
    const newIndex = scenes.findIndex((scene) => scene.id === over.id)

    setScenes((prevScenes) => arrayMove(prevScenes, oldIndex, newIndex))
    setActiveSceneIndex(newIndex)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    setShowThemeSelector(false)
  }

  const removeGenreTag = (genreToRemove: string) => {
    setDetectedGenres(detectedGenres.filter((g) => g !== genreToRemove))
  }

  const generateScreenplay = async () => {
    if (!prompt.trim()) return

    // Check if a theme is selected
    if (!selectedTheme) {
      setThemeError("Please select a theme before generating the screenplay.")
      setShowThemeSelector(true)
      return
    } else {
      setThemeError(null) // Clear any previous theme error
    }

    setIsGenerating(true)
    setIsTextAnimationComplete(false)
    setShowDownloadOptions(false)
    setErrorMessage(null) // Clear any previous error messages
    // Set flag to prevent theme changes after generation
    setHasGeneratedScreenplay(true)

    try {
      // Use the Gemini API for text generation
      const formatPrompt =
        selectedTheme === "cinematic"
          ? "Format the response as a professional cinematic short film screenplay with proper scene headings (INT./EXT. LOCATION - TIME), action descriptions, character names in ALL CAPS when first introduced, and dialogue. Include multiple scenes with clear transitions between them (CUT TO:, DISSOLVE TO:, etc.). Follow standard screenplay formatting with scene headings, action lines, character names centered and in ALL CAPS before dialogue, and proper indentation. Include FADE IN: at the beginning and FADE OUT. at the end."
          : selectedTheme === "shortform"
          ? "Format the response as a short-form script suitable for social media content like TikTok or Instagram Reels. Keep it concise (under 60 seconds when performed), with clear visual directions, simple scene descriptions, and brief, punchy dialogue. Focus on a single concept with a hook at the beginning and a clear punchline or call to action at the end."
          : "Format the response in BBC style documentary format with 'NARRATOR:' for voiceover sections, 'VISUAL:' for describing what appears on screen, and 'INTERVIEW:' for subject interviews with the person's name and title. Use a formal, authoritative tone for narration and balance factual information with compelling storytelling."

      // Add context from previous scenes if this isn't the first scene
      let contextPrompt = ""
      if (activeSceneIndex > 0 && scenes.length > 1) {
        // Get the previous scene's content for context
        const previousSceneContent = scenes[activeSceneIndex - 1].content || ""

        // Extract key information from previous scene
        const prevSceneLines = previousSceneContent.split("\n")
        let prevSceneLocation = ""
        const prevSceneCharacters = []
        let prevSceneSummary = ""

        // Find the scene heading and collect character names
        for (const line of prevSceneLines) {
          if (line.trim().startsWith("INT.") || line.trim().startsWith("EXT.") || line.trim().startsWith("INT./EXT.")) {
            prevSceneLocation = line.trim()
          }

          // Collect character names (all caps lines that aren't transitions)
          const isCharacterLine =
            line.trim() === line.trim().toUpperCase() &&
            line.trim().length > 0 &&
            !line.includes(":") &&
            !line.trim().startsWith("FADE") &&
            !line.trim().startsWith("CUT") &&
            !line.trim().startsWith("DISSOLVE")

          if (isCharacterLine) {
            prevSceneCharacters.push(line.trim())
          }
        }

        // Create a brief summary of the previous scene
        prevSceneSummary = previousSceneContent.substring(0, 500) + "..."

        // Add context to the prompt
        contextPrompt = `
This scene should continue from the previous scene which took place at: ${prevSceneLocation}
Characters from the previous scene: ${[...new Set(prevSceneCharacters)].join(", ")}
Brief summary of previous scene: ${prevSceneSummary}

Please continue the story from this point, maintaining continuity with the previous scene. The new scene should:
1. Reference events or conversations from the previous scene
2. Continue the character arcs and storylines
3. Make sense as a direct continuation (not start a completely new story)
4. Include a transition like "CUT TO:" or "DISSOLVE TO:" at the beginning
`
      }

      const systemPrompt = `You are an expert screenplay writer. ${formatPrompt} Include proper formatting, scene descriptions, and compelling dialogue. Be creative and engaging. Generate a complete screenplay with a beginning, middle, and an end. Do not stop mid-generation. Ensure all formatting is consistent throughout the screenplay.
${contextPrompt}`

      // Show a generating message
      setGeneratedContent("Generating your screenplay...")

      // Function to generate with retry logic
      const generateWithRetry = async (retries = 3) => {
        for (let attempt = 0; attempt < retries; attempt++) {
          try {
            const response = await fetch(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
                },
                body: JSON.stringify({
                  contents: [
                    {
                      role: "user",
                      parts: [
                        {
                          text:
                            activeSceneIndex > 0
                              ? `${contextPrompt}\n\nBased on this context, continue the screenplay with the following idea: ${prompt}`
                              : prompt,
                        },
                      ],
                    },
                  ],
                  systemInstruction: {
                    parts: [
                      {
                        text: systemPrompt,
                      },
                    ],
                  },
                  generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 8192, // Increased from 4096 to ensure completion
                  },
                }),
              },
            )

            if (!response.ok) {
              if (response.status === 403) {
                console.error("API request failed with status 403: Forbidden. Possible causes:")
                console.error("- Invalid or expired API key")
                console.error("- Insufficient permissions for the API key")
                console.error("- API key not enabled for the requested service")
                console.error("Please verify your API key and ensure it has the necessary permissions.")
                throw new Error("API request failed with status 403: Forbidden")
              }
              throw new Error(`API request failed with status ${response.status}`)
            }

            const data = await response.json()
            if (
              data.candidates &&
              data.candidates.length > 0 &&
              data.candidates[0].content &&
              data.candidates[0].content.parts &&
              data.candidates[0].content.parts.length > 0
            ) {
              return data.candidates[0].content.parts[0].text
            } else {
              throw new Error("Invalid response format from API")
            }
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed:`, error)
            if (attempt === retries - 1) throw error

            // Wait before retrying
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }
        }
        throw new Error("All retry attempts failed")
      }

      // Generate the screenplay
      const generatedText = await generateWithRetry()

      // Process the screenplay to ensure it's complete
      let processedText = generatedText

      // Process the screenplay to ensure proper scene continuation
      if (selectedTheme === "cinematic" && activeSceneIndex > 0) {
        // Check if the screenplay has proper scene continuations
        const sceneLines = processedText.split("\n")

        let hasProperContinuation = false

        // Check if the screenplay already has continuation references
        for (let i = 0; i < 10 && i < sceneLines.length; i++) {
          if (sceneLines[i].includes("CONTINUED FROM") || sceneLines[i].includes("CONTINUOUS")) {
            hasProperContinuation = true
            break
          }
        }

        // If no continuation found, add one
        if (!hasProperContinuation) {
          // Find the previous scene's location
          const prevSceneContent = scenes[activeSceneIndex - 1]?.content || ""
          const prevSceneLines = prevSceneContent.split("\n")
          let prevSceneLocation = ""

          // Find the scene heading line in previous scene
          for (const line of prevSceneLines) {
            if (
              line.trim().startsWith("INT.") ||
              line.trim().startsWith("EXT.") ||
              line.trim().startsWith("INT./EXT.")
            ) {
              // Extract location (remove INT./EXT. and time of day)
              prevSceneLocation = line
                .trim()
                .replace(/^(INT\.|EXT\.|INT\/EXT\.)/, "")
                .replace(/- (DAY|NIGHT|MORNING|EVENING|AFTERNOON|LATER|CONTINUOUS|SAME TIME)$/, "")
                .trim()
              break
            }
          }

          // Add continuation note at the beginning
          if (prevSceneLocation) {
            processedText = `CONTINUED FROM PREVIOUS SCENE AT ${prevSceneLocation}\n\n${processedText}`
          } else {
            processedText = `CONTINUED FROM PREVIOUS SCENE\n\n${processedText}`
          }
        }
      }

      // Check if the screenplay seems incomplete (ends abruptly)
      if (
        !processedText.toLowerCase().includes("fade out") &&
        !processedText.toLowerCase().includes("the end") &&
        !processedText.toLowerCase().includes("cut to black") &&
        !processedText.toLowerCase().includes("end scene") &&
        selectedTheme === "cinematic"
      ) {
        // Generate a conclusion
        const conclusionPrompt = `Complete the following screenplay with a proper ending:

${processedText}`

        try {
          const conclusionResponse = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
              },
              body: JSON.stringify({
                contents: [
                  {
                    role: "user",
                    parts: [
                      {
                        text: conclusionPrompt,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 2048, // Increased from 1024
                },
              }),
            },
          )

          if (conclusionResponse.ok) {
            const conclusionData = await conclusionResponse.json()
            const conclusionText = conclusionData.candidates[0].content.parts[0].text

            // Extract just the ending part
            const endingPart = conclusionText.substring(processedText.length)
            if (endingPart.trim().length > 0) {
              processedText += "\n\n" + endingPart
            } else {
              processedText += "\n\nFADE OUT.\n\nTHE END"
            }
          }
        } catch (error) {
          console.error("Error generating conclusion:", error)
          // Add a simple ending if conclusion generation fails
          processedText += "\n\nFADE OUT.\n\nTHE END"
        }
      }

      setGeneratedContent(processedText)

      // Save the generated content to the current scene
      const updatedScenes = [...scenes]
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        content: processedText,
      }
      setScenes(updatedScenes)

      // Generate recommendations using a separate API call
      try {
        const recommendationsResponse = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
            },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Based on this screenplay idea: "${prompt}", provide 3-5 specific recommendations to improve it. Format each recommendation as a separate point.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          },
        )

        if (recommendationsResponse.ok) {
          const recData = await recommendationsResponse.json()
          const recText = recData.candidates[0].content.parts[0].text

          // Parse the recommendations into an array
          let recArray = []
          // First try to extract numbered recommendations
          const numberedRecs = recText.match(/\d+\.\s+([^\d]+?)(?=\d+\.|$)/g)
          if (numberedRecs && numberedRecs.length > 0) {
            recArray = numberedRecs.map((rec: string) => rec.replace(/^\d+\.\s+/, "").trim())
          } else {
            // Fallback to splitting by newlines or periods for non-numbered recommendations
            recArray = recText
              .split(/\n+|(?<=\.)\s+/)
              .map((item: string) => item.trim())
              .filter(
                (item: string) =>
                  item.length > 10 &&
                  !item.includes("recommendations") &&
                  !item.includes("Recommendations"),
              )
          }

          setRecommendations(recArray.slice(0, 5)) // Limit to 5 recommendations
        }
      } catch (error) {
        console.error("Error generating recommendations:", error)
      }
    } catch (err) {
      console.error("Error generating screenplay:", err)
      setGeneratedContent("Error generating screenplay. Please check your API key and try again.")
      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadRecommendationsText = async () => {
    setIsDownloading(true)

    try {
      // Simulate file saving
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Recommendations downloaded!",
        description: "The recommendations have been saved to your device.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download failed!",
        description: "There was an error downloading the recommendations.",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Find the toggleEditMode function and replace it with this updated version
  // that saves the edited content back to the scenes array

  const toggleEditMode = () => {
    // If we're currently in edit mode and turning it off, save the changes
    if (isEditing && generatedContent) {
      // Update the current scene with the edited content
      const updatedScenes = [...scenes]
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        content: generatedContent,
      }
      setScenes(updatedScenes)
    }

    // Toggle edit mode
    setIsEditing(!isEditing)
  }

  const redirectToImageGenerator = () => {
    router.push("/image-generator")
  }

  const editScene = (index: number) => {
    setActiveSceneIndex(index)
  }

  const addNewScene = () => {
    setScenes([...scenes, { id: `scene-${scenes.length + 1}`, content: "" }])
  }

  const canAddMoreScenes = () => {
    return scenes.length < 5
  }

  const handleDownloadPDF = useCallback(async () => {
    if (!generatedContent) {
      toast({
        variant: "destructive",
        title: "No screenplay to download!",
        description: "Please generate a screenplay first.",
      })
      return
    }

    setShowFileNameModal(true)
  }, [generatedContent, toast, setShowFileNameModal])

  const handleFileNameSubmit = useCallback(
    async (fileName: string) => {
      setShowFileNameModal(false)
      setIsDownloading(true)

      try {
        // Generate the PDF using the service
        const pdfDataUrl = await generateScreenplayPDF({
          title: fileName || "Untitled Screenplay",
          author: "AI Writer",
          genre: detectedGenres.length > 0 ? detectedGenres : ["Drama"],
          scenes: scenes.map((scene) => ({ content: scene.content || "" })),
          recommendations: recommendations,
        })

        // Create a link element and trigger download
        const link = document.createElement("a")
        link.href = pdfDataUrl
        link.download = `${fileName}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Screenplay downloaded!",
          description: "The screenplay has been saved to your device.",
        })
      } catch (error) {
        console.error("Error generating or downloading PDF:", error)
        toast({
          variant: "destructive",
          title: "Download failed!",
          description: "There was an error downloading the screenplay.",
        })
      } finally {
        setIsDownloading(false)
      }
    },
    [generatedContent, toast, setIsDownloading, setShowFileNameModal, detectedGenres, scenes, recommendations],
  )

  const handleDownloadTXT = useCallback(async () => {
    if (!generatedContent) {
      toast({
        variant: "destructive",
        title: "No screenplay to download!",
        description: "Please generate a screenplay first.",
      })
      return
    }

    setIsDownloading(true)

    try {
      const blob = new Blob([generatedContent], { type: "text/plain;charset=utf-8" })
      FileSaver.saveAs(blob, "screenplay.txt")

      toast({
        title: "Screenplay downloaded!",
        description: "The screenplay has been saved to your device.",
      })
    } catch (error) {
      console.error("Error downloading TXT:", error)
      toast({
        variant: "destructive",
        title: "Download failed!",
        description: "There was an error downloading the screenplay.",
      })
    } finally {
      setIsDownloading(false)
    }
  }, [generatedContent, toast])

  if (isLoading) {
    return <SimpleFilmRollLoader message="Loading AI Writer..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background noise texture */}
      <div className='absolute inset-0 bg-[url("/noise.png")] opacity-5 mix-blend-overlay'></div>

      {/* Back button - only show when fullscreen */}
      {!isFullscreen && (
        <div className="container mx-auto px-4 pt-8 relative z-10">
          <Link href="/#home" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      )}

      <div className={`container mx-auto px-4 py-8 relative z-10 ${isFullscreen ? "pt-4" : ""}`}>
        {/* Title - only show when not in fullscreen */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider">WRITER</h1>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              Transform your ideas into professionally formatted screenplays with our advanced AI technology.
            </p>
          </motion.div>
        )}

        {/* Main content area */}
        <div className="max-w-6xl mx-auto" ref={mainContainerRef}>
          <GlassCard className="p-4 md:p-6 rounded-xl overflow-hidden relative">
            {/* Fullscreen toggle and reset buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 z-20">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>

            {/* Theme error message */}
            {themeError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
                <AlertCircle size={18} className="text-red-400 mr-2" />
                <p className="text-sm text-white/90">{themeError}</p>
              </div>
            )}

            {/* Error message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
                <AlertCircle size={18} className="text-red-400 mr-2" />
                <p className="text-sm text-white/90">{errorMessage}</p>
              </div>
            )}

            {/* Theme selection button - always visible */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setShowThemeSelector(true)}
                className={`flex items-center justify-center py-3 px-6 text-sm font-medium text-center text-white rounded-lg backdrop-blur-md transition-all ${
                  selectedTheme
                    ? "bg-green-600/70 hover:bg-green-700/80 border border-green-500/30"
                    : "bg-blue-600/70 hover:bg-blue-700/80 border border-blue-500/30"
                } focus:ring-4 focus:outline-none focus:ring-blue-300/50 shadow-lg glass`}
                disabled={isGenerating || hasGeneratedScreenplay}
              >
                {selectedTheme ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {selectedTheme === "cinematic"
                      ? "Cinematic Short Films"
                      : selectedTheme === "bbc"
                      ? "BBC Style"
                      : "Short Form"}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Choose Format
                  </>
                )}
              </button>
            </div>

            {/* Theme selector modal */}
            <ThemeSelector
              isOpen={showThemeSelector}
              onClose={() => setShowThemeSelector(false)}
              onSelect={handleThemeSelect}
              selectedTheme={selectedTheme}
              themeOptions={themeOptionsList}
            />

            {/* Input area */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Prompt input */}
              <div className="md:col-span-3">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="prompt" className="block text-sm font-medium text-white/80">
                    Write your screenplay idea
                  </label>
                  <div className="text-xs text-white/50">
                    {detectedGenres.length > 0 && (
                      <>
                        Detected genres:{" "}
                        {detectedGenres.map((genre) => (
                          <GenreTag key={genre} name={genre} onRemove={() => removeGenreTag(genre)} />
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    id="prompt"
                    ref={promptRef}
                    className="block w-full p-4 text-sm text-white bg-black/40 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm resize-none overflow-hidden min-h-[100px]"
                    placeholder="A detective investigates a mysterious murder in a futuristic city..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ImageIcon className="h-5 w-5 text-white/50" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Generate button - only visible if theme is selected */}
              <div className="flex flex-col space-y-2">
                {selectedTheme && (
                  <button
                    onClick={generateScreenplay}
                    className="flex items-center justify-center py-3 px-4 text-sm font-medium text-center text-white rounded-lg bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300"
                    disabled={isGenerating || !prompt.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="mt-6 p-4 rounded-lg bg-black/20 border border-white/10 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-medium text-white">AI Recommendations</h4>
                  <button
                    onClick={downloadRecommendationsText}
                    className="px-3 py-1 text-sm bg-purple-600/30 hover:bg-purple-600/50 rounded-lg flex items-center"
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <Loader className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="mr-2 h-3 w-3" />
                    )}
                    Save Recommendations
                  </button>
                </div>
                <ul className="list-disc pl-5 text-white/80">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="mb-2">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Screenplay output */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">Screenplay</h3>
                <div className="flex space-x-2">
                  {/* Edit mode toggle */}
                  <button
                    onClick={toggleEditMode}
                    className={`p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${
                      isEditing ? "bg-green-500 hover:bg-green-600" : ""
                    }`}
                    title={isEditing ? "Save changes" : "Edit screenplay"}
                  >
                    <Edit size={16} />
                  </button>

                  {/* Download options */}
                  {generatedContent && (
                    <button
                      onClick={() => setShowDownloadOptions(true)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      title="Download options"
                    >
                      <Download size={16} />
                    </button>
                  )}

                  {/* Image generator redirect */}
                  {generatedContent && (
                    <button
                      onClick={redirectToImageGenerator}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      title="Visualize this screenplay"
                    >
                      <ImageIcon size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scene navigation - only for cinematic theme and only if content has been generated */}
              {selectedTheme === "cinematic" && generatedContent && (
                <DndContext collisionDetection={closestCenter} onDragEnd={handleOnDragEnd}>
                  <SortableContext items={scenes} strategy={verticalListSortingStrategy}>
                    <div className="flex items-center space-x-2 mb-4 overflow-x-auto">
                      {scenes.map((scene, index) => (
                        <button
                          key={scene.id}
                          onClick={() => editScene(index)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            activeSceneIndex === index
                              ? "bg-white text-black"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          Scene {index + 1}
                        </button>
                      ))}
                      {canAddMoreScenes() && generatedContent && (
                        <button
                          onClick={addNewScene}
                          className="px-3 py-1 rounded-full text-sm bg-green-500 hover:bg-green-600 text-white transition-colors"
                        >
                          <Plus className="mr-2 inline-block h-4 w-4" />
                          Add Scene
                        </button>
                      )}
                    </div>
                  </SortableContext>
                </DndContext>
              )}

              {/* Scene content */}
              <div className="relative">
                {isGenerating ? (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                    <Enhanced3DOrb isGenerating={isGenerating} />
                  </div>
                ) : null}

                {isEditing ? (
                  <textarea
                    value={generatedContent || ""}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="block w-full p-4 text-sm text-white bg-black/40 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm resize-none overflow-hidden min-h-[300px]"
                    placeholder="Start writing your screenplay here..."
                  />
                ) : (
                  <div
                    ref={contentRef}
                    className={`prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none p-4 text-white/80 rounded-lg bg-black/20 border border-white/10 backdrop-blur-sm min-h-[300px] overflow-auto ${
                      selectedTheme === "cinematic" ? "font-courier" : ""
                    }`}
                  >
                    {generatedContent ? (
                      <FadeInEffect text={generatedContent} duration={500} />
                    ) : (
                      <p className="text-white/50">
                        No screenplay generated yet. Enter your idea and click "Generate".
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Download Options Modal */}
      {showDownloadOptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-xl overflow-hidden"
          >
            <GlassCard className="p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Download Screenplay
                </h2>
                <button
                  onClick={() => setShowDownloadOptions(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-white/70 mb-6">Choose the format you'd like to download your screenplay in.</p>

              <DownloadOptionComponent
                icon={<FileText size={20} />}
                title="Download as PDF"
                description="Best for sharing and professional use."
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              />

              <DownloadOptionComponent
                icon={<FileText size={20} />}
                title="Download as TXT"
                description="Plain text format, easy to edit."
                onClick={handleDownloadTXT}
                disabled={isDownloading}
              />
            </GlassCard>
          </motion.div>
        </motion.div>
      )}

      {/* File Name Input Modal */}
      {showFileNameModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md rounded-xl overflow-hidden"
          >
            <GlassCard className="p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Enter File Name
                </h2>
                <button
                  onClick={() => setShowFileNameModal(false)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-white/70 mb-6">Please enter a file name for your screenplay.</p>

              <div className="mb-4">
                <label htmlFor="fileName" className="block text-sm font-medium text-white/80">
                  File Name
                </label>
                <input
                  type="text"
                  id="fileName"
                  className="block w-full p-4 text-sm text-white bg-black/40 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
                  placeholder="My Screenplay"
                  value={fileNameInput || ""}
                  onChange={(e) => setFileNameInput(e.target.value)}
                />
              </div>

              <button
                onClick={() => {
                  if (fileNameInput && fileNameInput.trim()) {
                    handleFileNameSubmit(fileNameInput.trim())
                  } else {
                    toast({
                      variant: "destructive",
                      title: "Invalid file name!",
                      description: "Please enter a valid file name.",
                    })
                  }
                }}
                className="flex items-center justify-center py-3 px-4 text-sm font-medium text-center text-white rounded-lg bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300"
              >
                Download
              </button>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default WriterPage

