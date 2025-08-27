// Helper function to generate images for scenes
export async function generateSceneImage(sceneHeading: string, prompt: string): Promise<string> {
  try {
    console.log("Generating image for scene:", sceneHeading)

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate a more realistic placeholder
    const placeholderImages = [
      "/assets/scene-visualization-1.png",
      "/assets/scene-visualization-2.png",
      "/assets/character-visualization.png",
    ]

    // Use random placeholder for demo
    const randomIndex = Math.floor(Math.random() * placeholderImages.length)
    return placeholderImages[randomIndex]
  } catch (error) {
    console.error("Error generating image:", error)
    return "/assets/placeholder-wide.png"
  }
}

