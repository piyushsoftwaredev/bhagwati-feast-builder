
/**
 * Simple cache service for storing and retrieving data with expiration
 */
export interface CacheItem<T> {
  value: T;
  expiry: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  
  private constructor() {
    this.cache = new Map();
    
    // Try to load cache from localStorage
    this.loadFromStorage();
    
    // Set up interval to clean expired items
    setInterval(() => this.cleanExpiredItems(), 60000); // Clean every minute
  }
  
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }
  
  /**
   * Set a value in the cache with optional expiration time
   * @param key Cache key
   * @param value Value to store
   * @param ttlMinutes Time to live in minutes (default: 30 minutes)
   */
  public set<T>(key: string, value: T, ttlMinutes: number = 30): void {
    const expiry = Date.now() + (ttlMinutes * 60 * 1000);
    this.cache.set(key, { value, expiry });
    this.saveToStorage();
  }
  
  /**
   * Get a value from the cache
   * @param key Cache key
   * @returns The cached value or undefined if not found or expired
   */
  public get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    // Return undefined if item doesn't exist or has expired
    if (!item || item.expiry < Date.now()) {
      if (item) this.cache.delete(key); // Clean up expired item
      return undefined;
    }
    
    return item.value as T;
  }
  
  /**
   * Check if a key exists in the cache and is not expired
   * @param key Cache key
   * @returns True if the key exists and is not expired
   */
  public has(key: string): boolean {
    const item = this.cache.get(key);
    return !!item && item.expiry >= Date.now();
  }
  
  /**
   * Remove a key from the cache
   * @param key Cache key
   */
  public remove(key: string): void {
    this.cache.delete(key);
    this.saveToStorage();
  }
  
  /**
   * Clear all items from the cache
   */
  public clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }
  
  /**
   * Clean expired items from the cache
   */
  private cleanExpiredItems(): void {
    const now = Date.now();
    let hasExpired = false;
    
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry < now) {
        this.cache.delete(key);
        hasExpired = true;
      }
    }
    
    if (hasExpired) {
      this.saveToStorage();
    }
  }
  
  /**
   * Save the cache to localStorage
   */
  private saveToStorage(): void {
    try {
      // Convert Map to object for storage
      const cacheObject: Record<string, CacheItem<any>> = {};
      for (const [key, value] of this.cache.entries()) {
        cacheObject[key] = value;
      }
      
      localStorage.setItem('app-cache', JSON.stringify(cacheObject));
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }
  
  /**
   * Load the cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const storedCache = localStorage.getItem('app-cache');
      if (!storedCache) return;
      
      const cacheObject = JSON.parse(storedCache);
      
      // Convert object back to Map
      for (const [key, value] of Object.entries(cacheObject)) {
        this.cache.set(key, value as CacheItem<any>);
      }
      
      // Clean expired items immediately after loading
      this.cleanExpiredItems();
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }
}

// Export singleton instance
export const cache = CacheService.getInstance();
