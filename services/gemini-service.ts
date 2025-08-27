// Service for interacting with Google Gemini API

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

export interface GeminiResponse {
  success: boolean
  content?: string
  error?: string
}

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Retry function with exponential backoff
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let retries = 0
  let lastError: any

  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // If it's a rate limit error (429), wait and retry
      if (error.status === 429) {
        const delayTime = initialDelay * Math.pow(2, retries)
        console.log(`Rate limited. Retrying in ${delayTime}ms...`)
        await delay(delayTime)
        retries++
      } else {
        // For other errors, don't retry
        throw error
      }
    }
  }

  throw lastError
}

export async function analyzeScreenplay(screenplayText: string, analysisType: string): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    return {
      success: false,
      error: "Gemini API key is not configured. Please add your API key to the environment variables.",
    }
  }

  try {
    // Create a detailed prompt based on the analysis type
    const prompt = createAnalysisPrompt(analysisType, screenplayText)

    // Use retry logic with backoff
    const response = await retryWithBackoff(async () => {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            parts: [
              {
                text: `You are an expert screenplay critic with decades of experience in film analysis, 
                screenwriting, and film theory. Analyze the screenplay with attention to ${analysisType}. 
                Be specific, constructive, and insightful. Provide clear examples from the text.
                Format your response with clear sections and bullet points where appropriate.`,
              },
            ],
          },
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      })

      if (!res.ok) {
        const error: any = new Error(`API request failed with status ${res.status}`)
        error.status = res.status
        throw error
      }

      return res
    })

    const data = await response.json()
    const generatedText = data.candidates[0].content.parts[0].text

    return {
      success: true,
      content: generatedText,
    }
  } catch (error) {
    console.error("Error analyzing screenplay:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

function createAnalysisPrompt(analysisType: string, screenplayText: string): string {
  // Truncate screenplay if it's too long (Gemini has token limits)
  const truncatedScreenplay =
    screenplayText.length > 30000 ? screenplayText.substring(0, 30000) + "... [truncated for length]" : screenplayText

  // Common formatting instructions to add to all prompts
  const formattingInstructions = `
  Format your response with clear sections:
  
  # Main Analysis
  Provide your main analysis here.
  
  ## Strengths
  - List 3-5 specific strengths with clear examples
  
  ## Weaknesses
  - List 3-5 specific weaknesses with clear examples
  
  ## Recommendations
  - Provide 3-5 actionable recommendations for improvement
  
  Be specific, constructive, and insightful. Provide clear examples from the text.
  `

  switch (analysisType) {
    case "comprehensive":
      return `Provide a comprehensive analysis of this screenplay, covering structure, character development, dialogue, 
      visual storytelling, pacing, theme, and genre conventions. Identify the screenplay's strengths and weaknesses, 
      and provide specific, actionable feedback for improvement.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "structure":
      return `Analyze this screenplay's structure. Identify whether it follows three-act structure, hero's journey, 
      or another recognizable pattern. Evaluate the effectiveness of the setup, inciting incident, rising action, 
      midpoint, climax, and resolution. Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "character":
      return `Analyze the character development in this screenplay. Evaluate the protagonist's arc, the antagonist's 
      motivations, and the dimensionality of supporting characters. Identify character goals, conflicts, and transformations. 
      Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "dialogue":
      return `Analyze the dialogue in this screenplay. Evaluate how well the dialogue reveals character, advances plot, 
      and creates subtext. Identify instances of on-the-nose dialogue, distinctive character voices, and effective use of 
      silence. Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "visual":
      return `Analyze the visual storytelling in this screenplay. Evaluate how effectively the screenplay creates 
      imagery through scene descriptions, action lines, and visual motifs. Identify instances of "showing" rather than 
      "telling." Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "pacing":
      return `Analyze the pacing in this screenplay. Evaluate the rhythm and flow of scenes, the balance of action and dialogue,
      and the overall momentum of the story. Identify any areas that drag or feel rushed. Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "theme":
      return `Analyze the thematic elements in this screenplay. Identify the central themes and how they're developed
      throughout the story. Evaluate how effectively the themes are integrated with character and plot. Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "genre":
      return `Analyze how this screenplay works within its genre. Identify the genre conventions it follows and any it subverts.
      Evaluate how effectively it meets audience expectations while offering something fresh. Provide specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`

    case "scene":
      return `Analyze this scene description or short screenplay. Evaluate its effectiveness in terms of visual storytelling,
      character development, dialogue, and dramatic tension. Provide specific, actionable feedback for improvement.
      
      ${formattingInstructions}
      
      Scene:
      ${truncatedScreenplay}`

    default:
      return `Analyze this screenplay and provide constructive feedback for improvement. Focus on both strengths and 
      weaknesses, with specific examples from the text.
      
      ${formattingInstructions}
      
      Screenplay:
      ${truncatedScreenplay}`
  }
}

// Function to parse screenplay text from different file formats
// Use JavaScript fallback for pdfjs-dist to avoid requiring .wasm files
import { extractTextFromPDF } from '@/components/pdf-handler';

export async function parseScreenplayFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    // For PDF files, use the client-side PDF handler
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      // Only attempt PDF extraction in the browser
      if (typeof window === 'undefined') {
        reject(new Error('PDF processing is only available in the browser'));
        return;
      }
      
      extractTextFromPDF(file)
        .then(resolve)
        .catch(reject);
      return;
    }

    // For DOCX files
    if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || fileName.endsWith(".docx")) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          if (!event.target?.result) {
            throw new Error("Failed to read DOCX file");
          }

          const mammoth = await import("mammoth");
          const arrayBuffer = event.target.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(new Error("Failed to extract text from DOCX"));
        }
      };

      reader.onerror = () => reject(new Error("Error reading DOCX file"));
      reader.readAsArrayBuffer(file);
      return;
    }

    // For plain text files
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read text file"));
      }
    };

    reader.onerror = () => reject(new Error("Error reading text file"));
    reader.readAsText(file);
  });
}

// Update the validateScreenplayFile function to be more permissive with file sizes for PDFs

// Replace the existing validateScreenplayFile function with this improved version:
export function validateScreenplayFile(file: File): { valid: boolean; message?: string } {
  // Check file type
  const validTypes = [".pdf", ".docx", ".txt"]
  const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

  if (!validTypes.includes(fileExtension)) {
    return {
      valid: false,
      message: "Invalid file type. Please upload a PDF, DOCX, or TXT file.",
    }
  }

  // Check file size (max 15MB for PDF, 10MB for others)
  const maxSize = fileExtension === ".pdf" ? 15 * 1024 * 1024 : 10 * 1024 * 1024
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File too large. Maximum size is ${fileExtension === ".pdf" ? "15MB" : "10MB"}.`,
    }
  }

  // For PDFs, we can't easily estimate page count, so we'll be more permissive
  if (fileExtension !== ".pdf") {
    // Estimate page count (very rough estimate)
    // ~3000 characters per page for a screenplay
    const estimatedPages = Math.ceil(file.size / 3000)
    if (estimatedPages > 300) {
      return {
        valid: false,
        message: "Screenplay too long. Maximum 300 pages allowed.",
      }
    }
  }

  return { valid: true }
}

export function parseAnalysisResponse(content: string) {
  // First try to extract from formatted sections
  let strengths: string[] = []
  let weaknesses: string[] = []
  let recommendations: string[] = []

  // Look for formatted sections with bullet points
  const strengthsSection = content.match(/## Strengths\s+([\s\S]*?)(?=##|$)/i)
  const weaknessesSection = content.match(/## Weaknesses\s+([\s\S]*?)(?=##|$)/i)
  const recommendationsSection = content.match(/## Recommendations\s+([\s\S]*?)(?=##|$)/i)

  // Extract bullet points from sections
  if (strengthsSection && strengthsSection[1]) {
    const bulletPoints = strengthsSection[1].match(/[-•*]\s+(.*?)(?=[-•*]|$)/g)
    if (bulletPoints) {
      strengths = bulletPoints
        .map((point) => point.replace(/^[-•*]\s+/, "").trim())
        .filter((point) => point.length > 5)
        .slice(0, 5)
    }
  }

  if (weaknessesSection && weaknessesSection[1]) {
    const bulletPoints = weaknessesSection[1].match(/[-•*]\s+(.*?)(?=[-•*]|$)/g)
    if (bulletPoints) {
      weaknesses = bulletPoints
        .map((point) => point.replace(/^[-•*]\s+/, "").trim())
        .filter((point) => point.length > 5)
        .slice(0, 5)
    }
  }

  if (recommendationsSection && recommendationsSection[1]) {
    const bulletPoints = recommendationsSection[1].match(/[-•*]\s+(.*?)(?=[-•*]|$)/g)
    if (bulletPoints) {
      recommendations = bulletPoints
        .map((point) => point.replace(/^[-•*]\s+/, "").trim())
        .filter((point) => point.length > 5)
        .slice(0, 5)
    }
  }

  // Fallback to regex extraction if sections aren't found or are empty
  if (strengths.length === 0) {
    // Extract strengths (look for sections with "strength", "positive", "good", "effective", "works well")
    const strengthsRegex = /(?:strength|positive|good|effective|works well)(?:[^.]*(?:\.\s*)){1,10}/gi
    const strengthsMatch = content.match(strengthsRegex) || []
    strengths = strengthsMatch
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && !s.toLowerCase().includes("weakness") && !s.toLowerCase().includes("however"))
      .slice(0, 5)
  }

  if (weaknesses.length === 0) {
    // Extract weaknesses (look for sections with "weakness", "issue", "problem", "improve", "lacks", "could be better")
    const weaknessesRegex = /(?:weakness|issue|problem|improve|lacks|could be better)(?:[^.]*(?:\.\s*)){1,10}/gi
    const weaknessesMatch = content.match(weaknessesRegex) || []
    weaknesses = weaknessesMatch
      .map((s) => s.trim())
      .filter((s) => s.length > 10)
      .slice(0, 5)
  }

  if (recommendations.length === 0) {
    // Extract recommendations (look for sections with "recommend", "suggest", "consider", "try", "could", "should", "would benefit")
    const recommendationsRegex =
      /(?:recommend|suggest|consider|try|could|should|would benefit)(?:[^.]*(?:\.\s*)){1,10}/gi
    const recommendationsMatch = content.match(recommendationsRegex) || []
    recommendations = recommendationsMatch
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && !s.toLowerCase().includes("weakness"))
      .slice(0, 5)
  }

  return { strengths, weaknesses, recommendations }
}

