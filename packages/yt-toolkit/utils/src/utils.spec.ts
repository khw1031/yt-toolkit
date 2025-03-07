import { getVideoId, parseDuration } from "./utils";

describe("getVideoId", () => {
  it("should extract video ID from a standard YouTube URL", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    expect(getVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("should extract video ID from a short YouTube URL", () => {
    const url = "https://youtu.be/dQw4w9WgXcQ";
    expect(getVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("should extract video ID from an embedded YouTube URL", () => {
    const url = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    expect(getVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("should return empty string for invalid URL", () => {
    const url = "https://example.com";
    expect(getVideoId(url)).toBe("");
  });

  it("should not extract ID from a raw video ID string", () => {
    const videoId = "dQw4w9WgXcQ";
    expect(getVideoId(videoId)).toBe("");
  });
});

describe("parseDuration", () => {
  it("should parse duration with hours, minutes, and seconds", () => {
    const durationStr = "PT1H30M15S";
    expect(parseDuration(durationStr)).toBe(90); // 1h30m = 90 minutes
  });

  it("should parse duration with only minutes and seconds", () => {
    const durationStr = "PT5M30S";
    expect(parseDuration(durationStr)).toBe(5); // 5m30s = 5 minutes
  });

  it("should parse duration with only seconds", () => {
    const durationStr = "PT45S";
    expect(parseDuration(durationStr)).toBe(0); // 45s = 0 minutes
  });

  it("should parse duration with only hours", () => {
    const durationStr = "PT2H";
    expect(parseDuration(durationStr)).toBe(120); // 2h = 120 minutes
  });

  it("should throw error for invalid duration format", () => {
    const durationStr = "invalid";
    expect(() => parseDuration(durationStr)).toThrow(
      "Invalid duration string: invalid"
    );
  });
});
