import { useState, useEffect, useRef } from 'react'
import './SearchBar.css'

function SearchBar({
  searchTerm,
  onSearchChange,
  onYouTubeSearch,
  isSearching,
  songs,
  onSongSelect,
  onAddToPlaylist,
  currentSong,
  searchSource,
  playlist,
  showPlaylist,
  onRemoveFromPlaylist, // New prop for removing songs from playlist
  focusedSongIndex, // New prop for focused song index
  songListRef, // New prop for song list ref
  onDragStart, // New prop for drag and drop
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveSongUp, // New prop for moving songs up
  onMoveSongDown, // New prop for moving songs down
}) {
  // Create ref for search input
  const searchInputRef = useRef(null)

  const handleYouTubeSearch = () => {
    if (searchTerm.trim()) {
      const searchQuery = `${searchTerm} karaoke`
      console.log('ກົດປຸ່ມຄົ້ນຫາ YouTube ດ້ວຍ:', searchQuery)
      onYouTubeSearch(searchQuery)
    }
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter' && searchTerm.trim() && !isSearching) {
      handleYouTubeSearch()
    }
  }

  // Focus search input when component mounts or when showPlaylist changes
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showPlaylist])

  // Focus search input when searchTerm changes or when the component is shown
  useEffect(() => {
    if (searchInputRef.current) {
      // Add a small delay to ensure the element is fully rendered
      const timer = setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
          // Remove the select() call to prevent automatic text selection
          // searchInputRef.current.select(); // Commented out to allow normal typing
        }
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [searchTerm])

  // Determine which songs to display
  const displayedSongs = showPlaylist ? playlist : songs

  return (
    <div className="search-bar font-lao">
      <div className="search-container">
        <div className="search-icon">📺</div>
        <input
          ref={searchInputRef} // Attach ref to input
          type="text"
          className="search-input"
          placeholder="ຄົ້ນຫາຊື່ເພງ ຫຼື ນັກຮ້ອງ... (ກົດ Enter ເພື່ອຄົ້ນຫາ)"
          value={searchTerm}
          onChange={e => {
            onSearchChange(e.target.value)
          }}
          onKeyPress={handleKeyPress}
          // Add these attributes to ensure proper input behavior
          autoFocus={false}
          spellCheck={false}
        />
        <button
          className="youtube-search-btn"
          onClick={() => {
            handleYouTubeSearch()
          }}
          disabled={!searchTerm || isSearching}
          title={isSearching ? 'ກຳລັງຄົ້ນຫາ...' : 'ຄົ້ນຫາຈາກ YouTube'}
        >
          {isSearching ? '🔍' : '🔍'}
          {isSearching && (
            <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>
              ຄົ້ນຫາ...
            </span>
          )}
        </button>

        {searchTerm && (
          <button className="clear-search" onClick={() => onSearchChange('')}>
            ✕
          </button>
        )}
      </div>

      {/* Search Results or Playlist */}
      <div className="search-results">
        <h3 className="list-title">
          {showPlaylist ? (
            <>🎵 ລາຍການເພງທີເລືອກໃວ້ ({playlist && playlist.length} ເພງ)</>
          ) : (
            <>📺 ລາຍຊື່ຈາກ YouTube ({songs && songs.length} ເພງ)</>
          )}
        </h3>
        <div
          className="song-list"
          ref={songListRef} // Attach ref for mouse wheel handling
          onDragOver={onDragOver}
          onWheel={e => {
            // Allow natural scrolling when not using Ctrl key
            if (!e.ctrlKey) {
              e.stopPropagation()
            }
          }}
        >
          {displayedSongs &&
            displayedSongs.map((song, index) => (
              <div
                key={song.id}
                className={`song-item ${
                  currentSong?.id === song.id ? 'active' : ''
                } ${index === focusedSongIndex ? 'focused' : ''}`}
                onClick={() => {
                  console.log('ຄລິກເພງ:', song.title, '- Source:', song.source)
                  onSongSelect(song)
                }}
                draggable={showPlaylist} // Only draggable in playlist mode
                onDragStart={e => {
                  if (showPlaylist) {
                    // Simplified approach for better Chrome compatibility
                    e.dataTransfer.setData('text/plain', index.toString())
                    onDragStart(e, index)
                  }
                }}
                onDragOver={e => {
                  if (showPlaylist) {
                    e.preventDefault()
                    // Simplified approach for better Chrome compatibility
                    e.dataTransfer.dropEffect = 'move'
                  }
                }}
                onDrop={e => {
                  if (showPlaylist) {
                    e.preventDefault()
                    onDrop(e, index)
                  }
                }}
                onDragEnd={e => {
                  if (showPlaylist) {
                    onDragEnd(e)
                  }
                }}
              >
                <div className="song-number">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="song-info">
                  <div className="song-title">{song.title}</div>
                  {song.artist && (
                    <div className="song-artist">{song.artist}</div>
                  )}
                  <div className="song-source">
                    {song.source === 'youtube' ? '📺' : '🎵'}{' '}
                    {song.channelTitle || 'Local Song'}
                  </div>
                </div>

                <div className="song-actions">
                  <div className="song-duration">{song.duration}</div>
                  {song.thumbnail && (
                    <img
                      src={song.thumbnail}
                      alt="thumbnail"
                      className="song-thumbnail"
                    />
                  )}
                  <button
                    className="play-now-btn"
                    onClick={e => {
                      e.stopPropagation()
                      onSongSelect(song)
                      console.log('ກົດປຸ່ມຫຼິ້ນດຽວນີ້:', song.title)
                    }}
                    title="ຫຼິ້ນດຽວນີ້"
                  >
                    ▶️
                  </button>
                  {!showPlaylist && (
                    <button
                      className="add-to-playlist-btn youtube-btn"
                      onClick={e => {
                        e.stopPropagation()
                        onAddToPlaylist(song)
                      }}
                      title="ເພີ່ມໃສ່ Playlist"
                    >
                      +
                    </button>
                  )}
                  {showPlaylist && (
                    <button
                      className="remove-from-playlist-btn"
                      onClick={e => {
                        e.stopPropagation()
                        onRemoveFromPlaylist(song.id)
                      }}
                      title="ລົບອອກຈາກລາຍການ"
                    >
                      ✕
                    </button>
                  )}
                  {/* Add move up and move down buttons for playlist items */}
                  {showPlaylist && (
                    <div className="move-buttons">
                      <button
                        className="move-up-btn"
                        onClick={e => {
                          e.stopPropagation()
                          onMoveSongUp(index)
                        }}
                        title="ຍ້າຍຂື້ນ"
                      >
                        ↑
                      </button>
                      <button
                        className="move-down-btn"
                        onClick={e => {
                          e.stopPropagation()
                          onMoveSongDown(index)
                        }}
                        title="ຍ້າຍລົງ"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {displayedSongs && displayedSongs.length === 0 && (
            <div className="no-songs">
              <p>{showPlaylist ? 'ບໍ່ມີເພງໃນລາຍການ' : 'ບໍ່ພົບເພງທີ່ຄົ້ນຫາ'}</p>
              {!showPlaylist && (
                <p>
                  ລອງຄົ້ນຫາດ້ວຍຊື່ອື່ນ ຫຼື ກົດປຸ່ມ 📺 ເພື່ອຄົ້ນຫາຈາກ YouTube
                </p>
              )}
            </div>
          )}
        </div>
        {/* Mouse wheel navigation hint */}
        {displayedSongs && displayedSongs.length > 0 && (
          <div className="mouse-wheel-hint">
            🖱️ Mouse Wheel: Scroll List | Ctrl + Mouse Wheel: Navigate Songs
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
