import { EventEmitter } from 'expo-modules-core';

export interface Chapter {
  title: string;
  url: string;
  durationMillis?: number;
}

export interface PlaybackStatus {
  positionMillis: number;
  durationMillis: number;
  isPlaying: boolean;
  error?: string;
  errorCode?: number;
  isError?: boolean;
}

export interface AuthChallenge {
  challengeType: string;
  bookId: string;
}

export interface AudiobookPlayerModuleInterface {
  setup(
    drmLicenseUrl: string,
    drmType: string,
    drmCertificateUrl: string,
    drmCertificateHash: string
  ): Promise<void>;
  
  setAccessToken(token: string | null): Promise<void>;
  
  initialize(chapters: Chapter[], bookId: string): Promise<Chapter[]>;
  
  play(
    initialChapterIndex: number,
    title: string,
    artist: string,
    albumArtUrl?: string | null
  ): Promise<string>;
  
  pause(): Promise<void>;
  
  resume(): Promise<void>;
  
  seek(seconds: number): Promise<void>;
  
  fastForward(interval: number): Promise<void>;
  
  rewind(interval: number): Promise<void>;
  
  setSpeed(speed: number): Promise<void>;
}

const AudiobookPlayerModule: AudiobookPlayerModuleInterface = {
  setup: async (drmLicenseUrl, drmType, drmCertificateUrl, drmCertificateHash) => {
    // Implementation will be provided by the native module
  },
  
  setAccessToken: async (token) => {
    // Implementation will be provided by the native module
  },
  
  initialize: async (chapters, bookId) => {
    // Implementation will be provided by the native module
    return [];
  },
  
  play: async (initialChapterIndex, title, artist, albumArtUrl) => {
    // Implementation will be provided by the native module
    return "started";
  },
  
  pause: async () => {
    // Implementation will be provided by the native module
  },
  
  resume: async () => {
    // Implementation will be provided by the native module
  },
  
  seek: async (seconds) => {
    // Implementation will be provided by the native module
  },
  
  fastForward: async (interval) => {
    // Implementation will be provided by the native module
  },
  
  rewind: async (interval) => {
    // Implementation will be provided by the native module
  },
  
  setSpeed: async (speed) => {
    // Implementation will be provided by the native module
  }
};

export default AudiobookPlayerModule;

// Event emitter for module events
export const eventEmitter = new EventEmitter(AudiobookPlayerModule);

// Export event types
export const Events = {
  STATUS_UPDATE: 'AudiobookPlayerStatus',
  AUTH_CHALLENGE: 'AudiobookPlayerAuthChallenge'
} as const;