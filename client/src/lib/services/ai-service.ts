import { ContentBrief, ContentData } from '../types';
import { puterService } from './puter-service';

export class AIService {
  private model: string = 'claude-3-sonnet';
  private maxTokens: number = 4000;

  async generateContent(brief: ContentBrief): Promise<ContentData> {
    const prompt = this.buildPrompt(brief);
    
    try {
      const response = await puterService.generateContent(prompt, {
        model: brief.aiModel || this.model,
        stream: false, // Set to true for streaming implementation
        maxTokens: this.maxTokens,
      });

      const generatedContent = response.text || response.content || '';
      
      // Extract title from content or use keyword
      const title = this.extractTitle(generatedContent) || `Complete Guide to ${brief.keyword}`;
      
      return {
        title,
        content: generatedContent,
        keyword: brief.keyword,
        contentType: brief.contentType,
        wordCount: this.countWords(generatedContent),
        status: 'draft',
      };
      
    } catch (error) {
      throw new Error(`AI content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateContentStreaming(brief: ContentBrief, onProgress: (chunk: string, progress: number) => void): Promise<ContentData> {
    const prompt = this.buildPrompt(brief);
    
    try {
      const response = await puterService.generateContent(prompt, {
        model: brief.aiModel || this.model,
        stream: true,
        maxTokens: this.maxTokens,
      });

      let generatedContent = '';
      let progress = 0;
      
      for await (const chunk of response) {
        if (chunk.text) {
          generatedContent += chunk.text;
          progress = Math.min(progress + 1, 95); // Cap at 95% until complete
          onProgress(chunk.text, progress);
        }
      }
      
      onProgress('', 100); // Signal completion
      
      const title = this.extractTitle(generatedContent) || `Complete Guide to ${brief.keyword}`;
      
      return {
        title,
        content: generatedContent,
        keyword: brief.keyword,
        contentType: brief.contentType,
        wordCount: this.countWords(generatedContent),
        status: 'draft',
      };
      
    } catch (error) {
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
