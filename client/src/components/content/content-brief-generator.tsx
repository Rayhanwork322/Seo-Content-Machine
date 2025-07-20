import { useState } from 'react';
import { useLocation } from 'wouter';
import { useContentStore } from '@/lib/stores/content-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { ContentBrief } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function ContentBriefGenerator() {
  const { generateContent, isGenerating } = useContentStore();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [brief, setBrief] = useState<ContentBrief>({
    keyword: '',
    contentType: 'article',
    targetLength: 2000,
    tone: 'professional',
    audience: 'general',
    aiModel: 'claude-3-5-sonnet',
  });

  const handleGenerateContent = async () => {
    if (!brief.keyword.trim()) {
      toast({
        title: "Keyword Required",
        description: "Please enter a target keyword to generate content.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate content with new affiliate links and custom prompt features
      await generateContent(brief);
      
      // Show success message
      toast({
        title: "Content Generated Successfully!",
        description: "Your content is ready for editing and optimization.",
      });
      
      // Navigate to editor to show the generated content
      setLocation('/editor');
      
    } catch (error) {
      console.error('Content generation failed:', error);
      toast({
        title: "Content Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
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

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label htmlFor="customPrompt">Custom Prompt</Label>
            <Textarea
              id="customPrompt"
              placeholder="Add specific instructions for your content..."
              value={brief.customPrompt || ''}
              onChange={(e) => updateBrief('customPrompt', e.target.value)}
              disabled={isGenerating}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Optional: Add specific requirements or tone
            </p>
          </div>

          {/* Affiliate Links */}
          <div className="space-y-2">
            <Label htmlFor="affiliateLinks">Affiliate/Internal Links</Label>
            <Textarea
              id="affiliateLinks"
              placeholder="https://example.com/product1&#10;https://affiliate.com/product2"
              value={brief.affiliateLinks || ''}
              onChange={(e) => updateBrief('affiliateLinks', e.target.value)}
              disabled={isGenerating}
              className="min-h-[80px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Links will be inserted every 2-3 paragraphs (one per line)
            </p>
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
              <SelectContent className="max-h-60 overflow-y-auto">
                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet (Recommended)</SelectItem>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="o1">O1</SelectItem>
                <SelectItem value="o1-mini">O1 Mini</SelectItem>
                <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
                <SelectItem value="claude-opus-4">Claude Opus 4</SelectItem>
                <SelectItem value="claude-3-7-sonnet">Claude 3.7 Sonnet</SelectItem>
                <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                <SelectItem value="deepseek-reasoner">DeepSeek Reasoner</SelectItem>
                <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                <SelectItem value="gpt-4.1-nano">GPT-4.1 Nano</SelectItem>
                <SelectItem value="mistral-large-latest">Mistral Large</SelectItem>
                <SelectItem value="meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo">Llama 3.1 70B</SelectItem>
                <SelectItem value="grok-beta">Grok Beta</SelectItem>
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
