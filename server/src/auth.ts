import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { createUser, findUserByEmail, findUserById, updateUser, type User } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set — copy server/.env.example to server/.env and fill it in.");
}

const COOKIE_NAME = "iris_token";
const isProd = process.env.NODE_ENV === "production";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(u: User) {
  return { name: u.name, email: u.email, useCase: u.useCase, surveyComplete: u.surveyComplete };
}

function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, JWT_SECRET as string, { expiresIn: "7d" });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function verifyCookie(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET as string) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "Tell us what to call you." });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: randomUUID(),
    name: name.trim(),
    email: email.toLowerCase(),
    passwordHash,
    useCase: null,
    surveyComplete: false,
    createdAt: new Date().toISOString(),
  };
  await createUser(user);
  setAuthCookie(res, user.id);
  res.status(201).json(publicUser(user));
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  setAuthCookie(res, user.id);
  res.json(publicUser(user));
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.status(204).end();
});

authRouter.get("/me", async (req, res) => {
  const userId = verifyCookie(req.cookies?.[COOKIE_NAME]);
  if (!userId) return res.status(401).json({ error: "Not authenticated." });

  const user = await findUserById(userId);
  if (!user) return res.status(401).json({ error: "Not authenticated." });

  res.json(publicUser(user));
});

authRouter.post("/survey", async (req, res) => {
  const userId = verifyCookie(req.cookies?.[COOKIE_NAME]);
  if (!userId) return res.status(401).json({ error: "Not authenticated." });

  const { useCase, name } = req.body ?? {};
  const patch: Partial<User> = { surveyComplete: true };
  if (typeof useCase === "string") patch.useCase = useCase;
  if (typeof name === "string" && name.trim()) patch.name = name.trim();

  const updated = await updateUser(userId, patch);
  if (!updated) return res.status(404).json({ error: "User not found." });
  res.json(publicUser(updated));
});
