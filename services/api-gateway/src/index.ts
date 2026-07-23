import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import dotenv from "dotenv";
import { SERVICE_URLS, RATE_LIMIT, SERVICE_PORTS } from "@veritas/constants";

dotenv.config();

const app = express();
const PORT = SERVICE_PORTS.API_GATEWAY;

// --- Middleware ---
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));
app.use(morgan("combined"));
app.use(express.json());

const limiter = rateLimit({
  windowMs: RATE_LIMIT.WINDOW_MS,
  max: RATE_LIMIT.MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "RATE_LIMITED", message: "Too many requests, try again later" },
});
app.use(limiter);

// --- Health check ---
app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "healthy",
    version: "0.1.0",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// --- Service routes ---
const electionProxyOptions: Options = {
  target: SERVICE_URLS.ELECTION,
  changeOrigin: true,
  pathRewrite: { "^/api/elections": "/elections" },
  onError: (_err, _req, res) => {
    (res as express.Response).status(502).json({
      code: "SERVICE_UNAVAILABLE",
      message: "Election service is down",
    });
  },
};

const identityProxyOptions: Options = {
  target: SERVICE_URLS.IDENTITY,
  changeOrigin: true,
  pathRewrite: { "^/api/identity": "/identity" },
  onError: (_err, _req, res) => {
    (res as express.Response).status(502).json({
      code: "SERVICE_UNAVAILABLE",
      message: "Identity service is down",
    });
  },
};

const zkProofProxyOptions: Options = {
  target: SERVICE_URLS.ZK_PROOF,
  changeOrigin: true,
  pathRewrite: { "^/api/zk-proof": "/zk-proof" },
  onError: (_err, _req, res) => {
    (res as express.Response).status(502).json({
      code: "SERVICE_UNAVAILABLE",
      message: "ZK proof service is down",
    });
  },
};

const tallyProxyOptions: Options = {
  target: SERVICE_URLS.TALLY,
  changeOrigin: true,
  pathRewrite: { "^/api/tally": "/tally" },
  onError: (_err, _req, res) => {
    (res as express.Response).status(502).json({
      code: "SERVICE_UNAVAILABLE",
      message: "Tally service is down",
    });
  },
};

app.use("/api/elections", createProxyMiddleware(electionProxyOptions));
app.use("/api/identity", createProxyMiddleware(identityProxyOptions));
app.use("/api/zk-proof", createProxyMiddleware(zkProofProxyOptions));
app.use("/api/tally", createProxyMiddleware(tallyProxyOptions));

// --- Aggregated health endpoint ---
app.get("/api/health", async (_req, res) => {
  const services = ["ELECTION", "IDENTITY", "ZK_PROOF", "TALLY"] as const;
  const checks = await Promise.allSettled(
    services.map(async (name) => {
      const url = SERVICE_URLS[name];
      const response = await fetch(`${url}/health`);
      const body = (await response.json()) as Record<string, unknown>;
      return { service: name.toLowerCase(), ...body } as Record<string, unknown>;
    })
  );

  const results = checks.map((c) =>
    c.status === "fulfilled"
      ? c.value
      : { service: "unknown", status: "down", error: "unreachable" }
  );

  const allHealthy = results.every((r: any) => r.status === "healthy");
  res.status(allHealthy ? 200 : 503).json({
    gateway: "healthy",
    services: results,
    timestamp: Date.now(),
  });
});

// --- 404 handler ---
app.use((_req, res) => {
  res.status(404).json({ code: "NOT_FOUND", message: "Route not found" });
});

// --- Error handler ---
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Gateway error:", err.message);
  res.status(500).json({ code: "INTERNAL_ERROR", message: "Internal gateway error" });
});

app.listen(PORT, () => {
  console.log(`[api-gateway] running on port ${PORT}`);
});

export default app;
