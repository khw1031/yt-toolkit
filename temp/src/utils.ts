/**
 * Extracts a YouTube video ID from a URL
 * @param url YouTube video URL
 * @returns The video ID or an empty string if not found
 */
export function getVideoId(url: string): string {
  const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(pattern);
  if (match && match[1]) {
    return match[1];
  }
  return '';
}

/**
 * Parses a YouTube ISO 8601 duration string into minutes
 * @param durationStr ISO 8601 duration string (e.g. "PT1H30M15S")
 * @returns Duration in minutes
 */
export function parseDuration(durationStr: string): number {
  const matches = /(?:PT)(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i.exec(durationStr);
  if (!matches) {
    throw new Error(`Invalid duration string: ${durationStr}`);
  }

  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  return hours * 60 + minutes + Math.floor(seconds / 60);
} 