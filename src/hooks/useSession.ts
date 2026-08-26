import { useCallback, useEffect, useState } from "react";
import { api, ApiError, type ApiUser } from "../lib/api";

export interface SessionData {
  loggedIn: boolean;
  name: string;
  email: string;
  surveyComplete: boolean;
  useCase: string;
}

const DEFAULT_SESSION: SessionData = {
  loggedIn: false,
  name: "",
  email: "",
  surveyComplete: false,
  useCase: "",
};

function fromApiUser(u: ApiUser): SessionData {
  return {
    loggedIn: true,
    name: u.name,
    email: u.email,
    surveyComplete: u.surveyComplete,
    useCase: u.useCase ?? "",
  };
}

/**
 * Talks to the real IRIS backend (server/) for auth. There's no third-party
 * auth provider — just a local Express server, bcrypt-hashed passwords, and
 * a JWT in an httpOnly cookie. This hook holds the client-side mirror of
 * that session.
 */
export function useSession() {
  const [session, setSession] = useState<SessionData>(DEFAULT_SESSION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .me()
      .then((u) => setSession(fromApiUser(u)))
      .catch(() => setSession(DEFAULT_SESSION))
      .finally(() => setLoading(false));
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const user = await api.signup(name, email, password);
      setSession(fromApiUser(user));
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: e instanceof ApiError ? e.message : "Something went wrong." };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const user = await api.login(email, password);
      setSession(fromApiUser(user));
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: e instanceof ApiError ? e.message : "Something went wrong." };
    }
  }, []);

  const completeSurvey = useCallback(async (useCase: string, name: string) => {
    try {
      const user = await api.completeSurvey(useCase, name);
      setSession(fromApiUser(user));
      return { ok: true as const };
    } catch (e) {
      return { ok: false as const, error: e instanceof ApiError ? e.message : "Something went wrong." };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      setSession(DEFAULT_SESSION);
    }
  }, []);

  return { session, loading, signup, signIn, completeSurvey, logout };
}
