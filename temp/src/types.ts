export interface Options {
  lang?: string;
  apiKey?: string;
}

export interface VideoInfo {
  transcript: string;
  duration: number;
  comments: string[];
}

export interface CaptionTrack {
  baseUrl: string;
  name?: string;
  languageCode?: string;
}

export interface YoutubeVideoResponse {
  items: Array<{
    contentDetails: {
      duration: string;
    };
  }>;
}

export interface YoutubeCommentResponse {
  items: Array<{
    snippet: {
      topLevelComment: {
        snippet: {
          textDisplay: string;
        };
      };
    };
    replies?: {
      comments: Array<{
        snippet: {
          textDisplay: string;
        };
      }>;
    };
  }>;
  nextPageToken?: string;
} 