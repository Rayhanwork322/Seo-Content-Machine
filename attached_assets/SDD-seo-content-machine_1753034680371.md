# Software Design Document (SDD)
## SEO Content Machine

### System Architecture Overview

#### Frontend Architecture (React + Vite)
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────────────────────────────────────────────┤
│  Components Layer (ShadCN UI + Custom)                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Dashboard   │ │   Editor    │ │  Settings   │       │
│  │ Component   │ │ Component   │ │ Component   │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────┤
│  State Management Layer (Zustand/Context)               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Auth Store  │ │Content Store│ │ Settings    │       │
│  │             │ │             │ │ Store       │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────┤
│  Services Layer (Business Logic)                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │   AI        │ │ WordPress   │ │    SEO      │       │
│  │ Service     │ │  Service    │ │  Service    │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────────────────────┤
│  API Layer (Puter.js Integration)                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ Puter.auth  │ │  Puter.fs   │ │  Puter.ai   │       │
│  │             │ │             │ │             │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────────────────────┘
```

#### Backend Integration Architecture
```
┌─────────────────────────────────────────────────────────┐
│                   Puter.js Services                     │
├─────────────────────────────────────────────────────────┤
│  Authentication Service                                  │
│  - OAuth2 flows                                         │
│  - Session management                                    │
│  - User profile data                                     │
├─────────────────────────────────────────────────────────┤
│  File Storage Service (Puter.fs)                        │
│  - Content drafts and finals                            │
│  - Image and media assets                               │
│  - Template library storage                             │
├─────────────────────────────────────────────────────────┤
│  AI Service (Puter.ai)                                  │
│  - Multiple model support                               │
│  - Streaming content generation                         │
│  - Prompt optimization                                   │
├─────────────────────────────────────────────────────────┤
│  Key-Value Store (Puter.kv)                            │
│  - User preferences                                      │
│  - WordPress connections                                 │
│  - SEO configurations                                    │
├─────────────────────────────────────────────────────────┤
│  Hosting Service (Puter.hosting)                       │
│  - Static app deployment                                │
│  - CDN distribution                                     │
│  - SSL certificates                                     │
└─────────────────────────────────────────────────────────┘
```

### Component Design Specifications

#### Core React Components

##### Dashboard Component
**Purpose**: Main application dashboard with content overview
**Props Interface**:
```typescript
interface DashboardProps {
  user: User;
  recentContent: ContentItem[];
  performanceMetrics: PerformanceData;
  wpConnections: WordPressConnection[];
}
```
**Key Features**:
- Real-time content generation progress
- Performance metrics visualization
- Quick action buttons for common tasks
- WordPress site status indicators

##### ContentEditor Component
**Purpose**: Rich text editor with AI assistance and SEO optimization
**Props Interface**:
```typescript
interface ContentEditorProps {
  contentId?: string;
  initialContent?: Content;
  onSave: (content: Content) => void;
  onPublish: (content: Content, wpSite: string) => void;
  aiModel: AIModel;
}
```
**Key Features**:
- Real-time AI content generation with streaming
- Integrated SEO analysis and scoring
- WordPress-compatible rich text editing
- Auto-save functionality every 30 seconds

##### WordPressManager Component
**Purpose**: Manage WordPress site connections and publishing
**Props Interface**:
```typescript
interface WordPressManagerProps {
  connections: WordPressConnection[];
  onAddConnection: (connection: WordPressConnection) => void;
  onTestConnection: (connectionId: string) => Promise<boolean>;
  onRemoveConnection: (connectionId: string) => void;
}
```
**Key Features**:
- Multiple authentication method support
- Connection health monitoring
- Bulk publishing capabilities
- Site-specific publishing settings

#### Utility Components (ShadCN UI Integration)

##### Custom Component Extensions
```typescript
// Extended Button with loading states
export const LoadingButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & {
    loading?: boolean;
    loadingText?: string;
  }
>(({ loading, loadingText, children, disabled, ...props }, ref) => {
  return (
    <Button ref={ref} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? loadingText : children}
    </Button>
  );
});

// SEO Score Display Component
export const SEOScoreCard: React.FC<{
  score: number;
  breakdown: SEOBreakdown;
}> = ({ score, breakdown }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          SEO Score
          <Badge className={getScoreColor(score)}>{score}/100</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={score} className="mb-4" />
        {/* Breakdown details */}
      </CardContent>
    </Card>
  );
};
```

### Data Flow & State Management

#### Global State Architecture (Zustand)
```typescript
// Auth Store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

// Content Store
interface ContentState {
  currentContent: Content | null;
  contentList: Content[];
  isGenerating: boolean;
  generationProgress: number;
  
  // Actions
  generateContent: (brief: ContentBrief) => Promise<void>;
  saveContent: (content: Content) => Promise<void>;
  publishContent: (contentId: string, wpSiteId: string) => Promise<void>;
  loadContentList: () => Promise<void>;
}

// Settings Store
interface SettingsState {
  preferences: UserPreferences;
  wpConnections: WordPressConnection[];
  
  // Actions
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  addWPConnection: (connection: WordPressConnection) => Promise<void>;
  testWPConnection: (connectionId: string) => Promise<boolean>;
}
```

#### Data Flow Patterns
```typescript
// Content Generation Flow
const generateContent = async (brief: ContentBrief) => {
  // 1. Update UI state
  setIsGenerating(true);
  setGenerationProgress(0);
  
  // 2. Stream content from Puter.ai
  const response = await puter.ai.chat(generatePrompt(brief), {
    model: userPreferences.aiModel,
    stream: true,
    maxTokens: 4000
  });
  
  // 3. Process streaming response
  let generatedContent = '';
  for await (const chunk of response) {
    if (chunk.text) {
      generatedContent += chunk.text;
      setCurrentContent(prev => ({
        ...prev,
        content: generatedContent
      }));
      setGenerationProgress(prev => prev + 1);
    }
  }
  
  // 4. Perform SEO analysis
  const seoScore = await analyzeSEO(generatedContent, brief);
  
  // 5. Save to Puter.fs
  await puter.fs.write(
    `content/${contentId}.json`,
    JSON.stringify({ ...content, seoScore })
  );
  
  setIsGenerating(false);
};
```

### Service Layer Architecture

#### AIService Class
```typescript
class AIService {
  private model: string;
  private maxTokens: number;
  
  constructor(model: string = 'claude-3-sonnet', maxTokens: number = 4000) {
    this.model = model;
    this.maxTokens = maxTokens;
  }
  
  async generateContent(brief: ContentBrief): Promise<AsyncGenerator<string>> {
    const prompt = this.buildPrompt(brief);
    
    const response = await puter.ai.chat(prompt, {
      model: this.model,
      stream: true,
      maxTokens: this.maxTokens
    });
    
    return this.processStream(response);
  }
  
  private buildPrompt(brief: ContentBrief): string {
    return `
    Create a comprehensive ${brief.contentType} about "${brief.keyword}".
    
    Requirements:
    - Target length: ${brief.targetLength} words
    - Tone: ${brief.tone}
    - Audience: ${brief.audience}
    - Include H2 and H3 headings
    - Optimize for SEO with keyword density 1-2%
    - Include conclusion with call-to-action
    
    Outline:
    ${brief.outline.map(h => `${h.level}: ${h.heading}`).join('\n')}
    `;
  }
  
  private async* processStream(response: any): AsyncGenerator<string> {
    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  }
}
```

#### WordPressService Class
```typescript
class WordPressService {
  private connections: Map<string, WordPressConnection> = new Map();
  
  async addConnection(connection: WordPressConnection): Promise<void> {
    // Test connection first
    const isValid = await this.testConnection(connection);
    if (!isValid) {
      throw new Error('WordPress connection failed');
    }
    
    // Store encrypted credentials
    const encrypted = await this.encryptCredentials(connection.credentials);
    const secureConnection = {
      ...connection,
      credentials: encrypted
    };
    
    // Save to Puter.kv
    await puter.kv.set(`wp_connection_${connection.id}`, secureConnection);
    this.connections.set(connection.id, secureConnection);
  }
  
  async publishContent(
    content: Content,
    connectionId: string
  ): Promise<{ success: boolean; postId?: number; url?: string }> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('WordPress connection not found');
    }
    
    const decryptedCredentials = await this.decryptCredentials(
      connection.credentials
    );
    
    const postData = {
      title: content.title,
      content: content.content,
      excerpt: content.excerpt,
      status: connection.defaultSettings.postStatus,
      categories: connection.defaultSettings.defaultCategories,
      tags: this.extractTags(content),
      meta: {
        _yoast_wpseo_title: content.seoTitle,
        _yoast_wpseo_metadesc: content.metaDescription
      }
    };
    
    try {
      const response = await fetch(`${connection.url}/wp-json/wp/v2/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.buildAuthHeader(decryptedCredentials)
        },
        body: JSON.stringify(postData)
      });
      
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        postId: result.id,
        url: result.link
      };
    } catch (error) {
      console.error('WordPress publish error:', error);
      return { success: false };
    }
  }
  
  private buildAuthHeader(credentials: any): string {
    switch (credentials.type) {
      case 'oauth2':
        return `Bearer ${credentials.accessToken}`;
      case 'jwt':
        return `Bearer ${credentials.token}`;
      case 'basic':
        return `Basic ${btoa(`${credentials.username}:${credentials.password}`)}`;
      default:
        throw new Error('Unsupported authentication type');
    }
  }
}
```

#### SEOService Class
```typescript
class SEOService {
  private rules: SEORules;
  
  constructor() {
    this.loadSEORules();
  }
  
  async analyzeSEO(content: Content): Promise<SEOAnalysis> {
    const analysis = {
      overallScore: 0,
      titleScore: this.analyzeTitle(content.title, content.keyword),
      metaScore: this.analyzeMeta(content.metaDescription, content.keyword),
      keywordScore: this.analyzeKeywordDensity(content.content, content.keyword),
      readabilityScore: this.analyzeReadability(content.content),
      headingScore: this.analyzeHeadings(content.content),
      lengthScore: this.analyzeLength(content.content),
      suggestions: []
    };
    
    // Calculate overall score
    analysis.overallScore = this.calculateOverallScore(analysis);
    
    // Generate suggestions
    analysis.suggestions = this.generateSuggestions(analysis);
    
    return analysis;
  }
  
  private analyzeKeywordDensity(content: string, keyword: string): number {
    const wordCount = content.split(/\s+/).length;
    const keywordCount = (content.toLowerCase().match(
      new RegExp(keyword.toLowerCase(), 'g')
    ) || []).length;
    
    const density = (keywordCount / wordCount) * 100;
    
    // Optimal density 1-2%
    if (density >= 1 && density <= 2) return 100;
    if (density > 0.5 && density < 3) return 80;
    if (density > 0 && density < 4) return 60;
    return 30;
  }
  
  private analyzeReadability(content: string): number {
    // Implement Flesch-Kincaid readability score
    const sentences = content.split(/[.!?]+/).length - 1;
    const words = content.split(/\s+/).length;
    const syllables = this.countSyllables(content);
    
    const fleschScore = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    
    // Convert to 0-100 scale
    return Math.max(0, Math.min(100, fleschScore));
  }
  
  private generateSuggestions(analysis: SEOAnalysis): string[] {
    const suggestions: string[] = [];
    
    if (analysis.titleScore < 80) {
      suggestions.push('Optimize your title tag to include the primary keyword near the beginning');
    }
    
    if (analysis.metaScore < 80) {
      suggestions.push('Improve meta description by including target keywords and keeping it under 160 characters');
    }
    
    if (analysis.keywordScore < 80) {
      suggestions.push('Adjust keyword density to 1-2% for optimal SEO performance');
    }
    
    if (analysis.readabilityScore < 60) {
      suggestions.push('Improve readability by using shorter sentences and simpler vocabulary');
    }
    
    return suggestions;
  }
}
```

### Deployment Topology

#### Puter.hosting Deployment Configuration
```typescript
// Deploy configuration
const deployConfig = {
  subdomain: 'seo-content-machine',
  directory: 'dist',
  customDomain: 'app.seocontentmachine.com', // Optional
  ssl: true,
  cdn: true,
  gzip: true
};

// Build and deploy script
const deploy = async () => {
  // 1. Build the application
  await execAsync('npm run build');
  
  // 2. Deploy to Puter hosting
  const deployment = await puter.hosting.create(
    deployConfig.subdomain,
    deployConfig.directory
  );
  
  console.log(`Deployed to: https://${deployment.subdomain}.puter.site`);
};
```

#### Environment Configuration
```typescript
// Environment variables managed through Vite
interface AppConfig {
  VITE_PUTER_APP_ID: string;
  VITE_APP_VERSION: string;
  VITE_SENTRY_DSN?: string;
  VITE_ANALYTICS_ID?: string;
}

// Runtime configuration
const config: AppConfig = {
  VITE_PUTER_APP_ID: import.meta.env.VITE_PUTER_APP_ID,
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_ANALYTICS_ID: import.meta.env.VITE_ANALYTICS_ID
};
```

#### Performance Optimization Strategy
- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Tree shaking and minimal dependencies
- **Caching Strategy**: Service worker for offline functionality
- **CDN Integration**: Static assets served via Puter.hosting CDN
- **Image Optimization**: WebP format with fallbacks
- **CSS Optimization**: Tailwind CSS purging and minification

---

**Document Version**: 1.0  
**Last Updated**: Current Date  
**Software Architect**: Development Team Lead  
**Reviewers**: Senior Engineers, Tech Lead