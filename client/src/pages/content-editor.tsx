import { ContentBriefGenerator } from '@/components/content/content-brief-generator';
import { ContentEditorPanel } from '@/components/content/content-editor-panel';
import { SEOAnalysisPanel } from '@/components/content/seo-analysis-panel';
import { GenerationProgress } from '@/components/content/generation-progress';
import { ImageGenerator } from '@/components/content/image-generator';

export function ContentEditor() {
  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Content Generation Panel */}
      <ContentBriefGenerator />
      
      {/* Generation Progress - shows when generating */}
      <GenerationProgress />
      
      {/* Main Editor Area */}
      <ContentEditorPanel />
      
      {/* SEO Analysis Panel */}
      <SEOAnalysisPanel />
    </div>
  );
}
