export interface SpeechRecognitionRequest {
  audio: Buffer;
  encoding: string;
  sampleRateHertz?: number;
  languageCode?: string;
  enableWordTimeOffsets?: boolean;
  enableAutomaticPunctuation?: boolean;
}

export interface SpeechRecognitionResponse {
  transcript: string;
  confidence: number;
  words?: WordInfo[];
  languageCode?: string;
}

export interface WordInfo {
  word: string;
  startTime: string;
  endTime: string;
  confidence: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StreamRequest {
  audioChunk: Buffer;
  isFinal: boolean;
  sessionId: string;
}

export interface StreamResponse {
  transcript: string;
  isFinal: boolean;
  confidence: number;
  sessionId: string;
}
