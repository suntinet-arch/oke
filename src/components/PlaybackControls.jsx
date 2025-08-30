import { useState } from 'react'
import './PlaybackControls.css'

function PlaybackControls({ isPlaying, onPlayPause, currentSong, youtubePlayer }) {
  const [isRepeat, setIsRepeat] = useState(false)
  const [isRandom, setIsRandom] = useState(false)

  const handleStop = () => {
    if (youtubePlayer && currentSong?.source === 'youtube') {
      console.log('ຫยຸດ YouTube player')
      youtubePlayer.stopVideo()
      setIsPlaying(false)
    }
    // Add local stop logic here
  }

  const handlePrevious = () => {
    if (youtubePlayer && currentSong?.source === 'youtube') {
      console.log('ຖອຍຫຼັງ 10 ວິນາທີ')
      const currentTime = youtubePlayer.getCurrentTime()
      youtubePlayer.seekTo(Math.max(0, currentTime - 10)) // Go back 10 seconds
    }
    // Add previous song logic here
  }

  const handleNext = () => {
    if (youtubePlayer && currentSong?.source === 'youtube') {
      console.log('ໄປໜ້າ 10 ວິນາທີ')
      const currentTime = youtubePlayer.getCurrentTime()
      const duration = youtubePlayer.getDuration()
      youtubePlayer.seekTo(Math.min(duration, currentTime + 10)) // Go forward 10 seconds
    }
    // Add next song logic here
  }

  return (
    <div className="playback-controls font-lao">
      <div className="current-song-info">
        {currentSong ? (
          <>
            <div className="now-playing">ກຳລັງຫຼິ້ນ:</div>
            <div className="current-song-title">{currentSong.title}</div>
            <div className="current-song-artist">{currentSong.artist}</div>
            {currentSong.source === 'youtube' && (
              <div className="youtube-indicator">
                📺 YouTube: {currentSong.channelTitle}
              </div>
            )}
          </>
        ) : (
          <div className="no-song">ເລືອກເພງເພື່ອຫຼິ້ນ</div>
        )}
      </div>

      <div className="control-buttons">
        <button 
          className="control-btn secondary-btn" 
          title="ເພງກ່ອນໜ້າ / ຖອຍຫຼັງ 10 ວິນາທີ"
          onClick={handlePrevious}
        >
          ⏮
        </button>
        
        <button 
          className={`control-btn play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={onPlayPause}
          title={isPlaying ? 'ຢຸດ' : 'ຫຼິ້ນ'}
          disabled={!currentSong}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>
        
        <button 
          className="control-btn secondary-btn" 
          title="ຢຸດ"
          onClick={handleStop}
          disabled={!currentSong}
        >
          ⏹
        </button>
        
        <button 
          className="control-btn secondary-btn" 
          title="ເພງຕໍ່ໄປ / ໄປໜ້າ 10 ວິນາທີ"
          onClick={handleNext}
        >
          ⏭
        </button>
        
        <button 
          className={`control-btn mode-btn ${isRepeat ? 'active' : ''}`}
          onClick={() => setIsRepeat(!isRepeat)}
          title="ເພງຊ້ຳ"
        >
          🔄
        </button>
        
        <button 
          className={`control-btn mode-btn ${isRandom ? 'active' : ''}`}
          onClick={() => setIsRandom(!isRandom)}
          title="ສຸ່ມເພງ"
        >
          🔀
        </button>
      </div>
    </div>
  )
}

export default PlaybackControls