import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from gemini-server/.env first, then fallback to project-root/.env
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { default: studyPackRoutes } = await import("./routes/studyPack.js");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
   cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
   }),
);
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get("/health", (req, res) => {
   res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", studyPackRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
   console.log(`🚀 Gemini AI Server running on http://localhost:${PORT}`);
   console.log(
      `📚 Study Pack API: http://localhost:${PORT}/api/generate-study-pack`,
   );

   if (!process.env.GEMINI_API_KEY) {
      console.warn(
         "⚠️  GEMINI_API_KEY not found. Add it to gemini-server/.env or project-root/.env",
      );
   }
});
