"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import {
  ArrowLeft,
  Send,
  Upload,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  FileText,
  AlertCircle,
  BarChart,
  BookOpen,
  MessageSquare,
  Eye,
  Clock,
  Download,
} from "lucide-react"
import SimpleFilmRollLoader from "@/components/simple-film-roll-loader"
import { useMobileDetection } from "@/hooks/use-mobile-detection"
import { GlassCard } from "@/components/glass-card"
import FadeInText from "@/components/fade-in-text"
import {
  analyzeScreenplay,
  validateScreenplayFile,
  parseScreenplayFile,
  parseAnalysisResponse,
} from "@/services/gemini-service"
import AnalysisResultCard from "@/components/analysis-result-card"

// Dynamic import for FloatingPaths component
const FloatingPaths = dynamic(() => import('@/components/floating-paths'), {
  ssr: false,
})

// Analysis category type
type AnalysisCategory = "structure" | "character" | "dialogue" | "visual" | "pacing" | "theme" | "genre" | "formatting"

// Analysis result interface
interface AnalysisResult {
  category: AnalysisCategory
  score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  detailedAnalysis: string
}

export default function CriticPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [windowHeight, setWindowHeight] = useState(0)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "system", content: "Welcome to NOLAN AI Critic. Upload your screenplay or describe a scene for analysis." },
  ])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [screenplayText, setScreenplayText] = useState<string>("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const [activeCategory, setActiveCategory] = useState<AnalysisCategory | null>(null)
  const [overallScore, setOverallScore] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showLineByLineFeedback, setShowLineByLineFeedback] = useState(false)
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0)
  const [linkCopied, setLinkCopied] = useState(false)
  const [editorSourceChecked, setEditorSourceChecked] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isMobile, isClient } = useMobileDetection()

  // Check if screenplay was sent from editor
  useEffect(() => {
    // Only run this effect once
    if (editorSourceChecked) return

    const source = searchParams?.get("source")

    if (source === "editor") {
      const editorScreenplay = sessionStorage.getItem("screenplay_to_analyze")
      if (editorScreenplay) {
        try {
          const parsedScreenplay = JSON.parse(editorScreenplay)
          setScreenplayText(editorScreenplay)
          setMessages((prev) => [
            ...prev,
            {
              role: "user",
              content: editorScreenplay || "", // Fallback to an empty string if `editorScreenplay` is undefined
            },
          ])
          // Create a mock file for the uploaded screenplay
          const mockFile = new File([editorScreenplay], "screenplay-from-editor.txt", { type: "text/plain" })
          setUploadedFile(mockFile)

          // Automatically start analysis after a short delay
          setTimeout(() => {
            analyzeUploadedScreenplay()
          }, 1000)
        } catch (error) {
          console.error("Error parsing screenplay from editor:", error)
          setErrorMessage("Error parsing screenplay from editor. Please try again.")
        }
      }
    }

    setEditorSourceChecked(true)
  }, [searchParams, editorSourceChecked])

  useEffect(() => {
    // Simulate loading with film reel animation
    const timer = setTimeout(() => {
      setIsLoading(false)

      // After loading animation completes, set content as loaded
      setTimeout(() => {
        setIsLoaded(true)
      }, 300)
    }, 2000) // Show loading animation for 2 seconds

    // Track window height for responsive adjustments
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setErrorMessage(null)

    try {
      // Validate file
      const validation = validateScreenplayFile(file)
      if (!validation.valid) {
        setErrorMessage(validation.message || "Invalid file")
        setIsUploading(false)
        return
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Processing ${file.name}... This may take a moment for PDF files.`,
        },
      ])

      try {
        const text = await parseScreenplayFile(file)
        setScreenplayText(text)
        setUploadedFile(file)

        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "user",
            content: `Uploaded screenplay: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
          }
          return newMessages
        })
      } catch (parseError) {
        console.error("Error parsing file:", parseError)
        setErrorMessage(`Error processing file: ${parseError instanceof Error ? parseError.message : "Unknown error"}`)

        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "system",
            content: `Error processing ${file.name}: ${parseError instanceof Error ? parseError.message : "Unknown error"}. Please try a different file format.`,
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setErrorMessage("Error uploading file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle prompt submission
  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() && !uploadedFile) return

    // Add user message
    const userMessage = uploadedFile ? `Analyze screenplay: ${uploadedFile.name}` : prompt

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // If there's a screenplay uploaded, analyze it
    if (uploadedFile && screenplayText) {
      analyzeUploadedScreenplay()
    } else if (prompt.trim()) {
      // Otherwise, analyze the prompt as a scene description
      analyzeSceneDescription(prompt)
    }

    // Clear input
    setPrompt("")
  }

  // Helper function to delay execution
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  // Analyze uploaded screenplay
  const analyzeUploadedScreenplay = async () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    setMessages((prev) => [...prev, { role: "system", content: "Analyzing your screenplay..." }])

    try {
      // Define categories to analyze
      const categories: AnalysisCategory[] = [
        "structure",
        "character",
        "dialogue",
        "visual",
        "pacing",
        "theme",
        "genre",
        "formatting",
      ]

      const results: AnalysisResult[] = []

      // Analyze each category sequentially
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i]
        setAnalysisProgress(Math.round((i / categories.length) * 100))

        // Update message to show current category
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "system",
            content: `Analyzing ${category} (${i + 1}/${categories.length})...`,
          }
          return newMessages
        })

        // Call Gemini API for this category
        const response = await analyzeScreenplay(screenplayText, category)

        if (response.success && response.content) {
          // Parse the response into structured data
          const { strengths, weaknesses, recommendations } = parseAnalysisResponse(response.content)
          const score = 75 // Placeholder score
          const result = {
            category,
            score,
            strengths,
            weaknesses,
            recommendations,
            detailedAnalysis: response.content,
          }
          results.push(result)
        } else {
          throw new Error(response.error || "Analysis failed")
        }

        // Add a delay between API calls to avoid rate limiting
        await delay(1000)
      }

      // Calculate overall score
      const avgScore = results.reduce((sum, result) => sum + result.score, 0) / results.length
      setOverallScore(Math.round(avgScore))

      // Set analysis results
      setAnalysisResults(results)

      // Set active category to the first one
      setActiveCategory(results[0]?.category || null)

      // Update message with completion
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: "system",
          content: "Analysis complete! Review the detailed feedback below.",
        }
        return newMessages
      })
    } catch (error) {
      console.error("Error analyzing screenplay:", error)
      setErrorMessage(`Error analyzing screenplay: ${error instanceof Error ? error.message : "Unknown error"}`)

      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: "system",
          content: `Error analyzing screenplay. ${error instanceof Error ? error.message : "Please try again."}`,
        }
        return newMessages
      })
    } finally {
      setIsAnalyzing(false)
      setAnalysisProgress(100)
    }
  }

  // Analyze scene description
  const analyzeSceneDescription = async (sceneDescription: string) => {
    setIsAnalyzing(true)
    setMessages((prev) => [...prev, { role: "system", content: "Analyzing your scene description..." }])

    try {
      // Call Gemini API for scene analysis
      const response = await analyzeScreenplay(sceneDescription, "scene")

      if (response.success && response.content) {
        // Show line-by-line feedback for scene descriptions
        setShowLineByLineFeedback(true)
        setCurrentFeedbackIndex(0)

        // Update message with the analysis, providing a fallback value
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: "system",
            content: response.content || "No analysis available.",
          }
          return newMessages
        })
      } else {
        throw new Error(response.error || "Analysis failed")
      }
    } catch (error) {
      console.error("Error analyzing scene:", error)
      setErrorMessage(`Error analyzing scene: ${error instanceof Error ? error.message : "Unknown error"}`)

      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[newMessages.length - 1] = {
          role: "system",
          content: `Error analyzing scene. ${error instanceof Error ? error.message : "Please try again."}`,
        }
        return newMessages
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Copy share link
  const copyShareLink = () => {
    // In a real app, this would generate a unique link
    const shareLink = `${window.location.origin}/critic?shared=true`

    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy link:", err)
      })
  }

  // Calculate dynamic padding based on window height
  const dynamicPadding = windowHeight > 800 ? "py-8" : windowHeight > 700 ? "py-6" : "py-4"

  // Add this function inside the component
  const downloadConversation = async () => {
    try {
      // Prompt the user for a file name
      const fileName = window.prompt("Enter a file name for the conversation:", "screenplay-critique-conversation")
      if (!fileName) return // User cancelled

      // Create a more comprehensive text version of the conversation
      let conversationText = "# NOLAN  SCREENPLAY CRITIC - CONVERSATION LOG\n\n"
      conversationText += `Date: ${new Date().toLocaleString()}\n`

      if (uploadedFile) {
        conversationText += `Screenplay: ${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)\n`
      }

      if (overallScore) {
        conversationText += `Overall Score: ${overallScore}/100 - ${getScoreRating(overallScore)}\n`
      }

      conversationText += "\n## CONVERSATION\n\n"

      // Add the conversation messages
      conversationText += messages
        .map((msg) => `${msg.role === "user" ? "YOU" : "AI CRITIC"}: ${msg.content}`)
        .join("\n\n")

      // Add analysis results if available
      if (analysisResults.length > 0) {
        conversationText += "\n\n## DETAILED ANALYSIS RESULTS\n\n"

        analysisResults.forEach((result) => {
          conversationText += `### ${result.category.toUpperCase()} ANALYSIS\n`
          conversationText += `Score: ${result.score}/100 - ${getScoreRating(result.score)}\n\n`

          conversationText += "STRENGTHS:\n"
          result.strengths.forEach((strength, i) => {
            conversationText += `${i + 1}. ${strength}\n`
          })
          conversationText += "\n"

          conversationText += "WEAKNESSES:\n"
          result.weaknesses.forEach((weakness, i) => {
            conversationText += `${i + 1}. ${weakness}\n`
          })
          conversationText += "\n"

          conversationText += "RECOMMENDATIONS:\n"
          result.recommendations.forEach((rec, i) => {
            conversationText += `${i + 1}. ${rec}\n`
          })
          conversationText += "\n\n"
        })
      }

      // Create a blob with the conversation content
      const blob = new Blob([conversationText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      // Create a link and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = `${fileName}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Show success message
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Conversation saved successfully!",
        },
      ])
    } catch (error) {
      console.error("Error downloading conversation:", error)
      setErrorMessage("Error saving conversation. Please try again.")
    }
  }

  const resetChat = () => {
    setMessages([
      {
        role: "system",
        content: "Welcome to NOLAN AI Critic. Upload your screenplay or describe a scene for analysis.",
      },
    ])
    setAnalysisResults([])
    setOverallScore(null)
    setErrorMessage(null)
    setUploadedFile(null)
    setScreenplayText("")
    setActiveCategory(null)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getScoreRating = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Good"
    if (score >= 70) return "Fair"
    return "Needs Improvement"
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const downloadAnalysis = async () => {
    if (!analysisResults.length) return

    try {
      setIsAnalyzing(true)

      // Create a comprehensive report that includes all analysis categories
      const reportTitle = uploadedFile ? `Analysis Report - ${uploadedFile.name}` : "Screenplay Analysis Report"

      // Create HTML content for the report
      let reportContent = `
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #5a3e2b; border-bottom: 2px solid #d4a76a; padding-bottom: 10px; }
            h2 { color: #7d5a38; margin-top: 30px; }
            h3 { color: #9c7a58; }
            .score { font-size: 24px; font-weight: bold; margin: 20px 0; }
            .score-excellent { color: #4caf50; }
            .score-good { color: #8bc34a; }
            .score-fair { color: #ffc107; }
            .score-needs-improvement { color: #f44336; }
            .section { margin-bottom: 30px; }
            .list-item { margin-bottom: 10px; }
            .category { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            .category-header { display: flex; justify-content: space-between; align-items: center; }
            .detailed-analysis { background-color: #f9f9f9; padding: 15px; border-left: 3px solid #d4a76a; margin-top: 15px; }
            .meta { color: #777; font-size: 14px; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <div class="meta">
            <p>Generated on: ${new Date().toLocaleString()}</p>
            ${uploadedFile ? `<p>File: ${uploadedFile.name} (${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</p>` : ""}
          </div>
          
          <div class="score ${overallScore && overallScore >= 90 ? "score-excellent" : overallScore && overallScore >= 80 ? "score-good" : overallScore && overallScore >= 70 ? "score-fair" : "score-needs-improvement"}">
            Overall Score: ${overallScore}/100 - ${overallScore ? getScoreRating(overallScore) : "N/A"}
          </div>
          
          <h2>Analysis Summary</h2>
    `

      // Add each category to the report
      analysisResults.forEach((result) => {
        const scoreRating = getScoreRating(result.score)
        const scoreColorClass =
          result.score >= 90
            ? "score-excellent"
            : result.score >= 80
              ? "score-good"
              : result.score >= 70
                ? "score-fair"
                : "score-needs-improvement"

        reportContent += `
        <div class="category">
          <div class="category-header">
            <h3>${result.category.charAt(0).toUpperCase() + result.category.slice(1)}</h3>
            <div class="${scoreColorClass}">Score: ${result.score}/100 - ${scoreRating}</div>
          </div>
          
          <div class="section">
            <h4>Strengths</h4>
            <ul>
              ${result.strengths.map((strength) => `<li class="list-item">${strength}</li>`).join("")}
            </ul>
          </div>
          
          <div class="section">
            <h4>Weaknesses</h4>
            <ul>
              ${result.weaknesses.map((weakness) => `<li class="list-item">${weakness}</li>`).join("")}
            </ul>
          </div>
          
          <div class="section">
            <h4>Recommendations</h4>
            <ul>
              ${result.recommendations.map((rec) => `<li class="list-item">${rec}</li>`).join("")}
            </ul>
          </div>
          
          <div class="detailed-analysis">
            <h4>Detailed Analysis</h4>
            <div>${result.detailedAnalysis.replace(/\n/g, "<br>")}</div>
          </div>
        </div>
      `
      })

      reportContent += `
        </body>
      </html>
    `

      // Create a blob from the HTML content
      const blob = new Blob([reportContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)

      // Create a link and trigger download
      const a = document.createElement("a")
      a.href = url
      a.download = `${reportTitle.replace(/\s+/g, "_")}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsAnalyzing(false)
    } catch (error) {
      console.error("Error generating analysis report:", error)
      setErrorMessage("Error generating analysis report. Please try again.")
      setIsAnalyzing(false)
    }
  }

  const clearUploadedFile = () => {
    setUploadedFile(null)
  }

  if (isLoading) {
    return <SimpleFilmRollLoader message="Loading AI Critic..." />
  }

  return (
    <>
      {isAnalyzing && <SimpleFilmRollLoader message={`Analyzing Screenplay... ${analysisProgress}%`} />}

      <div className="min-h-screen bg-gradient-to-b from-amber-900 to-red-900 relative overflow-hidden">
        {/* Background noise texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>

        {/* Floating paths background animation */}
        <div className="absolute inset-0 z-0 opacity-30">
          <FloatingPaths />
        </div>

        {/* Cinematic entrance animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-gradient-to-r from-amber-900/50 to-red-900/50 z-0"
        />

        {/* Back button - only show when not in fullscreen */}
        {!isFullscreen && (
          <div className="container mx-auto px-4 pt-8 relative z-10">
            <Link href="/#" className="inline-flex items-center text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        )}

        <div className={`container mx-auto px-4 ${dynamicPadding} relative z-10 ${isFullscreen ? "pt-4" : "pt-8"}`}>
          {/* Title - only show when not in fullscreen */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-wider">Critic</h1>
              <p className="text-lg text-white/80 max-w-3xl mx-auto">
                Receive professional-level feedback and analysis to elevate your screenplay to its full potential.
              </p>
            </motion.div>
          )}

          {/* Main interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`mx-auto ${isFullscreen ? "max-w-5xl" : "max-w-4xl"}`}
          >
            <GlassCard className="p-4 md:p-6 rounded-xl overflow-hidden relative glass-card-3d">
              <div className="glass-highlight-enhanced"></div>
              {/* Fullscreen toggle and reset buttons */}
              <div className="absolute top-4 right-4 flex space-x-2 z-20">
                <button
                  onClick={resetChat}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  title="Reset conversation"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center">
                  <AlertCircle size={18} className="text-red-400 mr-2" />
                  <p className="text-sm text-white/90">{errorMessage}</p>
                  <button onClick={() => setErrorMessage(null)} className="ml-auto p-1 hover:bg-white/10 rounded-full">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Analysis results */}
              {analysisResults.length > 0 && overallScore !== null && (
                <div className="mb-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                    <h2 className="text-xl font-bold mb-2 md:mb-0">Screenplay Analysis</h2>

                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="mr-2">
                        <div className="text-sm text-white/70 mb-1">Overall Score</div>
                        <div className={`text-2xl font-bold metallic-text-gold`}>
                          {overallScore}/100 - {getScoreRating(overallScore)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category tabs */}
                  <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto pb-2">
                    {analysisResults.map((result) => (
                      <button
                        key={result.category}
                        className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${
                          activeCategory === result.category
                            ? "bg-white/20 text-white"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                        onClick={() => setActiveCategory(result.category)}
                      >
                        {result.category === "structure" && <BookOpen size={14} className="mr-1.5" />}
                        {result.category === "character" && <MessageSquare size={14} className="mr-1.5" />}
                        {result.category === "dialogue" && <MessageSquare size={14} className="mr-1.5" />}
                        {result.category === "visual" && <Eye size={14} className="mr-1.5" />}
                        {result.category === "pacing" && <Clock size={14} className="mr-1.5" />}
                        {result.category === "theme" && <BookOpen size={14} className="mr-1.5" />}
                        {result.category === "genre" && <BarChart size={14} className="mr-1.5" />}
                        {result.category === "formatting" && <FileText size={14} className="mr-1.5" />}

                        <span className="capitalize metallic-text-subtle">{result.category}</span>

                        <span
                          className={`ml-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs ${getScoreColor(result.score)}`}
                        >
                          {result.score}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active category content */}
                  {activeCategory && (
                    <div>
                      {analysisResults
                        .filter((result) => result.category === activeCategory)
                        .map((result, index) => (
                          <AnalysisResultCard
                            key={index}
                            category={result.category}
                            score={result.score}
                            scoreRating={getScoreRating(result.score)}
                            scoreColor={getScoreColor(result.score)}
                            strengths={result.strengths}
                            weaknesses={result.weaknesses}
                            recommendations={result.recommendations}
                            detailedAnalysis={result.detailedAnalysis}
                          />
                        ))}
                    </div>
                  )}

                  {/* Action buttons - positioned at the bottom */}
                  <div className="mt-6 flex flex-wrap justify-center gap-4">
                    <button
                      onClick={downloadAnalysis}
                      className="p-3 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 rounded-lg flex items-center shadow-lg"
                      title="Download analysis report"
                    >
                      <Download size={18} className="mr-2" />
                      <span>Download Full Report</span>
                    </button>
                    <button
                      onClick={downloadConversation}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-lg flex items-center"
                      title="Download conversation"
                    >
                      <Download size={18} className="mr-2" />
                      <span>Save Conversation</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Chat messages container */}
              {(!analysisResults.length || !overallScore) && (
                <div className="flex justify-end mb-2 mt-8">
                  <button
                    onClick={downloadConversation}
                    className="flex items-center text-xs bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1.5 transition-colors"
                    title="Download conversation"
                  >
                    <Download size={14} className="mr-1.5" />
                    <span>Save Conversation</span>
                  </button>
                </div>
              )}

              {/* Chat messages container */}
              {(!analysisResults.length || !overallScore) && (
                <div
                  ref={chatContainerRef}
                  className="mb-4 overflow-y-auto custom-scrollbar-enhanced"
                  style={{
                    height: isFullscreen ? "calc(100vh - 180px)" : "calc(70vh - 180px)",
                    minHeight: "300px",
                  }}
                >
                  {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                      <div
                        className={`inline-block max-w-[85%] px-4 py-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-amber-600/30 text-white rounded-tr-none"
                            : "bg-white/10 text-white rounded-tl-none"
                        }`}
                      >
                        {showLineByLineFeedback && message.role === "system" && index === messages.length - 1 ? (
                          <FadeInText
                            text={message.content}
                            lineDelay={0.2}
                            className="text-sm whitespace-pre-wrap"
                            enableFormatting={true}
                          />
                        ) : (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input form */}
              <form onSubmit={handlePromptSubmit} className="relative">
                {/* File upload indicator */}
                {uploadedFile && (
                  <div className="absolute -top-12 left-0 right-0 bg-white/10 rounded-lg p-2 flex justify-between items-center">
                    <span className="truncate max-w-[80%]">📄 {uploadedFile.name}</span>
                    <button type="button" onClick={clearUploadedFile} className="p-1 rounded-full hover:bg-white/10">
                      <X size={16} />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Analyze a gripping opening scene for a cinematic short film..."
                      className="w-full p-3 pr-10 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/50 resize-none"
                      rows={1}
                      style={{
                        minHeight: "50px",
                        maxHeight: "120px",
                      }}
                      disabled={isAnalyzing}
                    />
                  </div>

                  {/* File upload button */}
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      id="file-upload"
                      disabled={isAnalyzing}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`p-3 rounded-lg flex items-center justify-center cursor-pointer ${
                        isUploading || isAnalyzing ? "bg-amber-600/50 cursor-wait" : "bg-white/10 hover:bg-white/20"
                      } transition-colors ${isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isUploading ? (
                        <div className="w-5 h-5 border-2 border-t-white border-r-white/50 border-b-white/20 border-l-white/10 rounded-full animate-spin"></div>
                      ) : (
                        <Upload size={20} />
                      )}
                    </label>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="p-3 bg-gradient-to-r from-amber-600 to-red-600 rounded-lg hover:from-amber-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={(!prompt.trim() && !uploadedFile) || isAnalyzing || isUploading}
                  >
                    {isAnalyzing ? (
                      <div className="w-5 h-5 border-2 border-t-white border-r-white/50 border-b-white/20 border-l-white/10 rounded-full animate-spin"></div>
                    ) : (
                      <Send size={20} />
                    )}
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>

          {/* Features section - only show when not in fullscreen */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <GlassCard className="p-5 text-center">
                <h3 className="text-lg font-bold mb-2">Structure Analysis</h3>
                <p className="text-white/70 text-sm">
                  Get detailed feedback on your screenplay's structure, pacing, and narrative flow.
                </p>
              </GlassCard>

              <GlassCard className="p-5 text-center">
                <h3 className="text-lg font-bold mb-2">Character Evaluation</h3>
                <p className="text-white/70 text-sm">
                  Receive insights on character development, arcs, and relationship dynamics.
                </p>
              </GlassCard>

              <GlassCard className="p-5 text-center">
                <h3 className="text-lg font-bold mb-2">Dialogue Enhancement</h3>
                <p className="text-white/70 text-sm">
                  Get suggestions to improve dialogue authenticity and character voice.
                </p>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

