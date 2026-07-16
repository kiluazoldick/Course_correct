import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

// Désactiver Stripe en développement
async function initStripe() {
  log("⚠️ Stripe désactivé - Mode développement local");
  return;
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Fonction pour démarrer le serveur
async function startServer() {
  await initStripe();

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // Setup Vite ou serveur statique selon l'environnement
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  const host =
    process.env.NODE_ENV === "production"
      ? "0.0.0.0"
      : process.env.HOST || "127.0.0.1";

  server.listen(
    {
      port,
      host: host,
    },
    () => {
      log(`🚀 Corrige Tes Cours - serving on http://${host}:${port}`);
    },
  );

  const cleanupExpiredUploads = async () => {
    try {
      const deletedCount = await storage.deleteExpiredAnonymousUploads();
      if (deletedCount > 0) {
        log(`Cleaned up ${deletedCount} expired anonymous upload(s)`);
      }
    } catch (error) {
      console.error("Error cleaning up expired uploads:", error);
    }
  };

  cleanupExpiredUploads();
  setInterval(cleanupExpiredUploads, 3600000);
}

// Démarrer le serveur
startServer();

// ===== EXPORT POUR VERCEL =====
export default app;
