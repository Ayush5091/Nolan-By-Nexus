// Helper functions

/**
 * Delay execution for a specified time
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retry attempts
 * @param initialDelay Initial delay in milliseconds
 * @returns Promise with the function result
 */
export async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let retries = 0
  let lastError: any

  while (retries < maxRetries) {
    try {
      return await fn()
    } catch (error: any) {
      lastError = error

      // Calculate backoff time
      const backoffTime = initialDelay * Math.pow(2, retries)
      console.log(`Attempt ${retries + 1} failed. Retrying in ${backoffTime}ms...`)

      // Wait before retrying
      await delay(backoffTime)
      retries++
    }
  }

  throw lastError
}

/**
 * Format a date to a readable string
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

