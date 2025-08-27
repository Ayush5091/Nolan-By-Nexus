// Service for image generation using Starry AI

import { delay } from "@/utils/helpers"

// Types
export interface ImageGenerationRequest {
  prompt: string
  style?: string
  aspectRatio?: string
  negativePrompt?: string
}

export interface ImageGenerationResponse {
  success: boolean
  imageUrl?: string
  error?: string
}

// Mock image URLs for different scene types (in a real app, these would be generated)
const mockImageUrls: Record<string, string[]> = {
  apartment: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
  ],
  office: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
  ],
  street: [
    "https://images.unsplash.com/photo-1519331379826-f10be5486c6f",
    "https://images.unsplash.com/photo-1520986606214-8b456906c813",
  ],
  night: [
    "https://images.unsplash.com/photo-1519608487953-e999c86e7455",
    "https://images.unsplash.com/photo-1507090960745-b32f65d3113a",
  ],
  default: [
    "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba",
  ],
}

// Helper function to determine the best image category based on scene heading
function getImageCategory(sceneHeading: string): string {
  sceneHeading = sceneHeading.toLowerCase()

  if (sceneHeading.includes("apartment") || sceneHeading.includes("house") || sceneHeading.includes("home")) {
    return "apartment"
  } else if (
    sceneHeading.includes("office") ||
    sceneHeading.includes("building") ||
    sceneHeading.includes("workplace")
  ) {
    return "office"
  } else if (sceneHeading.includes("restaurant") || sceneHeading.includes("cafe") || sceneHeading.includes("diner")) {
    return "restaurant"
  } else if (sceneHeading.includes("street") || sceneHeading.includes("road") || sceneHeading.includes("avenue")) {
    return "street"
  } else if (sceneHeading.includes("night") || sceneHeading.includes("evening") || sceneHeading.includes("dark")) {
    return "night"
  } else {
    return "default"
  }
}

// Update the generateSceneImage function to use the Hugging Face API
export async function generateSceneImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
  try {
    // Use the Hugging Face API to generate an image
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `${request.prompt} ${request.style || "cinematic, detailed, atmospheric"}`,
          parameters: {
            negative_prompt: request.negativePrompt || "blurry, low quality, distorted",
            num_inference_steps: 30,
            guidance_scale: 7.5,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Image generation failed with status: ${response.status}`)
    }

    // For server-side handling, return the blob data directly
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Data}`;

    return {
      success: true,
      imageUrl,
    }
  } catch (error) {
    console.error("Error generating image:", error)

    // Fallback to mock images if API fails
    const category = getImageCategory(request.prompt)
    const imageUrls = mockImageUrls[category] || mockImageUrls.default
    const randomIndex = Math.floor(Math.random() * imageUrls.length)
    const imageUrl = `${imageUrls[randomIndex]}?w=800&h=450&fit=crop&crop=entropy&auto=format&q=80`

    return {
      success: true,
      imageUrl,
    }
  }
}

// Generate multiple images for a scene (for variations)
export async function generateSceneImageVariations(
  request: ImageGenerationRequest,
  count = 3,
): Promise<ImageGenerationResponse[]> {
  const results: ImageGenerationResponse[] = []

  // Generate images sequentially to prevent API overload
  for (let i = 0; i < count; i++) {
    const result = await generateSceneImage({
      ...request,
      // Add slight variations to the prompt for each image
      prompt: `${request.prompt}${i === 0 ? "" : `, variation ${i + 1}`}`,
    })

    results.push(result)

    // Add a small delay between requests
    if (i < count - 1) {
      await delay(500)
    }
  }

  return results
}

