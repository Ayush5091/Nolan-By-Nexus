"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, Minimize2, Download, ArrowLeft, Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ThemeCard from "@/components/theme-card"
import DownloadOptions from "@/components/download-options"
import { generateImage } from "@/lib/image-generation"
import { generateScreenplayPDF } from "@/services/screenplay-pdf-service"
import { ImageIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { FadeInEffect } from "@/components/fade-in-effect"
import { Enhanced3DOrb } from "@/components/enhanced-3d-orb"
import FileSaver from "file-saver"

type Theme = "hollywood" | "shortform" | "bbc" | "cinematic"
type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "2.35:1"

export default function AIScreenplayGenerator() {
  const [prompt, setPrompt] = useState("")
  const [title, setTitle] = useState("")
  const [selectedTheme, setSelectedTheme] = useState<Theme>("hollywood")
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>("16:9")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [detectedGenres, setDetectedGenres] = useState<string[]>([])
  const [isEditMode, setIsEditing] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [scenes, setScenes] = useState<Array<{ title: string; content: string; image?: string }>>([{ content: "" }])
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [recommendations, setRecommendations] = useState<string[]>([
    "Consider adding more character development in the opening scene",
    "The dialogue could be more concise and impactful",
    "Add more visual descriptions to enhance the cinematic quality",
    "Consider a stronger inciting incident to hook the audience",
  ])
  const [hasGeneratedInitialScene, setHasGeneratedScreenplay] = useState(false)
  const [isTextAnimationComplete, setIsTextAnimationComplete] = useState(false)
  const [themeError, setThemeError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const promptRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { toast } = useToast()

  const commonGenres = [
    "Action",
    "Adventure",
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
    "Crime",
    "Documentary",
    "Family",
    "Historical",
    "Musical",
    "Superhero",
    "War",
  ]

  // Simulated loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.style.height = "auto"
      promptRef.current.style.height = `${promptRef.current.scrollHeight}px`
    }
  }, [prompt])

  // Detect genres in prompt
  useEffect(() => {
    const detectGenresInPrompt = () => {
      const newGenres: string[] = []

      commonGenres.forEach((genre) => {
        if (prompt.toLowerCase().includes(genre.toLowerCase())) {
          if (!detectedGenres.includes(genre)) {
            newGenres.push(genre)
          }
        }
      })

      if (newGenres.length > 0) {
        setDetectedGenres([...detectedGenres, ...newGenres])
      }
    }

    detectGenresInPrompt()
  }, [prompt, detectedGenres])

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId)
    setShowThemeSelector(false)
    setThemeError(null) // Clear any previous theme error

    // Don't automatically show aspect ratio selector
    // Only set default aspect ratio if needed
    if (themeId === "shortform") {
      setSelectedAspectRatio("9:16")
    } else if (themeId === "bbc") {
      setSelectedAspectRatio("16:9")
    } else if (themeId === "cinematic") {
      setSelectedAspectRatio("2.35:1") // Standard cinematic ratio
    }
  }

  // Add a constant for max scenes
  const MAX_SCENES = 20

  // Add a new scene with improved continuation logic
  const addNewScene = () => {
    // Check if we've reached the maximum number of scenes
    if (scenes.length >= MAX_SCENES) {
      toast({
        title: "Maximum scenes reached",
        description: `You can only have up to ${MAX_SCENES} scenes. Please delete a scene before adding a new one.`,
        variant: "destructive",
      })
      return
    }

    // Ask for confirmation
    if (confirm("Add a new scene? Your current scene content will be saved.")) {
      // Save current scene content
      if (generatedContent) {
        const updatedScenes = [...scenes]
        updatedScenes[activeSceneIndex] = {
          ...updatedScenes[activeSceneIndex],
          content: generatedContent,
          image: generatedImages.length > 0 ? generatedImages[0] : undefined,
        }

        // Add new empty scene with continuation reference if in cinematic mode
        let newSceneContent = ""

        // If in cinematic mode and there's a previous scene, add continuation reference
        if (selectedTheme === "cinematic" && updatedScenes.length > 0) {
          // Extract the location from the previous scene heading
          const prevSceneContent = updatedScenes[activeSceneIndex].content || ""
          const prevSceneLines = prevSceneContent.split("\n")
          let prevSceneLocation = ""
          const prevSceneCharacters = []

          // Find the scene heading line and collect character names
          for (const line of prevSceneLines) {
            if (
              line.trim().startsWith("INT.") ||
              line.trim().startsWith("EXT.") ||
              line.trim().startsWith("INT./EXT.") ||
              line.trim().startsWith("INT/EXT")
            ) {
              // Extract location (remove INT./EXT. and time of day)
              prevSceneLocation = line
                .trim()
                .replace(/^(INT\.|EXT\.|INT\/EXT\.|I\/E)/, "")
                .replace(/- (DAY|NIGHT|MORNING|EVENING|AFTERNOON|LATER|CONTINUOUS|SAME TIME)$/, "")
                .trim()
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

          // Create a continuation reference with context
          if (prevSceneLocation) {
            newSceneContent = `CONTINUED FROM PREVIOUS SCENE AT ${prevSceneLocation}\n\n`

            // Add a transition line
            newSceneContent += "CUT TO:\n\n"

            // Add a placeholder for the new scene heading
            const timeOfDay = ["DAY", "NIGHT", "EVENING", "MORNING", "AFTERNOON"][Math.floor(Math.random() * 5)]
            newSceneContent += `INT. NEW LOCATION - ${timeOfDay}\n\n`

            // Add context about characters if available
            if (prevSceneCharacters.length > 0) {
              // Mention characters from previous scene for continuity
              const characterList = [...new Set(prevSceneCharacters)].slice(0, 2).join(" and ")
              newSceneContent += `${characterList} continue their conversation from the previous scene.\n\n`
            }
          } else {
            newSceneContent = "CONTINUED FROM PREVIOUS SCENE\n\n"
            newSceneContent += "CUT TO:\n\n"
          }
        }

        // Add new scene with continuation reference
        const updatedScenescenes = [...scenes]
        updatedScenescenes.push({ content: newSceneContent })

        setScenes(updatedScenescenes)
        setActiveSceneIndex(updatedScenescenes.length - 1)

        // Set the new scene content
        setGeneratedContent(newSceneContent)
        setIsTextAnimationComplete(true) // Don't animate when adding a new scene

        toast({
          title: "New scene added",
          description: "A new scene has been added with continuation from the previous scene.",
          variant: "default",
        })
      } else {
        // Just add a new empty scene if there's no content
        setScenes([...scenes, { content: "" }])
        setActiveSceneIndex(scenes.length)

        toast({
          title: "New scene added",
          description: "A new empty scene has been added.",
          variant: "default",
        })
      }
    }
  }

  // Delete a scene
  const deleteScene = (index: number) => {
    const newScenes = [...scenes]
    newScenes.splice(index, 1)

    if (newScenes.length === 0) {
      newScenes.push({ content: "" })
    }

    setScenes(newScenes)

    if (activeSceneIndex >= newScenes.length) {
      setActiveSceneIndex(newScenes.length - 1)
    }

    // Load the content of the now active scene
    if (newScenes[activeSceneIndex]) {
      setGeneratedContent(newScenes[activeSceneIndex].content || "")
      setIsTextAnimationComplete(true) // Don't animate when switching scenes
    }
  }

  // Edit a scene
  const editScene = (index: number) => {
    // Save current scene content before switching
    if (generatedContent && activeSceneIndex !== index) {
      const updatedScenes = [...scenes]
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        content: generatedContent,
        image: generatedImages.length > 0 ? generatedImages[0] : undefined,
      }
      setScenes(updatedScenes)
    }

    // Switch to the selected scene
    setActiveSceneIndex(index)

    // Load the content of the selected scene
    if (scenes[index]) {
      setGeneratedContent(scenes[index].content || "")
      setIsTextAnimationComplete(true) // Don't animate when switching scenes
    }

    if (promptRef.current) {
      promptRef.current.focus()
    }
  }

  // Remove a genre tag
  const removeGenreTag = (genre: string) => {
    setDetectedGenres(detectedGenres.filter((g) => g !== genre))
  }

  // Update the redirectToImageGenerator function to save the current screenplay to the current scene
  const redirectToImageGenerator = () => {
    // Save the current screenplay to the current scene if it exists
    if (generatedContent) {
      const updatedScenes = [...scenes]
      updatedScenes[activeSceneIndex] = {
        ...updatedScenes[activeSceneIndex],
        content: generatedContent,
      }
      setScenes(updatedScenes)

      // Save the current screenplay to session storage for the image generator to use
      sessionStorage.setItem("screenplay_to_visualize", generatedContent)
    }
    router.push("/image-generator?source=writer")
  }

  // Generate screenplay with improved continuation handling
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
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Example generated content based on theme
      let content = ""

      if (selectedTheme === "hollywood") {
        content = `INT. COFFEE SHOP - DAY

The bustling cafe is filled with the morning crowd. ALEX (30s, disheveled but charming) sits alone at a corner table, typing frantically on a laptop.

JORDAN (20s, confident) approaches with two coffee cups.

JORDAN
You look like you could use this.

ALEX
(without looking up)
Thanks, but I'm good.

JORDAN
It's not poisoned, I promise.

Alex finally looks up, surprised by the intrusion but amused.

ALEX
Sorry, deadline in an hour. I'm Alex.

JORDAN
Jordan. Mind if I join? I'm avoiding someone at table six.

FADE TO:

INT. COFFEE SHOP - LATER

Alex and Jordan laugh together, laptop closed, coffee cups empty.

ALEX
So you're saying this happens often?

JORDAN
Only on days ending in "y".

CUT TO BLACK.`
      } else if (selectedTheme === "bbc") {
        content = `NARRATOR: Welcome to London Calling, where we explore the stories that shape our world. Today, we're diving into the life of Emma, a dedicated teacher facing a life-altering decision.

VISUAL: A montage of London scenes - bustling streets, historic landmarks, and quiet residential areas.

INTERVIEW: EMMA (40s, Teacher): It's not just a job, it's a calling. But sometimes, the calling asks too much.

VISUAL: Emma sits by the window, grading papers. The room is filled with books.

NARRATOR: Emma's life takes an unexpected turn when Michael, an old friend, arrives with an offer she can't refuse.

INTERVIEW: MICHAEL (40s, Researcher): I've been offered the position in Edinburgh. It's a chance of a lifetime.

VISUAL: Michael, soaking wet from the rain, stands in Emma's hallway.

NARRATOR: But will Emma choose her career or her heart?

FADE OUT.`
      } else {
        content = `INT. APARTMENT - NIGHT

RILEY (25) scrolls through social media, the blue light illuminating their face.

A notification pops up: "Memory from 3 years ago"

RILEY
(whispers)
Not today, algorithm.

Riley clicks anyway. A video plays - Riley and SAM (26) laughing on a beach.

RILEY
(whispers)
Why did I watch that?

Riley picks up phone, hovers over Sam's contact.

Types: "I miss you"

Deletes it.

Types: "Hey, how've you been?"

Sends.

Three dots appear immediately.

Riley holds breath.`
      }

      setGeneratedContent(content)

      // Save the generated content as the first scene
      const newScene = {
        title: title || "Scene 1",
        content: content,
      }

      setScenes([newScene])
      setActiveSceneIndex(0)
      setHasGeneratedScreenplay(true)

      // Generate image for the first scene
      generateSceneImage()
    } catch (error) {
      console.error("Error generating screenplay:", error)
      toast({
        title: "Error",
        description: "Failed to generate screenplay. Please check your API key and try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate image for the scene
  const generateSceneImage = async () => {
    setIsGeneratingImage(true)

    try {
      // Call image generation function
      const imageUrl = await generateImage(prompt, selectedTheme)
      setGeneratedImage(imageUrl)

      // Update the current scene with the generated image
      if (scenes.length > 0) {
        const updatedScenes = [...scenes]
        updatedScenes[activeSceneIndex] = {
          ...updatedScenes[activeSceneIndex],
          image: imageUrl,
        }
        setScenes(updatedScenes)
      }
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Handle download
  const handleDownload = async (format: string) => {
    try {
      if (format === "pdf") {
        // Generate PDF using the improved service
        const screenplay = {
          title: title || "Untitled Screenplay",
          author: "AI Writer",
          genre: detectedGenres,
          scenes: scenes,
          theme: selectedTheme || "cinematic",
          recommendations: recommendations,
        }

        const pdfUrl = await generateScreenplayPDF(screenplay)

        // Open the PDF in a new tab
        window.open(pdfUrl, "_blank")

        toast({
          title: "Success",
          description: "PDF generated successfully!",
          variant: "default",
        })
      } else {
        // For other formats, create a text file
        let content = `${title || "Untitled Screenplay"}\n\n`
        content += `Genre: ${detectedGenres.join(", ")}\n\n`
        content += `Written by: AI Writer\n`
        content += `Date: ${new Date().toLocaleDateString()}\n\n`

        // Add a separator line
        content += "=".repeat(80) + "\n"

        // Add "FADE IN:" at the beginning for cinematic format
        if (selectedTheme === "cinematic") {
          content += "FADE IN:\n\n"
        }

        // Combine all scenes with proper formatting
        scenes.forEach((scene, index) => {
          // Don't add scene number headers for cinematic format
          if (selectedTheme !== "cinematic") {
            content += `SCENE ${index + 1}${scene.title ? `: ${scene.title}` : ""}\n\n`
          }

          // Add scene content
          content += `${scene.content}\n\n`

          // Add separator between scenes except for the last one
          if (index < scenes.length - 1) {
            content += "-".repeat(40) + "\n\n"
          }
        })

        // Add recommendations if available
        if (recommendations.length > 0) {
          content += "\n" + "=".repeat(80) + "\n\n"
          content += "AI RECOMMENDATIONS:\n\n"
          recommendations.forEach((rec, index) => {
            content += `${index + 1}. ${rec}\n`
          })
        }

        const blob = new Blob([content], { type: "text/plain" })
        FileSaver.saveAs(blob, `${(title || "Untitled_Screenplay").replace(/\s+/g, "_")}.txt`)

        toast({
          title: "Success",
          description: `Screenplay downloaded as ${format} file!`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Error downloading text file. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Function to check if more scenes can be added
  const canAddMoreScenes = () => {
    return scenes.length < MAX_SCENES
  }

  // Function to handle drag and drop
  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const reorderedScenes = reorder(scenes, result.source.index, result.destination.index)

    setScenes(reorderedScenes)
    setActiveSceneIndex(result.destination.index)
  }

  // Helper function to reorder the list
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const themeOptions = [
    {
      id: "cinematic",
      title: "Cinematic Short Films",
      description: "Ideal for creating visually stunning short films with a focus on cinematic storytelling.",
      videoSrc: "/cinematic-demo.mp4",
      placeholderImage: "/public/images/cinema.png",
    },
    {
      id: "bbc",
      title: "BBC Style",
      description: "Suited for creating documentary-style content with a formal and authoritative tone.",
      videoSrc: "/bbc-demo.mp4",
      placeholderImage: "/public/images/bbc.png",
    },
    {
      id: "shortform",
      title: "Short Form",
      description:
        "Perfect for generating engaging content for social media platforms like TikTok and Instagram Reels.",
      videoSrc: "/shortform-demo.mp4",
      placeholderImage: "/public/images/short-form.png",
    },
  ]

  const toggleEditMode = () => {
    setEditing(!editing)
  }

  const saveRecommendations = () => {
    // Placeholder function for saving recommendations
    toast({
      title: "Recommendations Saved",
      description: "Your AI recommendations have been saved.",
    })
  }

  return (
      <div className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "min-h-screen"}`}>
        {/* Back button - only show when fullscreen */}
        {isFullscreen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 z-10 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <ArrowLeft size={24} />
          </motion.button>
        )}

        {/* Fullscreen toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </motion.button>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-center mb-8"
          >
            AI Screenplay Generator
          </motion.h2>

          {!hasGeneratedScreenplay ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="mb-8">
                <label className="block text-white text-lg mb-2">Screenplay Title (Optional)</label>
                <Input
                  type="text"
                  placeholder="Enter a title for your screenplay"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div className="mb-8">
                <label className="block text-white text-lg mb-2">Prompt</label>
                <Textarea
                  id="prompt"
                  ref={promptRef}
                  className="block w-full p-4 text-sm text-white bg-black/40 border border-white/20 rounded-lg focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm resize-none overflow-hidden min-h-[100px]"
                  placeholder="A gripping opening scene for a cinematic short film..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ImageIcon className="h-5 w-5 text-white/50" aria-hidden="true" />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-white text-lg mb-4">Select Theme</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ThemeCard
                    title="Cinematic Short Films"
                    description="Ideal for creating visually stunning short films with a focus on cinematic storytelling."
                    videoSrc="/cinematic-demo.mp4"
                    placeholderImage="/public/images/cinema.png"
                    isSelected={selectedTheme === "cinematic"}
                    onClick={() => handleThemeSelect("cinematic")}
                  />
                  <ThemeCard
                    title="BBC Style"
                    description="Suited for creating documentary-style content with a formal and authoritative tone."
                    videoSrc="/bbc-demo.mp4"
                    placeholderImage="/public/images/bbc.png"
                    isSelected={selectedTheme === "bbc"}
                    onClick={() => handleThemeSelect("bbc")}
                  />
                  <ThemeCard
                    title="Short Form"
                    description="Perfect for generating engaging content for social media platforms like TikTok and Instagram Reels."
                    videoSrc="/shortform-demo.mp4"
                    placeholderImage="/public/images/short-form.png"
                    isSelected={selectedTheme === "shortform"}
                    onClick={() => handleThemeSelect("shortform")}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={generateScreenplay}
                  disabled={!prompt.trim() || isGenerating}
                  className="px-8 py-6 text-lg"
                >
                  {isGenerating ? "Generating..." : "Generate Screenplay"}
                </Button>
              </div>

              {isGenerating && (
                <div className="mt-12 flex justify-center">
                  <Enhanced3DOrb isGenerating={isGenerating} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{title || "Untitled Screenplay"}</h3>

                <div className="flex space-x-2">
                  {/* Scene selector */}
                  <Select
                    value={activeSceneIndex.toString()}
                    onValueChange={(value) => editScene(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px] bg-gray-900 border-gray-700 text-white">
                      <SelectValue placeholder="Select scene" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-white">
                      {scenes.map((scene, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Scene {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Edit mode toggle */}
                  <Button variant="outline" size="sm" onClick={toggleEditMode}>
                    {editing ? "Preview" : "Edit"}
                  </Button>

                  {/* Download button */}
                  <Button variant="outline" size="sm" onClick={() => setShowDownloadOptions(true)}>
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>

                  {/* Image generator redirect */}
                  <Button variant="outline" size="sm" onClick={redirectToImageGenerator}>
                    <ImageIcon size={16} className="mr-2" />
                    Visualize
                  </Button>
                </div>
              </div>

              {/* Screenplay content */}
              <div className="relative">
                {isGenerating ? (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                    <Enhanced3DOrb isGenerating={isGenerating} />
                  </div>
                ) : null}

                {editing ? (
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
                      <p className="text-white/50">No screenplay generated yet. Enter your idea and click "Generate".</p>
                    )}
                  </div>
                )}
              </div>

              {/* Scene management and recommendations */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Scene management */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <h4 className="text-xl font-bold mb-4">Scene Management</h4>

                  <div className="space-y-4">
                    {/* Scene list */}
                    <div className="space-y-2">
                      {scenes.map((scene, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-md ${
                            activeSceneIndex === index ? "bg-purple-900/50 border border-purple-500/50" : "bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center">
                            <span className="font-bold mr-2">Scene {index + 1}</span>
                            <span className="text-sm text-gray-400 truncate max-w-[150px]">
                              {scene.content.split("\n")[0]}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => editScene(index)} className="h-8 px-2">
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteScene(index)}
                              className="h-8 px-2 text-red-500 hover:text-red-400"
                              disabled={scenes.length <= 1}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add new scene button */}
                    {canAddMoreScenes() && (
                      <Button variant="outline" className="w-full flex items-center justify-center" onClick={addNewScene}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Scene
                      </Button>
                    )}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold">AI Recommendations</h4>
                    <Button variant="outline" size="sm" onClick={saveRecommendations}>
                      <Save size={16} className="mr-2" />
                      Save
                    </Button>
                  </div>

                  <ul className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-purple-900 text-white text-xs mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <p className="text-gray-300">{rec}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Download options modal */}
            <AnimatePresence>
              {showDownloadOptions && (
                <DownloadOptions
                  content={generatedContent}
                  title={title || "Untitled Screenplay"}
                  onClose={() => setShowDownloadOptions(false)}
                  onDownload={handleDownload}
                  theme={selectedTheme || undefined}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    )
}

