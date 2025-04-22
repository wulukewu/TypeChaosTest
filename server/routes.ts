import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // The app doesn't require any backend API routes
  // since it's a client-side only application

  const httpServer = createServer(app);
  return httpServer;
}
