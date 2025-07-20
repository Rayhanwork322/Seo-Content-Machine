import { Link, useLocation } from 'wouter';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bot, 
  Edit3, 
  BarChart3, 
  Globe, 
  TrendingUp, 
  FolderOpen, 
  Plus, 
  Moon, 
  Sun 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [location] = useLocation();
  const { user, signOut } = useAuthStore();
  const { preferences, updatePreferences } = useSettingsStore();

  const toggleTheme = () => {
    const newTheme = preferences.theme === 'light' ? 'dark' : 'light';
    updatePreferences({ theme: newTheme });
  };

  const navigation = [
    {
      name: 'Content Editor',
      href: '/editor',
      icon: Edit3,
      current: location === '/editor' || location === '/',
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: BarChart3,
      current: location === '/dashboard',
    },
    {
      name: 'WordPress Sites',
      href: '/wordpress',
      icon: Globe,
      current: location === '/wordpress',
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: TrendingUp,
      current: location === '/analytics',
    },
    {
      name: 'Content Library',
      href: '/library',
      icon: FolderOpen,
      current: location === '/library',
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">SEO Machine</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border space-y-3">
        <Link href="/editor">
          <Button className="w-full" variant="default">
            <Plus className="h-4 w-4 mr-2" />
            New Content
          </Button>
        </Link>

        {/* User Profile */}
        <div className="flex items-center space-x-3 pt-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-muted text-muted-foreground">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-muted-foreground">Content Creator</p>
          </div>
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-1 h-8 w-8"
          >
            {preferences.theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          size="sm"
          onClick={signOut}
          className="w-full"
        >
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
