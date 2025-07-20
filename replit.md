# SEO Content Machine - Replit.md

## Overview

The SEO Content Machine is a modern React-based web application that automates SEO content creation and WordPress publishing. It uses AI-powered content generation via Puter.js, real-time SEO analysis, and serverless architecture to enable users to create and publish high-quality content efficiently.

**Status**: Fully migrated to Replit environment with working Puter.js integration for AI content generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 20, 2025 - Content Generation System Complete
- ✓ Successfully integrated Puter.js SDK for AI content generation
- ✓ Added support for all 25+ AI models including GPT-4o, Claude 3.5 Sonnet, DeepSeek, Gemini, and more
- ✓ Implemented proper authentication flow with Puter.auth
- ✓ Added intelligent model fallback system for quota management
- ✓ Fixed content generation navigation to editor after successful generation
- ✓ Added proper toast notifications for success and error states
- ✓ Implemented cloud storage integration using Puter.fs for content persistence
- ✓ Fixed streaming content generation with progress tracking
- ✓ Added proper error handling and fallback mechanisms
- ✓ Included required Puter attribution footer
- ✓ Content now properly appears in editor after generation
- ✓ All content types (article, guide, review, listicle, tutorial) working
- ✓ Application fully functional and ready for deployment

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: ShadCN UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: Zustand stores for auth, content, and settings
- **Routing**: Wouter for lightweight client-side routing
- **Data Fetching**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Serverless Integration**: Puter.js for authentication, file storage, and AI services
- **API Layer**: RESTful endpoints with Express routes
- **Authentication**: OAuth2 via Puter.auth with session management

### Database Schema
The application uses PostgreSQL with three main tables:
- **users**: User profiles with Puter ID integration and preferences
- **content**: Article storage with SEO metrics and publishing status
- **wordpress_connections**: WordPress site credentials and connection settings

## Key Components

### Content Generation System
- **AI Integration**: Multiple AI models (GPT-4, Claude, Gemini) via Puter.ai
- **Content Brief Generator**: Keyword-driven content planning with SERP analysis
- **Real-time Editor**: Rich text editing with auto-save functionality
- **Progress Tracking**: Visual feedback during content generation

### SEO Analysis Engine
- **Real-time Analysis**: Continuous SEO scoring as content is edited
- **Keyword Optimization**: Density tracking and placement recommendations
- **Technical SEO**: Meta tags, heading structure, and readability analysis
- **Recommendations**: Actionable suggestions for content improvement

### WordPress Integration
- **Multi-site Management**: Support for multiple WordPress installations
- **REST API Integration**: Direct publishing via WordPress REST API
- **Credential Storage**: Secure storage in Puter.kv key-value store
- **Publishing Options**: Draft, immediate, or scheduled publishing

### User Interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: WCAG 2.1 AA compliance with proper ARIA labels
- **Theme Support**: Light/dark mode with CSS custom properties
- **Component Library**: Consistent design system using ShadCN components

## Data Flow

1. **Authentication Flow**
   - User signs in via Puter.auth OAuth2
   - Session stored in browser with automatic refresh
   - User preferences loaded from Puter.kv

2. **Content Creation Flow**
   - User inputs target keyword and content parameters
   - System generates content brief using AI services
   - Content generated via Puter.ai with progress tracking
   - Real-time SEO analysis provides optimization suggestions
   - Content saved to PostgreSQL via Drizzle ORM

3. **Publishing Flow**
   - User selects WordPress site from saved connections
   - Content adapted for target site (categories, tags, formatting)
   - Published via WordPress REST API
   - Publishing status tracked in database

## External Dependencies

### Core Services
- **Puter.js**: Serverless platform providing auth, storage, and AI services
- **Neon Database**: Managed PostgreSQL hosting
- **WordPress REST API**: Content publishing integration

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast bundling for production builds
- **Drizzle Kit**: Database migrations and schema management

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Consistent icon library

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Local PostgreSQL or Neon development database
- **Environment Variables**: DATABASE_URL for database connection

### Production Deployment
- **Frontend**: Static build served via Vite/Express hybrid
- **Backend**: Node.js server with Express routes
- **Database**: Neon PostgreSQL with connection pooling
- **Hosting**: Designed for deployment on platforms supporting Node.js

### Build Process
- **Frontend Build**: `vite build` creates optimized static assets
- **Backend Build**: `esbuild` bundles server code for production
- **Database Migrations**: `drizzle-kit push` applies schema changes

### Environment Configuration
- **Development**: `NODE_ENV=development` with tsx for TypeScript execution
- **Production**: `NODE_ENV=production` with compiled JavaScript
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

The application follows a serverless-first approach, leveraging Puter.js for most backend functionality while maintaining a traditional Express server for development and fallback endpoints.

## Recent Changes (January 2025)

### Puter.js Integration Complete
- ✅ Added Puter.js SDK integration for AI content generation
- ✅ Implemented support for all available AI models (Claude 3.5 Sonnet, GPT-4o, O1, DeepSeek, Gemini, etc.)
- ✅ Added test mode support for development without API credits
- ✅ Implemented proper error handling for Puter.js responses
- ✅ Added fallback mock content generation for development
- ✅ Updated authentication to work with Puter.js auth system
- ✅ Added "Powered by Puter" attribution in footer

### Fixed Content Generation
- ✅ Content generation now works with multiple AI models
- ✅ Proper handling of streaming and non-streaming responses
- ✅ Improved error messages for better debugging
- ✅ Test mode enabled for seamless development experience

### Migration to Replit Complete
- ✅ All required packages installed and configured
- ✅ Application running successfully on Replit environment
- ✅ Proper client/server separation maintained
- ✅ Security best practices implemented