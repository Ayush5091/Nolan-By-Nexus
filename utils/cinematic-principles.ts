// Comprehensive collection of cinematic principles for screenplay analysis

export const cinematicPrinciples = {
  // Narrative Structure
  structure: {
    threeActStructure: {
      name: "Three-Act Structure",
      description: "The classic beginning (setup), middle (confrontation), and end (resolution) structure",
      checkpoints: [
        "Clear setup establishing characters, world, and stakes",
        "Inciting incident that disrupts the status quo",
        "Rising action with escalating conflicts",
        "Midpoint that raises stakes or changes direction",
        "Climactic confrontation that resolves the central conflict",
        "Resolution that shows the new normal",
      ],
    },
    heroJourney: {
      name: "Hero's Journey",
      description: "Campbell's monomyth structure with 12 stages of the hero's adventure",
      checkpoints: [
        "Ordinary World introduction",
        "Call to Adventure",
        "Refusal of the Call",
        "Meeting the Mentor",
        "Crossing the Threshold",
        "Tests, Allies, and Enemies",
        "Approach to the Inmost Cave",
        "Ordeal",
        "Reward",
        "The Road Back",
        "Resurrection",
        "Return with the Elixir",
      ],
    },
    saveTheCat: {
      name: "Save the Cat",
      description: "Blake Snyder's 15-beat screenplay structure",
      checkpoints: [
        "Opening Image",
        "Theme Stated",
        "Setup",
        "Catalyst",
        "Debate",
        "Break into Two",
        "B Story",
        "Fun and Games",
        "Midpoint",
        "Bad Guys Close In",
        "All Is Lost",
        "Dark Night of the Soul",
        "Break into Three",
        "Finale",
        "Final Image",
      ],
    },
  },

  // Character Development
  character: {
    arc: {
      name: "Character Arc",
      description: "The internal journey and transformation of characters",
      checkpoints: [
        "Clear character goals, motivations, and flaws",
        "Internal and external conflicts that challenge the character",
        "Meaningful character growth throughout the story",
        "Consistent yet evolving character behavior",
        "Transformative moments that change the character",
      ],
    },
    dimensionality: {
      name: "Character Dimensionality",
      description: "The complexity and depth of characters",
      checkpoints: [
        "Multi-dimensional protagonist with clear wants and needs",
        "Complex antagonist with understandable motivations",
        "Distinctive supporting characters that serve the story",
        "Authentic relationships between characters",
        "Subtext in character interactions",
      ],
    },
  },

  // Dialogue
  dialogue: {
    name: "Dialogue Effectiveness",
    description: "The quality and purpose of character speech",
    checkpoints: [
      "Distinctive voice for each character",
      "Dialogue that reveals character and advances plot",
      "Subtext and subtlety in conversations",
      "Avoidance of on-the-nose dialogue",
      "Effective use of silence and what's unsaid",
      "Balance of dialogue and action",
    ],
  },

  // Visual Storytelling
  visualStorytelling: {
    name: "Visual Storytelling",
    description: "How the story is told through visual elements",
    checkpoints: [
      "Show don't tell approach",
      "Effective scene descriptions that evoke imagery",
      "Visual motifs and symbolism",
      "Meaningful settings that enhance the story",
      "Action lines that create clear mental pictures",
    ],
  },

  // Pacing and Rhythm
  pacing: {
    name: "Pacing and Rhythm",
    description: "The flow and tempo of the screenplay",
    checkpoints: [
      "Varied scene lengths and rhythms",
      "Effective use of tension and release",
      "Appropriate pacing for genre and story",
      "Momentum that builds toward the climax",
      "Breathing room for emotional impact",
    ],
  },

  // Theme
  theme: {
    name: "Thematic Depth",
    description: "The underlying message or meaning of the screenplay",
    checkpoints: [
      "Clear central theme that's explored throughout",
      "Theme expressed through character choices and conflicts",
      "Avoidance of heavy-handed messaging",
      "Thematic consistency with meaningful payoff",
      "Subthemes that complement the central theme",
    ],
  },

  // Genre Conventions
  genre: {
    name: "Genre Awareness",
    description: "How well the screenplay works within its genre",
    checkpoints: [
      "Understanding of genre conventions and audience expectations",
      "Fresh approach to genre tropes",
      "Consistent tone appropriate to the genre",
      "Genre-specific elements (horror scares, comedy setups, etc.)",
      "Cross-genre elements that enhance rather than confuse",
    ],
  },

  // Formatting and Presentation
  formatting: {
    name: "Professional Formatting",
    description: "Industry-standard screenplay formatting",
    checkpoints: [
      "Proper scene headings, action lines, and dialogue formatting",
      "Appropriate use of transitions, shots, and technical directions",
      "Clean, readable presentation",
      "Effective use of white space",
      "Consistent formatting throughout",
    ],
  },
}

// Scoring rubric for evaluating screenplays
export const scoringRubric = {
  excellent: {
    range: [90, 100],
    description: "Exceptional work that demonstrates mastery of the principle",
  },
  good: {
    range: [75, 89],
    description: "Strong work with minor areas for improvement",
  },
  satisfactory: {
    range: [60, 74],
    description: "Competent work that meets basic requirements but lacks distinction",
  },
  needsWork: {
    range: [40, 59],
    description: "Significant issues that detract from the screenplay's effectiveness",
  },
  poor: {
    range: [0, 39],
    description: "Fundamental problems that require substantial revision",
  },
}

// Helper function to generate prompts for Gemini API
export function generateAnalysisPrompt(principle: string, screenplayText: string): string {
  return `Analyze the following screenplay excerpt based on the principle of ${principle}. 
  Provide specific examples from the text, identify strengths and weaknesses, and offer constructive suggestions for improvement.
  
  Screenplay:
  ${screenplayText.substring(0, 15000)}... [truncated for length]`
}

// Helper function to extract key insights from Gemini responses
export function extractInsights(geminiResponse: string): string[] {
  // Split the response into paragraphs and filter out empty lines
  const paragraphs = geminiResponse.split("\n").filter((line) => line.trim().length > 0)

  // Extract key insights (assuming insights are in paragraphs or bullet points)
  return paragraphs.map((p) => p.replace(/^- /, "").trim())
}

