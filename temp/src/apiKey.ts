// Simple in-memory storage for API key
let apiKey = '';

/**
 * Sets the YouTube API key
 * @param key The YouTube API key
 */
export function setApiKey(key: string): void {
  apiKey = key;
}

/**
 * Gets the YouTube API key
 * @returns The current YouTube API key
 */
export function getApiKey(): string {
  if (!apiKey) {
    throw new Error('YouTube API key not found. Please set it using setApiKey()');
  }
  return apiKey;
} 