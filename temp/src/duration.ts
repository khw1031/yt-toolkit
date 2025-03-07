import axios from 'axios';
import { getVideoId, parseDuration } from './utils';
import { getApiKey } from './apiKey';
import { YoutubeVideoResponse } from './types';

/**
 * Gets the duration of a YouTube video in minutes
 * @param url The YouTube video URL or ID
 * @param apiKey Optional YouTube API key. If not provided, will use the globally set API key.
 * @returns The duration in minutes
 */
export async function getVideoDuration(url: string, apiKey?: string): Promise<number> {
  const videoId = getVideoId(url) || url;
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL or video ID');
  }

  try {
    // Use provided API key or fall back to global one
    const key = apiKey || getApiKey();
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${key}`;
    
    const response = await axios.get<YoutubeVideoResponse>(apiUrl);
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const durationStr = response.data.items[0].contentDetails.duration;
    return parseDuration(durationStr);
  } catch (error) {
    throw new Error(`Failed to get video duration: ${(error as Error).message}`);
  }
} 