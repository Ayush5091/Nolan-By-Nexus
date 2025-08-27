// Enhanced screenplay generation service with fine-tuned model parameters

// Types
export interface GenerationOptions {
  theme: "hollywood" | "shortform" | "bbc"
  prompt: string
  enableImages: boolean
  aspectRatio?: string
  continuousGeneration: boolean
}

export interface GenerationResult {
  success: boolean
  content?: string
  images?: string[]
  error?: string
}

// Improved prompts for different screenplay formats
const formatPrompts = {
  hollywood: `Format the response as a professional Hollywood screenplay with proper scene headings (INT./EXT.), action descriptions, character names in ALL CAPS when first introduced, and dialogue. 

Follow standard screenplay formatting:
1. Scene headings should be in the format: INT./EXT. LOCATION - TIME
2. Action lines should be descriptive and visual
3. Character names should be centered and in ALL CAPS before dialogue
4. Dialogue should be centered and indented
5. Parentheticals for acting directions should be in (parentheses)
6. Transitions like CUT TO: or DISSOLVE TO: should be right-aligned
7. Include a proper FADE IN: at the beginning and FADE OUT. at the end

Create a complete, coherent screenplay with a clear beginning, middle, and end. Include 3-5 scenes with proper transitions between them.`,

  shortform: `Format the response as a short-form script suitable for social media content like TikTok, Instagram Reels, or YouTube Shorts. 

The script should:
1. Be concise and engaging, designed for 15-60 second content
2. Include clear visual directions and dialogue
3. Be formatted with simple scene descriptions and character dialogue
4. Focus on a single concept that can be quickly understood
5. Have a hook in the first few seconds
6. End with a clear punchline or call to action

Keep the total length appropriate for a short-form video (approximately 1-2 pages maximum).`,

  bbc: `Format the response as a BBC-style documentary script with proper formatting for narration, interviews, and visual descriptions.

Follow this structure:
1. Use "NARRATOR:" for voiceover sections
2. Use "VISUAL:" for describing what appears on screen
3. Use "INTERVIEW:" for subject interviews, with the person's name and title
4. Include specific time codes or scene markers
5. Use a formal, authoritative tone for narration
6. Balance factual information with compelling storytelling
7. Include proper introductions and conclusions

The script should be informative, engaging, and follow documentary conventions.`,
}

// Enhanced system prompts with fine-tuned instructions
const getSystemPrompt = (theme: string, prompt: string) => {
  const basePrompt = `You are an expert screenplay writer with experience in Hollywood productions, television, and digital media. 
  
Write a compelling, original screenplay based on the following concept: "${prompt}"

${formatPrompts[theme as keyof typeof formatPrompts]}

IMPORTANT GUIDELINES:
- Create a COMPLETE screenplay with a proper beginning, middle, and end
- Include compelling characters with clear motivations
- Write vivid, visual descriptions that create clear mental images
- Ensure dialogue sounds natural and reveals character
- Maintain consistent tone and pacing throughout
- DO NOT stop mid-screenplay or leave the story unfinished
- DO NOT include meta-commentary or notes about the screenplay
- DO NOT use placeholders or suggestions for the user to fill in

The screenplay should be ready for immediate use without requiring additional work.`

  return basePrompt
}

// Helper function to delay execution
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Generate a screenplay with improved continuous generation
export async function generateScreenplay(options: GenerationOptions): Promise<GenerationResult> {
  try {
    const { theme, prompt, enableImages, continuousGeneration } = options

    // Get the appropriate system prompt
    const systemPrompt = getSystemPrompt(theme, prompt)

    // Generate the initial screenplay
    const initialResponse = await generateWithRetry(prompt, systemPrompt)

    if (!initialResponse.success) {
      return initialResponse
    }

    let screenplayContent = initialResponse.content || ""

    // Check if the screenplay seems incomplete and continuous generation is enabled
    if (
      continuousGeneration &&
      theme === "hollywood" &&
      !screenplayContent.toLowerCase().includes("fade out") &&
      !screenplayContent.toLowerCase().includes("the end")
    ) {
      // Generate a conclusion
      const conclusionPrompt = `Complete the following screenplay with a proper ending and resolution for all plot threads. Add 1-2 final scenes and end with FADE OUT:

${screenplayContent}`

      const conclusionResponse = await generateWithRetry(
        conclusionPrompt,
        "You are completing an unfinished screenplay. Write only the ending scenes. Do not repeat any earlier content. End with FADE OUT.",
      )

      if (conclusionResponse.success && conclusionResponse.content) {
        // Extract just the new content (avoid duplication)
        const newContent = extractNewContent(screenplayContent, conclusionResponse.content)
        screenplayContent += "\n\n" + newContent
      } else {
        // Add a simple ending if conclusion generation fails
        screenplayContent += "\n\nFADE OUT.\n\nTHE END"
      }
    }

    // Generate images if enabled
    const images = enableImages ? await generateImages(prompt, theme) : []

    return {
      success: true,
      content: screenplayContent,
      images,
    }
  } catch (error) {
    console.error("Error generating screenplay:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Helper function to generate with retry logic
async function generateWithRetry(prompt: string, systemPrompt: string, retries = 3): Promise<GenerationResult> {
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY || "",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: prompt,
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
              temperature: 0.75, // Slightly increased for more creativity
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 4096,
              stopSequences: [],
            },
          }),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      const generatedText = data.candidates[0].content.parts[0].text

      return {
        success: true,
        content: generatedText,
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error)

      if (attempt === retries - 1) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to generate after multiple attempts",
        }
      }

      // Exponential backoff
      const backoffTime = Math.pow(2, attempt) * 1000
      await delay(backoffTime)
    }
  }

  return {
    success: false,
    error: "Failed to generate after multiple attempts",
  }
}

// Helper function to extract new content without duplication
function extractNewContent(originalContent: string, newContent: string): string {
  // If the new content is very short, just return it
  if (newContent.length < 100) {
    return newContent
  }

  // Find the last 50 characters of the original content
  const lastChunk = originalContent.slice(-50)

  // Find where this chunk appears in the new content
  const overlapIndex = newContent.indexOf(lastChunk)

  if (overlapIndex !== -1 && overlapIndex < 100) {
    // Return only the part after the overlap
    return newContent.substring(overlapIndex + lastChunk.length)
  }

  // If we can't find a clear overlap, look for scene headings
  const sceneHeadingMatch = newContent.match(/INT\.|EXT\./i)
  if (sceneHeadingMatch && sceneHeadingMatch.index) {
    return newContent.substring(sceneHeadingMatch.index)
  }

  // If all else fails, just return the new content with a separator
  return "...\n\n" + newContent
}

// Generate images for the screenplay
async function generateImages(prompt: string, theme: string): Promise<string[]> {
  // In a real implementation, this would call the Starry AI API
  // For demo purposes, we'll return placeholder images
  await delay(2000) // Simulate API delay

  if (theme === "hollywood") {
    return ["/assets/scene-visualization-1.png", "/assets/scene-visualization-2.png"]
  } else if (theme === "shortform") {
    return ["/assets/placeholder-wide.png"]
  } else {
    return ["/assets/placeholder-wide.png"]
  }
}

