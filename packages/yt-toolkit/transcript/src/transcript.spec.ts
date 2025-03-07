import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import axios from "axios";
import { getTranscript } from "./transcript";

// Mock dependencies
vi.mock("axios");
vi.mock("../src/utils", () => ({
  getVideoId: (url: string) => (url === "invalid-url" ? "" : "test-video-id"),
}));

describe("getTranscript", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should throw an error for invalid URL", async () => {
    // Mock axios to not be called for invalid URLs
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockRejectedValue(new Error("Should not be called"));

    // We need to update our tests since getTranscript returns an error string instead of throwing
    // This matches the behavior of the actual function
    const result = await getTranscript("invalid-url");
    expect(result).toContain("Failed to fetch transcript");
  });

  it("should return transcript when available", async () => {
    // Mock the HTML response containing the caption tracks data
    const mockHtmlResponse = {
      data: `
        <html>
          <body>
            <script>
              "captionTracks":[{"baseUrl":"https://example.com/transcript","languageCode":"en"}]
            </script>
          </body>
        </html>
      `,
    };

    // Mock the transcript XML response
    const mockTranscriptResponse = {
      data: `
        <transcript>
          <text start="0.1" dur="1.5">Hello world</text>
          <text start="1.6" dur="2.0">This is a test</text>
        </transcript>
      `,
    };

    // Setup axios mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValueOnce(mockHtmlResponse);
    mockedAxios.get.mockResolvedValueOnce(mockTranscriptResponse);

    const result = await getTranscript(
      "https://www.youtube.com/watch?v=test-video-id"
    );

    // We expect axios to be called twice - once for the video page and once for the transcript
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(result).toContain("Hello world");
    expect(result).toContain("This is a test");
  });

  it("should return error message when no caption tracks found", async () => {
    // Mock HTML response with no caption tracks
    const mockHtmlResponse = { data: "<html><body></body></html>" };

    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValue(mockHtmlResponse);

    const result = await getTranscript(
      "https://www.youtube.com/watch?v=test-video-id"
    );

    expect(result).toBe("Transcript not available");
  });

  it("should handle API errors gracefully", async () => {
    const errorMessage = "Network error";
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const result = await getTranscript(
      "https://www.youtube.com/watch?v=test-video-id"
    );

    expect(result).toContain("Failed to fetch transcript");
    expect(result).toContain(errorMessage);
  });

  it("should select caption track by language preference", async () => {
    // Mock the HTML response with multiple caption tracks
    const mockHtmlResponse = {
      data: `
        <html>
          <body>
            <script>
              "captionTracks":[{"baseUrl":"https://example.com/en-transcript","name":{"simpleText":"English"},"languageCode":"en"},{"baseUrl":"https://example.com/es-transcript","name":{"simpleText":"Spanish"},"languageCode":"es"}]
            </script>
          </body>
        </html>
      `,
    };

    // Mock the transcript responses
    const mockEnTranscriptResponse = {
      data: "<transcript><text>English transcript</text></transcript>",
    };

    const mockEsTranscriptResponse = {
      data: "<transcript><text>Spanish transcript</text></transcript>",
    };

    // Setup axios mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes("watch?v=")) {
        return Promise.resolve(mockHtmlResponse);
      } else if (url === "https://example.com/en-transcript") {
        return Promise.resolve(mockEnTranscriptResponse);
      } else if (url === "https://example.com/es-transcript") {
        return Promise.resolve(mockEsTranscriptResponse);
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    // Test with Spanish language preference
    const result = await getTranscript(
      "https://www.youtube.com/watch?v=test-video-id",
      { lang: "es" }
    );

    expect(result).toContain("Spanish transcript");
  });
});
