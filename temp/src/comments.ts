import axios from 'axios';
import { getVideoId } from './utils';
import { getApiKey } from './apiKey';
import { YoutubeCommentResponse } from './types';

/**
 * Gets comments for a YouTube video
 * @param url The YouTube video URL or ID
 * @param maxResults Maximum number of comments to fetch (default: 100)
 * @param apiKey Optional YouTube API key. If not provided, will use the globally set API key.
 * @returns An array of comment strings
 */
export async function getComments(url: string, maxResults: number = 100, apiKey?: string): Promise<string[]> {
  const videoId = getVideoId(url) || url;
  
  if (!videoId) {
    throw new Error('Invalid YouTube URL or video ID');
  }

  try {
    // Use provided API key or fall back to global one
    const key = apiKey || getApiKey();
    const comments: string[] = [];
    let nextPageToken: string | undefined;
    
    // We may need to make multiple requests to get all comments up to maxResults
    do {
      const pageQuery = nextPageToken ? `&pageToken=${nextPageToken}` : '';
      const apiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&textFormat=plainText&maxResults=100${pageQuery}&key=${key}`;
      
      const response = await axios.get<YoutubeCommentResponse>(apiUrl);
      
      if (!response.data.items || response.data.items.length === 0) {
        break;
      }
      
      // Process each comment thread
      for (const item of response.data.items) {
        // Add the top-level comment
        const topLevelComment = item.snippet.topLevelComment.snippet.textDisplay;
        comments.push(topLevelComment);
        
        // Add replies if any
        if (item.replies) {
          for (const reply of item.replies.comments) {
            const replyText = reply.snippet.textDisplay;
            comments.push(`    - ${replyText}`);
          }
        }
        
        // Stop if we've reached the max
        if (comments.length >= maxResults) {
          break;
        }
      }
      
      // Get the next page token for pagination
      nextPageToken = response.data.nextPageToken;
      
      // Stop if we've reached the max or there are no more pages
    } while (nextPageToken && comments.length < maxResults);
    
    return comments.slice(0, maxResults);
  } catch (error) {
    throw new Error(`Failed to get comments: ${(error as Error).message}`);
  }
} 