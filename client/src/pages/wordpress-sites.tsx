import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, Settings, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface WordPressSite {
  id: string;
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

export default function WordPressSites() {
  const [sites, setSites] = useState<WordPressSite[]>([
    {
      id: '1',
      name: 'My Blog',
      url: 'https://myblog.com',
      status: 'connected',
      lastSync: '2 hours ago'
    },
    {
      id: '2',
      name: 'Business Site',
      url: 'https://business.com',
      status: 'disconnected',
      lastSync: '1 day ago'
    }
  ]);

  const [newSite, setNewSite] = useState({
    name: '',
    url: '',
    username: '',
    password: ''
  });

  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddSite = () => {
    if (newSite.name && newSite.url) {
      const site: WordPressSite = {
        id: Date.now().toString(),
        name: newSite.name,
        url: newSite.url,
        status: 'connected',
        lastSync: 'Just now'
      };
      setSites([...sites, site]);
      setNewSite({ name: '', url: '', username: '', password: '' });
      setIsAddingNew(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WordPress Sites</h1>
          <p className="text-muted-foreground">Manage your WordPress site connections</p>
        </div>
        
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect WordPress Site</DialogTitle>
              <DialogDescription>
                Add a new WordPress site to publish content directly from the editor.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  placeholder="My WordPress Site"
                  value={newSite.name}
                  onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input
                  id="siteUrl"
                  placeholder="https://yoursite.com"
                  value={newSite.url}
                  onChange={(e) => setNewSite({...newSite, url: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="admin"
                  value={newSite.username}
                  onChange={(e) => setNewSite({...newSite, username: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="password">Application Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="xxxx xxxx xxxx xxxx"
                  value={newSite.password}
                  onChange={(e) => setNewSite({...newSite, password: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSite}>
                  Connect Site
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sites.map((site) => (
          <Card key={site.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <CardDescription>{site.url}</CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(site.status)}`} />
                    <span className="capitalize">{site.status}</span>
                  </Badge>
                  
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Last sync: {site.lastSync}</span>
                <Button variant="outline" size="sm">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sites.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No WordPress sites connected</h3>
              <p className="text-muted-foreground text-center mb-4">
                Connect your WordPress sites to start publishing content directly from the editor.
              </p>
              <Button onClick={() => setIsAddingNew(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Site
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}