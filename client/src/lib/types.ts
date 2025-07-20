export interface ContentBrief {
  keyword: string;
  contentType: 'article' | 'guide' | 'review' | 'listicle' | 'tutorial';
  targetLength: number;
  tone: string;
  audience: string;
  aiModel: string;
  customPrompt?: string;
  affiliateLinks?: string;
}

export interface GenerationProgress {
  isGenerating: boolean;
  percentage: number;
  status: string;
  currentSection?: string;
}

export interface SEOMetrics {
  keywordDensity: number;
  titleOptimization: number;
  metaDescription: number;
  headingStructure: string;
  readabilityScore: number;
  internalLinks: number;
}

export interface SEORecommendation {
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WordPressPublishOptions {
  siteId: string;
  status: 'draft' | 'publish' | 'future';
  category?: string;
  tags?: string;
  scheduledDate?: Date;
}

export interface ContentData {
  id?: string;
  title: string;
  content: string;
  keyword?: string;
  contentType: string;
  seoScore?: number;
  metaTitle?: string;
  metaDescription?: string;
  wordCount?: number;
  status: 'draft' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
}
