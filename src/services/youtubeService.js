import axios from 'axios';
import youtubeConfig, { isValidApiKey, getApiStatus } from '../config/youtube.config.js';

// ດຶງການຕັ້ງຄ່າຈາກ config
const { 
  API_KEY, 
  API_URL, 
  CORS_PROXY, 
  USE_REAL_API,
  SEARCH_DEFAULTS,
  VIDEO_DEFAULTS 
} = youtubeConfig;

class YouTubeService {
  
  // ຄົ້ນຫາວິດີໂອຈາກ YouTube
  async searchVideos(query, maxResults = SEARCH_DEFAULTS.maxResults) {
    console.log('Searching for:', query);
    console.log('API Status:', getApiStatus());
    
    // ຖ້າໃຊ້ Real API
    if (USE_REAL_API && isValidApiKey(API_KEY)) {
      return await this.searchRealYouTube(query, maxResults);
    }
    
    // ສຳລັບການທົດສອບ ໃຊ້ mock data ທັນທີ
    const status = getApiStatus();
    console.log(status.message);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResults = this.getMockYouTubeResults(query, maxResults);
        resolve(mockResults);
      }, 1000); // ຈຳລອງ network delay
    });
  }

  // ຄົ້ນຫາ YouTube ຈິງດ້ວຍ API
  async searchRealYouTube(query, maxResults = SEARCH_DEFAULTS.maxResults) {
    try {
      console.log('ໃຊ້ Real YouTube API');
      
      // ຄົ້ນຫາວິດີໂອ
      const searchQuery = encodeURIComponent(`${query} karaoke OR lyrics OR cover`);
      const searchUrl = `${CORS_PROXY}?url=${encodeURIComponent(
        `${API_URL}/search?part=${SEARCH_DEFAULTS.part}&q=${searchQuery}&type=${SEARCH_DEFAULTS.type}&maxResults=${maxResults}&order=${SEARCH_DEFAULTS.order}&key=${API_KEY}`
      )}`;
      
      console.log('YouTube API URL:', searchUrl);
      const response = await axios.get(searchUrl);
      const data = JSON.parse(response.data.contents);
      
      if (data && data.items) {
        // ດຶງລາຍລະອຽດຂອງວິດີໂອແຕ່ລະຄັນ
        const videoDetailsPromises = data.items.map(item => 
          this.getVideoDetails(item.id.videoId)
        );
        
        const videoDetails = await Promise.all(videoDetailsPromises);
        
        return data.items.map((item, index) => ({
          id: item.id.videoId,
          title: this.cleanTitle(item.snippet.title),
          artist: this.extractArtist(item.snippet.title),
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
          duration: videoDetails[index]?.duration || 'Unknown',
          channelTitle: item.snippet.channelTitle,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          viewCount: videoDetails[index]?.viewCount || 0,
          likeCount: videoDetails[index]?.likeCount || 0,
          source: 'youtube'
        }));
      }
      return [];
    } catch (error) {
      console.error('YouTube Real API search error:', error);
      console.log('ການໃຊ້ Real API ຜິດພລາດ - ກັບໄປໃຊ້ Mock Data');
      // Return mock data for demonstration
      return this.getMockYouTubeResults(query, maxResults);
    }
  }

  // ດຶງລາຍລະອຽດວິດີໂອ (ຮວມທັງ duration)
  async getVideoDetails(videoId) {
    if (!USE_REAL_API || !isValidApiKey(API_KEY)) {
      console.log('getVideoDetails: ໃຊ້ Demo Mode');
      return {
        duration: this.getRandomDuration(),
        viewCount: Math.floor(Math.random() * 10000000),
        likeCount: Math.floor(Math.random() * 100000)
      };
    }
    
    try {
      console.log('getVideoDetails: ໃຊ້ Real API ສຳລັບ video:', videoId);
      
      const url = `${CORS_PROXY}?url=${encodeURIComponent(
        `${API_URL}/videos?part=${VIDEO_DEFAULTS.part}&id=${videoId}&fields=${encodeURIComponent(VIDEO_DEFAULTS.fields)}&key=${API_KEY}`
      )}`;
      
      const response = await axios.get(url);
      const data = JSON.parse(response.data.contents);
      
      if (data && data.items && data.items[0]) {
        const item = data.items[0];
        return {
          duration: this.parseDuration(item.contentDetails.duration),
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount
        };
      }
      return null;
    } catch (error) {
      console.error('YouTube video details error:', error);
      return {
        duration: this.getRandomDuration(),
        viewCount: Math.floor(Math.random() * 10000000),
        likeCount: Math.floor(Math.random() * 100000)
      };
    }
  }

  // ທຳຄວາມສະອາດຫົວຂໍ້ເພງ
  cleanTitle(title) {
    // ລຶບ keywords ທົ່ວໄປທີ່ບໍ່ຈຳເປັນ
    return title
      .replace(/\[.*?\]/g, '') // ລຶບ [Official Video], [Lyrics], etc.
      .replace(/\(.*?karaoke.*?\)/gi, '') // ລຶບ (Karaoke Version)
      .replace(/\(.*?lyrics.*?\)/gi, '') // ລຶບ (with lyrics)
      .replace(/\s+/g, ' ') // ລຶບ space ເກີນ
      .trim();
  }

  // ດຶງຊື່ນັກຮ້ອງຈາກຫົວຂໍ້
  extractArtist(title) {
    // ລອງຫາ pattern ທົ່ວໄປ: "Artist - Song" ຫຼື "Song by Artist"
    const patterns = [
      /^([^-]+)\s*-\s*(.+)$/,  // Artist - Song
      /^(.+)\s+by\s+([^(]+)/i, // Song by Artist
      /^([^(]+)\s*\(/          // Artist (anything else)
    ];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
    
    // ແທນທີ່ຈະໃຫ້ຄ່າ "Unknown Artist" ໃຫ້ໃຊ້ຊື່ວິດີໂອເປັນຊື່ນັກຮ້ອງ
    return '';
  }

  // ແປງ ISO 8601 duration ເປັນ readable format
  parseDuration(duration) {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 'Unknown';

    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    const seconds = match[3] ? parseInt(match[3].replace('S', '')) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  // Mock data ທີ່ມີຄວາມຫຼາກຫຼາຍສຳລັບການທົດສອບ
  getMockYouTubeResults(query, maxResults = 10) {
    // ໃຊ້ video IDs ທີ່ຫຼາກຫຼາຍແລະມີຈິງໃນ YouTube
    const videoIds = [
      'dQw4w9WgXcQ', // Never Gonna Give You Up
      'kJQP7kiw5Fk', // Despacito
      '9bZkp7q19f0', // Gangnam Style
      'CevxZvSJLk8', // Katy Perry - Roar
      'YQHsXMglC9A', // Adele - Hello
      'hT_nvWreIhg', // Whitney Houston - I Will Always Love You
      'SlPhMPnQ58k', // Céline Dion - My Heart Will Go On
      'RgKAFK5djSk', // Wiz Khalifa - See You Again
      'OPf0YbXqDm0', // Mark Ronson - Uptown Funk
      'nfWlot6h_JM', // Taylor Swift - Shake It Off
      'JGwWNGJdvx8', // Ed Sheeran - Shape of You
      'ru0K8uYEZWw', // ColdPlay - Something Just Like This
      'PT2_F-1esPk', // The Chainsmokers - Closer
      'fJ9rUzIMcZQ', // Darude - Sandstorm
      'y6120QOlsfU', // Different music video
      'HBjDZMJUduo', // Different popular song
      'tAGnKpE4NCI', // Different karaoke version
      'L_jWHffIx5E', // Different instrumental
      'jhFpC2toNWA', // Different piano version
      'hsm4poTWjMs'  // Different live performance
    ];

    const musicGenres = ['Official Music Video', 'Karaoke Version', 'Live Performance', 'Instrumental', 'Piano Version'];
    const channels = ['Official Channel', 'Karaoke World', 'Live Sessions', 'Instrumental Hub', 'Piano Music'];
    
    const baseMockResults = [];
    
    // ເລືອກ video ID ຕາມຄຳຄົ້ນຫາ ເພື່ອໃຫ້ໜູຄ້າຍເພງຈິງ
    let selectedVideoIds = [];
    const queryLower = query.toLowerCase();
    
    // ສຳລັບຄຳຄົ້ນຫາເພງລາວ
    if (queryLower.includes('ຮັກ') || queryLower.includes('ລາວ') || queryLower.includes('ດອກ') || queryLower.includes('ໄຜ່')) {
      selectedVideoIds = [
        'dQw4w9WgXcQ', // ເພງຄາສິກທີ່ມີຊື່ເສີຍງ
        'kJQP7kiw5Fk', 
        'YQHsXMglC9A',
        'hT_nvWreIhg',
        'CevxZvSJLk8'
      ];
    }
    // ສຳລັບຄຳຄົ້ນຫາເພງດັງ
    else if (queryLower.includes('rock') || queryLower.includes('pop') || queryLower.includes('ດັງ')) {
      selectedVideoIds = [
        '9bZkp7q19f0',
        'OPf0YbXqDm0', 
        'nfWlot6h_JM',
        'JGwWNGJdvx8',
        'PT2_F-1esPk'
      ];
    }
    // ເພງທີ່ເຫຼືອ
    else {
      selectedVideoIds = videoIds.slice(0, 5);
    }
    
    for (let i = 0; i < Math.min(5, maxResults); i++) {
      const videoId = selectedVideoIds[i] || videoIds[i % videoIds.length];
      const genre = musicGenres[i % musicGenres.length];
      const channel = channels[i % channels.length];
      
      baseMockResults.push({
        id: videoId,
        title: `${query} - ${genre}`,
        artist: this.extractArtistFromQuery(query),
        thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        duration: this.getRandomDuration(),
        channelTitle: channel,
        description: `${query} - ${this.getDescriptionInLao(genre)}`,
        source: 'youtube'
      });
    }

    return baseMockResults;
  }

  // ສຸ່ມເວລາເພງ
  getRandomDuration() {
    const minutes = Math.floor(Math.random() * 3) + 2; // 2-4 ນາທີ
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // ແປຄຳອະທິບາຍເປັນລາວ
  getDescriptionInLao(genre) {
    const descriptions = {
      'Official Music Video': 'ເພງຈາກ YouTube Official',
      'Karaoke Version': 'ເວີຊັນຄາລາໂອເກະພ້ອມເນື້ອເພງ',
      'Live Performance': 'ການສະແດງສົດຢ່າງເປັນທາງການ',
      'Instrumental': 'ເວີຊັນເຄື່ອງດົນຕີເທົ່ານັ້ນ',
      'Piano Version': 'ເວີຊັນເປີໂນ'
    };
    return descriptions[genre] || 'ເພງຈາກ YouTube';
  }

  // ດຶງຊື່ນັກຮ້ອງຈາກ search query
  extractArtistFromQuery(query) {
    // ລອງຫາຮູບແບບທົ່ວໄປ
    if (query.includes(' - ')) {
      return query.split(' - ')[0].trim();
    }
    if (query.includes(' by ')) {
      return query.split(' by ')[1].trim();
    }
    // ຖ້າບໍ່ມີຮູບແບບໃດກໍບໍ່ໃຫ້ສະແດງ "Unknown Artist"
    return '';
  }
}

export default new YouTubeService();