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
      // Wait for Puter.js SDK to be available (loaded via script tag in HTML)
      if (typeof window !== 'undefined') {
        let attempts = 0;
        while (!window.puter && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.puter) {
          throw new Error('Puter.js SDK not available');
        }
      }

      this.initialized = true;
      console.log('Puter.js SDK initialized successfully');
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
        signIn: () => Promise.resolve({ id: 'mock-user', username: 'Demo User', email: 'demo@example.com' }),
        signOut: () => Promise.resolve(),
        getUser: () => Promise.resolve({ id: 'mock-user', username: 'Demo User', email: 'demo@example.com' }),
        isSignedIn: () => Promise.resolve(true)
      },
      fs: {
        write: (path: string, content: string) => {
          console.log('Mock Puter: Writing file to', path);
          return Promise.resolve();
        },
        read: (path: string) => {
          console.log('Mock Puter: Reading file from', path);
          return Promise.resolve({ text: () => Promise.resolve('{}') });
        },
        mkdir: (path: string) => Promise.resolve(),
        exists: (path: string) => Promise.resolve(false),
        list: (path: string) => Promise.resolve([])
      },
      ai: {
        chat: (prompt: string | any[], options: any) => {
          console.log('Mock Puter: Generating content for prompt');
          // Generate a more realistic mock content based on the prompt
          const mockContent = this.generateMockContent(prompt);
          return Promise.resolve({
            text: mockContent,
            content: mockContent,
            usage: { total_tokens: 1500 }
          });
        }
      },
      kv: {
        set: (key: string, value: any) => {
          console.log('Mock Puter: Setting KV', key);
          localStorage.setItem(`puter_kv_${key}`, JSON.stringify(value));
          return Promise.resolve();
        },
        get: (key: string) => {
          console.log('Mock Puter: Getting KV', key);
          const stored = localStorage.getItem(`puter_kv_${key}`);
          return Promise.resolve(stored ? JSON.parse(stored) : null);
        },
        del: (key: string) => {
          localStorage.removeItem(`puter_kv_${key}`);
          return Promise.resolve();
        }
      }
    };
  }

  private generateMockContent(prompt: string | any[]): string {
    const promptText = Array.isArray(prompt) ? prompt.join(' ') : prompt;
    
    // Extract keyword from prompt if possible
    const keywordMatch = promptText.match(/keyword[:\s]+([^\n\r,]+)/i);
    const keyword = keywordMatch ? keywordMatch[1].trim() : 'your topic';
    
    return `# Complete Guide to ${keyword}

## Introduction

Welcome to this comprehensive guide about ${keyword}. In this article, we'll explore everything you need to know to master this topic and achieve your goals.

## What is ${keyword}?

${keyword} is an essential concept that plays a crucial role in today's digital landscape. Understanding ${keyword} can help you improve your skills and achieve better results.

## Key Benefits of ${keyword}

1. **Enhanced Performance**: ${keyword} can significantly improve your overall performance
2. **Better Results**: Implementing ${keyword} strategies leads to measurable improvements
3. **Competitive Advantage**: Mastering ${keyword} gives you an edge over competitors
4. **Long-term Success**: ${keyword} provides sustainable solutions for long-term growth

## Best Practices for ${keyword}

### Getting Started

To begin with ${keyword}, follow these essential steps:

1. Research and understand the fundamentals
2. Create a strategic plan
3. Implement gradually
4. Monitor and adjust

### Advanced Techniques

Once you've mastered the basics, consider these advanced approaches:

- **Optimization**: Fine-tune your ${keyword} implementation
- **Integration**: Combine ${keyword} with other strategies
- **Automation**: Use tools to streamline your ${keyword} processes
- **Analytics**: Track and measure your ${keyword} performance

## Common Mistakes to Avoid

When working with ${keyword}, avoid these frequent pitfalls:

- Rushing the implementation process
- Ignoring data and analytics
- Failing to stay updated with trends
- Not investing in proper training

## Tools and Resources

Here are some valuable tools for ${keyword}:

- Professional software solutions
- Educational resources and courses
- Community forums and support groups
- Expert consultations and services

## Conclusion

${keyword} is a powerful approach that can transform your results when implemented correctly. By following the strategies outlined in this guide, you'll be well-equipped to leverage ${keyword} effectively.

Remember to stay patient, consistent, and always keep learning. Success with ${keyword} comes to those who are willing to invest time and effort into mastering the fundamentals.

Start implementing these strategies today, and you'll see improvements in your ${keyword} performance soon.`;
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
    console.log('Calling Puter.js AI with options:', options);
    
    // Handle testMode properly
    const testMode = options.testMode || false;
    delete options.testMode; // Remove testMode from options as it's a separate parameter
    
    return window.puter.ai.chat(prompt, testMode, options);
  }
}

export const puterService = new PuterService();
