// YouTube API Configuration
// ການຕັ້ງຄ່າ YouTube API

export const youtubeConfig = {
  // ວາງ YouTube Data API v3 Key ຂອງທ່ານທີ່ນີ້
  // ວິທີການຂໍ API Key:
  // 1. ໄປທີ່ https://console.cloud.google.com/
  // 2. ສ້າງ Project ໃໝ່ ຫຼື ເລືອກ Project ທີ່ມີ
  // 3. ເປີດ "APIs & Services" > "Library"
  // 4. ຄົ້ນຫາ "YouTube Data API v3" ແລະ Enable
  // 5. ໄປທີ່ "Credentials" ແລະສ້າງ API Key
  // 6. ຈຳກັດ API Key ໃຫ້ໃຊ້ກັບ YouTube Data API ເທົ່ານັ້ນ
  API_KEY: 'AIzaSyDUCSC-Pt8N8Gg5gjYjVQkuY_QwknhDnVk',
  
  // URL ຂອງ YouTube Data API v3
  API_URL: 'https://www.googleapis.com/youtube/v3',
  
  // ໃຊ້ CORS proxy ເພື່ອຫຼີກລ່ຽງ browser restrictions
  CORS_PROXY: 'https://api.allorigins.win/get',
  
  // ເປີດ/ປິດການໃຊ້ Real API (true = ໃຊ້ API ຈິງ, false = ໃຊ້ Mock Data)
  USE_REAL_API: true,
  
  // ການຕັ້ງຄ່າການຄົ້ນຫາ
  SEARCH_DEFAULTS: {
    maxResults: 15,
    type: 'video',
    part: 'snippet',
    order: 'relevance'
  },
  
  // ການຕັ້ງຄ່າວິດີໂອ
  VIDEO_DEFAULTS: {
    part: 'contentDetails,statistics,snippet',
    fields: 'items(id,contentDetails(duration),statistics(viewCount,likeCount),snippet(title,channelTitle))'
  }
};

// ຟັງຊັນກວດສອບວ່າ API Key ຖືກຕ້ອງບໍ
export const isValidApiKey = (apiKey) => {
  return apiKey && 
         apiKey !== 'YOUR_YOUTUBE_API_KEY_HERE' && 
         apiKey.length > 20 && 
         apiKey.startsWith('AIza');
};

// ຟັງຊັນການແຈ້ງເຕືອນການຕັ້ງຄ່າ API
export const getApiStatus = () => {
  const { API_KEY, USE_REAL_API } = youtubeConfig;
  
  if (!USE_REAL_API) {
    return {
      status: 'demo',
      message: '🔄 ໃຊ້ Demo Mode - Mock Data',
      color: '#ff6b6b'
    };
  }
  
  if (!isValidApiKey(API_KEY)) {
    return {
      status: 'invalid',
      message: '❌ API Key ບໍ່ຖືກຕ້ອງ - ກັບໄປໃຊ້ Mock Data',
      color: '#ff6b6b'
    };
  }
  
  return {
    status: 'valid',
    message: '✅ ໃຊ້ YouTube API ຈິງ',
    color: '#4ade80'
  };
};

export default youtubeConfig;