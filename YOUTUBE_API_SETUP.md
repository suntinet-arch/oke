# YouTube API Setup

## Overview
This document provides instructions for setting up the YouTube API for the WebApp1 Karaoke application.

## Prerequisites
- Google Account
- Access to Google Cloud Console

## Steps to Set Up YouTube API

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown and select "New Project"
3. Enter a project name and click "Create"

### 2. Enable YouTube Data API v3
1. In the Google Cloud Console, make sure your project is selected
2. Navigate to "APIs & Services" > "Library"
3. Search for "YouTube Data API v3"
4. Click on "YouTube Data API v3" in the search results
5. Click "Enable"

### 3. Create API Credentials
1. Navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key and save it securely

### 4. Configure API Key Restrictions (Recommended)
1. In the "Credentials" page, click on the pencil icon next to your API key
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s) to the "Website restrictions" list
4. Under "API restrictions", select "Restrict key" and choose "YouTube Data API v3"
5. Click "Save"

### 5. Add API Key to WebApp1 Configuration
1. Locate the configuration file in the WebApp1 project:
   ```
   src/config/youtube.config.js
   ```
2. Replace the placeholder API key with your actual API key:
   ```javascript
   const YOUTUBE_CONFIG = {
     API_KEY: 'YOUR_YOUTUBE_API_KEY_HERE',
     USE_REAL_API: true,
     MAX_RESULTS: 15
   };

   export default YOUTUBE_CONFIG;
   ```

## Testing the API Setup
1. Run the WebApp1 application
2. Use the search functionality to verify that YouTube videos are being returned
3. Check the browser console for any API-related errors

## Troubleshooting
- If you encounter CORS issues, ensure your API key restrictions are properly configured
- If you receive quota exceeded errors, check your Google Cloud Console for usage limits
- If searches return no results, verify that your API key is correct and the YouTube Data API is enabled

## Security Considerations
- Keep your API key secure and do not expose it in client-side code in production
- Use API key restrictions to limit usage to your domain(s)
- Monitor API usage in the Google Cloud Console

## Additional Resources
- [YouTube Data API v3 Documentation](https://developers.google.com/youtube/v3)
- [Google Cloud Console](https://console.cloud.google.com/)