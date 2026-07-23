import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./models/prisma";
import tallyRoutes from "./routes/tally.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      service: "tally-service",
      status: "healthy",
      version: "0.1.0",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  } catch {
    res.status(503).json({
      service: "tally-service",
      status: "degraded",
      version: "0.1.0",
      timestamp: Date.now(),
    });
  }
});

app.use("/tally", tallyRoutes);

app.use((_req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Tally service error:", err.message);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal service error" });
});

app.listen(PORT, () => {
  console.log(`[tally-service] running on port ${PORT}`);
});

export default app;
