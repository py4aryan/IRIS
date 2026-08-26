import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./auth.js";

const app = express();
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

app.use("/api/auth", authRouter);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`IRIS API listening on http://localhost:${PORT}`);
});
