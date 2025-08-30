import { useState, useEffect, useRef } from 'react'
import SearchBar from './components/SearchBar'
import LyricsDisplay from './components/LyricsDisplay'
import YouTubeService from './services/youtubeService'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentSong, setCurrentSong] = useState(null)
  const [playlist, setPlaylist] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLyrics, setCurrentLyrics] = useState('')
  const [songs, setSongs] = useState([])
  const [searchSource, setSearchSource] = useState('youtube')
  const [isSearching, setIsSearching] = useState(false)
  const [youtubePlayer, setYoutubePlayer] = useState(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [mouseInTopArea, setMouseInTopArea] = useState(false)
  const [mouseInSearchArea, setMouseInSearchArea] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false) // New state for showing playlist
  const [focusedSongIndex, setFocusedSongIndex] = useState(-1) // For keyboard navigation
  const [showPlaylistComplete, setShowPlaylistComplete] = useState(false) // For playlist completion popup
  const [draggedItem, setDraggedItem] = useState(null) // For drag and drop functionality
  const [dragOverItem, setDragOverItem] = useState(null) // For drag over visualization

  // Ref for the song list
  const songListRef = useRef(null)

  // Auto-hide search bar logic
  useEffect(() => {
    let timer
    // ບໍ່ຫາຍຖ້າ mouse ຍັງຢູ່ໃນ top area ຫຼື search area ຫຼື search bar ມີການໂຕ້ຕອບ
    if (showSearchBar && !mouseInTopArea && !mouseInSearchArea) {
      timer = setTimeout(() => {
        setShowSearchBar(false)
        setFocusedSongIndex(-1) // Reset focus when hiding
      }, 3000) // ຫາຍຫຼັງຈາກ 3 ວິນາທີ
    }
    return () => clearTimeout(timer)
  }, [showSearchBar, mouseInTopArea, mouseInSearchArea])

  // Mouse movement detection
  useEffect(() => {
    const handleMouseMove = e => {
      if (e.clientY < 100) {
        // ຖ້າ mouse ຢູ່ດ້ານເທິງ 100px
        setShowSearchBar(true)
        setMouseInTopArea(true)
      } else {
        setMouseInTopArea(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Add global keydown listener to show search bar when typing
  useEffect(() => {
    const handleGlobalKeyDown = e => {
      // Check if we're already in an input field
      const isInputElement =
        e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA'

      // Check if the key pressed is a character key and not a special key
      if (
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        !isInputElement
      ) {
        // Show search bar immediately like mouse hover
        setShowSearchBar(true)
        setMouseInSearchArea(true)
        setMouseInTopArea(true) // Also set this to simulate mouse hover

        // Focus the search input after a short delay to ensure the component is rendered
        setTimeout(() => {
          const searchInput = document.querySelector('.search-input')
          if (searchInput) {
            searchInput.focus()
          }
        }, 50)
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [])

  // Effect to add/remove immediate-show class based on typing interaction
  useEffect(() => {
    const topSearchBar = document.querySelector('.top-search-bar')
    if (mouseInTopArea && mouseInSearchArea) {
      topSearchBar?.classList.add('immediate-show')
    } else {
      topSearchBar?.classList.remove('immediate-show')
    }
  }, [mouseInTopArea, mouseInSearchArea])

  // Effect to reset mouseInSearchArea when search bar is hidden
  useEffect(() => {
    if (!showSearchBar) {
      setMouseInSearchArea(false)
    }
  }, [showSearchBar])

  // Keyboard event listener for showing playlist and navigation
  useEffect(() => {
    const handleKeyDown = e => {
      // Check if we're in an input field - more comprehensive check
      const isInputElement =
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable ||
        (e.target.classList && e.target.classList.contains('search-input'))

      // Show playlist when down arrow key is pressed
      // Special case: if we just focused the search input, still allow playlist to show
      if (e.key === 'ArrowDown') {
        setShowPlaylist(true)
        setShowSearchBar(true) // Also show search bar when playlist is shown

        // Focus first song if none is focused AND there are songs in the playlist
        if (focusedSongIndex === -1 && playlist && playlist.length > 0) {
          setFocusedSongIndex(0)
        }
        e.preventDefault()
        return
      }

      // Hide playlist when Escape key is pressed
      if (e.key === 'Escape') {
        setShowPlaylist(false)
        setFocusedSongIndex(-1)
        e.preventDefault()
        return
      }

      // Handle keyboard navigation in playlist/search results
      // Allow navigation when search bar is visible, but with special handling for playlist mode
      if (showSearchBar) {
        const displayedSongs = showPlaylist ? playlist : songs

        // Special case for playlist mode - allow navigation even when in input field
        if (
          showPlaylist &&
          isInputElement &&
          (e.key === 'ArrowUp' || e.key === 'ArrowDown')
        ) {
          // Prevent default input behavior for arrow keys when in playlist mode
          e.preventDefault()

          if (e.key === 'ArrowUp') {
            setFocusedSongIndex(prev => Math.max(0, prev - 1))
          } else if (e.key === 'ArrowDown') {
            if (displayedSongs && displayedSongs.length > 0) {
              setFocusedSongIndex(prev =>
                Math.min(displayedSongs.length - 1, prev + 1)
              )
            }
          }
          return
        }

        // Normal navigation when not in input field
        if (!isInputElement) {
          if (e.key === 'ArrowUp') {
            setFocusedSongIndex(prev => Math.max(0, prev - 1))
            e.preventDefault()
          } else if (e.key === 'ArrowDown') {
            if (displayedSongs && displayedSongs.length > 0) {
              setFocusedSongIndex(prev =>
                Math.min(displayedSongs.length - 1, prev + 1)
              )
            }
            e.preventDefault()
          } else if (
            e.key === 'Enter' &&
            focusedSongIndex >= 0 &&
            focusedSongIndex < (displayedSongs ? displayedSongs.length : 0)
          ) {
            // Play the focused song
            if (displayedSongs && displayedSongs.length > 0) {
              const song = displayedSongs[focusedSongIndex]
              handleSongSelect(song)
            }
            e.preventDefault()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showPlaylist, playlist, songs, focusedSongIndex])

  // Mouse wheel event listener for scrolling through songs
  useEffect(() => {
    const handleWheel = e => {
      if (showSearchBar && songListRef.current) {
        const displayedSongs = showPlaylist ? playlist : songs
        if (displayedSongs && displayedSongs.length > 0) {
          // Use Ctrl + mouse wheel for navigation through songs
          if (e.ctrlKey) {
            e.preventDefault()

            // Calculate new focused index with wrapping
            let newIndex = focusedSongIndex
            if (e.deltaY > 0) {
              // Scrolling down - move to next song
              newIndex = (focusedSongIndex + 1) % displayedSongs.length
            } else if (e.deltaY < 0) {
              // Scrolling up - move to previous song
              newIndex =
                (focusedSongIndex - 1 + displayedSongs.length) %
                displayedSongs.length
            }

            setFocusedSongIndex(newIndex)

            // Scroll the focused item into view
            const songItems = songListRef.current.querySelectorAll('.song-item')
            if (songItems[newIndex]) {
              songItems[newIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
              })
            }

            // Prevent default scrolling behavior when Ctrl is pressed
            e.preventDefault()
            e.stopPropagation()
            return false
          }
          // Without Ctrl key, let natural scrolling work normally
          // But still allow the event to bubble up for parent container scrolling
        }
      }
    }

    // Add wheel event listener to the song list container
    const songListContainer = songListRef.current
    if (songListContainer) {
      songListContainer.addEventListener('wheel', handleWheel, {
        passive: false,
      })
    }

    return () => {
      if (songListContainer) {
        songListContainer.removeEventListener('wheel', handleWheel, {
          passive: false,
        })
      }
    }
  }, [showSearchBar, showPlaylist, playlist, songs, focusedSongIndex])

  // Use YouTube results only
  const displayedSongs = showPlaylist ? playlist : songs

  // Handle YouTube search
  const handleYouTubeSearch = async query => {
    if (!query.trim()) {
      alert('ກະລຸນາພິມຊື່ເພງທີ່ຕ້ອງການຄົ້ນຫາກ່ອນ')
      return
    }

    console.log('ກຳລັງຄົ້ນຫາ YouTube:', query)
    setIsSearching(true)
    setShowSearchBar(true) // Show search bar when searching
    setShowPlaylist(false) // Make sure we're showing search results, not playlist

    try {
      const results = await YouTubeService.searchVideos(query, 15)
      console.log('ຜົນການຄົ້ນຫາ:', results)

      if (results && results.length > 0) {
        setSongs(results)
        setSearchSource('youtube')
        console.log('ຄົ້ນຫາສຳເລັດ:', results.length, 'ເພງ')
        setFocusedSongIndex(0) // Focus first song after search
      } else {
        alert('ບໍ່ພົບເພງທີ່ຄົ້ນຫາ ລອງຄົ້ນຫາດ້ວຍຄຳອື່ນ')
        setSongs([])
      }
    } catch (error) {
      console.error('YouTube search failed:', error)
      alert('ເກີດຂໍ້ຜິດພລາດໃນການຄົ້ນຫາ YouTube')
      setSongs([]) // Clear songs on error
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search term change
  const handleSearchChange = term => {
    setSearchTerm(term)

    // Clear search results when search term is cleared
    if (!term.trim()) {
      console.log('Clearing search results')
      setSongs([])
      setFocusedSongIndex(-1)
    } else {
      // Show search bar when typing
      setShowSearchBar(true)
      setShowPlaylist(false) // Make sure we're showing search results, not playlist
      console.log('Searching for:', term)
    }
  }

  const handleSongSelect = song => {
    console.log('ເລືອກເພງ:', song.title, '- Source:', song.source)
    setCurrentSong(song)
    setIsPlaying(true) // Set playing state to true when selecting a song

    // If the song is from the playlist, make sure the playlist is shown
    const isSongInPlaylist = playlist.some(p => p.id === song.id)
    if (isSongInPlaylist) {
      setShowPlaylist(true)
    }

    if (song.source === 'youtube') {
      setCurrentLyrics(
        `♪ ${song.title} - ${song.artist} ♪\n\n🎤 ເພງຈາກ YouTube\n\nເນື້ອເພງຈະປາກົດທີ່ນີ້ໃນເວລາຫຼິ້ນ...\nLyrics will appear here during playback...\n\n📺 ຊ່ອງ: ${song.channelTitle}\n\n💡 ກົດປຸ່ມ ▶️ ເພື່ອເລີ່ມຫຼິ້ນ`
      )
    } else {
      setCurrentLyrics(
        `♪ ${song.title} - ${song.artist} ♪\n\nເນື້ອເພງຈະປາກົດທີ່ນີ້...\nLyrics will appear here...`
      )
    }

    // ຖ້າເປັນເພງ YouTube ໃຫ້ລໍຖ້າ player ພ້ອມແລ້ວຈຶ່ງໃຫ້ auto-play
    if (song.source === 'youtube') {
      setTimeout(() => {
        if (youtubePlayer && youtubePlayer.playVideo) {
          youtubePlayer.playVideo()
        }
      }, 1000) // ລໍຖ້າ player ໂຫຼດແລ້ວ
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)

    // Control YouTube player if available
    if (youtubePlayer && currentSong?.source === 'youtube') {
      if (isPlaying) {
        youtubePlayer.pauseVideo()
      } else {
        youtubePlayer.playVideo()
      }
    }
  }

  const handlePlayerReady = player => {
    console.log('YouTube player ready! 🎤')
    setYoutubePlayer(player)

    // ຖ້າແລ້ວມີເພງອນທີ່ເລືອກໄວ້ ໃຫ້ເລີ່ມຫຼິ້ນ
    if (currentSong && currentSong.source === 'youtube') {
      setTimeout(() => {
        console.log('ເລີ່ມຫຼິ້ນເພງ YouTube auto...')
        player.playVideo()
        setIsPlaying(true)
      }, 500)
    }
  }

  // Handle YouTube player state changes for auto-play next song
  const handlePlayerStateChange = event => {
    // YouTube player states: -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = video cued
    if (event.data === 0 && currentSong) {
      // Song has ended, check if it's from playlist or search results
      const isSongInPlaylist = playlist.some(song => song.id === currentSong.id)

      if (isSongInPlaylist) {
        // Song is from playlist, remove it and play next song
        const currentIndex = playlist.findIndex(
          song => song.id === currentSong.id
        )
        if (currentIndex !== -1) {
          // Remove the played song from playlist
          const newPlaylist = playlist.filter(
            (_, index) => index !== currentIndex
          )
          setPlaylist(newPlaylist)

          // Adjust focused index if needed
          if (focusedSongIndex >= newPlaylist.length) {
            setFocusedSongIndex(Math.max(0, newPlaylist.length - 1))
          } else if (focusedSongIndex === currentIndex) {
            // If the focused song was removed, keep focus on the same position
            setFocusedSongIndex(
              Math.min(focusedSongIndex, Math.max(0, newPlaylist.length - 1))
            )
          } else if (focusedSongIndex > currentIndex) {
            // If the focused song is after the removed song, shift focus up by one
            setFocusedSongIndex(focusedSongIndex - 1)
          }

          // Play next song if there is one
          if (currentIndex < newPlaylist.length) {
            // Play next song
            const nextSong = newPlaylist[currentIndex]
            handleSongSelect(nextSong)
          } else if (newPlaylist.length > 0) {
            // If we were at the end, loop to first song
            const firstSong = newPlaylist[0]
            handleSongSelect(firstSong)
          } else {
            // No more songs, stop playback and show completion popup
            setCurrentSong(null)
            setIsPlaying(false)
            setShowPlaylistComplete(true)
            setFocusedSongIndex(-1) // Reset focus when playlist is empty
            setShowPlaylist(false) // Hide playlist when empty
          }
        }
      } else {
        // Song is from search results, always go to playlist after one song
        if (playlist.length > 0) {
          // Play the first song from playlist
          const firstSong = playlist[0]
          handleSongSelect(firstSong)
          setShowPlaylist(true) // Show playlist when switching to playlist mode
        } else {
          // No songs in playlist, stop playback and show completion popup
          setCurrentSong(null)
          setIsPlaying(false)
          setShowPlaylistComplete(true)
          setFocusedSongIndex(-1) // Reset focus when playlist is empty
          setShowPlaylist(false) // Hide playlist when empty
        }
      }
    }
  }

  const addToPlaylist = song => {
    if (!playlist.find(p => p.id === song.id)) {
      setPlaylist([...playlist, song])
    }
  }

  const removeFromPlaylist = songId => {
    const removeIndex = playlist.findIndex(p => p.id === songId)
    if (removeIndex === -1) return

    const newPlaylist = playlist.filter(p => p.id !== songId)
    setPlaylist(newPlaylist)

    // Adjust focused index if needed
    if (newPlaylist.length === 0) {
      // If playlist is now empty, reset focus
      setFocusedSongIndex(-1)
    } else if (focusedSongIndex >= newPlaylist.length) {
      // If focus was on or after the last item, move focus to the new last item
      setFocusedSongIndex(newPlaylist.length - 1)
    } else if (focusedSongIndex > removeIndex) {
      // If the focused song is after the removed song, shift focus up by one
      setFocusedSongIndex(focusedSongIndex - 1)
    }
    // If focusedSongIndex < removeIndex, no adjustment needed as the focus is still valid
  }

  // Drag and drop functions for reordering playlist
  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    // Simplified approach for better Chrome compatibility
    e.dataTransfer.setData('text/plain', index.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = e => {
    e.preventDefault()
    // Simplified approach for better Chrome compatibility
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dataIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)

    // Make sure we have valid data
    if (isNaN(dataIndex) || dataIndex === dropIndex) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    setDraggedItem(dataIndex)

    const newPlaylist = [...playlist]
    const draggedSong = newPlaylist[dataIndex]

    // Remove dragged item
    newPlaylist.splice(dataIndex, 1)
    // Insert at new position
    newPlaylist.splice(dropIndex, 0, draggedSong)

    setPlaylist(newPlaylist)

    // Update focused index if it's affected by the drag operation
    let newFocusedIndex = focusedSongIndex
    if (focusedSongIndex === dataIndex) {
      // If the focused item was dragged, update focus to new position
      newFocusedIndex = dropIndex
    } else if (dataIndex < focusedSongIndex && dropIndex >= focusedSongIndex) {
      // If dragging from before focused item to after it, shift focus down
      newFocusedIndex = focusedSongIndex - 1
    } else if (dataIndex > focusedSongIndex && dropIndex <= focusedSongIndex) {
      // If dragging from after focused item to before it, shift focus up
      newFocusedIndex = focusedSongIndex + 1
    }

    // Ensure focused index is valid
    if (newPlaylist.length > 0) {
      setFocusedSongIndex(
        Math.max(0, Math.min(newFocusedIndex, newPlaylist.length - 1))
      )
    } else {
      setFocusedSongIndex(-1)
    }

    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverItem(null)
  }

  // New functions to move songs up and down in the playlist
  const moveSongUp = index => {
    if (index <= 0 || index >= playlist.length) return

    const newPlaylist = [...playlist]
    const songToMove = newPlaylist[index]
    newPlaylist.splice(index, 1)
    newPlaylist.splice(index - 1, 0, songToMove)

    setPlaylist(newPlaylist)

    // Adjust focused index if needed
    if (focusedSongIndex === index) {
      setFocusedSongIndex(index - 1)
    } else if (focusedSongIndex === index - 1) {
      setFocusedSongIndex(index)
    }
  }

  const moveSongDown = index => {
    if (index < 0 || index >= playlist.length - 1) return

    const newPlaylist = [...playlist]
    const songToMove = newPlaylist[index]
    newPlaylist.splice(index, 1)
    newPlaylist.splice(index + 1, 0, songToMove)

    setPlaylist(newPlaylist)

    // Adjust focused index if needed
    if (focusedSongIndex === index) {
      setFocusedSongIndex(index + 1)
    } else if (focusedSongIndex === index + 1) {
      setFocusedSongIndex(index)
    }
  }

  return (
    <div className="app font-lao">
      {/* Playlist Completion Popup */}
      {showPlaylistComplete && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>ລາຍການເພັງທີເລືອກໃວ້ໝົດແລ້ວ (-_-)</h3>
            <button
              className="popup-close-btn"
              onClick={() => setShowPlaylistComplete(false)}
            >
              ປິດ
            </button>
          </div>
        </div>
      )}

      <div
        className={`top-search-bar ${showSearchBar ? 'visible' : 'hidden'}`}
        onMouseEnter={() => {
          setMouseInTopArea(true)
          setMouseInSearchArea(true)
        }}
        onMouseLeave={() => {
          setMouseInTopArea(false)
          setMouseInSearchArea(false)
        }}
      >
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onYouTubeSearch={handleYouTubeSearch}
          isSearching={isSearching}
          songs={songs} // Pass songs directly instead of displayedSongs
          onSongSelect={handleSongSelect}
          onAddToPlaylist={addToPlaylist}
          onRemoveFromPlaylist={removeFromPlaylist} // Pass remove function
          currentSong={currentSong}
          searchSource={searchSource}
          playlist={playlist}
          showPlaylist={showPlaylist}
          focusedSongIndex={focusedSongIndex} // Pass focused index
          songListRef={songListRef} // Pass ref for mouse wheel handling
          onDragStart={handleDragStart} // Pass drag functions
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onMoveSongUp={moveSongUp} // Pass move up function
          onMoveSongDown={moveSongDown} // Pass move down function
        />
      </div>

      <div className="main-content">
        {/* Center Panel - Lyrics Display */}
        <div className="center-panel">
          <LyricsDisplay
            lyrics={currentLyrics}
            currentSong={currentSong}
            onPlayerReady={handlePlayerReady}
            youtubePlayer={youtubePlayer}
            onPlayerStateChange={handlePlayerStateChange} // Pass state change handler
          />
        </div>
      </div>
    </div>
  )
}

export default App
