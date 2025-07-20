import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Calendar, MoreHorizontal, Edit, Trash2, Share, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  status: 'draft' | 'published' | 'scheduled';
  seoScore: number;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  keyword: string;
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    title: 'Complete Guide to React Hooks',
    excerpt: 'Learn everything about React Hooks including useState, useEffect, and custom hooks with practical examples...',
    status: 'published',
    seoScore: 92,
    wordCount: 2500,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    category: 'Web Development',
    keyword: 'react hooks'
  },
  {
    id: '2',
    title: 'JavaScript ES2024 Features',
    excerpt: 'Discover the latest JavaScript features in ES2024 including new array methods, async improvements...',
    status: 'draft',
    seoScore: 89,
    wordCount: 1800,
    createdAt: '2024-01-12',
    updatedAt: '2024-01-14',
    category: 'JavaScript',
    keyword: 'javascript es2024'
  },
  {
    id: '3',
    title: 'CSS Grid Layout Mastery',
    excerpt: 'Master CSS Grid Layout with this comprehensive guide covering all properties and real-world examples...',
    status: 'scheduled',
    seoScore: 85,
    wordCount: 3200,
    createdAt: '2024-01-10',
    updatedAt: '2024-01-11',
    category: 'CSS',
    keyword: 'css grid'
  },
  {
    id: '4',
    title: 'TypeScript Best Practices',
    excerpt: 'Learn TypeScript best practices for writing maintainable and type-safe code in your projects...',
    status: 'draft',
    seoScore: 78,
    wordCount: 2100,
    createdAt: '2024-01-08',
    updatedAt: '2024-01-08',
    category: 'TypeScript',
    keyword: 'typescript best practices'
  }
];

export default function ContentLibrary() {
  const [content, setContent] = useState<ContentItem[]>(mockContent);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');

  const filteredContent = content
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.keyword.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'updatedAt') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'seoScore') return b.seoScore - a.seoScore;
      if (sortBy === 'wordCount') return b.wordCount - a.wordCount;
      return a.title.localeCompare(b.title);
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'scheduled': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Content Library</h1>
        <p className="text-muted-foreground">Manage and organize all your content in one place</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last Updated</SelectItem>
            <SelectItem value="seoScore">SEO Score</SelectItem>
            <SelectItem value="wordCount">Word Count</SelectItem>
            <SelectItem value="title">Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content Grid */}
      <div className="grid gap-4">
        {filteredContent.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                      <span className="capitalize">{item.status}</span>
                    </Badge>
                    <Badge className={getScoreColor(item.seoScore)}>
                      SEO: {item.seoScore}
                    </Badge>
                  </div>
                  
                  <CardTitle className="text-xl hover:text-primary cursor-pointer">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {item.excerpt}
                  </CardDescription>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{item.wordCount} words</span>
                  </span>
                  
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {item.updatedAt}</span>
                  </span>
                  
                  <Badge variant="outline">{item.category}</Badge>
                </div>
                
                <div className="text-xs">
                  Target: <span className="font-mono">{item.keyword}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredContent.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No content found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'Start creating your first piece of content.'}
              </p>
              <Button>
                Create New Content
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}