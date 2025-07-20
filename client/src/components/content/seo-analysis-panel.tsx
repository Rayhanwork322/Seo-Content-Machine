import { useEffect, useState } from 'react';
import { useContentStore } from '@/lib/stores/content-store';
import { seoService, SEOAnalysis } from '@/lib/services/seo-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Target,
  Eye,
  Hash,
  FileText,
  Link
} from 'lucide-react';

export function SEOAnalysisPanel() {
  const { currentContent, updateContent } = useContentStore();
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze SEO when content changes
  useEffect(() => {
    if (currentContent) {
      const analyzeContent = async () => {
        setIsAnalyzing(true);
        try {
          const analysis = await seoService.analyzeSEO(currentContent);
          setSeoAnalysis(analysis);
        } catch (error) {
          console.error('SEO analysis failed:', error);
        } finally {
          setIsAnalyzing(false);
        }
      };

      const timer = setTimeout(analyzeContent, 500); // Debounce analysis
      return () => clearTimeout(timer);
    }
  }, [currentContent]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'warning': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      default: return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    }
  };

  if (!currentContent) {
    return (
      <div className="w-80 bg-card border-l border-border flex items-center justify-center">
        <div className="text-center space-y-2">
          <Target className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            No content to analyze
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col overflow-hidden">
      {/* SEO Score Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-foreground">SEO Analysis</h3>
          {isAnalyzing ? (
            <div className="w-12 h-12 rounded-full border-2 border-muted flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
            </div>
          ) : seoAnalysis ? (
            <div className="w-12 h-12 rounded-full border-4 border-green-500 flex items-center justify-center relative">
              <span className={`text-lg font-bold ${getScoreColor(seoAnalysis.overallScore)}`}>
                {seoAnalysis.overallScore}
              </span>
            </div>
          ) : null}
        </div>
        
        {seoAnalysis && (
          <>
            <Progress value={seoAnalysis.overallScore} className="mb-2" />
            <p className="text-sm text-muted-foreground">
              {seoAnalysis.overallScore >= 85 
                ? 'Excellent! Your content meets SEO best practices.'
                : seoAnalysis.overallScore >= 70
                ? 'Good SEO optimization with room for improvement.'
                : 'Needs optimization to improve search visibility.'}
            </p>
          </>
        )}
      </div>

      {/* SEO Metrics */}
      <div className="flex-1 overflow-y-auto">
        {seoAnalysis && (
          <div className="p-6 space-y-6">
            {/* Keyword Optimization */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Keyword Optimization</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Keyword Density</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {seoAnalysis.metrics.keywordDensity.toFixed(1)}%
                    </span>
                    {getScoreIcon(seoAnalysis.keywordScore)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Title Optimization</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {seoAnalysis.titleScore}/100
                    </span>
                    {getScoreIcon(seoAnalysis.titleScore)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meta Description</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {seoAnalysis.metaScore}/100
                    </span>
                    {getScoreIcon(seoAnalysis.metaScore)}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Structure */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground">Content Structure</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Heading Structure</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {seoAnalysis.metrics.headingStructure}
                    </span>
                    {getScoreIcon(seoAnalysis.headingScore)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Readability Score</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {seoAnalysis.readabilityScore}/100
                    </span>
                    {getScoreIcon(seoAnalysis.readabilityScore)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Internal Links</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {seoAnalysis.metrics.internalLinks} found
                    </span>
                    {getScoreIcon(seoAnalysis.metrics.internalLinks > 0 ? 100 : 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Recommendations */}
            {seoAnalysis.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Recommendations</h4>
                
                <div className="space-y-2">
                  {seoAnalysis.suggestions.map((suggestion, index) => (
                    <Alert key={index} className={getSuggestionColor(suggestion.type)}>
                      <div className="flex">
                        {getSuggestionIcon(suggestion.type)}
                        <div className="ml-2">
                          <AlertTitle className="text-sm font-medium">
                            {suggestion.title}
                          </AlertTitle>
                          <AlertDescription className="text-xs mt-1">
                            {suggestion.description}
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            {/* Meta Tags Editor */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground">Meta Tags</h4>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle" className="text-xs font-medium text-muted-foreground">
                    SEO Title ({currentContent.metaTitle?.length || 0}/60 chars)
                  </Label>
                  <Input
                    id="metaTitle"
                    value={currentContent.metaTitle || ''}
                    onChange={(e) => updateContent({ metaTitle: e.target.value })}
                    placeholder="Enter SEO title..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription" className="text-xs font-medium text-muted-foreground">
                    Meta Description ({currentContent.metaDescription?.length || 0}/160 chars)
                  </Label>
                  <Textarea
                    id="metaDescription"
                    value={currentContent.metaDescription || ''}
                    onChange={(e) => updateContent({ metaDescription: e.target.value })}
                    placeholder="Enter meta description..."
                    rows={3}
                    className="mt-1 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
