import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products endpoint handled by Express
  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    const product = insertProductSchema.parse(req.body);
    const created = await storage.createProduct(product);
    res.status(201).json(created);
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.sendStatus(204);
  });

  // Seed some demo products
  const demoProducts = [
    {
      name: "Premium Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      stock: 50
    },
    {
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health tracking",
      price: 299.99,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
      stock: 30
    },
    {
      name: "Laptop Pro",
      description: "Powerful laptop for professionals",
      price: 1299.99,
      imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
      stock: 20
    }
  ];

  // Seed products if none exist
  storage.getProducts().then(async (products) => {
    if (products.length === 0) {
      for (const product of demoProducts) {
        await storage.createProduct(product);
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}