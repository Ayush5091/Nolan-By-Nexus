// Simple in-memory cache service

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

class CacheService {
  private cache: Map<string, CacheItem<any>> = new Map()

  // Set data in cache with expiration
  set<T>(key: string, data: T, ttlSeconds = 3600): void {
    const now = Date.now()
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttlSeconds * 1000,
    })
  }

  // Get data from cache if not expired
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    const now = Date.now()

    if (!item || now > item.expiresAt) {
      if (item) {
        // Clean up expired item
        this.cache.delete(key)
      }
      return null
    }

    return item.data as T
  }

  // Check if key exists and is not expired
  has(key: string): boolean {
    const item = this.cache.get(key)
    const now = Date.now()

    if (!item || now > item.expiresAt) {
      if (item) {
        // Clean up expired item
        this.cache.delete(key)
      }
      return false
    }

    return true
  }

  // Remove item from cache
  delete(key: string): void {
    this.cache.delete(key)
  }

  // Clear all cache
  clear(): void {
    this.cache.clear()
  }

  // Get cache stats
  getStats() {
    const now = Date.now()
    let totalItems = 0
    let expiredItems = 0

    this.cache.forEach((item) => {
      totalItems++
      if (now > item.expiresAt) {
        expiredItems++
      }
    })

    return {
      totalItems,
      expiredItems,
      activeItems: totalItems - expiredItems,
    }
  }
}

// Export a singleton instance
export const cacheService = new CacheService()

