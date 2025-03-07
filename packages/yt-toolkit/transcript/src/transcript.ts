import axios from "axios";
import * as cheerio from "cheerio";
import { getVideoId } from "@yt-toolkit/utils";
import type { CaptionTrack, Options } from "../../_internal/types";

/**
 * Fetches the transcript for a YouTube video
 * @param url The YouTube video URL or ID
 * @param options Options for fetching the transcript
 * @returns The transcript text or an error message
 */
export async function getTranscript(
  url: string,
  options: Options = {}
): Promise<string> {
  const videoId = getVideoId(url) || url; // Handle if the URL is actually just a video ID

  if (!videoId) {
    throw new Error("Invalid YouTube URL or video ID");
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await axios.get(videoUrl);
    const html = response.data;

    // Find caption tracks in the YouTube page data
    const captionTracksRegex = /"captionTracks":\s*(\[.*?\])/;
    const match = html.match(captionTracksRegex);

    if (!match || !match[1]) {
      return "Transcript not available";
    }

    // Parse the caption tracks JSON
    let captionTracks: CaptionTrack[] = [];
    try {
      captionTracks = JSON.parse(match[1]);
    } catch (error) {
      return `Failed to parse caption tracks: ${(error as Error).message}`;
    }

    if (captionTracks.length === 0) {
      return "No caption tracks found";
    }

    // Select the caption track based on language preference
    let selectedTrack = captionTracks[0];
    if (options.lang) {
      const langTrack = captionTracks.find(
        (track) =>
          track.languageCode?.toLowerCase() === options.lang?.toLowerCase()
      );
      if (langTrack) {
        selectedTrack = langTrack;
      }
    }

    if (!selectedTrack.baseUrl) {
      return "No transcript URL found";
    }

    // Fetch the transcript XML
    const transcriptResponse = await axios.get(selectedTrack.baseUrl);
    const transcriptXml = transcriptResponse.data;

    // Parse the XML transcript
    const $ = cheerio.load(transcriptXml, { xmlMode: true });

    // Extract text from each <text> tag
    let transcriptText = "";
    $("text").each((_: unknown, element) => {
      transcriptText += $(element).text() + " ";
    });

    return transcriptText.trim();
  } catch (error) {
    return `Failed to fetch transcript: ${(error as Error).message}`;
  }
}

getTranscript("https://www.youtube.com/watch?v=f2ibNsDdJ0U")
  .then(console.log)
  .catch(console.error);
