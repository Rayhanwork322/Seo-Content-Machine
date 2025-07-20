import { useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/auth-store';
import { useSettingsStore } from '@/lib/stores/settings-store';
import { Sidebar } from './sidebar';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading, signIn, checkAuth } = useAuthStore();
  const { loadPreferences } = useSettingsStore();

  useEffect(() => {
    // Delay initialization to avoid startup errors
    const initializeApp = async () => {
      try {
        await loadPreferences();
        await checkAuth();
      } catch (error) {
        console.warn('App initialization failed, using fallback mode:', error);
      }
    };

    // Use a timeout to ensure DOM is ready
    setTimeout(initializeApp, 100);
  }, [checkAuth, loadPreferences]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full mx-4 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">SEO Content Machine</h1>
            <p className="text-muted-foreground">
              AI-powered content creation and WordPress publishing platform
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={signIn}
              className="w-full"
              size="lg"
            >
              Sign In with Puter
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Secure authentication powered by Puter.js
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
