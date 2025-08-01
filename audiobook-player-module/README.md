# Audiobook Player Module

An Expo module for audiobook playback with DRM support using ExoPlayer on Android.

## Features

- DRM-protected audiobook playback (Widevine)
- Background playback with media session controls
- Chapter-based navigation
- Playback speed control
- Seek, fast forward, and rewind functionality
- Album art support
- Authentication token management

## Installation

1. Install the module in your Expo project:
```bash
npm install ./audiobook-player-module
```

2. Add the module to your app.json:
```json
{
  "expo": {
    "plugins": [
      "./audiobook-player-module"
    ]
  }
}
```

## Build Instructions

### Prerequisites
- Node.js 16+
- Android Studio with Android SDK
- Expo CLI

### Building the Module

1. Navigate to the module directory:
```bash
cd audiobook-player-module
```

2. Install dependencies:
```bash
npm install
```

3. Build the module:
```bash
npm run build
```

### Building for Development

1. Clean the build:
```bash
npm run clean
```

2. Prepare the module:
```bash
npm run prepare
```

## Usage

```javascript
import { AudiobookPlayerModule } from 'audiobook-player-module';

// Setup DRM configuration
await AudiobookPlayerModule.setup(
  'https://your-drm-license-server.com/license',
  'widevine',
  'https://your-certificate-server.com/cert',
  'your-certificate-hash'
);

// Set access token
await AudiobookPlayerModule.setAccessToken('your-access-token');

// Initialize with chapters
const chapters = [
  { title: 'Chapter 1', url: 'https://example.com/chapter1.mp4' },
  { title: 'Chapter 2', url: 'https://example.com/chapter2.mp4' }
];
await AudiobookPlayerModule.initialize(chapters, 'book-id-123');

// Start playback
await AudiobookPlayerModule.play(0, 'Book Title', 'Author Name', 'https://example.com/cover.jpg');

// Control playback
await AudiobookPlayerModule.pause();
await AudiobookPlayerModule.resume();
await AudiobookPlayerModule.seek(30.5); // seconds
await AudiobookPlayerModule.setSpeed(1.5);
```

## Events

The module emits the following events:

- `AudiobookPlayerStatus`: Playback status updates
- `AudiobookPlayerAuthChallenge`: Authentication challenges

```javascript
import { EventEmitter } from 'expo-modules-core';

const eventEmitter = new EventEmitter(AudiobookPlayerModule);

eventEmitter.addListener('AudiobookPlayerStatus', (status) => {
  console.log('Playback status:', status);
});

eventEmitter.addListener('AudiobookPlayerAuthChallenge', (challenge) => {
  console.log('Auth challenge:', challenge);
});
```

## Dependencies

- ExoPlayer 2.18.7
- AndroidX Media 1.6.0
- Coil 2.3.0 (for image loading)
- Expo Modules Kotlin 1.0.0

## Troubleshooting

### Build Errors

1. **Kotlin version conflicts**: Ensure you're using Kotlin 1.8.0 or compatible version
2. **ExoPlayer version**: Make sure ExoPlayer version is compatible with your Android SDK
3. **Permission issues**: Verify all required permissions are declared in AndroidManifest.xml

### Runtime Issues

1. **DRM errors**: Check your DRM license server configuration
2. **Network issues**: Ensure proper internet connectivity and network permissions
3. **Media session**: Verify media session permissions are granted

## License

MIT License