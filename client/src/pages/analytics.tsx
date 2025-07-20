import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Eye, Users, Clock, Target } from 'lucide-react';

const analyticsData = {
  overview: {
    totalContent: 42,
    avgSeoScore: 87,
    totalViews: 12543,
    publishedThisMonth: 8
  },
  recentContent: [
    {
      id: '1',
      title: 'Complete Guide to React Hooks',
      seoScore: 92,
      views: 1234,
      publishDate: '2024-01-15',
      status: 'published'
    },
    {
      id: '2', 
      title: 'JavaScript ES2024 Features',
      seoScore: 89,
      views: 856,
      publishDate: '2024-01-12',
      status: 'published'
    },
    {
      id: '3',
      title: 'CSS Grid Layout Mastery',
      seoScore: 85,
      views: 642,
      publishDate: '2024-01-10',
      status: 'published'
    }
  ],
  seoTrends: [
    { month: 'Oct', score: 82 },
    { month: 'Nov', score: 85 },
    { month: 'Dec', score: 87 },
    { month: 'Jan', score: 89 }
  ]
};

export default function Analytics() {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Track your content performance and SEO metrics</p>
        </div>
        
        <Select defaultValue="30days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalContent}</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.overview.publishedThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg SEO Score</CardTitle>
            {getTrendIcon(analyticsData.overview.avgSeoScore, 85)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.avgSeoScore}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published This Month</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.publishedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              3 scheduled for next week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content Performance</CardTitle>
          <CardDescription>Your latest published articles and their metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recentContent.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{content.title}</h3>
                  <p className="text-sm text-muted-foreground">Published on {content.publishDate}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getScoreColor(content.seoScore)}>
                    SEO: {content.seoScore}
                  </Badge>
                  
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{content.views}</span>
                  </div>
                  
                  <Badge variant="secondary" className="capitalize">
                    {content.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SEO Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Score Trends</CardTitle>
          <CardDescription>Average SEO scores over the last 4 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4 h-32">
            {analyticsData.seoTrends.map((trend, index) => (
              <div key={trend.month} className="flex flex-col items-center flex-1">
                <div 
                  className="bg-primary rounded-t w-full flex items-end justify-center text-white text-xs font-medium"
                  style={{ height: `${(trend.score / 100) * 120}px` }}
                >
                  {trend.score}
                </div>
                <span className="text-sm text-muted-foreground mt-2">{trend.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}