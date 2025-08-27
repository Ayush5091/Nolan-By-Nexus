// This service provides fallback data when external APIs fail

// Helper function to generate random dates within the last 3 months
const getRandomRecentDate = () => {
  const now = new Date()
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(now.getMonth() - 3)

  const randomTimestamp = threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  const randomDate = new Date(randomTimestamp)

  return randomDate.toISOString().split("T")[0]
}

// Make sure the getMediaTrendsFallbackData function is properly exported
export const getMediaTrendsFallbackData = (count = 12) => {
  const categories = ["technology", "equipment", "industry", "software"]
  const sources = [
    "Film Technology Today",
    "Cinematography Journal",
    "Digital Media Insider",
    "Screenwriter Weekly",
    "Mobile Creator",
    "Entertainment Sustainability Report",
    "Color Theory in Film",
    "Sound & Vision",
    "Documentary Filmmaker",
    "Indie Film Hub",
  ]

  const trendTemplates = [
    {
      title: "Virtual Production Revolutionizes Filmmaking",
      description:
        "How LED walls and real-time rendering are changing the way films are made, reducing post-production time and costs while enhancing creative possibilities.",
      category: "technology",
    },
    {
      title: "AI-Assisted Screenwriting Tools Gain Popularity",
      description:
        "New AI tools are helping screenwriters overcome writer's block and develop more compelling character arcs and dialogue.",
      category: "software",
    },
    {
      title: "Anamorphic Lenses Make a Comeback in Indie Films",
      description:
        "The distinctive look of anamorphic lenses is experiencing a renaissance in independent cinema, with more affordable options now available.",
      category: "equipment",
    },
    {
      title: "Streaming Platforms Increase Demand for HDR Content",
      description:
        "Major streaming services are pushing for more HDR content, creating new challenges and opportunities for cinematographers and colorists.",
      category: "industry",
    },
    {
      title: "Mobile Filmmaking Reaches New Heights with Latest Smartphone Cameras",
      description:
        "Professional filmmakers are increasingly turning to high-end smartphones for certain productions, blurring the line between professional and consumer equipment.",
      category: "equipment",
    },
    {
      title: "Sustainable Production Practices Become Industry Standard",
      description:
        "Major studios and production companies are adopting green initiatives to reduce the environmental impact of film and TV production.",
      category: "industry",
    },
    {
      title: "New Color Grading Techniques for Emotional Storytelling",
      description:
        "Cinematographers and colorists are developing innovative approaches to color grading that enhance the emotional impact of scenes.",
      category: "technology",
    },
    {
      title: "Sound Design Innovations in Horror Films",
      description:
        "Sound designers are pushing boundaries with new techniques to create immersive and terrifying audio experiences in horror cinema.",
      category: "technology",
    },
    {
      title: "Lightweight Camera Rigs for Dynamic Documentary Filming",
      description:
        "New lightweight and modular camera rigs are making it easier for documentary filmmakers to capture dynamic footage in challenging environments.",
      category: "equipment",
    },
    {
      title: "Cloud-Based Collaboration Tools Transform Post-Production Workflows",
      description:
        "Remote teams are leveraging cloud platforms to collaborate on editing, VFX, and sound design from anywhere in the world.",
      category: "software",
    },
    {
      title: "Indie Filmmakers Embrace Crowdfunding for Creative Freedom",
      description:
        "More independent directors are turning to crowdfunding platforms to finance projects without compromising their artistic vision.",
      category: "industry",
    },
    {
      title: "Volumetric Capture Creates New Possibilities for Immersive Storytelling",
      description:
        "The technology behind volumetric video is opening doors for interactive narratives and mixed reality experiences.",
      category: "technology",
    },
    {
      title: "Film Festivals Adapt with Hybrid Physical-Digital Models",
      description:
        "Major film festivals are maintaining digital components post-pandemic, expanding access and discovering new audiences.",
      category: "industry",
    },
    {
      title: "Practical Effects Make a Comeback in Genre Films",
      description:
        "Filmmakers are rediscovering the value of practical effects for creating authentic textures and tangible presence on screen.",
      category: "equipment",
    },
    {
      title: "Real-Time Rendering Engines Blur Line Between Production and Post",
      description:
        "Game engines like Unreal and Unity are transforming production pipelines, allowing filmmakers to visualize final shots on set.",
      category: "software",
    },
  ]

  // Generate a varied set of trends
  const trends = []

  // First, use all templates in random order
  const shuffledTemplates = [...trendTemplates].sort(() => Math.random() - 0.5)
  const templatesNeeded = Math.min(count, shuffledTemplates.length)

  for (let i = 0; i < templatesNeeded; i++) {
    const template = shuffledTemplates[i]
    const randomSource = sources[Math.floor(Math.random() * sources.length)]
    const randomDate = getRandomRecentDate()
    const imageNumber = Math.floor(Math.random() * 5) + 1 // 1-5

    trends.push({
      id: i + 1,
      title: template.title,
      description: template.description,
      source: randomSource,
      url: "#",
      category: template.category,
      date: randomDate,
      image: `/assets/placeholder-wide-${imageNumber}.png`,
    })
  }

  // If we need more trends than templates, generate some with random categories
  if (count > trendTemplates.length) {
    const additionalNeeded = count - trendTemplates.length

    for (let i = 0; i < additionalNeeded; i++) {
      // Reuse a random template but change its category
      const templateIndex = Math.floor(Math.random() * trendTemplates.length)
      const template = trendTemplates[templateIndex]
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomSource = sources[Math.floor(Math.random() * sources.length)]
      const randomDate = getRandomRecentDate()
      const imageNumber = Math.floor(Math.random() * 5) + 1 // 1-5

      trends.push({
        id: trends.length + 1,
        title: template.title,
        description: template.description,
        source: randomSource,
        url: "#",
        category: randomCategory,
        date: randomDate,
        image: `/assets/placeholder-wide-${imageNumber}.png`,
      })
    }
  }

  return trends
}

// Add export for NewsArticle type
export interface NewsArticle {
  id: number
  title: string
  description: string
  source: {
    name: string
  }
  url: string
  publishedAt: string
  urlToImage?: string
}

// Add a function to get fallback news data
export function getFallbackNewsData(): NewsArticle[] {
  const trends = getMediaTrendsFallbackData(12)

  // Convert trends to NewsArticle format
  return trends.map((trend, index) => ({
    id: index,
    title: trend.title,
    description: trend.description,
    source: {
      name: trend.source,
    },
    url: trend.url,
    publishedAt: new Date(trend.date).toISOString(),
    urlToImage: trend.image,
  }))
}

// Generate fallback data for directorial insights
export const getDirectorialInsightsFallbackData = () => {
  return [
    {
      id: 1,
      title: "Dune: Part Two",
      director: "Denis Villeneuve",
      genre: "sci-fi",
      releaseDate: "2024",
      insights: [
        "Villeneuve's use of IMAX cameras creates an immersive desert landscape that becomes a character itself",
        "The director employs minimal CGI, preferring practical effects for authenticity",
        "Sound design and score are used as storytelling elements rather than mere accompaniment",
        "Villeneuve's patient pacing allows for character development amidst spectacle",
      ],
      image: "/assets/placeholder-wide.png",
    },
    {
      id: 2,
      title: "Oppenheimer",
      director: "Christopher Nolan",
      genre: "historical",
      releaseDate: "2023",
      insights: [
        "Nolan's use of practical effects and IMAX 70mm film creates a visceral viewing experience",
        "The director employs non-linear storytelling to mirror the fractured psychology of the protagonist",
        "Contrasting color palettes distinguish different timelines and perspectives",
        "Sound design and score work in tandem to build tension throughout the narrative",
      ],
      image: "/assets/placeholder-wide.png",
    },
    {
      id: 3,
      title: "Poor Things",
      director: "Yorgos Lanthimos",
      genre: "drama",
      releaseDate: "2023",
      insights: [
        "Lanthimos uses wide-angle lenses and symmetrical framing to create a sense of unease",
        "The director's use of practical sets and vibrant color creates a distinct visual language",
        "Camera movement is deliberate and often static, forcing the audience to observe the absurdity",
        "Performances are directed with a deadpan delivery that heightens the film's unique tone",
      ],
      image: "/assets/placeholder-wide.png",
    },
    {
      id: 4,
      title: "The Batman",
      director: "Matt Reeves",
      genre: "action",
      releaseDate: "2022",
      insights: [
        "Reeves uses rain and darkness as visual motifs to enhance the noir atmosphere",
        "The director employs practical stunt work and in-camera effects for authentic action sequences",
        "Camera movement is motivated by character emotion rather than spectacle",
        "Lighting techniques create dramatic shadows that reflect the protagonist's dual nature",
      ],
      image: "/assets/placeholder-wide.png",
    },
    {
      id: 5,
      title: "Everything Everywhere All at Once",
      director: "Daniels",
      genre: "sci-fi",
      releaseDate: "2022",
      insights: [
        "The directors use rapid editing and visual transitions to convey multiverse concepts",
        "Camera techniques shift dramatically between universes to establish distinct visual languages",
        "Practical effects and creative production design overcome budget limitations",
        "Action choreography serves character development rather than mere spectacle",
      ],
      image: "/assets/placeholder-wide.png",
    },
    {
      id: 6,
      title: "Killers of the Flower Moon",
      director: "Martin Scorsese",
      genre: "historical",
      releaseDate: "2023",
      insights: [
        "Scorsese uses deliberate pacing and extended scenes to build tension and dread",
        "The director's framing choices emphasize power dynamics between characters",
        "Natural lighting creates an authentic period atmosphere",
        "Camera movement is restrained, allowing performances to drive the narrative",
      ],
      image: "/assets/placeholder-wide.png",
    },
  ]
}

