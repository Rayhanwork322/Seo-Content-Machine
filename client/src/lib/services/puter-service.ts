declare global {
  interface Window {
    puter: any;
  }
}

class PuterService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Initialize Puter.js SDK
      if (typeof window !== 'undefined' && !window.puter) {
        // Dynamically load Puter.js SDK
        const script = document.createElement('script');
        script.src = 'https://js.puter.com/v2/';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          setTimeout(reject, 10000); // 10 second timeout
        });
      }

      this.initialized = true;
    } catch (error) {
      console.warn('Puter.js failed to load, using fallback mode:', error);
      // Initialize with mock Puter object for development
      if (!window.puter) {
        window.puter = this.createMockPuter();
      }
      this.initialized = true;
    }
  }

  private createMockPuter() {
    return {
      auth: {
        signIn: () => Promise.resolve({ id: 'mock-user', name: 'Mock User' }),
        signOut: () => Promise.resolve(),
        getUser: () => Promise.resolve({ id: 'mock-user', name: 'Mock User' }),
        isSignedIn: () => Promise.resolve(false)
      },
      fs: {
        write: (path: string, content: string) => Promise.resolve(),
        read: (path: string) => Promise.resolve('{}'),
        mkdir: (path: string) => Promise.resolve(),
        exists: (path: string) => Promise.resolve(false)
      },
      ai: {
        chat: (messages: any[], options: any) => Promise.resolve({
          text: 'This is a mock response from the AI service.',
          usage: { total_tokens: 100 }
        })
      },
      kv: {
        set: (key: string, value: any) => Promise.resolve(),
        get: (key: string) => Promise.resolve(null),
        del: (key: string) => Promise.resolve()
      }
    };
  }

  async signIn(): Promise<any> {
    await this.initialize();
    return window.puter.auth.signIn();
  }

  async signOut(): Promise<void> {
    await this.initialize();
    return window.puter.auth.signOut();
  }

  async getUser(): Promise<any> {
    await this.initialize();
    return window.puter.auth.getUser();
  }

  async isSignedIn(): Promise<boolean> {
    await this.initialize();
    return window.puter.auth.isSignedIn();
  }

  async writeFile(path: string, content: string): Promise<void> {
    await this.initialize();
    return window.puter.fs.write(path, content);
  }

  async readFile(path: string): Promise<string> {
    await this.initialize();
    const file = await window.puter.fs.read(path);
    return file.text();
  }

  async listFiles(path: string): Promise<any[]> {
    await this.initialize();
    return window.puter.fs.list(path);
  }

  async deleteFile(path: string): Promise<void> {
    await this.initialize();
    return window.puter.fs.delete(path);
  }

  async setKV(key: string, value: any): Promise<void> {
    await this.initialize();
    return window.puter.kv.set(key, value);
  }

  async getKV(key: string): Promise<any> {
    await this.initialize();
    return window.puter.kv.get(key);
  }

  async generateContent(prompt: string, options: any): Promise<any> {
    await this.initialize();
    return window.puter.ai.chat(prompt, options);
  }
}

export const puterService = new PuterService();
