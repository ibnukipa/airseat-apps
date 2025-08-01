# Audiobook Player Module

A React Native module for playing audiobooks with DRM support using ExoPlayer on Android.

## Features

- DRM (Widevine) support for protected content
- Chapter-based playback
- Media session integration for lock screen controls
- Playback speed control
- Seek, fast forward, and rewind functionality
- Status updates and error handling
- Authentication challenge handling for token refresh

## Installation

### For Expo SDK 40 and older

1. Copy the `modules/audiobook-player` directory to your project
2. Install the module dependencies in your main project

### Android Setup

Add to your `android/settings.gradle`:
```gradle
include ':audiobook-player'
project(':audiobook-player').projectDir = new File(rootProject.projectDir, '../modules/audiobook-player/android')
```

Add to your `android/app/build.gradle`:
```gradle
dependencies {
    implementation project(':audiobook-player')
    // ... other dependencies
}
```

Add to your `MainApplication.java`:
```java
import com.redesign.bookstoreai.audiobookplayer.AudiobookPlayerPackage;

@Override
protected List<ReactPackage> getPackages() {
    @SuppressWarnings("UnnecessaryLocalVariable")
    List<ReactPackage> packages = new PackageList(this).getPackages();
    packages.add(new AudiobookPlayerPackage());
    return packages;
}
```

## Usage

```typescript
import * as AudiobookPlayer from '../modules/audiobook-player/src';

// Setup DRM
await AudiobookPlayer.setup(
  'https://your-drm-license-url',
  'widevine',
  'https://your-certificate-url',
  'certificate-hash'
);

// Set access token
await AudiobookPlayer.setAccessToken('your-access-token');

// Initialize with chapters
const chapters = [
  { title: 'Chapter 1', url: 'https://example.com/chapter1.mp3' },
  { title: 'Chapter 2', url: 'https://example.com/chapter2.mp3' }
];

await AudiobookPlayer.initialize(chapters, 'book-id');

// Start playback
await AudiobookPlayer.play(0, 'Book Title', 'Author Name', 'https://example.com/cover.jpg');

// Listen for status updates
const statusListener = AudiobookPlayer.addListener('AudiobookPlayerStatus', (status) => {
  console.log('Position:', status.positionMillis);
  console.log('Duration:', status.durationMillis);
  console.log('Is Playing:', status.isPlaying);
});

// Listen for auth challenges
const authListener = AudiobookPlayer.addListener('AudiobookPlayerAuthChallenge', (challenge) => {
  console.log('Auth challenge:', challenge.challengeType);
  // Refresh token and call setAccessToken again
});

// Control playback
await AudiobookPlayer.pause();
await AudiobookPlayer.resume();
await AudiobookPlayer.seek(30); // Seek to 30 seconds
await AudiobookPlayer.setSpeed(1.5); // 1.5x speed
await AudiobookPlayer.fastForward(15); // Skip forward 15 seconds
await AudiobookPlayer.rewind(15); // Skip back 15 seconds

// Clean up listeners
statusListener.remove();
authListener.remove();
```

## AirPlay Button (iOS Placeholder on Android)

```tsx
import { AirPlayButton } from '../modules/audiobook-player/src';

<AirPlayButton 
  style={{ width: 40, height: 40 }}
  tintColor="#007AFF"
/>
```

## API Reference

### Methods

- `setup(drmLicenseUrl, drmType, drmCertificateUrl, drmCertificateHash)` - Configure DRM settings
- `setAccessToken(token)` - Set authentication token
- `initialize(chapters, bookId)` - Load chapters for playback
- `play(chapterIndex, title, artist, albumArtUrl?)` - Start playback
- `pause()` - Pause playback
- `resume()` - Resume playback
- `seek(seconds)` - Seek to position
- `fastForward(seconds)` - Skip forward
- `rewind(seconds)` - Skip backward
- `setSpeed(speed)` - Set playback speed

### Events

- `AudiobookPlayerStatus` - Playback status updates
- `AudiobookPlayerAuthChallenge` - Authentication challenges

## Requirements

- React Native >= 0.60
- Android API level 21+
- ExoPlayer 2.14.2
- Widevine DRM support on device

## Troubleshooting

### Build Issues

1. Make sure Kotlin is properly configured in your Android project
2. Check that all dependencies are properly included
3. Verify the module is properly linked in settings.gradle and MainApplication.java

### DRM Issues

1. Ensure your device supports Widevine DRM
2. Check that license URLs are accessible
3. Verify authentication tokens are valid

### Playback Issues

1. Check media URLs are accessible
2. Verify internet connectivity
3. Check Android media session permissions