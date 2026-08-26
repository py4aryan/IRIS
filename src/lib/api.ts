export interface ApiUser {
  name: string;
  email: string;
  useCase: string | null;
  surveyComplete: boolean;
}

export class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  me: () => request<ApiUser>("/auth/me"),
  signup: (name: string, email: string, password: string) =>
    request<ApiUser>("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) =>
    request<ApiUser>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),
  completeSurvey: (useCase: string, name: string) =>
    request<ApiUser>("/auth/survey", { method: "POST", body: JSON.stringify({ useCase, name }) }),
};
