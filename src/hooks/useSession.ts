import { useCallback, useState } from "react";

const STORAGE_KEY = "iris-session";

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

function readSession(): SessionData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION;
    return { ...DEFAULT_SESSION, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SESSION;
  }
}

function writeSession(data: SessionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/**
 * Frontend-only "session" — there is no backend, so login is a client-side
 * mock that never persists a password, and onboarding state just lives in
 * localStorage. Good enough to gate the dashboard behind a login + survey
 * flow without pretending to be real auth.
 */
export function useSession() {
  const [session, setSession] = useState<SessionData>(() => readSession());

  const update = useCallback((patch: Partial<SessionData>) => {
    setSession((prev) => {
      const next = { ...prev, ...patch };
      writeSession(next);
      return next;
    });
  }, []);

  const login = useCallback(
    (name: string, email: string) => {
      update({ loggedIn: true, name, email });
    },
    [update]
  );

  const completeSurvey = useCallback(
    (useCase: string, name?: string) => {
      update({ surveyComplete: true, useCase, ...(name ? { name } : {}) });
    },
    [update]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(DEFAULT_SESSION);
  }, []);

  return { session, login, completeSurvey, logout };
}
