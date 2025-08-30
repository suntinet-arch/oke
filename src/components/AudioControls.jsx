import { useState } from 'react'
import './AudioControls.css'

function AudioControls() {
  const [masterVolume, setMasterVolume] = useState(70)
  const [micVolume, setMicVolume] = useState(50)
  const [echo, setEcho] = useState(30)
  const [keyControl, setKeyControl] = useState(0) // -12 to +12 semitones

  return (
    <div className="audio-controls font-lao">
      <div className="audio-section">
        <h4>ຄວບຄຸມສຽງ</h4>
        
        <div className="controls-grid">
          <div className="control-group">
            <label className="control-label">
              🔊 ສຽງຫຼັກ
              <span className="value">{masterVolume}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={masterVolume}
              onChange={(e) => setMasterVolume(e.target.value)}
              className="slider master-volume"
            />
          </div>

          <div className="control-group">
            <label className="control-label">
              🎤 ສຽງໄມຄ໌
              <span className="value">{micVolume}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={micVolume}
              onChange={(e) => setMicVolume(e.target.value)}
              className="slider mic-volume"
            />
          </div>

          <div className="control-group">
            <label className="control-label">
              🔄 Echo/Reverb
              <span className="value">{echo}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={echo}
              onChange={(e) => setEcho(e.target.value)}
              className="slider echo-control"
            />
          </div>

          <div className="control-group">
            <label className="control-label">
              🎵 ປັບຄີ
              <span className="value">
                {keyControl > 0 ? '+' : ''}{keyControl}
              </span>
            </label>
            <input
              type="range"
              min="-12"
              max="12"
              value={keyControl}
              onChange={(e) => setKeyControl(e.target.value)}
              className="slider key-control"
            />
            <div className="key-labels">
              <span>♭</span>
              <span>0</span>
              <span>♯</span>
            </div>
          </div>
        </div>

        <div className="preset-buttons">
          <button className="preset-btn">ຣີເຊັດ</button>
          <button className="preset-btn">ບັນທຶກ</button>
        </div>
      </div>
    </div>
  )
}

export default AudioControls