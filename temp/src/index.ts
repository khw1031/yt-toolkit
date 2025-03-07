import { getVideoInfo } from "./getVideoInfo";
import { getTranscript } from "./transcript";
import { getComments } from "./comments";
import { getVideoDuration } from "./duration";
import { setApiKey, getApiKey } from "./apiKey";
import { getVideoId } from "./utils";
import type { Options } from "./types";

export {
  getVideoInfo,
  getTranscript,
  getComments,
  getVideoDuration,
  getVideoId,
  setApiKey,
  getApiKey,
};

export type { Options };
