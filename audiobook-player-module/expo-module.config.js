module.exports = {
  name: 'audiobook-player-module',
  platforms: ['android'],
  android: {
    package: 'com.redesign.bookstoreai.audiobookplayer',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.WAKE_LOCK',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.MEDIA_CONTENT_CONTROL'
    ]
  }
};