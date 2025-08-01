import { NativeModules, NativeEventEmitter, DeviceEventEmitter } from 'react-native';
import { Chapter, AudiobookPlayerEvents } from './';

// Get the native module
const AudiobookPlayerNativeModule = NativeModules.AudiobookPlayer;

class AudiobookPlayerModuleImplementation {
  private emitter = new NativeEventEmitter(AudiobookPlayerNativeModule);

  async setup(
    drmLicenseUrl: string,
    drmType: string,
    drmCertificateUrl: string,
    drmCertificateHash: string
  ): Promise<void> {
    return AudiobookPlayerNativeModule.setup(drmLicenseUrl, drmType, drmCertificateUrl, drmCertificateHash);
  }

  async setAccessToken(token: string | null): Promise<void> {
    return AudiobookPlayerNativeModule.setAccessToken(token);
  }

  async initialize(chapters: Chapter[], bookId: string): Promise<Chapter[]> {
    return AudiobookPlayerNativeModule.initialize(chapters, bookId);
  }

  async play(
    initialChapterIndex: number,
    title: string,
    artist: string,
    albumArtUrl?: string | null
  ): Promise<string> {
    return AudiobookPlayerNativeModule.play(initialChapterIndex, title, artist, albumArtUrl);
  }

  async pause(): Promise<void> {
    return AudiobookPlayerNativeModule.pause();
  }

  async resume(): Promise<void> {
    return AudiobookPlayerNativeModule.resume();
  }

  async seek(seconds: number): Promise<void> {
    return AudiobookPlayerNativeModule.seek(seconds);
  }

  async fastForward(interval: number): Promise<void> {
    return AudiobookPlayerNativeModule.fastForward(interval);
  }

  async rewind(interval: number): Promise<void> {
    return AudiobookPlayerNativeModule.rewind(interval);
  }

  async setSpeed(speed: number): Promise<void> {
    return AudiobookPlayerNativeModule.setSpeed(speed);
  }

  addListener<T extends keyof AudiobookPlayerEvents>(
    eventName: T,
    listener: (event: AudiobookPlayerEvents[T]) => void
  ): { remove: () => void } {
    return DeviceEventEmitter.addListener(eventName, listener);
  }
}

export default new AudiobookPlayerModuleImplementation();