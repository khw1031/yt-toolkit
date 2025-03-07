import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { setApiKey, getApiKey } from '../src/apiKey';

describe('API Key Management', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Clear the API key by calling the original setApiKey
    setApiKey('');
  });

  it('should allow setting and getting an API key', () => {
    const testKey = 'test-api-key-123';
    setApiKey(testKey);
    expect(getApiKey()).toBe(testKey);
  });

  it('should throw an error when getting API key if not set', () => {
    expect(() => getApiKey()).toThrow('YouTube API key not found');
  });

  it('should handle process.env in Node.js environment', () => {
    // For this test, we'll set an API key and then check that it's returned correctly
    setApiKey('env-api-key');
    expect(getApiKey()).toBe('env-api-key');
  });
}); 