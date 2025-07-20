import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API endpoints for the SEO Content Machine
  // Since we're using Puter.js for most backend functionality,
  // these routes serve as fallbacks or local development endpoints

  // Content endpoints (using Puter.fs for storage)
  app.get("/api/content", (req, res) => {
    res.json({ 
      message: "Content managed via Puter.fs",
      endpoint: "Use Puter.js client-side services" 
    });
  });

  // WordPress connection endpoints (using Puter.kv for storage)
  app.get("/api/wordpress", (req, res) => {
    res.json({ 
      message: "WordPress connections managed via Puter.kv",
      endpoint: "Use Puter.js client-side services" 
    });
  });

  // User preferences endpoints (using Puter.kv for storage)
  app.get("/api/preferences", (req, res) => {
    res.json({ 
      message: "User preferences managed via Puter.kv",
      endpoint: "Use Puter.js client-side services" 
    });
  });

  // AI service proxy (optional, for local development)
  app.post("/api/generate", (req, res) => {
    res.json({ 
      message: "AI content generation handled via Puter.ai",
      endpoint: "Use Puter.js client-side services" 
    });
  });

  // SEO analysis endpoint (could be local or via external service)
  app.post("/api/seo-analyze", (req, res) => {
    res.json({ 
      message: "SEO analysis performed client-side",
      endpoint: "Use client-side SEO service" 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
