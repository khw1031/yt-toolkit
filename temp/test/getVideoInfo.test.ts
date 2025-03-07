import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { getVideoInfo } from '../src/getVideoInfo';
import { getTranscript } from '../src/transcript';
import { getVideoDuration } from '../src/duration';
import { getComments } from '../src/comments';

// Mock dependencies
vi.mock('../src/transcript', () => ({
  getTranscript: vi.fn(),
}));
vi.mock('../src/duration', () => ({
  getVideoDuration: vi.fn(),
}));
vi.mock('../src/comments', () => ({
  getComments: vi.fn(),
}));

const TEST_API_KEY = 'test-api-key';

describe('getVideoInfo', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should aggregate data from all sources', async () => {
    // Mock the individual function responses
    const mockTranscript = 'Test transcript';
    const mockDuration = 90;
    const mockComments = ['Comment 1', 'Comment 2'];

    // Setup mocks
    const getTranscriptMock = getTranscript as unknown as Mock;
    getTranscriptMock.mockResolvedValue(mockTranscript);
    
    const getVideoDurationMock = getVideoDuration as unknown as Mock;
    getVideoDurationMock.mockResolvedValue(mockDuration);
    
    const getCommentsMock = getComments as unknown as Mock;
    getCommentsMock.mockResolvedValue(mockComments);

    // Test the aggregation
    const result = await getVideoInfo('https://www.youtube.com/watch?v=test-video-id', {}, TEST_API_KEY);
    
    // Check that all functions were called with the correct parameters
    expect(getTranscriptMock).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test-video-id', {});
    expect(getVideoDurationMock).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test-video-id', TEST_API_KEY);
    expect(getCommentsMock).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test-video-id', 100, TEST_API_KEY);
    
    // Check the result structure
    expect(result).toEqual({
      transcript: mockTranscript,
      duration: mockDuration,
      comments: mockComments,
    });
  });

  it('should pass language options to getTranscript', async () => {
    // Setup mocks
    const getTranscriptMock = getTranscript as unknown as Mock;
    getTranscriptMock.mockResolvedValue('Translated transcript');
    
    const getVideoDurationMock = getVideoDuration as unknown as Mock;
    getVideoDurationMock.mockResolvedValue(60);
    
    const getCommentsMock = getComments as unknown as Mock;
    getCommentsMock.mockResolvedValue([]);

    // Test with language option
    const options = { lang: 'es' };
    await getVideoInfo('https://www.youtube.com/watch?v=test-video-id', options, TEST_API_KEY);
    
    // Check that getTranscript was called with the language option
    expect(getTranscriptMock).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test-video-id', options);
  });

  it('should handle errors from individual functions', async () => {
    // Setup error in one of the functions
    const getTranscriptMock = getTranscript as unknown as Mock;
    getTranscriptMock.mockRejectedValue(new Error('Transcript error'));
    
    const getVideoDurationMock = getVideoDuration as unknown as Mock;
    getVideoDurationMock.mockResolvedValue(60);
    
    const getCommentsMock = getComments as unknown as Mock;
    getCommentsMock.mockResolvedValue([]);

    // Test error handling
    await expect(getVideoInfo('https://www.youtube.com/watch?v=test-video-id', {}, TEST_API_KEY))
      .rejects.toThrow('Failed to get video info: Transcript error');
  });

  it('should pass apiKey from options', async () => {
    // Mock the individual function responses
    const mockTranscript = 'Test transcript';
    const mockDuration = 90;
    const mockComments = ['Comment 1', 'Comment 2'];

    // Setup mocks
    const getTranscriptMock = getTranscript as unknown as Mock;
    getTranscriptMock.mockResolvedValue(mockTranscript);
    
    const getVideoDurationMock = getVideoDuration as unknown as Mock;
    getVideoDurationMock.mockResolvedValue(mockDuration);
    
    const getCommentsMock = getComments as unknown as Mock;
    getCommentsMock.mockResolvedValue(mockComments);

    const optionsWithApiKey = { apiKey: 'options-api-key' };

    // Test with apiKey in options
    await getVideoInfo('https://www.youtube.com/watch?v=test-video-id', optionsWithApiKey);
    
    // Check that the API key from options is used
    expect(getVideoDurationMock).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test-video-id', 'options-api-key');
    expect(getCommentsMock).toHaveBeenCalledWith('https://www.youtube.com/watch?v=test-video-id', 100, 'options-api-key');
  });
}); 