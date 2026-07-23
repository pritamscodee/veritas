import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import zkProofRoutes from "./routes/zk-proof.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "zk-proof-service",
    status: "healthy",
    version: "0.1.0",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/zk-proof", zkProofRoutes);

app.use((_req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("ZK proof service error:", err.message);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal service error" });
});

app.listen(PORT, () => {
  console.log(`[zk-proof-service] running on port ${PORT}`);
});

export default app;
