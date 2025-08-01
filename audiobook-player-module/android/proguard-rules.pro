# Keep ExoPlayer classes
-keep class com.google.android.exoplayer2.** { *; }

# Keep DRM classes
-keep class com.google.android.exoplayer2.drm.** { *; }

# Keep MediaSession classes
-keep class android.support.v4.media.** { *; }
-keep class androidx.media.** { *; }

# Keep our module classes
-keep class com.redesign.bookstoreai.audiobookplayer.** { *; }

# Keep Kotlin coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# Keep Coil classes
-keep class coil.** { *; }

# Keep Expo modules
-keep class expo.modules.** { *; }

# General Android rules
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception