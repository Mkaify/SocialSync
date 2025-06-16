const axios = require('axios');

class SocialMediaService {
  
  // Post to Facebook
  async postToFacebook(accessToken, content) {
    try {
      const url = 'https://graph.facebook.com/me/feed';
      const payload = {
        message: content.text,
        access_token: accessToken
      };

      if (content.imageUrl) {
        // For images, use a different endpoint
        const imageUrl = 'https://graph.facebook.com/me/photos';
        payload.url = content.imageUrl;
        payload.caption = content.text;
        
        const response = await axios.post(imageUrl, payload);
        return { success: true, id: response.data.id, platform: 'facebook' };
      } else {
        const response = await axios.post(url, payload);
        return { success: true, id: response.data.id, platform: 'facebook' };
      }
    } catch (error) {
      console.error('Facebook posting error:', error.response?.data || error.message);
      throw new Error(`Facebook posting failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Post to Twitter
  async postToTwitter(accessToken, content) {
    try {
      const url = 'https://api.twitter.com/2/tweets';
      const payload = {
        text: content.text
      };

      // Note: Twitter v2 API has different image handling
      // Images need to be uploaded first, then referenced
      if (content.imageUrl) {
        // For now, just post text. Image upload requires additional steps
        payload.text += ` ${content.imageUrl}`;
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, id: response.data.data.id, platform: 'twitter' };
    } catch (error) {
      console.error('Twitter posting error:', error.response?.data || error.message);
      throw new Error(`Twitter posting failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  // Post to LinkedIn
  async postToLinkedIn(accessToken, content) {
    try {
      // First get the user's profile ID
      const profileResponse = await axios.get('https://api.linkedin.com/v2/people/~', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const authorId = profileResponse.data.id;
      
      const url = 'https://api.linkedin.com/v2/ugcPosts';
      const payload = {
        author: `urn:li:person:${authorId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: content.text
            },
            shareMediaCategory: content.imageUrl ? 'IMAGE' : 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      };

      // Add media if image URL is provided
      if (content.imageUrl) {
        payload.specificContent['com.linkedin.ugc.ShareContent'].media = [{
          status: 'READY',
          originalUrl: content.imageUrl
        }];
      }

      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, id: response.data.id, platform: 'linkedin' };
    } catch (error) {
      console.error('LinkedIn posting error:', error.response?.data || error.message);
      throw new Error(`LinkedIn posting failed: ${error.response?.data?.message || error.message}`);
    }
  }

  // Post to Instagram
  async postToInstagram(accessToken, content) {
    try {
      if (!content.imageUrl) {
        throw new Error('Instagram requires an image to post');
      }

      // Instagram Basic Display API has limitations
      // This is a simplified version - in production, you'd need Instagram Business API
      const url = 'https://graph.instagram.com/me/media';
      const payload = {
        image_url: content.imageUrl,
        caption: content.text,
        access_token: accessToken
      };

      const response = await axios.post(url, payload);
      
      // After creating media, you need to publish it
      const publishUrl = 'https://graph.instagram.com/me/media_publish';
      const publishPayload = {
        creation_id: response.data.id,
        access_token: accessToken
      };

      const publishResponse = await axios.post(publishUrl, publishPayload);
      
      return { success: true, id: publishResponse.data.id, platform: 'instagram' };
    } catch (error) {
      console.error('Instagram posting error:', error.response?.data || error.message);
      throw new Error(`Instagram posting failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Main posting method
  async postToPlatform(platform, accessToken, content) {
    switch (platform) {
      case 'facebook':
        return await this.postToFacebook(accessToken, content);
      case 'twitter':
        return await this.postToTwitter(accessToken, content);
      case 'linkedin':
        return await this.postToLinkedIn(accessToken, content);
      case 'instagram':
        return await this.postToInstagram(accessToken, content);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Validate token (check if it's still valid)
  async validateToken(platform, accessToken) {
    try {
      switch (platform) {
        case 'facebook':
          await axios.get('https://graph.facebook.com/me', {
            params: { access_token: accessToken }
          });
          break;
        case 'twitter':
          await axios.get('https://api.twitter.com/2/users/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          break;
        case 'linkedin':
          await axios.get('https://api.linkedin.com/v2/people/~', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          break;
        case 'instagram':
          await axios.get('https://graph.instagram.com/me', {
            params: { access_token: accessToken }
          });
          break;
        default:
          return false;
      }
      return true;
    } catch (error) {
      console.error(`Token validation failed for ${platform}:`, error.response?.data || error.message);
      return false;
    }
  }
}

module.exports = new SocialMediaService(); 