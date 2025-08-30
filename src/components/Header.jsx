import './Header.css'

function Header() {
  const currentTime = new Date().toLocaleDateString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return (
    <header className="header font-lao">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">
            🎤 EXTREME KARAOKE 🎵
          </h1>
          <p className="app-subtitle">ລະບົບຄາລາໂອເກະພິເສດ</p>
        </div>
        
        <div className="header-info">
          <div className="datetime">
            <span className="time">{currentTime}</span>
          </div>
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span>ພ້ອມໃຊ້ງານ</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header