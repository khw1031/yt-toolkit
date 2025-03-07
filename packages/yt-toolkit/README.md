# yt-toolkit

YouTube transcript, duration, and comments fetcher written in TypeScript.

A TypeScript module that works in both browser and Node.js environments to fetch YouTube video data.

## Installation

```bash
npm install yt-toolkit
# or
yarn add yt-toolkit
# or
pnpm add yt-toolkit
```

## Usage

### Node.js

```typescript
import {
  getVideoInfo,
  getTranscript,
  getComments,
  getVideoDuration,
  setApiKey,
} from "yt-toolkit";

// Method 1: Set API key globally (for compatibility with older code)
setApiKey("YOUR_API_KEY");

// Method 2: Pass API key directly to functions (recommended)
const apiKey = "YOUR_API_KEY";

// Get all information at once
const videoInfo = await getVideoInfo(
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  {},
  apiKey
);
console.log(videoInfo);

// Or get individual pieces of information
const transcript = await getTranscript(
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
);
const durationInMinutes = await getVideoDuration(
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  apiKey
);
const comments = await getComments(
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  100,
  apiKey
);

// Method 3: Pass API key in options
const options = {
  lang: "en",
  apiKey: "YOUR_API_KEY",
};
const videoInfoWithOptions = await getVideoInfo(
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  options
);
```

### Browser

```html
<script type="module">
  import {
    getVideoInfo,
    getTranscript,
    setApiKey,
  } from "https://unpkg.com/yt-toolkit?module";

  // You can set the API key globally
  setApiKey("YOUR_API_KEY");

  // Or pass it directly to functions (recommended)
  const apiKey = "YOUR_API_KEY";

  async function fetchVideo() {
    const transcript = await getTranscript(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
    const videoInfo = await getVideoInfo(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      {},
      apiKey
    );

    document.getElementById("transcript").textContent = transcript;
    console.log(videoInfo);
  }

  fetchVideo();
</script>
```

## API

### getVideoInfo(url: string, options?: Options, apiKey?: string)

Returns an object containing the transcript, duration (in minutes), and comments for a YouTube video.

### getTranscript(url: string, options?: Options)

Returns the transcript text for a YouTube video.

### getVideoDuration(url: string, apiKey?: string)

Returns the duration of a YouTube video in minutes.

### getComments(url: string, maxResults?: number, apiKey?: string)

Returns an array of comments from a YouTube video.

### getVideoId(url: string)

Extracts the YouTube video ID from a URL.

### setApiKey(key: string)

Sets the YouTube API key for global use (falls back when no API key provided to functions).

### Options

```typescript
interface Options {
  lang?: string; // Language for the transcript (default: 'en')
  apiKey?: string; // YouTube API key (can be provided here instead of as a separate parameter)
}
```

## API Key

This package requires a YouTube API key to fetch comments and video duration. You need to:

1. Get a YouTube Data API v3 key from the [Google Cloud Console](https://console.cloud.google.com/)
2. Provide it to functions in one of these ways (in order of recommendation):
   - Directly to functions as a parameter: `getComments(videoUrl, 100, apiKey)`
   - Via options: `getVideoInfo(videoUrl, { apiKey })`
   - Set globally: `setApiKey(apiKey)` (least recommended, but available for backwards compatibility)

## Development

### Building

To build the library:

```bash
pnpm build
```

This will create both Node.js and browser-compatible bundles in the `dist` directory.

### Testing

Tests are written using Vitest. To run tests:

```bash
pnpm test           # Run tests once
pnpm test:watch     # Run tests in watch mode
pnpm test:coverage  # Run tests with coverage report
```

## License

ISC
