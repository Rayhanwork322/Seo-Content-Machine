import { useState } from 'react';
import { useContentStore } from '@/lib/stores/content-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, TrendingUp, Target, Calendar, 
  FileText, Globe, Eye, MousePointer 
} from 'lucide-react';

export function Analytics() {
  const { contentList } = useContentStore();
  const [timeRange, setTimeRange] = useState('30d');

  // Calculate analytics data
  const totalContent = contentList.length;
  const publishedContent = contentList.filter(c => c.status === 'published').length;
  const avgSeoScore = totalContent > 0 
    ? Math.round(contentList.reduce((acc, c) => acc + (c.seoScore || 0), 0) / totalContent)
    : 0;
  const avgWordCount = totalContent > 0
    ? Math.round(contentList.reduce((acc, c) => acc + (c.wordCount || 0), 0) / totalContent)
    : 0;

  // Content type distribution
  const contentTypeStats = contentList.reduce((acc, content) => {
    acc[content.contentType] = (acc[content.contentType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // SEO score distribution
  const seoScoreRanges = {
    excellent: contentList.filter(c => (c.seoScore || 0) >= 85).length,
    good: contentList.filter(c => (c.seoScore || 0) >= 70 && (c.seoScore || 0) < 85).length,
    needsWork: contentList.filter(c => (c.seoScore || 0) < 70).length,
  };

  // Recent activity
  const recentContent = contentList
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Track your content performance and optimization metrics
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalContent}</div>
              <p className="text-xs text-muted-foreground">
                Articles created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{publishedContent}</div>
              <p className="text-xs text-muted-foreground">
                {totalContent > 0 ? Math.round((publishedContent / totalContent) * 100) : 0}% of total content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{avgSeoScore}</div>
              <Progress value={avgSeoScore} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Word Count</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgWordCount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Words per article
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Content Analysis</TabsTrigger>
            <TabsTrigger value="seo">SEO Performance</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Content Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Type Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of your content by type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(contentTypeStats).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {type}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(count / totalContent) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Publishing Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Publishing Status</CardTitle>
                  <CardDescription>
                    Current status of your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { status: 'published', count: contentList.filter(c => c.status === 'published').length, color: 'bg-green-500' },
                    { status: 'draft', count: contentList.filter(c => c.status === 'draft').length, color: 'bg-yellow-500' },
                    { status: 'pending', count: contentList.filter(c => c.status === 'draft' && c.title?.includes('pending')).length, color: 'bg-blue-500' },
                  ].map(({ status, count, color }) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <span className="capitalize">{status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${color}`}
                            style={{ width: totalContent > 0 ? `${(count / totalContent) * 100}%` : '0%' }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* SEO Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Score Distribution</CardTitle>
                  <CardDescription>
                    How your content performs on SEO metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Excellent (85+)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: totalContent > 0 ? `${(seoScoreRanges.excellent / totalContent) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{seoScoreRanges.excellent}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Good (70-84)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: totalContent > 0 ? `${(seoScoreRanges.good / totalContent) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{seoScoreRanges.good}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Needs Work (&lt;70)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: totalContent > 0 ? `${(seoScoreRanges.needsWork / totalContent) * 100}%` : '0%' }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{seoScoreRanges.needsWork}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>
                    Your highest SEO scoring articles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contentList
                      .sort((a, b) => (b.seoScore || 0) - (a.seoScore || 0))
                      .slice(0, 5)
                      .map((content) => (
                        <div key={content.id} className="flex items-center justify-between p-2 rounded-lg border">
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-1">{content.title}</p>
                            <p className="text-xs text-muted-foreground">{content.keyword}</p>
                          </div>
                          <Badge variant={(content.seoScore || 0) >= 85 ? "default" : "secondary"}>
                            {content.seoScore || 0}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest content creation activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentContent.map((content) => (
                    <div key={content.id} className="flex items-center space-x-4 p-4 rounded-lg border">
                      <div className="flex-1">
                        <p className="font-medium">{content.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {content.contentType}
                          </Badge>
                          <Badge className={`text-xs ${
                            content.status === 'published' ? 'bg-green-100 text-green-800' :
                            content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {content.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {content.createdAt ? new Date(content.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{content.wordCount || 0} words</p>
                        <p className="text-xs text-muted-foreground">SEO: {content.seoScore || 0}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

