import { useState, useEffect } from 'react';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { wordpressService } from '@/lib/services/wordpress-service';
import { ContentData, WordPressPublishOptions } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Globe, Loader2 } from 'lucide-react';

interface WordPressPublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentData;
}

export function WordPressPublishModal({ open, onOpenChange, content }: WordPressPublishModalProps) {
  const { wpConnections, loadWPConnections } = useSettingsStore();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishOptions, setPublishOptions] = useState<WordPressPublishOptions>({
    siteId: '',
    status: 'draft',
    category: '',
    tags: '',
  });

  useEffect(() => {
    if (open) {
      loadWPConnections();
    }
  }, [open, loadWPConnections]);

  const handlePublish = async () => {
    if (!publishOptions.siteId) {
      toast({
        title: 'No Site Selected',
        description: 'Please select a WordPress site to publish to.',
        variant: 'destructive',
      });
      return;
    }

    setIsPublishing(true);

    try {
      const connection = wpConnections.find(conn => conn.id.toString() === publishOptions.siteId);
      if (!connection) {
        throw new Error('WordPress connection not found');
      }

      const result = await wordpressService.publishContent(content, connection, publishOptions);
      
      if (result.success) {
        toast({
          title: 'Published Successfully!',
          description: `Content published to ${connection.name}`,
        });
        onOpenChange(false);
      } else {
        throw new Error(result.error || 'Publishing failed');
      }
    } catch (error) {
      toast({
        title: 'Publishing Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const updateOptions = (field: keyof WordPressPublishOptions, value: string) => {
    setPublishOptions(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Publish to WordPress</DialogTitle>
          <DialogDescription>
            Select a WordPress site and configure publishing options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* WordPress Site Selection */}
          <div className="space-y-2">
            <Label htmlFor="wpSite">WordPress Site</Label>
            <Select 
              value={publishOptions.siteId} 
              onValueChange={(value) => updateOptions('siteId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a site..." />
              </SelectTrigger>
              <SelectContent>
                {wpConnections.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No WordPress sites connected. Add one in Settings.
                  </div>
                ) : (
                  wpConnections.map((connection) => (
                    <SelectItem key={connection.id} value={connection.id.toString()}>
                      {connection.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Publishing Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postStatus">Status</Label>
              <Select 
                value={publishOptions.status} 
                onValueChange={(value) => updateOptions('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="publish">Publish</SelectItem>
                  <SelectItem value="future">Schedule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Category name..."
                value={publishOptions.category || ''}
                onChange={(e) => updateOptions('category', e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="SEO, rankings, optimization..."
              value={publishOptions.tags || ''}
              onChange={(e) => updateOptions('tags', e.target.value)}
            />
          </div>

          {/* Content Preview */}
          <div className="space-y-2">
            <Label>Content Preview</Label>
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium text-sm">{content.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {content.wordCount} words • {content.contentType}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isPublishing || !publishOptions.siteId}
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Globe className="h-4 w-4 mr-2" />
                Publish Article
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
