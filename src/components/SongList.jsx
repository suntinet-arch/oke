import './SongList.css'

function SongList({ songs, onSongSelect, onAddToPlaylist, currentSong, searchSource }) {
  return (
    <div className="song-list-container font-lao">
      <h3 className="list-title">
        {searchSource === 'youtube' ? (
          <>
            📺 ລາຍຊື່ຈາກ YouTube ({songs.length} ເພງ)
          </>
        ) : (
          <>
            🎵 ລາຍຊື່ເພງທ້ອງຖິ່ນ ({songs.length} ເພງ)
          </>
        )}
      </h3>
      
      <div className="song-list">
        {songs.map((song, index) => (
          <div 
            key={song.id}
            className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
            onClick={() => {
              console.log('ຄລິກເພງ:', song.title, '- Source:', song.source)
              onSongSelect(song)
            }}
          >
            <div className="song-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
              {song.source === 'youtube' && (
                <div className="song-source">
                  📺 {song.channelTitle}
                </div>
              )}
            </div>
            
            <div className="song-actions">
              <div className="song-duration">{song.duration}</div>
              {song.source === 'youtube' && song.thumbnail && (
                <img 
                  src={song.thumbnail} 
                  alt="thumbnail"
                  className="song-thumbnail"
                />
              )}
              {song.source === 'youtube' && (
                <button 
                  className="play-now-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSongSelect(song)
                    console.log('ກົດປຸ່ມຫຼິ້ນດຽວນີ້:', song.title)
                  }}
                  title="ຫຼິ້ນດຽວນີ້"
                >
                  ▶️
                </button>
              )}
              <button 
                className={`add-to-playlist-btn ${song.source === 'youtube' ? 'youtube-btn' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToPlaylist(song)
                }}
                title="ເພີ່ມໃສ່ Playlist"
              >
                +
              </button>
            </div>
          </div>
        ))}
        
        {songs.length === 0 && (
          <div className="no-songs">
            <p>ບໍ່ພົບເພງທີ່ຄົ້ນຫາ</p>
            <p>ລອງຄົ້ນຫາດ້ວຍຊື່ອື່ນ ຫຼື ກົດປຸ່ມ 📺 ເພື່ອຄົ້ນຫາຈາກ YouTube</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SongList