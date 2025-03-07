# @yt-toolkit/utils

A collection of utility functions for working with YouTube data in the YT Toolkit ecosystem.

## Installation

```bash
# If you're within the monorepo
pnpm add @yt-toolkit/utils

# If you're installing from npm (once published)
npm install @yt-toolkit/utils
# or
yarn add @yt-toolkit/utils
# or
pnpm add @yt-toolkit/utils
```

## Usage

```typescript
import { getVideoId, parseDuration } from "@yt-toolkit/utils";

// Extract a YouTube video ID from a URL
const videoId = getVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
console.log(videoId); // 'dQw4w9WgXcQ'

// Parse a YouTube ISO 8601 duration string to minutes
const durationInMinutes = parseDuration("PT1H30M15S");
console.log(durationInMinutes); // 90
```

## API Reference

### `getVideoId(url: string): string`

Extracts a YouTube video ID from various URL formats.

**Parameters:**

- `url` (string): A YouTube video URL

**Returns:**

- (string): The extracted video ID, or an empty string if no valid ID is found

**Supported URL formats:**

- Standard YouTube URLs: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- Short YouTube URLs: `https://youtu.be/dQw4w9WgXcQ`
- Embedded YouTube URLs: `https://www.youtube.com/embed/dQw4w9WgXcQ`
- URLs with additional parameters: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120s`

### `parseDuration(durationStr: string): number`

Parses a YouTube ISO 8601 duration string into minutes.

**Parameters:**

- `durationStr` (string): An ISO 8601 duration string (e.g., "PT1H30M15S")

**Returns:**

- (number): Duration in minutes

**Examples:**

- `PT1H30M15S` → 90 minutes (1 hour and 30 minutes)
- `PT5M30S` → 5 minutes
- `PT45S` → 0 minutes (less than a minute)
- `PT2H` → 120 minutes (2 hours)

**Errors:**

- Throws an error if the duration string format is invalid

## Development

### Testing

Run tests:

```bash
pnpm test
```

## License

[MIT](../../LICENSE)
