import { WordPressConnection } from '@shared/schema';
import { ContentData, WordPressPublishOptions } from '../types';

interface PublishResult {
  success: boolean;
  postId?: number;
  url?: string;
  error?: string;
}

export class WordPressService {
  async publishContent(
    content: ContentData,
    connection: WordPressConnection,
    options: WordPressPublishOptions
  ): Promise<PublishResult> {
    try {
      const postData = {
        title: content.title,
        content: content.content,
        excerpt: content.content.substring(0, 200) + '...',
        status: options.status,
        categories: options.category ? [options.category] : [],
        tags: options.tags ? options.tags.split(',').map(tag => tag.trim()) : [],
        meta: {
          _yoast_wpseo_title: content.metaTitle || content.title,
          _yoast_wpseo_metadesc: content.metaDescription || '',
        },
      };

      const authHeader = this.buildAuthHeader(connection);
      
      const response = await fetch(`${connection.url}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`WordPress API error: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        postId: result.id,
        url: result.link,
      };

    } catch (error) {
      console.error('WordPress publish error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async testConnection(connection: WordPressConnection): Promise<boolean> {
    try {
      const authHeader = this.buildAuthHeader(connection);
      
      const response = await fetch(`${connection.url}/wp-json/wp/v2/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('WordPress connection test failed:', error);
      return false;
    }
  }

  async getCategories(connection: WordPressConnection): Promise<any[]> {
    try {
      const authHeader = this.buildAuthHeader(connection);
      
      const response = await fetch(`${connection.url}/wp-json/wp/v2/categories`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch WordPress categories:', error);
      return [];
    }
  }

  async getTags(connection: WordPressConnection): Promise<any[]> {
    try {
      const authHeader = this.buildAuthHeader(connection);
      
      const response = await fetch(`${connection.url}/wp-json/wp/v2/tags`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tags: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch WordPress tags:', error);
      return [];
    }
  }

  private buildAuthHeader(connection: WordPressConnection): string {
    const credentials = connection.credentials as any;
    
    switch (connection.authType) {
      case 'oauth2':
        return `Bearer ${credentials.accessToken}`;
      case 'jwt':
        return `Bearer ${credentials.token}`;
      case 'basic':
      case 'application_password':
        return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
      default:
        throw new Error(`Unsupported authentication type: ${connection.authType}`);
    }
  }
}

export const wordpressService = new WordPressService();
