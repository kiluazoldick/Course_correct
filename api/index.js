// api/index.js - Point d'entrée pour Vercel avec serverless-http
import app from "../dist/index.js";
import serverless from "serverless-http";

// Exporter la fonction handler pour Vercel
export const handler = serverless(app);
