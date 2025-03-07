import { getTranscript } from './transcript';
import { getVideoDuration } from './duration';
import { getComments } from './comments';
import { Options, VideoInfo } from './types';

/**
 * Gets comprehensive information about a YouTube video
 * @param url The YouTube video URL or ID
 * @param options Options for fetching video information
 * @param apiKey Optional YouTube API key. If not provided, will use from options or globally set API key.
 * @returns Object containing transcript, duration, and comments
 */
export async function getVideoInfo(url: string, options: Options = {}, apiKey?: string): Promise<VideoInfo> {
  try {
    // Use apiKey from parameter or from options
    const key = apiKey || options.apiKey;
    
    // Run all API calls in parallel for better performance
    const [transcript, duration, comments] = await Promise.all([
      getTranscript(url, options),
      getVideoDuration(url, key),
      getComments(url, 100, key)
    ]);

    return {
      transcript,
      duration,
      comments
    };
  } catch (error) {
    throw new Error(`Failed to get video info: ${(error as Error).message}`);
  }
} 