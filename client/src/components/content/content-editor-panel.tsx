import { useState, useEffect } from 'react';
import { useContentStore } from '@/lib/stores/content-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, FileText, Clock, Globe } from 'lucide-react';
import { WordPressPublishModal } from '../wordpress/wordpress-publish-modal';

export function ContentEditorPanel() {
  const { currentContent, updateContent, saveContent, contentList, isGenerating } = useContentStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  
  // If no current content but we have content in the list, use the most recent
  useEffect(() => {
    if (!currentContent && contentList.length > 0 && !isGenerating) {
      console.log('No current content, using most recent from list:', contentList[0]);
      useContentStore.getState().setCurrentContent(contentList[0]);
    }
  }, [currentContent, contentList, isGenerating]);

  // Auto-save functionality
  useEffect(() => {
    if (currentContent) {
      const timer = setTimeout(() => {
        saveContent(currentContent);
        setAutoSaveStatus('Auto-saved');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      }, 30000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [currentContent, saveContent]);

  const handleTitleChange = (title: string) => {
    updateContent({ title });
  };

  const handleContentChange = (content: string) => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    updateContent({ content, wordCount });
  };

  const handleSave = async () => {
    if (currentContent) {
      await saveContent(currentContent);
      setAutoSaveStatus('Saved');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  };

  // Debug: Log current content state
  console.log('ContentEditorPanel: currentContent =', currentContent);
  console.log('ContentEditorPanel: contentList.length =', contentList.length);
  console.log('ContentEditorPanel: isGenerating =', isGenerating);

  if (!currentContent) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">No Content Selected</h3>
              <p className="text-muted-foreground">
                Generate new content or select an existing article to start editing.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Content Editor</h1>
              <p className="text-sm text-muted-foreground">
                Create SEO-optimized content with AI assistance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Auto-save indicator */}
              {autoSaveStatus && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{autoSaveStatus}</span>
                </div>
              )}
              
              {/* WordPress Publish Button */}
              <Button onClick={() => setShowPublishModal(true)}>
                <Globe className="h-4 w-4 mr-2" />
                Publish to WordPress
              </Button>
            </div>
          </div>
        </header>

        {/* Editor Toolbar */}
        <div className="bg-card border-b border-border px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Word Count */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{currentContent.wordCount || 0} words</span>
              </div>

              {/* Content Type Badge */}
              <Badge variant="secondary">
                {currentContent.contentType}
              </Badge>

              {/* SEO Score */}
              {currentContent.seoScore && (
                <Badge 
                  variant={currentContent.seoScore >= 85 ? "default" : "secondary"}
                  className={currentContent.seoScore >= 85 ? "bg-green-100 text-green-800" : ""}
                >
                  SEO: {currentContent.seoScore}/100
                </Badge>
              )}
            </div>

            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            {/* Title Input */}
            <Input
              placeholder="Enter your article title..."
              value={currentContent.title || ''}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="text-3xl font-bold border-none text-foreground bg-transparent mb-6 p-0 h-auto text-3xl leading-tight focus-visible:ring-0"
            />

            {/* Content Editor */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <Textarea
                placeholder="Start writing your content here..."
                value={currentContent.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[600px] border-none resize-none text-base leading-relaxed focus-visible:ring-0"
              />
            </div>
          </div>
        </div>
      </div>

      <WordPressPublishModal
        open={showPublishModal}
        onOpenChange={setShowPublishModal}
        content={currentContent}
      />
    </>
  );
}
