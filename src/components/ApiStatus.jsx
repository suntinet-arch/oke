import { useState, useEffect } from 'react';
import { getApiStatus } from '../config/youtube.config.js';
import './ApiStatus.css';

function ApiStatus() {
  const [status, setStatus] = useState(getApiStatus());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // ອັບເດດສະຖານະທຸກໆ 5 ວິນາທີ
    const interval = setInterval(() => {
      setStatus(getApiStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="api-status font-lao">
      <div 
        className={`status-badge ${status.status}`}
        onClick={toggleDetails}
        style={{ backgroundColor: status.color }}
      >
        <span className="status-text">{status.message}</span>
        <span className="toggle-icon">{showDetails ? '▲' : '▼'}</span>
      </div>
      
      {showDetails && (
        <div className="status-details">
          <h4>📋 ຂໍ້ມູນການຕັ້ງຄ່າ YouTube API</h4>
          
          {status.status === 'demo' && (
            <div className="demo-info">
              <p><strong>🔄 Demo Mode:</strong></p>
              <ul>
                <li>ໃຊ້ເພງຕົວຢ່າງ 20 ເພງ</li>
                <li>ເພງອາດບໍ່ຕົງກັບການຄົ້ນຫາ 100%</li>
                <li>ເໝາະສຳລັບການທົດສອບ</li>
              </ul>
            </div>
          )}
          
          {status.status === 'invalid' && (
            <div className="invalid-info">
              <p><strong>❌ API Key ບັນຫາ:</strong></p>
              <ul>
                <li>API Key ບໍ່ຖືກຕ້ອງ ຫຼື ບໍ່ໄດ້ຕັ້ງ</li>
                <li>ໄປທີ່ src/config/youtube.config.js</li>
                <li>ປ່ຽນ USE_REAL_API: true</li>
                <li>ວາງ API Key ຈິງ</li>
              </ul>
            </div>
          )}
          
          {status.status === 'valid' && (
            <div className="valid-info">
              <p><strong>✅ API ເຮັດວຽກປົກກະຕິ:</strong></p>
              <ul>
                <li>ເຊື່ອມຕໍ່ YouTube API ສຳເລັດ</li>
                <li>ສາມາດຄົ້ນຫາເພງຈິງໄດ້</li>
                <li>ຂໍ້ມູນມາຈາກ YouTube ໂດຍກົງ</li>
              </ul>
            </div>
          )}
          
          <div className="setup-guide">
            <p><strong>🔧 ວິທີຕັ້ງຄ່າ YouTube API:</strong></p>
            <ol>
              <li>ໄປທີ່ <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
              <li>ສ້າງໂປຣເຈັກໃໝ່ ຫຼື ເລືອກໂປຣເຈັກທີ່ມີ</li>
              <li>ເປີດ "APIs & Services" → "Library"</li>
              <li>ຄົ້ນຫາ "YouTube Data API v3" ແລະ Enable</li>
              <li>ໄປທີ່ "Credentials" ແລະສ້າງ API Key</li>
              <li>ເອົາ API Key ໄປໃສ່ໃນ src/config/youtube.config.js</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApiStatus;