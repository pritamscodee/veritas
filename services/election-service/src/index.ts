import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./models/prisma";
import electionRoutes from "./routes/election.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Health check
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      service: "election-service",
      status: "healthy",
      version: "0.1.0",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  } catch {
    res.status(503).json({
      service: "election-service",
      status: "degraded",
      version: "0.1.0",
      timestamp: Date.now(),
    });
  }
});

// Routes
app.use("/elections", electionRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Election service error:", err.message);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal service error" });
});

app.listen(PORT, () => {
  console.log(`[election-service] running on port ${PORT}`);
});

export default app;
