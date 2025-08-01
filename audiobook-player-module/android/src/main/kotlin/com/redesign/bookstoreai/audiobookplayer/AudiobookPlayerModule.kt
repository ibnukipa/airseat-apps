package com.redesign.bookstoreai.audiobookplayer

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.BitmapDrawable
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import android.util.Log
import android.view.Gravity
import android.widget.LinearLayout
import android.widget.TextView
import coil.ImageLoader
import coil.request.ImageRequest
import com.google.android.exoplayer2.ExoPlayer
import com.google.android.exoplayer2.MediaItem
import com.google.android.exoplayer2.PlaybackException
import com.google.android.exoplayer2.Player
import com.google.android.exoplayer2.C
import com.google.android.exoplayer2.drm.DrmSessionManager
import com.google.android.exoplayer2.drm.ExoMediaDrm
import com.google.android.exoplayer2.drm.HttpMediaDrmCallback
import com.google.android.exoplayer2.drm.DefaultDrmSessionManager
import com.google.android.exoplayer2.drm.DrmSession
import com.google.android.exoplayer2.source.ProgressiveMediaSource
import com.google.android.exoplayer2.upstream.DefaultDataSource
import com.google.android.exoplayer2.upstream.DefaultHttpDataSource
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import expo.modules.kotlin.AppContext
import java.io.IOException
import java.net.URL
import java.util.UUID
import kotlin.math.max
import kotlin.math.min

data class Chapter(
  val title: String,
  val urlString: String,
  var url: Uri? = null,
  var durationMillis: Long? = null
)

// MARK: - AudiobookPlayerImpl (Core Player Logic - Equivalent to Swift's _AudiobookPlayer)
class AudiobookPlayerImpl(private val applicationContext: Context) {

  private var player: ExoPlayer? = null
  private var mediaSession: MediaSessionCompat? = null
  private var handler: Handler? = null
  private var statusRunnable: Runnable? = null

  private var drmLicenseUrl: String? = null
  private var drmType: String? = null
  private var drmCertificateUrl: String? = null
  private var drmCertificateHash: String? = null

  private var currentAccessToken: String? = null
  private var currentBookId: String? = null
  private var currentChapters: MutableList<Chapter> = mutableListOf()
  private var currentChapterIndex: Int = 0

  var onStatusUpdate: ((Map<String, Any?>) -> Unit)? = null
  var onAuthChallenge: ((Map<String, Any?>) -> Unit)? = null

  init {
    Log.d("AudiobookPlayerImpl", "AudiobookPlayerImpl initialized.")
    handler = Handler(Looper.getMainLooper())
    mediaSession = MediaSessionCompat(applicationContext, "AudiobookPlayerSession").apply {
      setFlags(
        MediaSessionCompat.FLAG_HANDLES_MEDIA_BUTTONS or
                MediaSessionCompat.FLAG_HANDLES_TRANSPORT_CONTROLS
      )
      setCallback(mediaSessionCallback)
      isActive = true
    }
  }

  // MARK: - Setup Function
  fun setup(
    drmLicenseUrl: String,
    drmType: String,
    drmCertificateUrl: String,
    drmCertificateHash: String,
    promise: Promise
  ) {
    Log.d("AudiobookPlayerImpl", "setup called.")
    try {
      URL(drmLicenseUrl)
      URL(drmCertificateUrl)
    } catch (e: Exception) {
      promise.reject("INVALID_URL", "Provided DRM URL is invalid: ${e.localizedMessage}", e)
      return
    }

    if (drmCertificateHash.isEmpty()) {
      promise.reject("INVALID_CERT_HASH", "Certificate hash cannot be empty.", Exception("Certificate hash cannot be empty."))
      return
    }
    if (drmType.lowercase() != "widevine") {
      promise.reject("INVALID_DRM_TYPE", "DRM type must be 'widevine' on Android.", Exception("DRM type must be 'widevine' on Android."))
      return
    }

    this.drmLicenseUrl = drmLicenseUrl
    this.drmType = drmType
    this.drmCertificateUrl = drmCertificateUrl
    this.drmCertificateHash = drmCertificateHash

    Log.d("AudiobookPlayerImpl", "DRM setup complete. License: $drmLicenseUrl, DRM Type: $drmType")
    promise.resolve(null)
  }

  // MARK: - Set Access Token Function
  fun setAccessToken(token: String?, promise: Promise) {
    Log.d("AudiobookPlayerImpl", "Access token updated.")
    this.currentAccessToken = token
    promise.resolve(null)
  }

  // MARK: - Initialize Function
  fun initialize(chapters: List<Map<String, Any>>, bookId: String, promise: Promise) {
    Log.d("AudiobookPlayerImpl", "initialize called with ${chapters.size} chapters, bookId: $bookId")

    if (bookId.isEmpty()) {
      promise.reject("INVALID_BOOK_ID", "Book ID cannot be empty when initializing player content.", Exception("Book ID cannot be empty when initializing player content."))
      return
    }
    this.currentBookId = bookId

    this.currentChapters.clear()
    this.currentChapters.addAll(chapters.mapNotNull { chapterDict ->
      val title = chapterDict["title"] as? String
      val urlString = chapterDict["url"] as? String
      if (title == null || urlString == null) {
        Log.w("AudiobookPlayerImpl", "Invalid chapter dictionary in initialize: $chapterDict")
        return@mapNotNull null
      }
      Chapter(title = title, urlString = urlString, url = Uri.parse(urlString))
    })

    if (this.currentChapters.isEmpty()) {
      promise.reject("NO_CHAPTERS_PROVIDED", "No chapters were provided to initialize.", Exception("No chapters were provided to initialize."))
      return
    }

    loadChapterDurations(promise)
  }

  // MARK: - Play Function
  fun play(
    initialChapterIndex: Int,
    title: String,
    artist: String,
    albumArtUrl: String?,
    promise: Promise
  ) {
    Log.d("AudiobookPlayerImpl", "play called with initial index $initialChapterIndex.")

    if (currentChapters.isEmpty()) {
      promise.reject("CHAPTERS_NOT_LOADED", "Chapters must be loaded using initialize() before calling play().", Exception("Chapters must be loaded using initialize() before calling play()."))
      return
    }
    if (initialChapterIndex < 0 || initialChapterIndex >= currentChapters.size) {
      promise.reject("CHAPTER_INDEX_OUT_OF_BOUNDS", "Initial chapter index out of bounds.", Exception("Initial chapter index out of bounds."))
      return
    }

    this.currentChapterIndex = initialChapterIndex

    _playSingleChapter(
      chapterIndex = initialChapterIndex,
      audiobookTitle = title,
      audiobookArtist = artist,
      albumArtUrl = albumArtUrl,
      promise = promise
    )
  }

  private fun _playSingleChapter(
    chapterIndex: Int,
    audiobookTitle: String,
    audiobookArtist: String,
    albumArtUrl: String?,
    promise: Promise? = null
  ) {
    initializePlayer()

    val chapterToPlay = currentChapters[chapterIndex]
    if (chapterToPlay.url == null) {
      promise?.reject("INVALID_CHAPTER_URL", "Invalid chapter URL provided for playback.", Exception("Invalid chapter URL provided for playback."))
      return
    }

    val mediaItem = buildMediaItem(chapterToPlay)
    val dataSourceFactory = DefaultDataSource.Factory(applicationContext, DefaultHttpDataSource.Factory())

    val mediaSource = ProgressiveMediaSource.Factory(dataSourceFactory)
      .setDrmSessionManagerProvider { _ -> getDrmSessionManager() }
      .createMediaSource(mediaItem)

    player?.setMediaSource(mediaSource)
    player?.prepare()
    player?.play()

    setupMediaSessionMetadata(audiobookTitle, audiobookArtist, albumArtUrl)
    startStatusTimer()
    promise?.resolve("started")
  }

  // MARK: - Playback Control Functions
  fun pause() {
    Log.d("AudiobookPlayerImpl", "pause called.")
    player?.pause()
    updateMediaSessionPlaybackState()
  }

  fun resume() {
    Log.d("AudiobookPlayerImpl", "resume called.")
    player?.play()
    updateMediaSessionPlaybackState()
  }

  fun seek(seconds: Double) {
    Log.d("AudiobookPlayerImpl", "seek called with seconds: $seconds")
    val positionMillis = (seconds * 1000).toLong()
    player?.seekTo(positionMillis)
  }

  fun fastForward(interval: Double) {
    Log.d("AudiobookPlayerImpl", "fastForward called with interval: $interval")
    player?.run {
      val newPosition = min(currentPosition + (interval * 1000).toLong(), duration.coerceAtLeast(0L))
      seekTo(newPosition)
    }
  }

  fun rewind(interval: Double) {
    Log.d("AudiobookPlayerImpl", "rewind called with interval: $interval")
    player?.run {
      val newPosition = max(currentPosition - (interval * 1000).toLong(), 0L)
      seekTo(newPosition)
    }
  }

  fun setSpeed(speed: Double) {
    Log.d("AudiobookPlayerImpl", "setSpeed called with speed: $speed")
    if (speed.isFinite() && speed > 0) {
      player?.playbackParameters = player?.playbackParameters?.withSpeed(speed.toFloat()) ?: return
      updateMediaSessionPlaybackState()
    } else {
      Log.w("AudiobookPlayerImpl", "Attempted to set invalid speed: $speed")
    }
  }

  // MARK: - DRM Specific Implementation
  private fun getDrmSessionManager(): DrmSessionManager {
    val widevineUuid = UUID.fromString("edef8ba9-79d6-4ace-a3c8-27dcd51d21ed")
    val licenseUrl = drmLicenseUrl
    val bookId = currentBookId

    if (licenseUrl == null || bookId == null) {
      Log.d("AudiobookPlayerImpl", "DRM is not configured or missing parameters. Returning No-Op manager.")
      return DefaultDrmSessionManager.Builder().build()
    }

    val httpDataSourceFactory = DefaultHttpDataSource.Factory().apply {
      setDefaultRequestProperties(mutableMapOf<String, String>().apply {
        currentAccessToken?.let {
          put("Authorization", "Bearer $it")
        }
        put("book_id", bookId)
        put("drm_type", drmType ?: "")
      })
    }

    val drmCallback = object : HttpMediaDrmCallback(licenseUrl, httpDataSourceFactory) {
      @Throws(IOException::class)
      override fun executeKeyRequest(uuid: UUID, request: ExoMediaDrm.KeyRequest): ByteArray {
        try {
          return super.executeKeyRequest(uuid, request)
        } catch (e: IOException) {
          val message = e.message ?: ""
          if (message.contains("401 Unauthorized") || message.contains("403 Forbidden")) {
            Log.w("AudiobookPlayerImpl", "DRM License Request failed with 401/403. Emitting auth challenge.")
            handler?.post {
              onAuthChallenge?.invoke(mapOf("challengeType" to "tokenExpired", "bookId" to bookId))
            }
            throw DrmSession.DrmSessionException(PlaybackException.ERROR_CODE_DRM_SYSTEM_ERROR, e)
          }
          throw e
        }
      }
    }
    return DefaultDrmSessionManager.Builder()
      .setUuidAndExoMediaDrmProvider(widevineUuid, ExoMediaDrm.Provider { exoMediaDrm -> exoMediaDrm })
      .build(drmCallback)
  }

  private fun buildMediaItem(chapter: Chapter): MediaItem {
    val mediaItemBuilder = MediaItem.Builder().setUri(chapter.url)

    if (drmType?.lowercase() == "widevine" && drmLicenseUrl != null) {
      mediaItemBuilder.setDrmConfiguration(
        MediaItem.DrmConfiguration.Builder(UUID.fromString("edef8ba9-79d6-4ace-a3c8-27dcd51d21ed"))
          .setLicenseUri(Uri.parse(drmLicenseUrl))
          .setLicenseRequestHeaders(mutableMapOf<String, String>().apply {
            currentAccessToken?.let { put("Authorization", "Bearer $it") }
            currentBookId?.let { put("book_id", it) }
            drmType?.let { put("drm_type", it) }
          }.toMap())
          .build()
      )
    }
    return mediaItemBuilder.build()
  }

  // MARK: - Status Updates
  private fun startStatusTimer() {
    statusRunnable?.let { handler?.removeCallbacks(it) }
    statusRunnable = object : Runnable {
      override fun run() {
        sendStatus()
        updateMediaSessionPlaybackState()
        handler?.postDelayed(this, 500)
      }
    }
    handler?.post(statusRunnable!!)
  }

  private fun sendStatus() {
    player?.let { p ->
      val duration = if (p.duration != C.TIME_UNSET) p.duration else 0L
      val position = p.currentPosition

      val status: Map<String, Any?> = mapOf(
        "positionMillis" to position,
        "durationMillis" to duration,
        "isPlaying" to (p.playbackState == Player.STATE_READY && p.playWhenReady)
      )
      onStatusUpdate?.invoke(status)
    }
  }

  // MARK: - MediaSessionCompat Integration
  private fun setupMediaSessionMetadata(title: String, artist: String, albumArtUrl: String?) {
    val metadataBuilder = MediaMetadataCompat.Builder()
      .putString(MediaMetadataCompat.METADATA_KEY_TITLE, title)
      .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, artist)
      .putLong(MediaMetadataCompat.METADATA_KEY_DURATION, currentChapters.getOrNull(currentChapterIndex)?.durationMillis ?: 0L)

    albumArtUrl?.let { urlString ->
      Log.d("AudiobookPlayerImpl", "Attempting to load album art from: $urlString")
      val imageRequest = ImageRequest.Builder(applicationContext)
        .data(urlString)
        .allowHardware(false) // Required for MediaMetadataCompat which expects software bitmaps
        .target { drawable ->
          val bitmap = (drawable as? BitmapDrawable)?.bitmap
          if (bitmap != null) {
            Log.d("AudiobookPlayerImpl", "Album art loaded successfully.")
            metadataBuilder.putBitmap(MediaMetadataCompat.METADATA_KEY_ALBUM_ART, bitmap)
            mediaSession?.setMetadata(metadataBuilder.build())
          } else {
            Log.e("AudiobookPlayerImpl", "Failed to get bitmap from drawable for album art. Drawable type: ${drawable?.javaClass?.simpleName}")
          }
        }
        .listener(
          onError = { request, throwable ->
            Log.e("AudiobookPlayerImpl", "Error loading album art from $urlString: ${throwable.message}", throwable)
          }
        )
        .build()
      ImageLoader(applicationContext).enqueue(imageRequest)
    } ?: run {
      Log.d("AudiobookPlayerImpl", "No album art URL provided.")
    }

    mediaSession?.setMetadata(metadataBuilder.build())
    updateMediaSessionPlaybackState()
  }

  private fun updateMediaSessionPlaybackState() {
    player?.let { p ->
      val stateBuilder = PlaybackStateCompat.Builder()
        .setActions(
          PlaybackStateCompat.ACTION_PLAY or
                  PlaybackStateCompat.ACTION_PAUSE or
                  PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                  PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS or
                  PlaybackStateCompat.ACTION_SEEK_TO or
                  PlaybackStateCompat.ACTION_PLAY_PAUSE or
                  PlaybackStateCompat.ACTION_FAST_FORWARD or
                  PlaybackStateCompat.ACTION_REWIND
        )
        .setState(
          when (p.playbackState) {
            Player.STATE_BUFFERING -> PlaybackStateCompat.STATE_BUFFERING
            Player.STATE_READY -> if (p.playWhenReady) PlaybackStateCompat.STATE_PLAYING else PlaybackStateCompat.STATE_PAUSED
            Player.STATE_ENDED -> PlaybackStateCompat.STATE_STOPPED
            else -> PlaybackStateCompat.STATE_NONE
          },
          p.currentPosition,
          p.playbackParameters.speed
        )
      mediaSession?.setPlaybackState(stateBuilder.build())
    }
  }

  private val playerListener = object : Player.Listener {
    override fun onPlaybackStateChanged(playbackState: Int) {
      updateMediaSessionPlaybackState()
      sendStatus()
    }

    override fun onIsPlayingChanged(isPlaying: Boolean) {
      updateMediaSessionPlaybackState()
      sendStatus()
    }

    override fun onPlayerError(error: PlaybackException) {
      Log.e("AudiobookPlayerImpl", "ExoPlayer error: ${error.message}", error)
      onStatusUpdate?.invoke(mapOf(
        "error" to (error.message ?: "Unknown ExoPlayer error"),
        "errorCode" to error.errorCode,
        "isError" to true
      ))
    }

    override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
      val newChapterIndex = currentChapters.indexOfFirst { it.url == mediaItem?.playbackProperties?.uri }
      if (newChapterIndex != -1) {
        currentChapterIndex = newChapterIndex
      }

      sendStatus()
      val currentChapter = currentChapters.getOrNull(currentChapterIndex)
      setupMediaSessionMetadata(
        title = currentChapter?.title ?: mediaSession?.controller?.metadata?.getString(MediaMetadataCompat.METADATA_KEY_TITLE) ?: "Audiobook",
        artist = mediaSession?.controller?.metadata?.getString(MediaMetadataCompat.METADATA_KEY_ARTIST) ?: "Artist",
        albumArtUrl = null
      )
    }
  }

  private val mediaSessionCallback = object : MediaSessionCompat.Callback() {
    override fun onPlay() { resume() }
    override fun onPause() { pause() }
    override fun onSeekTo(pos: Long) { seek(pos.toDouble() / 1000.0) }
    override fun onFastForward() { fastForward(15.0) }
    override fun onRewind() { rewind(15.0) }

    override fun onSkipToNext() {
      if (currentChapterIndex < currentChapters.size - 1) {
        currentChapterIndex++
        player?.apply {
          stop()
          clearMediaItems()
          _playSingleChapter(
            chapterIndex = currentChapterIndex,
            audiobookTitle = mediaSession?.controller?.metadata?.getString(MediaMetadataCompat.METADATA_KEY_TITLE) ?: "Audiobook",
            audiobookArtist = mediaSession?.controller?.metadata?.getString(MediaMetadataCompat.METADATA_KEY_ARTIST) ?: "Artist",
            albumArtUrl = null
          )
        }
      } else {
        Log.d("AudiobookPlayerImpl", "Already at the last chapter.")
      }
    }

    override fun onSkipToPrevious() {
      if (currentChapterIndex > 0) {
        currentChapterIndex--
        player?.apply {
          stop()
          clearMediaItems()
          _playSingleChapter(
            chapterIndex = currentChapterIndex,
            audiobookTitle = mediaSession?.controller?.metadata?.getString(MediaMetadataCompat.METADATA_KEY_TITLE) ?: "Audiobook",
            audiobookArtist = mediaSession?.controller?.metadata?.getString(MediaMetadataCompat.METADATA_KEY_ARTIST) ?: "Artist",
            albumArtUrl = null
          )
        }
      } else {
        Log.d("AudiobookPlayerImpl", "Already at the first chapter.")
      }
    }
  }

  // MARK: - Chapter Duration Loading (Simulated for now)
  private fun loadChapterDurations(promise: Promise) {
    if (currentChapters.isEmpty()) {
      Log.d("AudiobookPlayerImpl", "No chapters to load durations for.")
      promise.resolve(emptyList<Map<String, Any?>>())
      return
    }

    Thread {
      val updatedChaptersData = currentChapters.map { chapter ->
        val simulatedDuration = 5 * 60 * 1000L
        chapter.durationMillis = simulatedDuration

        mapOf(
          "title" to chapter.title,
          "url" to chapter.urlString,
          "durationMillis" to (chapter.durationMillis ?: 0L)
        )
      }

      handler?.post {
        val totalDuration = currentChapters.sumOf { it.durationMillis ?: 0L }
        Log.d("AudiobookPlayerImpl", "All chapter durations loaded (simulated). Total: ${totalDuration}ms")
        promise.resolve(updatedChaptersData)
      }
    }.start()
  }

  // MARK: - Cleanup
  fun release() {
    Log.d("AudiobookPlayerImpl", "release called.")
    player?.release()
    player = null
    statusRunnable?.let { handler?.removeCallbacks(it) }
    statusRunnable = null
    mediaSession?.release()
    mediaSession = null
    Log.d("AudiobookPlayerImpl", "ExoPlayer and MediaSession released.")
  }

  private fun initializePlayer() {
    if (player == null) {
      player = ExoPlayer.Builder(applicationContext).build()
      player?.addListener(playerListener)
      player?.playWhenReady = true
      mediaSession?.isActive = true
      Log.d("AudiobookPlayerImpl", "ExoPlayer initialized.")
    }
  }
}

// MARK: - Custom Native View for AirPlay Button
class AirPlayButtonView(context: Context, appContext: AppContext? = null) : LinearLayout(context) {

  init {
    layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    orientation = VERTICAL
    gravity = Gravity.CENTER

    val messageTextView = TextView(context).apply {
      text = "AirPlay functionality is specific to iOS.\nThis is an Android placeholder."
      textSize = 12f
      setTextColor(Color.DKGRAY)
      gravity = Gravity.CENTER
      setPadding(10, 10, 10, 10)
    }
    addView(messageTextView)

    setBackgroundColor(Color.parseColor("#E0E0E0"))

    Log.d("AirPlayButtonView", "AirPlayButtonView initialized (Android placeholder).")
  }
}

// MARK: - AudiobookPlayerModule Definition (Main Expo Module Class)
class AudiobookPlayerModule : Module() {

  private var playerImpl: AudiobookPlayerImpl? = null

  override fun definition() = ModuleDefinition {
    Name("AudiobookPlayer")

    Events("AudiobookPlayerStatus", "AudiobookPlayerAuthChallenge")

    OnCreate {
      // Access applicationContext through the `appContext` property provided by ModuleDefinition
      this@AudiobookPlayerModule.playerImpl = AudiobookPlayerImpl(appContext.applicationContext).apply {
        onStatusUpdate = { status ->
          this@AudiobookPlayerModule.sendEvent("AudiobookPlayerStatus", status)
        }
        onAuthChallenge = { challengeInfo ->
          this@AudiobookPlayerModule.sendEvent("AudiobookPlayerAuthChallenge", challengeInfo)
        }
      }
      Log.d("AudiobookPlayerModule", "OnCreate - Module initialized.")
    }

    // --- AsyncFunction declarations with CORRECTED syntax for parameters ---
    AsyncFunction("setup") { drmLicenseUrl: String, drmType: String, drmCertificateUrl: String, drmCertificateHash: String, promise: Promise ->
      Log.d("AudiobookPlayerModule", "setup function called.")
      playerImpl?.setup(
        drmLicenseUrl,
        drmType,
        drmCertificateUrl,
        drmCertificateHash,
        promise
      ) ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    AsyncFunction("setAccessToken") { token: String?, promise: Promise ->
      Log.d("AudiobookPlayerModule", "setAccessToken function called.")
      playerImpl?.setAccessToken(token, promise)
        ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    AsyncFunction("initialize") { chapters: List<Map<String, Any>>, bookId: String, promise: Promise ->
      Log.d("AudiobookPlayerModule", "initialize function called with ${chapters.size} chapters, bookId: $bookId")
      playerImpl?.initialize(chapters, bookId, promise)
        ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    AsyncFunction("play") { initialChapterIndex: Int, title: String, artist: String, albumArtUrl: String?, promise: Promise ->
      Log.d("AudiobookPlayerModule", "play function called with initial index $initialChapterIndex.")
      playerImpl?.play(
        initialChapterIndex,
        title,
        artist,
        albumArtUrl,
        promise
      ) ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    AsyncFunction("pause") { promise: Promise ->
      Log.d("AudiobookPlayerModule", "pause function called.")
      playerImpl?.pause()
      promise.resolve(null)
    }

    AsyncFunction("resume") { promise: Promise ->
      Log.d("AudiobookPlayerModule", "resume function called.")
      playerImpl?.resume()
      promise.resolve(null)
    }

    AsyncFunction("seek") { seconds: Double, promise: Promise ->
      Log.d("AudiobookPlayerModule", "seek function called with seconds: $seconds")
      playerImpl?.seek(seconds)
      promise.resolve(null)
    }

    AsyncFunction("fastForward") { interval: Double, promise: Promise ->
      Log.d("AudiobookPlayerModule", "fastForward function called with interval: $interval")
      playerImpl?.fastForward(interval)
        ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    AsyncFunction("rewind") { interval: Double, promise: Promise ->
      Log.d("AudiobookPlayerModule", "rewind function called with interval: $interval")
      playerImpl?.rewind(interval)
        ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    AsyncFunction("setSpeed") { speed: Double, promise: Promise ->
      Log.d("AudiobookPlayerModule", "setSpeed function called with speed: $speed")
      playerImpl?.setSpeed(speed)
        ?: promise.reject("PLAYER_NOT_INITIALIZED", "AudiobookPlayer instance not available.", Exception("AudiobookPlayer instance not available."))
    }

    OnDestroy {
      Log.d("AudiobookPlayerModule", "OnDestroy - Module deinitialized.")
      playerImpl?.release()
      playerImpl = null
    }

    View(AirPlayButtonView::class) {
      Prop("tintColor") { view: AirPlayButtonView, tintColor: Int? ->
        if (tintColor != null) {
          view.setBackgroundColor(tintColor)
        }
      }

      Prop("backgroundColor") { view: AirPlayButtonView, backgroundColor: Int? ->
        if (backgroundColor != null) {
          view.setBackgroundColor(backgroundColor)
        }
      }
    }
  }
}