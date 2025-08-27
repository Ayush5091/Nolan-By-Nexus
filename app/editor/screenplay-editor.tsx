"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Plus,
  Save,
  Download,
  Share,
  ArrowLeft,
  Image,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Film,
  Camera,
  Palette,
  X,
  FileText,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { type Screenplay, type Scene, generateScene, updateScene, addScene } from "@/services/screenplay-service"
import { generateSceneImageVariations } from "@/services/image-service"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { SimpleFilmRollLoader } from "@/components/simple-film-roll-loader"

// Scene editor component with improved UI
const SceneEditor = ({
  scene,
  onUpdate,
  onDelete,
  onGenerateImage,
  isActive,
  toggleActive,
  previousScene,
  nextScene,
}: {
  scene: Scene
  onUpdate: (updates: Partial<Scene>) => void
  onDelete: () => void
  onGenerateImage: () => void
  isActive: boolean
  toggleActive: () => void
  previousScene?: Scene
  nextScene?: Scene
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedHeading, setEditedHeading] = useState(scene.heading)
  const [editedContent, setEditedContent] = useState(scene.content)
  const [editedNotes, setEditedNotes] = useState(scene.notes || "")

  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Reset form when scene changes
  useEffect(() => {
    setEditedHeading(scene.heading)
    setEditedContent(scene.content)
    setEditedNotes(scene.notes || "")
  }, [scene])

  // Auto-resize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto"
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`
    }
  }, [editedContent, isActive])

  const handleSave = () => {
    onUpdate({
      heading: editedHeading,
      content: editedContent,
      notes: editedNotes,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeading(scene.heading)
    setEditedContent(scene.content)
    setEditedNotes(scene.notes || "")
    setIsEditing(false)
  }

  return (
    <div
      className={`mb-4 rounded-lg overflow-hidden transition-all duration-300 ${isActive ? "border-2 border-amber-500" : "border border-white/20"}`}
    >
      {/* Scene header */}
      <div
        className={`p-3 flex items-center justify-between cursor-pointer ${isActive ? "bg-amber-900/50" : "bg-white/5"}`}
        onClick={toggleActive}
      >
        <div className="flex items-center">
          <Film className="w-4 h-4 mr-2" />
          <h3 className="font-medium truncate">{scene.heading}</h3>
        </div>
        <div className="flex items-center space-x-1">
          {scene.images && scene.images.length > 0 && <Camera className="w-4 h-4 text-green-400" title="Has images" />}
          {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {/* Scene content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-black/20">
              {/* Scene images */}
              {scene.images && scene.images.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-white/80">Scene Visualization</h4>
                    <button
                      onClick={onGenerateImage}
                      className="text-xs px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 rounded flex items-center"
                    >
                      <Palette className="w-3 h-3 mr-1" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {scene.images.map((image, index) => (
                      <div key={index} className="relative rounded overflow-hidden aspect-video">
                        <img
                          src={image || "/assets/scene-visualization-1.png"}
                          alt={`Scene visualization ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Scene Heading</label>
                    <input
                      type="text"
                      value={editedHeading}
                      onChange={(e) => setEditedHeading(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Scene Content</label>
                    <textarea
                      ref={contentRef}
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50 min-h-[200px] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">Notes</label>
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50 min-h-[80px] resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button onClick={handleCancel} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-3 py-1.5 bg-amber-600/50 hover:bg-amber-600/70 rounded">
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Scene content display */}
                  <pre className="whitespace-pre-wrap font-sans text-sm mb-4 p-3 bg-black/20 rounded">
                    {scene.content}
                  </pre>

                  {/* Scene notes */}
                  {scene.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-white/80 mb-1">Notes</h4>
                      <div className="text-sm text-white/70 p-2 bg-white/5 rounded">{scene.notes}</div>
                    </div>
                  )}

                  {/* Scene connections */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {previousScene && (
                      <div className="text-xs p-2 bg-white/5 rounded">
                        <span className="block text-white/60 mb-1">Previous Scene:</span>
                        <span className="block truncate">{previousScene.heading}</span>
                      </div>
                    )}

                    {nextScene && (
                      <div className="text-xs p-2 bg-white/5 rounded">
                        <span className="block text-white/60 mb-1">Next Scene:</span>
                        <span className="block truncate">{nextScene.heading}</span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 rounded flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={onGenerateImage}
                      className="px-3 py-1.5 bg-purple-600/30 hover:bg-purple-600/50 rounded flex items-center"
                    >
                      <Image className="w-4 h-4 mr-1.5" />
                      <span>{scene.images && scene.images.length > 0 ? "Regenerate Image" : "Generate Image"}</span>
                    </button>

                    <button
                      onClick={onDelete}
                      className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 rounded flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Main screenplay editor component
export default function ScreenplayEditor() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [screenplay, setScreenplay] = useState<Screenplay | null>(null)
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null)
  const [newScenePosition, setNewScenePosition] = useState<number | null>(null)
  const [newSceneHeading, setNewSceneHeading] = useState("")
  const [isAddingScene, setIsAddingScene] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [generatingImageForSceneId, setGeneratingImageForSceneId] = useState<string | null>(null)
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false)
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [critiquePending, setCritiquePending] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Check if screenplay was sent from critic
  useEffect(() => {
    const loadScreenplay = async () => {
      setIsLoading(true)

      try {
        const source = searchParams?.get("source")
        if (source === "critic") {
          const criticScreenplay = sessionStorage.getItem("screenplay_to_edit")
          if (criticScreenplay) {
            // Parse the screenplay from the critic
            const parsedScreenplay = JSON.parse(criticScreenplay)
            setScreenplay(parsedScreenplay)

            // Set the first scene as active
            if (parsedScreenplay.scenes && parsedScreenplay.scenes.length > 0) {
              setActiveSceneId(parsedScreenplay.scenes[0].id)
            }
          } else {
            // Create a new empty screenplay
            createNewScreenplay()
          }
        } else {
          // Create a new empty screenplay
          createNewScreenplay()
        }
      } catch (error) {
        console.error("Error loading screenplay:", error)
        // Create a new empty screenplay on error
        createNewScreenplay()
      } finally {
        setIsLoading(false)
      }
    }

    loadScreenplay()
  }, [searchParams])

  // Create a new empty screenplay
  const createNewScreenplay = async () => {
    const newScreenplay: Screenplay = {
      id: `screenplay_${Date.now()}`,
      title: "Untitled Screenplay",
      author: "Anonymous",
      genre: ["Drama"],
      logline: "A character faces a challenge and must overcome obstacles to achieve their goal.",
      scenes: [],
      lastModified: new Date(),
    }

    // Add an initial scene
    const initialScene = await generateScene("APARTMENT - DAY")
    newScreenplay.scenes.push(initialScene)

    setScreenplay(newScreenplay)
    setActiveSceneId(initialScene.id)
  }

  // Handle scene update
  const handleSceneUpdate = async (sceneId: string, updates: Partial<Scene>) => {
    if (!screenplay) return

    try {
      const updatedScreenplay = await updateScene(screenplay, sceneId, updates)
      setScreenplay(updatedScreenplay)

      // Show save indicator
      setSaveMessage("Changes saved")
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (error) {
      console.error("Error updating scene:", error)
    }
  }

  // Handle scene deletion
  const handleSceneDelete = (sceneId: string) => {
    if (!screenplay) return

    // Filter out the deleted scene
    const updatedScenes = screenplay.scenes.filter((scene) => scene.id !== sceneId)

    // Update the screenplay
    setScreenplay({
      ...screenplay,
      scenes: updatedScenes,
      lastModified: new Date(),
    })

    // If the active scene was deleted, set a new active scene
    if (activeSceneId === sceneId) {
      setActiveSceneId(updatedScenes.length > 0 ? updatedScenes[0].id : null)
    }

    // Show save indicator
    setSaveMessage("Scene deleted")
    setTimeout(() => setSaveMessage(""), 2000)
  }

  // Handle adding a new scene
  const handleAddScene = async () => {
    if (!screenplay) return

    setIsGenerating(true)

    try {
      // Generate a new scene
      const newScene = await generateScene(newSceneHeading)

      // Add the scene to the screenplay at the specified position
      const position = newScenePosition !== null ? newScenePosition : screenplay.scenes.length
      const updatedScreenplay = await addScene(screenplay, newScene, position)

      setScreenplay(updatedScreenplay)
      setActiveSceneId(newScene.id)
      setIsAddingScene(false)
      setNewSceneHeading("")
      setNewScenePosition(null)

      // Show save indicator
      setSaveMessage("New scene added")
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (error) {
      console.error("Error adding scene:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle generating an image for a scene
  const handleGenerateImage = async (sceneId: string) => {
    if (!screenplay) return

    setIsGeneratingImage(true)
    setGeneratingImageForSceneId(sceneId)

    try {
      const scene = screenplay.scenes.find((s) => s.id === sceneId)
      if (!scene) return

      // Generate image variations
      const imageResponses = await generateSceneImageVariations(
        {
          prompt: `${scene.heading}: ${scene.content.substring(0, 100)}...`,
          style: "cinematic, detailed, atmospheric",
        },
        2,
      )

      // Extract successful image URLs
      const imageUrls = imageResponses
        .filter((response) => response.success && response.imageUrl)
        .map((response) => response.imageUrl as string)

      if (imageUrls.length > 0) {
        // Update the scene with the generated images
        await handleSceneUpdate(sceneId, { images: imageUrls })
        toast({
          title: "Images generated",
          description: "Scene visualizations have been created successfully.",
        })
      } else {
        toast({
          title: "Image generation failed",
          description: "Could not generate scene visualizations. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating image:", error)
      toast({
        title: "Error",
        description: "Failed to generate scene visualizations.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
      setGeneratingImageForSceneId(null)
    }
  }

  // Handle downloading the screenplay as PDF
  const handleDownloadPDF = async () => {
    if (!screenplay) return

    setIsGeneratingPDF(true)
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your screenplay...",
    })

    try {
      // For now, we'll create a simple PDF using client-side JavaScript
      // In a production app, you would use a more robust PDF generation library

      // Create a simple PDF structure
      let content = `
        <html>
          <head>
            <title>${screenplay.title}</title>
            <style>
              body { font-family: Courier, monospace; margin: 1in; }
              h1 { text-align: center; margin-top: 2in; }
              .title-page { text-align: center; page-break-after: always; }
              .author { margin-top: 1in; }
              .scene-heading { text-transform: uppercase; font-weight: bold; margin-top: 2em; }
              .scene-content { margin: 1em 0; }
              .scene-notes { font-style: italic; color: #666; }
            </style>
          </head>
          <body>
            <div class="title-page">
              <h1>${screenplay.title}</h1>
              <p class="author">by ${screenplay.author}</p>
              <p>${screenplay.genre.join(", ")}</p>
              <p>${new Date().toLocaleDateString()}</p>
            </div>
      `

      // Add each scene
      screenplay.scenes.forEach((scene) => {
        content += `
          <div class="scene">
            <p class="scene-heading">${scene.heading}</p>
            <div class="scene-content">${scene.content.replace(/\n/g, "<br>")}</div>
            ${scene.notes ? `<p class="scene-notes">${scene.notes}</p>` : ""}
          </div>
        `
      })

      content += `
          </body>
        </html>
      `

      // Create a Blob from the HTML content
      const blob = new Blob([content], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      // Open the HTML in a new window for printing
      const printWindow = window.open(url, "_blank")
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print()
          URL.revokeObjectURL(url)
        }
      }

      toast({
        title: "PDF Ready",
        description: "Your screenplay has been prepared for printing/saving as PDF.",
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      toast({
        title: "PDF Generation Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Handle saving the screenplay
  const handleSaveScreenplay = () => {
    if (!screenplay) return

    setIsSaving(true)

    try {
      // In a real app, this would save to a database
      // For demo purposes, we'll save to localStorage
      localStorage.setItem(`screenplay_${screenplay.id}`, JSON.stringify(screenplay))

      // Show save indicator
      setSaveMessage("Screenplay saved to Drive")
      setTimeout(() => setSaveMessage(""), 2000)
    } catch (error) {
      console.error("Error saving screenplay:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle downloading the screenplay
  const handleDownloadScreenplay = () => {
    if (!screenplay) return

    try {
      // Format the screenplay as a text file
      let content = `Title: ${screenplay.title}\n`
      content += `Author: ${screenplay.author}\n`
      content += `Genre: ${screenplay.genre.join(", ")}\n\n`
      content += `Logline: ${screenplay.logline}\n\n`

      // Add each scene
      screenplay.scenes.forEach((scene, index) => {
        content += `${scene.heading}\n\n`
        content += `${scene.content}\n\n`

        if (scene.notes) {
          content += `/* Notes: ${scene.notes} */\n\n`
        }
      })

      // Create a download link
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${screenplay.title.replace(/\s+/g, "_")}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading screenplay:", error)
    }
  }

  // Handle adding a collaborator
  const handleAddCollaborator = () => {
    if (!collaboratorEmail || collaborators.includes(collaboratorEmail)) return

    setCollaborators([...collaborators, collaboratorEmail])
    setCollaboratorEmail("")
    setShowCollaboratorModal(false)

    // Show save indicator
    setSaveMessage(`Collaborator ${collaboratorEmail} added`)
    setTimeout(() => setSaveMessage(""), 2000)
  }

  // Handle sending to critic
  const handleSendToCritic = () => {
    if (!screenplay) return

    // Save screenplay to session storage for the critic
    sessionStorage.setItem("screenplay_to_analyze", JSON.stringify(screenplay))

    // Navigate to critic page
    setCritiquePending(true)
    router.push("/critic?source=editor")
  }

  // Find previous and next scenes for a given scene
  const getPreviousAndNextScenes = (sceneId: string) => {
    if (!screenplay) return { previousScene: undefined, nextScene: undefined }

    const sceneIndex = screenplay.scenes.findIndex((scene) => scene.id === sceneId)
    if (sceneIndex === -1) return { previousScene: undefined, nextScene: undefined }

    const previousScene = sceneIndex > 0 ? screenplay.scenes[sceneIndex - 1] : undefined
    const nextScene = sceneIndex < screenplay.scenes.length - 1 ? screenplay.scenes[sceneIndex + 1] : undefined

    return { previousScene, nextScene }
  }

  if (isLoading) {
    return <SimpleFilmRollLoader message="Loading Screenplay Editor..." />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>

      {/* Loading overlay */}
      {(isGenerating || isGeneratingImage || isGeneratingPDF) && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 border-8 border-gray-700 rounded-full animate-spin border-t-amber-500 mb-4"></div>
            <p className="text-white text-lg">
              {isGenerating
                ? "Generating new scene..."
                : isGeneratingPDF
                  ? "Creating PDF document..."
                  : `Generating image for scene...`}
            </p>
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          {/* Save indicator */}
          {saveMessage && (
            <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm animate-fade-in-out">
              {saveMessage}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider">SCREENPLAY EDITOR</h1>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Craft your screenplay with collaborative tools and AI-powered assistance.
          </p>
        </div>

        {screenplay && (
          <div className="max-w-5xl mx-auto">
            {/* Screenplay header */}
            <GlassCard className="p-6 mb-8 rounded-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div className="mb-4 md:mb-0">
                  <input
                    type="text"
                    value={screenplay.title}
                    onChange={(e) => setScreenplay({ ...screenplay, title: e.target.value })}
                    className="text-2xl font-bold bg-transparent border-b border-white/20 focus:border-amber-500 focus:outline-none pb-1 w-full md:w-auto"
                    placeholder="Screenplay Title"
                  />
                  <div className="flex flex-wrap items-center mt-2 text-sm text-white/70">
                    <span className="mr-4">By: {screenplay.author}</span>
                    <span className="mr-4">Scenes: {screenplay.scenes.length}</span>
                    <span>Genre: {screenplay.genre.join(", ")}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleSaveScreenplay}
                    className="px-3 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg flex items-center"
                    disabled={isSaving}
                  >
                    <Save className="w-4 h-4 mr-1.5" />
                    <span>{isSaving ? "Saving..." : "Save to Drive"}</span>
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className="px-3 py-2 bg-green-600/30 hover:bg-green-600/50 rounded-lg flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={handleDownloadScreenplay}
                    className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 rounded-lg flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    <span>Download Text</span>
                  </button>

                  <button
                    onClick={() => setShowCollaboratorModal(true)}
                    className="px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg flex items-center"
                  >
                    <Share className="w-4 h-4 mr-1.5" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={handleSendToCritic}
                    className="px-3 py-2 bg-amber-600/30 hover:bg-amber-600/50 rounded-lg flex items-center"
                    disabled={critiquePending}
                  >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    <span>{critiquePending ? "Opening Critic..." : "Get Critique"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">Logline</label>
                <textarea
                  value={screenplay.logline}
                  onChange={(e) => setScreenplay({ ...screenplay, logline: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
                  rows={2}
                  placeholder="Write a one-sentence summary of your screenplay..."
                />
              </div>

              {/* Collaborators */}
              {collaborators.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-white/80 mb-2">Collaborators</h3>
                  <div className="flex flex-wrap gap-2">
                    {collaborators.map((email, index) => (
                      <div key={index} className="px-2 py-1 bg-white/10 rounded-full text-xs flex items-center">
                        <span>{email}</span>
                        <button
                          onClick={() => setCollaborators(collaborators.filter((_, i) => i !== index))}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Scenes section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Scenes</h2>
                <button
                  onClick={() => setIsAddingScene(true)}
                  className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 rounded-lg flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Add Scene</span>
                </button>
              </div>

              {/* Add scene form */}
              {isAddingScene && (
                <GlassCard className="p-4 mb-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">Add New Scene</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Scene Heading</label>
                      <input
                        type="text"
                        value={newSceneHeading}
                        onChange={(e) => setNewSceneHeading(e.target.value)}
                        placeholder="e.g., INT. APARTMENT - DAY"
                        className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">Position</label>
                      <select
                        value={newScenePosition === null ? "" : newScenePosition.toString()}
                        onChange={(e) =>
                          setNewScenePosition(e.target.value === "" ? null : Number.parseInt(e.target.value))
                        }
                        className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      >
                        <option value="">At the end</option>
                        {screenplay.scenes.map((scene, index) => (
                          <option key={index} value={index}>
                            Before: {scene.heading}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setIsAddingScene(false)
                          setNewSceneHeading("")
                          setNewScenePosition(null)
                        }}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddScene}
                        disabled={!newSceneHeading.trim()}
                        className={`px-3 py-1.5 rounded ${
                          newSceneHeading.trim()
                            ? "bg-amber-600/50 hover:bg-amber-600/70"
                            : "bg-amber-600/20 cursor-not-allowed"
                        }`}
                      >
                        Generate Scene
                      </button>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Scene list */}
              <div className="space-y-2">
                {screenplay.scenes.map((scene, index) => {
                  const { previousScene, nextScene } = getPreviousAndNextScenes(scene.id)

                  return (
                    <SceneEditor
                      key={scene.id}
                      scene={scene}
                      onUpdate={(updates) => handleSceneUpdate(scene.id, updates)}
                      onDelete={() => handleSceneDelete(scene.id)}
                      onGenerateImage={() => handleGenerateImage(scene.id)}
                      isActive={activeSceneId === scene.id}
                      toggleActive={() => setActiveSceneId(activeSceneId === scene.id ? null : scene.id)}
                      previousScene={previousScene}
                      nextScene={nextScene}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collaborator modal */}
      {showCollaboratorModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Share Screenplay</h2>
            <p className="text-white/70 mb-4">
              Invite collaborators to work on this screenplay with you. They will be able to edit and comment on your
              work.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
              <input
                type="email"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
                placeholder="collaborator@example.com"
                className="w-full p-2 bg-white/5 border border-white/20 rounded focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCollaboratorModal(false)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCollaborator}
                disabled={!collaboratorEmail.includes("@")}
                className={`px-3 py-1.5 rounded ${
                  collaboratorEmail.includes("@")
                    ? "bg-amber-600/50 hover:bg-amber-600/70"
                    : "bg-amber-600/20 cursor-not-allowed"
                }`}
              >
                Add Collaborator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

