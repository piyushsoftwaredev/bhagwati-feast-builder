// Simple in-memory cache implementation
type CacheEntry = {
  value: any;
  expiry: number | null;
};

class CacheService {
  private cache: Map<string, CacheEntry> = new Map();

  // Set a value in the cache with optional expiry in minutes
  set(key: string, value: any, expiryMinutes?: number): void {
    const entry: CacheEntry = {
      value,
      expiry: expiryMinutes ? Date.now() + expiryMinutes * 60 * 1000 : null
    };
    this.cache.set(key, entry);
  }

  // Get a value from the cache
  get(key: string): any {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }
    
    // Check if the entry has expired
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.value;
  }

  // Check if a key exists in the cache
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    // Check if the entry has expired
    if (entry.expiry && Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  // Remove a value from the cache
  delete(key: string): void {
    this.cache.delete(key);
  }

  // Clear all values from the cache
  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton instance
export const cache = new CacheService();