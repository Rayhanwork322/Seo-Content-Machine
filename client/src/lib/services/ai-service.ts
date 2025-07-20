import { ContentBrief, ContentData } from '../types';
import { puterService } from './puter-service';

export class AIService {
  private model: string = 'claude-3-5-sonnet';
  private maxTokens: number = 4000;

  // Available AI models from Puter.js
  static readonly AVAILABLE_MODELS = [
    'gpt-4o-mini',
    'gpt-4o',
    'o1',
    'o1-mini',
    'o1-pro',
    'o3',
    'o3-mini',
    'o4-mini',
    'gpt-4.1',
    'gpt-4.1-mini',
    'gpt-4.1-nano',
    'gpt-4.5-preview',
    'claude-sonnet-4',
    'claude-opus-4',
    'claude-3-7-sonnet',
    'claude-3-5-sonnet',
    'deepseek-chat',
    'deepseek-reasoner',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    'mistral-large-latest',
    'pixtral-large-latest',
    'codestral-latest',
    'google/gemma-2-27b-it',
    'grok-beta'
  ];

  async generateContent(brief: ContentBrief): Promise<ContentData> {
    const prompt = this.buildPrompt(brief);
    
    try {
      console.log('Generating content with AI model:', brief.aiModel || this.model);
      
      const response = await puterService.generateContent(prompt, {
        model: brief.aiModel || this.model,
        stream: false,
        max_tokens: this.maxTokens,
        temperature: 0.7,
        testMode: true // Set to true for testing without API credits
      });

      // Handle different response formats from Puter.js
      let generatedContent = '';
      if (typeof response === 'string') {
        generatedContent = response;
      } else if (response.message && response.message.content) {
        generatedContent = response.message.content;
      } else if (response.text) {
        generatedContent = response.text;
      } else if (response.content) {
        generatedContent = response.content;
      } else {
        throw new Error('Unexpected response format from AI service');
      }
      
      if (!generatedContent || generatedContent.trim().length === 0) {
        throw new Error('AI service returned empty content');
      }
      
      // Extract title from content or use keyword
      const title = this.extractTitle(generatedContent) || `Complete Guide to ${brief.keyword}`;
      
      console.log('Content generated successfully, word count:', this.countWords(generatedContent));
      
      return {
        title,
        content: generatedContent,
        keyword: brief.keyword,
        contentType: brief.contentType,
        wordCount: this.countWords(generatedContent),
        status: 'draft',
      };
      
    } catch (error) {
      console.error('AI content generation failed:', error);
      
      // Handle Puter.js specific errors
      if (error && typeof error === 'object' && 'error' in error && 'success' in error && !(error as any).success) {
        const puterError = (error as any).error;
        if (puterError && typeof puterError === 'object' && 'message' in puterError) {
          throw new Error(`AI service error: ${puterError.message}`);
        }
      }
      
      throw new Error(`AI content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateContentStreaming(brief: ContentBrief, onProgress: (chunk: string, progress: number) => void): Promise<ContentData> {
    const prompt = this.buildPrompt(brief);
    
    try {
      console.log('Generating streaming content with AI model:', brief.aiModel || this.model);
      
      const response = await puterService.generateContent(prompt, {
        model: brief.aiModel || this.model,
        stream: true,
        max_tokens: this.maxTokens,
        temperature: 0.7,
        testMode: true // Set to true for testing without API credits
      });

      let generatedContent = '';
      let progress = 0;
      let chunkCount = 0;
      
      // Handle both async iterable and direct response
      if (response[Symbol.asyncIterator]) {
        for await (const chunk of response) {
          const text = chunk.text || chunk.content || chunk.delta?.text || '';
          if (text) {
            generatedContent += text;
            chunkCount++;
            progress = Math.min(Math.floor((chunkCount / 50) * 95), 95); // Estimate progress
            onProgress(text, progress);
          }
        }
      } else {
        // If streaming is not available, simulate it
        const content = response.text || response.content || response.message?.content || '';
        const words = content.split(' ');
        for (let i = 0; i < words.length; i += 5) {
          const chunk = words.slice(i, i + 5).join(' ') + ' ';
          generatedContent += chunk;
          progress = Math.min(Math.floor(((i + 5) / words.length) * 95), 95);
          onProgress(chunk, progress);
          await new Promise(resolve => setTimeout(resolve, 50)); // Simulate streaming delay
        }
      }
      
      onProgress('', 100); // Signal completion
      
      if (!generatedContent || generatedContent.trim().length === 0) {
        throw new Error('AI service returned empty content');
      }
      
      const title = this.extractTitle(generatedContent) || `Complete Guide to ${brief.keyword}`;
      
      console.log('Streaming content generated successfully, word count:', this.countWords(generatedContent));
      
      return {
        title,
        content: generatedContent,
        keyword: brief.keyword,
        contentType: brief.contentType,
        wordCount: this.countWords(generatedContent),
        status: 'draft',
      };
      
    } catch (error) {
      console.error('AI streaming content generation failed:', error);
      throw new Error(`AI content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(brief: ContentBrief): string {
    return `
Create a comprehensive ${brief.contentType} about "${brief.keyword}".

Requirements:
- Target length: ${brief.targetLength} words
- Content type: ${brief.contentType}
- Write in a professional, engaging tone
- Include proper H1, H2, and H3 headings for structure
- Optimize for SEO with keyword density between 1-2%
- Include a compelling introduction and conclusion with call-to-action
- Ensure content is original, informative, and valuable to readers
- Use bullet points and numbered lists where appropriate
- Include relevant examples and actionable tips

Structure the content with:
1. Engaging introduction that hooks the reader
2. Clear main sections with descriptive subheadings
3. Practical examples and tips throughout
4. Strong conclusion with clear next steps

Focus on providing genuine value while naturally incorporating the target keyword.
`;
  }

  private extractTitle(content: string): string | null {
    // Look for H1 tags or first line
    const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return h1Match[1].replace(/<[^>]*>/g, '').trim();
    }
    
    const mdH1Match = content.match(/^# (.+)$/m);
    if (mdH1Match) {
      return mdH1Match[1].trim();
    }
    
    // Use first line if no headers found
    const firstLine = content.split('\n')[0];
    if (firstLine && firstLine.length < 200) {
      return firstLine.replace(/<[^>]*>/g, '').trim();
    }
    
    return null;
  }

  private countWords(text: string): number {
    return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const aiService = new AIService();
