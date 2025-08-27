// Service for screenplay generation and management

import { delay } from "@/utils/helpers"

// Types
export interface Scene {
  id: string
  heading: string
  content: string
  notes?: string
  images?: string[]
}

export interface Screenplay {
  id: string
  title: string
  author: string
  genre: string[]
  logline: string
  scenes: Scene[]
  lastModified: Date
}

// Genre detection patterns with more sophisticated matching
const genrePatterns = [
  {
    genre: "Action",
    patterns: [
      /\b(?:fight|chase|explosion|combat|battle|gun|shoot|action|stunt|martial art|weapon|bomb|thriller)\b/i,
      /\b(?:high-octane|adrenaline|fast-paced|intense|explosive)\b/i,
    ],
  },
  {
    genre: "Drama",
    patterns: [
      /\b(?:emotional|relationship|family|struggle|conflict|personal|character-driven|intimate|drama)\b/i,
      /\b(?:poignant|moving|heartfelt|profound|tragic|realistic)\b/i,
    ],
  },
  {
    genre: "Comedy",
    patterns: [
      /\b(?:funny|humor|joke|laugh|comedy|comedic|hilarious|gag|prank|witty)\b/i,
      /\b(?:amusing|comical|satirical|farcical|slapstick|quirky)\b/i,
    ],
  },
  {
    genre: "Horror",
    patterns: [
      /\b(?:scary|fear|terror|horror|monster|ghost|supernatural|creepy|haunted|nightmare|blood|gore|scream)\b/i,
      /\b(?:frightening|terrifying|eerie|sinister|macabre|disturbing|suspenseful)\b/i,
    ],
  },
  {
    genre: "Science Fiction",
    patterns: [
      /\b(?:sci-fi|science fiction|future|space|alien|robot|technology|dystopian|utopian|advanced|futuristic)\b/i,
      /\b(?:interstellar|galactic|extraterrestrial|cybernetic|technological)\b/i,
    ],
  },
  {
    genre: "Fantasy",
    patterns: [
      /\b(?:magic|wizard|witch|dragon|elf|dwarf|mythical|enchanted|spell|potion|fantasy|magical|mystical)\b/i,
      /\b(?:enchanting|fantastical|mythological|supernatural|otherworldly)\b/i,
    ],
  },
  {
    genre: "Thriller",
    patterns: [
      /\b(?:suspense|mystery|tension|thriller|conspiracy|detective|crime|investigation|twist|suspenseful)\b/i,
      /\b(?:gripping|riveting|nail-biting|edge-of-seat|mysterious|intriguing)\b/i,
    ],
  },
  {
    genre: "Romance",
    patterns: [
      /\b(?:love|romance|relationship|passion|romantic|affection|desire|heart|couple|dating|marriage)\b/i,
      /\b(?:passionate|tender|heartwarming|intimate|amorous|sensual)\b/i,
    ],
  },
  {
    genre: "Western",
    patterns: [
      /\b(?:western|cowboy|sheriff|outlaw|frontier|ranch|saloon|duel|horse|desert|wild west)\b/i,
      /\b(?:rugged|dusty|lawless|frontier|old west)\b/i,
    ],
  },
  {
    genre: "Historical",
    patterns: [
      /\b(?:history|historical|period|era|ancient|medieval|renaissance|century|war|kingdom|empire)\b/i,
      /\b(?:bygone|classical|traditional|vintage|antique|epochal)\b/i,
    ],
  },
]

// Detect genres from screenplay content with improved logic
export function detectGenres(screenplay: Screenplay): string[] {
  const allText = [
    screenplay.title,
    screenplay.logline,
    ...screenplay.scenes.map((scene) => `${scene.heading} ${scene.content}`),
  ].join(" ")

  // Score-based approach for more nuanced genre detection
  const genreScores: Record<string, number> = {}

  genrePatterns.forEach(({ genre, patterns }) => {
    let score = 0
    patterns.forEach((pattern) => {
      const matches = allText.match(pattern) || []
      // Primary patterns get more weight
      score += matches.length * (patterns.indexOf(pattern) === 0 ? 2 : 1)
    })

    // Context-based adjustments
    if (genre === "Thriller" && allText.match(/\b(?:suspenseful|tense|mysterious)\b/i)) {
      score += 3 // Boost for atmospheric descriptions
    }

    if (genre === "Horror" && allText.match(/\b(?:terrifying|frightening|blood-curdling)\b/i)) {
      score += 3 // Boost for fear-inducing descriptions
    }

    genreScores[genre] = score
  })

  // Get top genres (those with scores above threshold)
  const threshold = 2
  const topGenres = Object.entries(genreScores)
    .filter(([_, score]) => score >= threshold)
    .sort(([_, scoreA], [__, scoreB]) => scoreB - scoreA)
    .map(([genre]) => genre)

  // Ensure we have at least one genre
  return topGenres.length > 0 ? topGenres : ["Drama"]
}

// Generate a new scene with improved content
export async function generateScene(prompt: string, previousScene?: Scene): Promise<Scene> {
  try {
    // In a real implementation, this would call an AI service
    // For demo purposes, we'll simulate a response with a delay
    await delay(1500)

    // Generate a unique ID for the scene
    const id = `scene_${Date.now()}`

    // Create a scene heading based on the prompt
    let heading = prompt
    if (!heading.includes("INT.") && !heading.includes("EXT.")) {
      heading = `INT. ${prompt.toUpperCase()} - DAY`
    }

    // Generate scene content that references previous scene if available
    let content = ""
    if (previousScene) {
      content = `CONTINUED FROM PREVIOUS SCENE\n\nThe tension from the ${previousScene.heading.toLowerCase()} carries into this new setting.\n\n`
    }

    content += `The room is filled with anticipation. Characters exchange meaningful glances.\n\nCHARACTER 1\n(nervously)\nI didn't expect to find you here.\n\nCHARACTER 2\nYet here we are. Funny how life works.\n\nCharacter 1 moves closer, their body language revealing unspoken history between them.\n\nCHARACTER 1\nWe need to talk about what happened.\n\nCHARACTER 2\n(interrupting)\nNot here. Not now.\n\nThe tension builds as they stand in silence, years of history hanging between them.`

    return {
      id,
      heading,
      content,
      notes: "This scene establishes the relationship between the main characters.",
      images: [],
    }
  } catch (error) {
    console.error("Error generating scene:", error)
    throw new Error("Failed to generate scene. Please try again.")
  }
}

// Generate a complete screenplay with chunked generation to prevent timeouts
export async function generateScreenplay(title: string, premise: string): Promise<Screenplay> {
  try {
    // For demo purposes, we'll create a screenplay with multiple scenes
    const id = `screenplay_${Date.now()}`

    // Generate a logline
    const logline = `A compelling story about ${premise.toLowerCase()}.`

    // Generate scenes in chunks to prevent timeouts
    const scenePrompts = [
      "APARTMENT - DAY",
      "OFFICE BUILDING - LATER",
      "RESTAURANT - EVENING",
      "STREET - NIGHT",
      "APARTMENT - NIGHT",
    ]

    const scenes: Scene[] = []

    // Generate scenes sequentially, with each referencing the previous
    for (let i = 0; i < scenePrompts.length; i++) {
      const previousScene = i > 0 ? scenes[i - 1] : undefined
      const scene = await generateScene(scenePrompts[i], previousScene)
      scenes.push(scene)

      // Add a small delay between scene generations to prevent API overload
      if (i < scenePrompts.length - 1) {
        await delay(500)
      }
    }

    const screenplay: Screenplay = {
      id,
      title,
      author: "AI Writer",
      genre: [],
      logline,
      scenes,
      lastModified: new Date(),
    }

    // Detect genres based on content
    screenplay.genre = detectGenres(screenplay)

    return screenplay
  } catch (error) {
    console.error("Error generating screenplay:", error)
    throw new Error("Failed to generate screenplay. Please try again.")
  }
}

// Update a scene with improved content
export async function updateScene(
  screenplay: Screenplay,
  sceneId: string,
  updates: Partial<Scene>,
): Promise<Screenplay> {
  const updatedScreenplay = { ...screenplay }
  const sceneIndex = updatedScreenplay.scenes.findIndex((scene) => scene.id === sceneId)

  if (sceneIndex === -1) {
    throw new Error("Scene not found")
  }

  // Update the scene
  updatedScreenplay.scenes[sceneIndex] = {
    ...updatedScreenplay.scenes[sceneIndex],
    ...updates,
    // Always update lastModified when a scene is updated
    lastModified: new Date(),
  }

  // Update adjacent scenes if needed for continuity
  if (updates.heading || updates.content) {
    // Update previous scene if it exists
    if (sceneIndex > 0) {
      const previousScene = updatedScreenplay.scenes[sceneIndex - 1]
      if (previousScene.content && previousScene.content.includes("CONTINUED IN NEXT SCENE")) {
        // Update the continuation note
        updatedScreenplay.scenes[sceneIndex - 1] = {
          ...previousScene,
          notes: `${previousScene.notes || ""}\nConnects to: ${updatedScreenplay.scenes[sceneIndex].heading}`,
        }
      }
    }

    // Update next scene if it exists
    if (sceneIndex < updatedScreenplay.scenes.length - 1) {
      const nextScene = updatedScreenplay.scenes[sceneIndex + 1]
      if (nextScene.content && nextScene.content.includes("CONTINUED FROM PREVIOUS SCENE")) {
        // Update the continuation reference
        const updatedContent = nextScene.content.replace(
          /CONTINUED FROM PREVIOUS SCENE.*?\n\n/s,
          `CONTINUED FROM PREVIOUS SCENE\n\nFollowing the events at ${updatedScreenplay.scenes[sceneIndex].heading.toLowerCase()}.\n\n`,
        )

        updatedScreenplay.scenes[sceneIndex + 1] = {
          ...nextScene,
          content: updatedContent,
        }
      }
    }
  }

  // Re-detect genres after significant updates
  if (updates.content || updates.heading) {
    updatedScreenplay.genre = detectGenres(updatedScreenplay)
  }

  return updatedScreenplay
}

// Add a new scene with improved positioning
export async function addScene(screenplay: Screenplay, newScene: Scene, position?: number): Promise<Screenplay> {
  const updatedScreenplay = { ...screenplay }

  // If position is not specified, add to the end
  const insertPosition = position !== undefined ? position : updatedScreenplay.scenes.length

  // Update the previous scene to reference the new scene if appropriate
  if (insertPosition > 0) {
    const previousScene = updatedScreenplay.scenes[insertPosition - 1]
    if (!previousScene.content.includes("CONTINUED IN NEXT SCENE")) {
      updatedScreenplay.scenes[insertPosition - 1] = {
        ...previousScene,
        content: `${previousScene.content}\n\nCONTINUED IN NEXT SCENE`,
        notes: `${previousScene.notes || ""}\nConnects to: ${newScene.heading}`,
      }
    }
  }

  // Update the new scene to reference the previous scene if appropriate
  if (insertPosition > 0 && !newScene.content.includes("CONTINUED FROM PREVIOUS SCENE")) {
    const previousScene = updatedScreenplay.scenes[insertPosition - 1]
    newScene = {
      ...newScene,
      content: `CONTINUED FROM PREVIOUS SCENE\n\nFollowing the events at ${previousScene.heading.toLowerCase()}.\n\n${newScene.content}`,
    }
  }

  // Insert the new scene
  updatedScreenplay.scenes = [
    ...updatedScreenplay.scenes.slice(0, insertPosition),
    newScene,
    ...updatedScreenplay.scenes.slice(insertPosition),
  ]

  // Update the next scene to reference the new scene if appropriate
  if (insertPosition < updatedScreenplay.scenes.length - 1) {
    const nextScene = updatedScreenplay.scenes[insertPosition + 1]
    if (nextScene.content.includes("CONTINUED FROM PREVIOUS SCENE")) {
      const updatedContent = nextScene.content.replace(
        /CONTINUED FROM PREVIOUS SCENE.*?\n\n/s,
        `CONTINUED FROM PREVIOUS SCENE\n\nFollowing the events at ${newScene.heading.toLowerCase()}.\n\n`,
      )

      updatedScreenplay.scenes[insertPosition + 1] = {
        ...nextScene,
        content: updatedContent,
      }
    }
  }

  // Re-detect genres after adding a new scene
  updatedScreenplay.genre = detectGenres(updatedScreenplay)

  return updatedScreenplay
}

