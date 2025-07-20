import { ContentData, SEOMetrics, SEORecommendation } from '../types';

export interface SEOAnalysis {
  overallScore: number;
  titleScore: number;
  metaScore: number;
  keywordScore: number;
  readabilityScore: number;
  headingScore: number;
  lengthScore: number;
  suggestions: SEORecommendation[];
  metrics: SEOMetrics;
}

export class SEOService {
  async analyzeSEO(content: ContentData): Promise<SEOAnalysis> {
    const analysis: SEOAnalysis = {
      overallScore: 0,
      titleScore: this.analyzeTitle(content.title, content.keyword),
      metaScore: this.analyzeMetaDescription(content.metaDescription, content.keyword),
      keywordScore: this.analyzeKeywordDensity(content.content, content.keyword),
      readabilityScore: this.analyzeReadability(content.content),
      headingScore: this.analyzeHeadings(content.content),
      lengthScore: this.analyzeLength(content.content),
      suggestions: [],
      metrics: this.calculateMetrics(content),
    };

    // Calculate overall score
    analysis.overallScore = this.calculateOverallScore(analysis);
    
    // Generate suggestions
    analysis.suggestions = this.generateSuggestions(analysis, content);
    
    return analysis;
  }

  private analyzeTitle(title: string, keyword?: string): number {
    let score = 0;
    
    if (!title) return 0;
    
    // Title length (50-60 characters is optimal)
    if (title.length >= 50 && title.length <= 60) score += 40;
    else if (title.length >= 40 && title.length <= 70) score += 30;
    else if (title.length >= 30) score += 20;
    
    // Keyword in title
    if (keyword && title.toLowerCase().includes(keyword.toLowerCase())) {
      score += 40;
      
      // Keyword position (earlier is better)
      const keywordIndex = title.toLowerCase().indexOf(keyword.toLowerCase());
      if (keywordIndex <= 10) score += 20;
      else if (keywordIndex <= 30) score += 10;
    }
    
    return Math.min(score, 100);
  }

  private analyzeMetaDescription(metaDescription?: string, keyword?: string): number {
    if (!metaDescription) return 0;
    
    let score = 0;
    
    // Length (150-160 characters is optimal)
    if (metaDescription.length >= 150 && metaDescription.length <= 160) score += 50;
    else if (metaDescription.length >= 120 && metaDescription.length <= 170) score += 40;
    else if (metaDescription.length >= 100) score += 30;
    
    // Keyword in meta description
    if (keyword && metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      score += 30;
    }
    
    // Call to action or engaging language
    const cta = /\b(learn|discover|find|get|download|try|start|explore)\b/i;
    if (cta.test(metaDescription)) score += 20;
    
    return Math.min(score, 100);
  }

  private analyzeKeywordDensity(content: string, keyword?: string): number {
    if (!keyword) return 50;
    
    const plainText = content.replace(/<[^>]*>/g, '').toLowerCase();
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    const keywordCount = words.filter(word => 
      word.includes(keyword.toLowerCase())
    ).length;
    
    const density = (keywordCount / words.length) * 100;
    
    // Optimal density 1-2%
    if (density >= 1 && density <= 2) return 100;
    if (density >= 0.5 && density <= 3) return 80;
    if (density >= 0.2 && density <= 4) return 60;
    if (density > 0 && density <= 5) return 40;
    
    return 20;
  }

  private analyzeReadability(content: string): number {
    const plainText = content.replace(/<[^>]*>/g, '');
    const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const syllables = this.countSyllables(plainText);
    
    // Flesch Reading Ease Score
    const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (syllables / words.length));
    
    // Convert to 0-100 scale (higher is better)
    if (fleschScore >= 80) return 100;
    if (fleschScore >= 70) return 90;
    if (fleschScore >= 60) return 80;
    if (fleschScore >= 50) return 70;
    if (fleschScore >= 40) return 60;
    return 50;
  }

  private analyzeHeadings(content: string): number {
    const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
    
    let score = 0;
    
    // Should have exactly one H1
    if (h1Count === 1) score += 30;
    else if (h1Count === 0) score += 0;
    else score += 10; // Multiple H1s is not ideal
    
    // Should have multiple H2s for structure
    if (h2Count >= 2 && h2Count <= 8) score += 40;
    else if (h2Count >= 1) score += 30;
    
    // H3s are good for detailed structure
    if (h3Count > 0) score += 30;
    
    return Math.min(score, 100);
  }

  private analyzeLength(content: string): number {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    
    // Optimal length depends on content type
    if (wordCount >= 1500 && wordCount <= 3000) return 100;
    if (wordCount >= 1000 && wordCount <= 4000) return 90;
    if (wordCount >= 800) return 80;
    if (wordCount >= 500) return 70;
    if (wordCount >= 300) return 60;
    
    return 40;
  }

  private calculateMetrics(content: ContentData): SEOMetrics {
    const plainText = content.content.replace(/<[^>]*>/g, '');
    const words = plainText.split(/\s+/).filter(word => word.length > 0);
    
    let keywordDensity = 0;
    if (content.keyword) {
      const keywordCount = words.filter(word => 
        word.toLowerCase().includes(content.keyword!.toLowerCase())
      ).length;
      keywordDensity = (keywordCount / words.length) * 100;
    }

    return {
      keywordDensity,
      titleOptimization: this.analyzeTitle(content.title, content.keyword),
      metaDescription: this.analyzeMetaDescription(content.metaDescription, content.keyword),
      headingStructure: this.getHeadingStructure(content.content),
      readabilityScore: this.analyzeReadability(content.content),
      internalLinks: this.countInternalLinks(content.content),
    };
  }

  private getHeadingStructure(content: string): string {
    const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (content.match(/<h3[^>]*>/gi) || []).length;
    
    if (h1Count === 1 && h2Count >= 2) return 'Good';
    if (h1Count === 1 && h2Count >= 1) return 'Fair';
    return 'Poor';
  }

  private countInternalLinks(content: string): number {
    const links = content.match(/<a[^>]*href=[^>]*>/gi) || [];
    return links.filter(link => !link.includes('http') || link.includes('localhost')).length;
  }

  private calculateOverallScore(analysis: SEOAnalysis): number {
    const weights = {
      title: 0.2,
      meta: 0.15,
      keyword: 0.2,
      readability: 0.15,
      heading: 0.15,
      length: 0.15,
    };

    return Math.round(
      analysis.titleScore * weights.title +
      analysis.metaScore * weights.meta +
      analysis.keywordScore * weights.keyword +
      analysis.readabilityScore * weights.readability +
      analysis.headingScore * weights.heading +
      analysis.lengthScore * weights.length
    );
  }

  private generateSuggestions(analysis: SEOAnalysis, content: ContentData): SEORecommendation[] {
    const suggestions: SEORecommendation[] = [];

    if (analysis.titleScore < 80) {
      suggestions.push({
        type: 'warning',
        title: 'Optimize Title Tag',
        description: 'Include your target keyword near the beginning and keep it between 50-60 characters.',
        priority: 'high',
      });
    }

    if (analysis.metaScore < 80) {
      suggestions.push({
        type: 'warning',
        title: 'Improve Meta Description',
        description: 'Write a compelling meta description (150-160 characters) that includes your target keyword.',
        priority: 'high',
      });
    }

    if (analysis.keywordScore < 80) {
      suggestions.push({
        type: 'info',
        title: 'Adjust Keyword Density',
        description: 'Aim for 1-2% keyword density throughout your content.',
        priority: 'medium',
      });
    }

    if (analysis.metrics.internalLinks === 0) {
      suggestions.push({
        type: 'error',
        title: 'Add Internal Links',
        description: 'Include 2-3 internal links to related content to improve SEO and user experience.',
        priority: 'medium',
      });
    }

    if (analysis.readabilityScore < 70) {
      suggestions.push({
        type: 'info',
        title: 'Improve Readability',
        description: 'Use shorter sentences and simpler vocabulary to improve readability score.',
        priority: 'low',
      });
    }

    return suggestions;
  }

  private countSyllables(text: string): number {
    // Simplified syllable counting
    return text.toLowerCase()
      .replace(/[^a-z]/g, '')
      .replace(/[aeiouy]+/g, 'a')
      .replace(/a$/g, '')
      .length || 1;
  }
}

export const seoService = new SEOService();
