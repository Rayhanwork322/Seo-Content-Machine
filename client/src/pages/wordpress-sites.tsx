import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Globe, Settings, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WordPressSite {
  id: string;
  name: string;
  url: string;
  username: string;
  applicationPassword: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  articlesPublished: number;
  createdAt: string;
}

export function WordPressSites() {
  const [sites, setSites] = useState<WordPressSite[]>([
    {
      id: '1',
      name: 'My Tech Blog',
      url: 'https://techblog.example.com',
      username: 'admin',
      applicationPassword: '****',
      status: 'connected',
      lastSync: '2025-01-20T19:30:00Z',
      articlesPublished: 25,
      createdAt: '2025-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Travel Stories',
      url: 'https://travelstories.example.com',
      username: 'editor',
      applicationPassword: '****',
      status: 'disconnected',
      lastSync: '2025-01-18T14:20:00Z',
      articlesPublished: 12,
      createdAt: '2025-01-10T15:30:00Z'
    }
  ]);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    username: '',
    applicationPassword: ''
  });
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'disconnected': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-3 w-3" />;
      case 'disconnected': return <Clock className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      default: return <Globe className="h-3 w-3" />;
    }
  };

  const handleAddSite = async () => {
    if (!newSite.name || !newSite.url || !newSite.username || !newSite.applicationPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to add a WordPress site.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Test connection
      const testResult = await testWordPressConnection(newSite);
      
      const site: WordPressSite = {
        id: Date.now().toString(),
        ...newSite,
        status: testResult.success ? 'connected' : 'error',
        lastSync: new Date().toISOString(),
        articlesPublished: 0,
        createdAt: new Date().toISOString()
      };

      setSites(prev => [...prev, site]);
      setNewSite({ name: '', url: '', username: '', applicationPassword: '' });
      setShowAddDialog(false);

      toast({
        title: testResult.success ? "Site Added Successfully!" : "Site Added with Warnings",
        description: testResult.success 
          ? "WordPress site connection tested and ready to use."
          : "Site added but connection test failed. Please check credentials.",
        variant: testResult.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to WordPress site. Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  const testWordPressConnection = async (siteData: any) => {
    // Mock connection test
    return { success: Math.random() > 0.3 }; // 70% success rate for demo
  };

  const handleTestConnection = async (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;

    try {
      const result = await testWordPressConnection(site);
      
      setSites(prev => prev.map(s => 
        s.id === siteId 
          ? { ...s, status: result.success ? 'connected' : 'error', lastSync: new Date().toISOString() }
          : s
      ));

      toast({
        title: result.success ? "Connection Successful" : "Connection Failed",
        description: result.success 
          ? "WordPress site is connected and ready."
          : "Unable to connect. Please check your credentials.",
        variant: result.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Unable to test connection to WordPress site.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveSite = (siteId: string) => {
    setSites(prev => prev.filter(s => s.id !== siteId));
    toast({
      title: "Site Removed",
      description: "WordPress site has been removed from your list.",
    });
  };

  const totalArticles = sites.reduce((acc, site) => acc + site.articlesPublished, 0);
  const connectedSites = sites.filter(s => s.status === 'connected').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">WordPress Sites</h1>
            <p className="text-sm text-muted-foreground">
              Manage your WordPress site connections and publishing
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add WordPress Site
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add WordPress Site</DialogTitle>
                <DialogDescription>
                  Connect a new WordPress site to publish your content directly.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Site Name</Label>
                  <Input
                    id="name"
                    placeholder="My WordPress Blog"
                    value={newSite.name}
                    onChange={(e) => setNewSite(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Site URL</Label>
                  <Input
                    id="url"
                    placeholder="https://yourblog.com"
                    value={newSite.url}
                    onChange={(e) => setNewSite(prev => ({ ...prev, url: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={newSite.username}
                    onChange={(e) => setNewSite(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Application Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx"
                    value={newSite.applicationPassword}
                    onChange={(e) => setNewSite(prev => ({ ...prev, applicationPassword: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Create an application password in WordPress admin under Users → Profile.
                  </p>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSite}>
                  Add Site
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {/* Site Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sites.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Connected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{connectedSites}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Articles Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalArticles}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {sites.length > 0 ? Math.round((connectedSites / sites.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sites List */}
        {sites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No WordPress Sites</h3>
              <p className="text-muted-foreground mb-4">
                Add your first WordPress site to start publishing content directly.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                Add Your First Site
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                      <CardDescription className="mt-1 break-all">
                        {site.url}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3">
                    <Badge className={getStatusColor(site.status)}>
                      {getStatusIcon(site.status)}
                      {site.status}
                    </Badge>
                    <Badge variant="outline">
                      {site.articlesPublished} articles
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-mono">{site.username}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span>{new Date(site.lastSync).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Added:</span>
                      <span>{new Date(site.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleTestConnection(site.id)}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRemoveSite(site.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}