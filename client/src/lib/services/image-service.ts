import { puterService } from './puter-service';

export class ImageService {
  
  /**
   * Generate an image using Puter.js txt2img API
   * @param prompt - The text prompt for image generation
   * @param options - Additional options for image generation
   */
  async generateImage(prompt: string, options: {
    model?: string;
    width?: number;
    height?: number;
    steps?: number;
    guidance_scale?: number;
  } = {}): Promise<string> {
    try {
      console.log('Generating image with prompt:', prompt);
      
      const imageOptions = {
        model: options.model || 'flux-schnell',
        width: options.width || 1024,
        height: options.height || 768,
        steps: options.steps || 4,
        guidance_scale: options.guidance_scale || 1,
        ...options
      };

      const response = await puterService.generateImage(prompt, imageOptions);
      
      console.log('Image generated successfully');
      return response;
      
    } catch (error) {
      console.error('Image generation failed:', error);
      throw new Error(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a content-based image prompt from article content
   * @param content - The article content to analyze
   * @param keyword - The target keyword
   */
  generateImagePrompt(content: string, keyword: string): string {
    // Extract first few paragraphs to understand context
    const firstParagraphs = content
      .split('\n\n')
      .slice(0, 3)
      .join(' ')
      .replace(/[#*_\[\]()]/g, '') // Remove markdown formatting
      .slice(0, 500);

    // Create a focused image prompt
    const prompt = `Professional high-quality image related to "${keyword}". Modern, clean style, suitable for blog article header. Based on: ${firstParagraphs}`;
    
    return prompt;
  }

  /**
   * Generate multiple image variations for content
   * @param content - The article content
   * @param keyword - The target keyword
   * @param count - Number of variations to generate
   */
  async generateContentImages(content: string, keyword: string, count: number = 1): Promise<string[]> {
    const basePrompt = this.generateImagePrompt(content, keyword);
    const variations = [
      `${basePrompt}, professional photography style`,
      `${basePrompt}, modern illustration style`,
      `${basePrompt}, minimalist design`,
      `${basePrompt}, infographic style`,
      `${basePrompt}, realistic photo`
    ];

    const results: string[] = [];
    
    for (let i = 0; i < Math.min(count, variations.length); i++) {
      try {
        const image = await this.generateImage(variations[i]);
        results.push(image);
      } catch (error) {
        console.warn(`Failed to generate image variation ${i + 1}:`, error);
        // Continue with other variations
      }
    }

    if (results.length === 0) {
      throw new Error('Failed to generate any images');
    }

    return results;
  }
}

export const imageService = new ImageService();