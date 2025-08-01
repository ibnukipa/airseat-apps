import AudiobookPlayerModule from './AudiobookPlayerModule';

export interface Chapter {
  title: string;
  url: string;
  durationMillis?: number;
}

export interface AudiobookPlayerStatus {
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

export interface AudiobookPlayerEvents {
  AudiobookPlayerStatus: AudiobookPlayerStatus;
  AudiobookPlayerAuthChallenge: AuthChallenge;
}

// DRM Setup
export async function setup(
  drmLicenseUrl: string,
  drmType: string,
  drmCertificateUrl: string,
  drmCertificateHash: string
): Promise<void> {
  return AudiobookPlayerModule.setup(drmLicenseUrl, drmType, drmCertificateUrl, drmCertificateHash);
}

// Access Token Management
export async function setAccessToken(token: string | null): Promise<void> {
  return AudiobookPlayerModule.setAccessToken(token);
}

// Initialization
export async function initialize(chapters: Chapter[], bookId: string): Promise<Chapter[]> {
  return AudiobookPlayerModule.initialize(chapters, bookId);
}

// Playback Control
export async function play(
  initialChapterIndex: number,
  title: string,
  artist: string,
  albumArtUrl?: string | null
): Promise<string> {
  return AudiobookPlayerModule.play(initialChapterIndex, title, artist, albumArtUrl);
}

export async function pause(): Promise<void> {
  return AudiobookPlayerModule.pause();
}

export async function resume(): Promise<void> {
  return AudiobookPlayerModule.resume();
}

export async function seek(seconds: number): Promise<void> {
  return AudiobookPlayerModule.seek(seconds);
}

export async function fastForward(interval: number): Promise<void> {
  return AudiobookPlayerModule.fastForward(interval);
}

export async function rewind(interval: number): Promise<void> {
  return AudiobookPlayerModule.rewind(interval);
}

export async function setSpeed(speed: number): Promise<void> {
  return AudiobookPlayerModule.setSpeed(speed);
}

// Event Listeners
export function addListener<T extends keyof AudiobookPlayerEvents>(
  eventName: T,
  listener: (event: AudiobookPlayerEvents[T]) => void
): { remove: () => void } {
  return AudiobookPlayerModule.addListener(eventName, listener);
}

export { AudiobookPlayerModule };

export { default as AirPlayButton } from './AirPlayButton';