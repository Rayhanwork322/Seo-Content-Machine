import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image, Loader2, Download, Wand2 } from 'lucide-react';
import { imageService } from '@/lib/services/image-service';
import { useToast } from '@/hooks/use-toast';

interface ImageGeneratorProps {
  content?: string;
  keyword?: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export function ImageGenerator({ content, keyword, onImageGenerated }: ImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const { toast } = useToast();

  const handleGenerateImage = async (useCustomPrompt: boolean = false) => {
    setIsGenerating(true);
    try {
      let prompt = '';
      
      if (useCustomPrompt && customPrompt.trim()) {
        prompt = customPrompt.trim();
      } else if (content && keyword) {
        prompt = imageService.generateImagePrompt(content, keyword);
      } else if (keyword) {
        prompt = `Professional high-quality image related to "${keyword}". Modern, clean style, suitable for blog article header.`;
      } else {
        toast({
          title: "Missing Information",
          description: "Please provide content/keyword or enter a custom prompt.",
          variant: "destructive",
        });
        return;
      }

      console.log('Generating image with prompt:', prompt);
      
      const imageUrl = await imageService.generateImage(prompt, {
        width: 1024,
        height: 768,
        steps: 4,
        guidance_scale: 1
      });
      
      setGeneratedImages(prev => [imageUrl, ...prev.slice(0, 4)]); // Keep last 5 images
      onImageGenerated?.(imageUrl);
      
      toast({
        title: "Image Generated!",
        description: "Your AI-generated image is ready to use.",
      });
      
    } catch (error) {
      console.error('Image generation failed:', error);
      toast({
        title: "Image Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          AI Image Generator
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate images based on your content or custom prompts
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Custom Prompt Input */}
        <div className="space-y-2">
          <Label htmlFor="imagePrompt">Custom Image Prompt (Optional)</Label>
          <Input
            id="imagePrompt"
            placeholder="e.g., Modern office setup with laptop and coffee..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to auto-generate from content
          </p>
        </div>

        {/* Generate Buttons */}
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => handleGenerateImage(false)}
            disabled={isGenerating || (!content && !keyword)}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate from Content
              </>
            )}
          </Button>
          
          {customPrompt.trim() && (
            <Button 
              onClick={() => handleGenerateImage(true)}
              disabled={isGenerating}
              variant="outline"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  Generate from Custom Prompt
                </>
              )}
            </Button>
          )}
        </div>

        {/* Generated Images */}
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Generated Images</Label>
              <Badge variant="secondary">
                {generatedImages.length} image{generatedImages.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img 
                    src={imageUrl} 
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md border"
                    onError={(e) => {
                      console.error('Failed to load image:', imageUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadImage(imageUrl, index)}
                      className="h-7 w-7 p-0"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onImageGenerated?.(imageUrl)}
                      className="h-7 w-7 p-0"
                    >
                      <Image className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-md">
          <p><strong>Powered by Puter.js</strong> - AI image generation using Flux model</p>
          <p>Images are generated at 1024x768 resolution and optimized for web use.</p>
        </div>
      </CardContent>
    </Card>
  );
}