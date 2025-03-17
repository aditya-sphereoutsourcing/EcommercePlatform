import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";
import { createProxyMiddleware } from 'http-proxy-middleware';

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy all /api requests to Spring Boot except /api/products
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/api': '/api' // keep /api prefix when forwarding to Spring Boot
    },
    // Don't proxy /api/products requests
    filter: (path) => {
      return !path.startsWith('/api/products');
    }
  }));

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


  setupAuth(app);

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

  // Orders
  app.post("/api/orders", requireAuth, async (req, res) => {
    const cartItems = await storage.getCartItems(req.user!.id);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const products = await storage.getProducts();
    const productMap = new Map(products.map(p => [p.id, p]));

    const total = cartItems.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const order = await storage.createOrder(
      { userId: req.user!.id, total, status: "pending", createdAt: new Date() },
      cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(productMap.get(item.productId)!.price),
        orderId: 0 // Will be set by storage
      }))
    );

    await storage.clearCart(req.user!.id);
    res.status(201).json(order);
  });

  app.get("/api/orders", requireAuth, async (req, res) => {
    const orders = await storage.getOrders(req.user!.id);
    res.json(orders);
  });

  const httpServer = createServer(app);
  return httpServer;
}

function requireAuth(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated()) {
    console.log("Authentication failed:", {
      sessionID: req.sessionID,
      isAuthenticated: req.isAuthenticated(),
      user: req.user
    });
    return res.status(401).json({ message: "Unauthorized" });
  }
  console.log("Authentication successful:", {
    sessionID: req.sessionID,
    user: req.user?.id
  });
  next();
}

function requireAdmin(req: Request, res: Response, next: Function) {
  if (!req.isAuthenticated() || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}