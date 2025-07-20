import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useContentStore } from '@/lib/stores/content-store';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Link } from 'wouter';
import { 
  FileText, 
  TrendingUp, 
  Globe, 
  Plus,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import { useEffect } from 'react';

export function Dashboard() {
  const { user } = useAuthStore();
  const { contentList, loadContentList } = useContentStore();

  useEffect(() => {
    loadContentList();
  }, [loadContentList]);

  const recentContent = contentList.slice(0, 5);
  const totalContent = contentList.length;
  const publishedContent = contentList.filter(c => c.status === 'published').length;
  const averageSeoScore = contentList.length > 0 
    ? Math.round(contentList.reduce((sum, c) => sum + (c.seoScore || 0), 0) / contentList.length)
    : 0;

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your content creation and performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContent}</div>
              <p className="text-xs text-muted-foreground">
                All-time content pieces
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{publishedContent}</div>
              <p className="text-xs text-muted-foreground">
                Live on WordPress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageSeoScore}/100</div>
              <p className="text-xs text-muted-foreground">
                Optimization quality
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contentList.filter(c => {
                  const createdAt = new Date(c.createdAt || '');
                  const now = new Date();
                  return createdAt.getMonth() === now.getMonth() && 
                         createdAt.getFullYear() === now.getFullYear();
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Content created
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Content</CardTitle>
              <CardDescription>
                Your latest content pieces and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentContent.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No content yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start creating your first piece of content
                  </p>
                  <Link href="/editor">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Content
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">
                          {content.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {content.wordCount} words
                          </span>
                          {content.seoScore && (
                            <span className="text-sm text-muted-foreground">
                              SEO: {content.seoScore}/100
                            </span>
                          )}
                          <span className="text-sm text-muted-foreground capitalize">
                            {content.status}
                          </span>
                        </div>
                      </div>
                      <Link href="/editor">
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                    </div>
                  ))}
                  
                  <Link href="/library">
                    <Button variant="outline" className="w-full">
                      View All Content
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts to boost your productivity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link href="/editor">
                  <Button className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Content
                  </Button>
                </Link>
                
                <Link href="/wordpress">
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Manage WordPress Sites
                  </Button>
                </Link>
                
                <Link href="/analytics">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
                
                <Link href="/library">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Content Library
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
