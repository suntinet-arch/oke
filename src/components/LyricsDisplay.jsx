import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import './LyricsDisplay.css'

function LyricsDisplay({ lyrics, currentSong, onPlayerReady, youtubePlayer, onPlayerStateChange }) {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedLyrics, setDisplayedLyrics] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (lyrics) {
      const lines = lyrics.split('\n').filter(line => line.trim() !== '')
      setDisplayedLyrics(lines)
      setCurrentLine(0)
    }
  }, [lyrics])

  // Simulate lyrics progression (in real app, this would sync with audio)
  useEffect(() => {
    if (displayedLyrics.length > 0) {
      const interval = setInterval(() => {
        setCurrentLine(prev => (prev + 1) % displayedLyrics.length)
      }, 3000) // Change line every 3 seconds for demo

      return () => clearInterval(interval)
    }
  }, [displayedLyrics])

  return (
    <div className="lyrics-display font-lao">
      {!currentSong ? (
        <div className="no-song-selected">
          <div className="karaoke-icon">🎤</div>
          <h2>ສັນຕິ ຄາຣາໂອເກະ</h2>
          <p>ເລືອກເພງເພື່ອເລີ່ມຮ້ອງ</p>
          <div className="music-notes">
            <span>♪</span>
            <span>♫</span>
            <span>♪</span>
            <span>♫</span>
          </div>
        </div>
      ) : (
        <>
          {currentSong.source === 'youtube' ? (
            <div className="youtube-player-container">
              <YouTube
                videoId={currentSong.id}
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    enablejsapi: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    start: 0,
                    cc_load_policy: 0,
                    autohide: 1
                  },
                }}
                onReady={(event) => {
                  console.log('YouTube player ready:', event.target)
                  if (onPlayerReady) {
                    onPlayerReady(event.target)
                  }
                }}
                onStateChange={(event) => {
                  console.log('YouTube player state:', event.data)
                  // 1 = playing, 2 = paused
                  setIsPlaying(event.data === 1)
                  
                  // Call the parent's state change handler
                  if (onPlayerStateChange) {
                    onPlayerStateChange(event)
                  }
                }}
                className="youtube-player"
              />
              
              {/* Click overlay for play/pause */}
              <div 
                className="video-click-overlay"
                onClick={() => {
                  if (youtubePlayer) {
                    if (isPlaying) {
                      youtubePlayer.pauseVideo()
                    } else {
                      youtubePlayer.playVideo()
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="lyrics-container">
              <div className="lyrics-background"></div>
              
              {displayedLyrics.map((line, index) => (
                <div
                  key={index}
                  className={`lyrics-line ${
                    index === currentLine ? 'current-line' : 
                    index < currentLine ? 'past-line' : 'future-line'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          <div className="progress-indicator">
            <div className="progress-dots">
              {displayedLyrics.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index <= currentLine ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LyricsDisplay