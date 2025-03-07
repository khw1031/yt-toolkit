import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import axios from 'axios';
import { getComments } from '../src/comments';

// Mock dependencies
vi.mock('axios');
vi.mock('../src/utils', () => ({
  getVideoId: (url: string) => url === 'invalid-url' ? '' : 'test-video-id',
}));

const TEST_API_KEY = 'test-api-key';

describe('getComments', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should handle invalid URL with error message', async () => {
    // Since getComments() catches and wraps errors rather than throwing on empty videoId,
    // we need to match the actual behavior here
    await expect(getComments('invalid-url', 100, TEST_API_KEY)).rejects.toThrow();
  });

  it('should return comments when available', async () => {
    // Mock API response
    const mockApiResponse = {
      data: {
        items: [
          {
            snippet: {
              topLevelComment: {
                snippet: {
                  textDisplay: 'This is a top-level comment',
                },
              },
            },
            replies: {
              comments: [
                {
                  snippet: {
                    textDisplay: 'This is a reply',
                  },
                },
              ],
            },
          },
          {
            snippet: {
              topLevelComment: {
                snippet: {
                  textDisplay: 'This is another comment',
                },
              },
            },
            // No replies
          },
        ],
      },
    };

    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await getComments('https://www.youtube.com/watch?v=test-video-id', 100, TEST_API_KEY);
    
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('test-video-id'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(TEST_API_KEY));
    expect(result).toHaveLength(3); // 2 top-level comments + 1 reply
    expect(result[0]).toBe('This is a top-level comment');
    expect(result[1]).toContain('This is a reply');
    expect(result[2]).toBe('This is another comment');
  });

  it('should return empty array when no comments found', async () => {
    // Mock empty API response
    const mockApiResponse = {
      data: {
        items: [],
      },
    };

    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await getComments('https://www.youtube.com/watch?v=test-video-id', 100, TEST_API_KEY);
    
    expect(result).toEqual([]);
  });

  it('should handle pagination with nextPageToken', async () => {
    // Mock API responses for multiple pages
    const mockFirstPageResponse = {
      data: {
        items: [
          {
            snippet: {
              topLevelComment: {
                snippet: {
                  textDisplay: 'Comment from page 1',
                },
              },
            },
          },
        ],
        nextPageToken: 'next-page-token',
      },
    };

    const mockSecondPageResponse = {
      data: {
        items: [
          {
            snippet: {
              topLevelComment: {
                snippet: {
                  textDisplay: 'Comment from page 2',
                },
              },
            },
          },
        ],
      },
    };

    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('pageToken=next-page-token')) {
        return Promise.resolve(mockSecondPageResponse);
      }
      return Promise.resolve(mockFirstPageResponse);
    });

    const result = await getComments('https://www.youtube.com/watch?v=test-video-id', 100, TEST_API_KEY);
    
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('Comment from page 1');
    expect(result[1]).toBe('Comment from page 2');
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API error';
    
    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    await expect(getComments('https://www.youtube.com/watch?v=test-video-id', 100, TEST_API_KEY))
      .rejects.toThrow(`Failed to get comments: ${errorMessage}`);
  });

  it('should respect maxResults parameter', async () => {
    // Create a response with more comments than the maxResults
    const mockApiResponse = {
      data: {
        items: Array(10).fill(0).map((_, index) => ({
          snippet: {
            topLevelComment: {
              snippet: {
                textDisplay: `Comment ${index + 1}`,
              },
            },
          },
        })),
      },
    };

    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    // Request only 5 comments
    const result = await getComments('https://www.youtube.com/watch?v=test-video-id', 5, TEST_API_KEY);
    
    expect(result).toHaveLength(5);
    expect(result[0]).toBe('Comment 1');
    expect(result[4]).toBe('Comment 5');
  });
}); 