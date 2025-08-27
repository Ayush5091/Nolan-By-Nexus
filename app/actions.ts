"use server"

import { revalidatePath } from "next/cache"

export async function generateImage(prompt: string): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const huggingFaceToken = process.env.HUGGING_FACE_ACCESS_TOKEN

    if (!huggingFaceToken) {
      return {
        success: false,
        error: "Hugging Face API token is not configured. Please add it to your environment variables.",
      }
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${huggingFaceToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()

      // Check for credit limit error
      if (errorData.error && errorData.error.includes("exceeded your monthly included credits")) {
        return {
          success: false,
          error: "You've exceeded the Hugging Face API credit limit. Please try again later or upgrade to a paid plan.",
        }
      }

      return {
        success: false,
        error: `Hugging Face API error: ${JSON.stringify(errorData)}`,
      }
    }

    // Convert response to base64 directly on the server
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const imageData = `data:image/jpeg;base64,${base64Data}`;

    return { success: true, data: imageData }
  } catch (error) {
    console.error("Error generating image:", error)
    return {
      success: false,
      error: `Failed to generate image: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

export async function regenerateContent(path: string) {
  revalidatePath(path)
}

