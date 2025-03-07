import { vi, beforeEach } from "vitest";

// Mock environment variables
vi.stubEnv("YOUTUBE_API_KEY", "test-api-key");

// Reset all mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
});
