import { useContentStore } from '@/lib/stores/content-store';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

export function GenerationProgress() {
  const { generationProgress } = useContentStore();

  if (!generationProgress.isGenerating) {
    return null;
  }

  return (
    <Card className="m-6">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Generating Content</span>
          <span className="text-sm text-muted-foreground">
            {generationProgress.percentage}%
          </span>
        </div>
        
        <Progress value={generationProgress.percentage} className="w-full" />
        
        <div className="text-xs text-muted-foreground">
          {generationProgress.status}
        </div>
      </CardContent>
    </Card>
  );
}
