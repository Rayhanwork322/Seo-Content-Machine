import { useState } from 'react';
import { useContentStore } from '@/lib/stores/content-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Loader2 } from 'lucide-react';
import { ContentBrief } from '@/lib/types';

export function ContentBriefGenerator() {
  const { generateContent, isGenerating } = useContentStore();
  const [brief, setBrief] = useState<ContentBrief>({
    keyword: '',
    contentType: 'article',
    targetLength: 2000,
    tone: 'professional',
    audience: 'general',
    aiModel: 'claude',
  });

  const handleGenerateContent = async () => {
    if (!brief.keyword.trim()) {
      return;
    }

    try {
      await generateContent(brief);
    } catch (error) {
      console.error('Content generation failed:', error);
    }
  };

  const updateBrief = (field: keyof ContentBrief, value: any) => {
    setBrief(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-medium text-foreground mb-4">Content Brief</h3>
        
        <div className="space-y-4">
          {/* Target Keyword */}
          <div className="space-y-2">
            <Label htmlFor="keyword">Target Keyword</Label>
            <Input
              id="keyword"
              placeholder="Enter your target keyword..."
              value={brief.keyword}
              onChange={(e) => updateBrief('keyword', e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="contentType">Content Type</Label>
            <Select 
              value={brief.contentType} 
              onValueChange={(value) => updateBrief('contentType', value)}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="guide">How-to Guide</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="listicle">Listicle</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Target Length */}
          <div className="space-y-2">
            <Label htmlFor="targetLength">Target Length</Label>
            <Select 
              value={brief.targetLength.toString()} 
              onValueChange={(value) => updateBrief('targetLength', parseInt(value))}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1500">1,500 words</SelectItem>
                <SelectItem value="2000">2,000 words</SelectItem>
                <SelectItem value="2500">2,500 words</SelectItem>
                <SelectItem value="3000">3,000 words</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Model */}
          <div className="space-y-2">
            <Label htmlFor="aiModel">AI Model</Label>
            <Select 
              value={brief.aiModel} 
              onValueChange={(value) => updateBrief('aiModel', value)}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude">Claude (Recommended)</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateContent}
            disabled={isGenerating || !brief.keyword.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
