import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import paymentsRoutes from "./routes/payments.routes";
import assetsRoutes from "./routes/assets.routes";
import rampRoutes from "./routes/ramp.routes";
import defiRoutes from "./routes/defi.routes";
import anchorsRoutes from "./routes/anchors.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    service: "stellar-service",
    status: "healthy",
    version: "0.1.0",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/payments", paymentsRoutes);
app.use("/assets", assetsRoutes);
app.use("/ramp", rampRoutes);
app.use("/defi", defiRoutes);
app.use("/anchors", anchorsRoutes);

app.use((_req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Stellar service error:", err.message);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal service error" });
});

app.listen(PORT, () => {
  console.log(`[stellar-service] running on port ${PORT}`);
});

export default app;
