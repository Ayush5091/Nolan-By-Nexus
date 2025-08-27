/**
 * Utility function to get placeholder images with consistent naming
 */
export function getPlaceholderImage(
  type: "scene" | "character" | "team" | "video" | "wide" | "square" | "vertical",
  index = 1,
): string {
  switch (type) {
    case "scene":
      return `/assets/scene-visualization-${index <= 2 ? index : 1}.png`
    case "character":
      return "/assets/character-visualization.png"
    case "team":
      return `/assets/team-member-${index <= 3 ? index : 1}.png`
    case "video":
      return `/assets/video-thumbnail-${index <= 2 ? index : 1}.png`
    case "wide":
      return "/assets/placeholder-wide.png"
    case "square":
      return "/assets/placeholder-square.png"
    case "vertical":
      return "/assets/placeholder-vertical.png"
    default:
      return "/assets/placeholder-square.png"
  }
}

/**
 * Get a random placeholder image of a specific type
 */
export function getRandomPlaceholderImage(
  type: "scene" | "character" | "team" | "video" | "wide" | "square" | "vertical",
): string {
  const maxIndices: Record<string, number> = {
    scene: 2,
    team: 3,
    video: 2,
    character: 1,
    wide: 1,
    square: 1,
    vertical: 1,
  }

  const randomIndex = Math.floor(Math.random() * maxIndices[type]) + 1
  return getPlaceholderImage(type, randomIndex)
}

