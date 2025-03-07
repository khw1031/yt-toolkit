import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import axios from 'axios';
import { getVideoDuration } from '../src/duration';
import { parseDuration } from '../src/utils';

// Mock dependencies
vi.mock('axios');
vi.mock('../src/utils', () => ({
  getVideoId: (url: string) => url === 'invalid-url' ? '' : 'test-video-id',
  parseDuration: vi.fn(),
}));

const TEST_API_KEY = 'test-api-key';

describe('getVideoDuration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should handle invalid URL with error message', async () => {
    // Since getVideoDuration() catches and wraps errors, we need to match the actual behavior
    // Our mock will not throw but return an error message
    await expect(getVideoDuration('invalid-url', TEST_API_KEY)).rejects.toThrow();
  });

  it('should return video duration when available', async () => {
    // Mock API responses
    const mockApiResponse = {
      data: {
        items: [
          {
            contentDetails: {
              duration: 'PT1H30M15S',
            },
          },
        ],
      },
    };

    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValue(mockApiResponse);
    
    const parseDurationMock = parseDuration as unknown as Mock;
    parseDurationMock.mockReturnValue(90); // 1h30m = 90 minutes

    const result = await getVideoDuration('https://www.youtube.com/watch?v=test-video-id', TEST_API_KEY);
    
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('test-video-id'));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining(TEST_API_KEY));
    expect(parseDurationMock).toHaveBeenCalledWith('PT1H30M15S');
    expect(result).toBe(90);
  });

  it('should throw an error when video not found', async () => {
    // Mock empty API response
    const mockApiResponse = {
      data: {
        items: [],
      },
    };

    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockResolvedValue(mockApiResponse);

    await expect(getVideoDuration('https://www.youtube.com/watch?v=test-video-id', TEST_API_KEY))
      .rejects.toThrow('Video not found');
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'API error';
    
    // Setup mocks
    const mockedAxios = axios as unknown as { get: Mock };
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    await expect(getVideoDuration('https://www.youtube.com/watch?v=test-video-id', TEST_API_KEY))
      .rejects.toThrow(`Failed to get video duration: ${errorMessage}`);
  });
}); 