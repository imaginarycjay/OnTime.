import express from "express";
import cors from "cors";
import "dotenv/config";
import studyPackRoutes from "./routes/studyPack.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

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
});
