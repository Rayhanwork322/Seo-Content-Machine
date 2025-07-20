import { create } from 'zustand';
import { ContentData, ContentBrief, GenerationProgress } from '../types';
import { puterService } from '../services/puter-service';
import { aiService } from '../services/ai-service';
import { seoService } from '../services/seo-service';

interface ContentState {
  currentContent: ContentData | null;
  contentList: ContentData[];
  isGenerating: boolean;
  generationProgress: GenerationProgress;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  generateContent: (brief: ContentBrief) => Promise<void>;
  saveContent: (content: ContentData) => Promise<void>;
  loadContent: (contentId: string) => Promise<void>;
  loadContentList: () => Promise<void>;
  updateContent: (updates: Partial<ContentData>) => void;
  deleteContent: (contentId: string) => Promise<void>;
  setCurrentContent: (content: ContentData | null) => void;
}

export const useContentStore = create<ContentState>((set, get) => ({
  currentContent: null,
  contentList: [],
  isGenerating: false,
  generationProgress: {
    isGenerating: false,
    percentage: 0,
    status: '',
  },
  isLoading: false,
  error: null,

  generateContent: async (brief: ContentBrief) => {
    try {
      set({
        isGenerating: true,
        generationProgress: {
          isGenerating: true,
          percentage: 0,
          status: 'Starting content generation...',
        },
        error: null,
      });

      const content = await aiService.generateContent(brief);
      
      // Analyze SEO
      const seoAnalysis = await seoService.analyzeSEO(content);
      
      const newContent: ContentData = {
        ...content,
        seoScore: seoAnalysis.overallScore,
        status: 'draft' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save to Puter.fs
      const contentId = `content_${Date.now()}`;
      await puterService.writeFile(
        `content/${contentId}.json`,
        JSON.stringify(newContent)
      );

      // Update content list with new content
      const { contentList } = get();
      const updatedContent = { ...newContent, id: contentId };
      
      set({
        currentContent: updatedContent,
        contentList: [updatedContent, ...contentList],
        isGenerating: false,
        generationProgress: {
          isGenerating: false,
          percentage: 100,
          status: 'Content generation completed',
        },
      });

    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Content generation failed',
        isGenerating: false,
        generationProgress: {
          isGenerating: false,
          percentage: 0,
          status: '',
        },
      });
    }
  },

  saveContent: async (content: ContentData) => {
    try {
      set({ isLoading: true, error: null });
      
      const contentId = content.id || `content_${Date.now()}`;
      const updatedContent = {
        ...content,
        id: contentId,
        updatedAt: new Date(),
      };

      await puterService.writeFile(
        `content/${contentId}.json`,
        JSON.stringify(updatedContent)
      );

      set({
        currentContent: updatedContent,
        isLoading: false,
      });

      // Update content list
      get().loadContentList();
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Save failed',
        isLoading: false,
      });
    }
  },

  loadContent: async (contentId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      const contentData = await puterService.readFile(`content/${contentId}.json`);
      const content = JSON.parse(contentData);
      
      set({
        currentContent: content,
        isLoading: false,
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load content',
        isLoading: false,
      });
    }
  },

  loadContentList: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const files = await puterService.listFiles('content/');
      const contentList: ContentData[] = [];
      
      for (const file of files) {
        if (file.name.endsWith('.json')) {
          try {
            const contentData = await puterService.readFile(`content/${file.name}`);
            const content = JSON.parse(contentData);
            contentList.push(content);
          } catch (error) {
            console.warn(`Failed to load content file: ${file.name}`);
          }
        }
      }
      
      set({
        contentList,
        isLoading: false,
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load content list',
        isLoading: false,
      });
    }
  },

  updateContent: (updates: Partial<ContentData>) => {
    const { currentContent } = get();
    if (!currentContent) return;
    
    const updatedContent = { ...currentContent, ...updates, updatedAt: new Date() };
    set({ currentContent: updatedContent });
    
    // Auto-save after 30 seconds
    setTimeout(() => {
      get().saveContent(updatedContent);
    }, 30000);
  },

  deleteContent: async (contentId: string) => {
    try {
      await puterService.deleteFile(`content/${contentId}.json`);
      
      const { contentList, currentContent } = get();
      const updatedList = contentList.filter(c => c.id !== contentId);
      
      set({
        contentList: updatedList,
        currentContent: currentContent?.id === contentId ? null : currentContent,
      });
      
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete content',
      });
    }
  },

  setCurrentContent: (content: ContentData | null) => {
    set({ currentContent: content });
  },
}));
