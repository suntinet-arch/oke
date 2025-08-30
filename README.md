# WebApp1 - Karaoke Web Application

## Overview
WebApp1 is a Karaoke system integrated with YouTube, designed to allow users to search for and play songs directly from YouTube. It provides a modern and interactive user experience with features like real-time search, lyrics overlay, and playlist management.

## Features
- YouTube Search Integration
- Real-time Search Results
- YouTube Video Player with Lyrics Overlay
- Playback Controls (Play, Pause, Stop, Previous, Next)
- Audio Controls (Volume, Mic, Echo, Key)
- Playlist Management (Add/Remove Songs)
- Responsive UI for Desktop and Mobile
- Smooth Animations and Glass Morphism Design

## Technology Stack
- React 18.2.0
- Vite 5.0.8
- react-youtube 10.1.0
- Axios 1.11.0 for HTTP requests

## Setup and Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd /Users/santi-it/Documents/WebApp1
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production
To build the application for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## Usage
1. Use the search bar to find songs on YouTube
2. Click on a song to play it
3. Use the playback controls to control the video
4. Add songs to your playlist for continuous playback
5. Use the audio controls to adjust the karaoke settings

## Configuration
The application uses a YouTube API key for searching videos. Make sure to configure the API key in the appropriate configuration file.

## Known Issues and Limitations
- Demo mode uses mock data; actual YouTube API requires valid API key
- CORS issues may occur if API key is misconfigured
- Limited to YouTube content availability and API rate limits

## Contributing
Contributions are welcome. Please fork the repository and submit a pull request with your changes.

## License
This project is licensed under the MIT License.# oke
