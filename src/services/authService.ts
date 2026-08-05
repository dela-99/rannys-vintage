import { signInWithGoogle as startGoogleSignIn } from "@/lib/auth";

export type AuthUser = {
  id?: string;
  name: string;
  email: string;
  role: "admin" | string;
};

type AuthResponse = {
  success?: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
const AUTH_STORAGE_KEY = "rannys-auth-session";

async function readJsonResponse(response: Response): Promise<AuthResponse> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return { message: await response.text() };
  }

  return (await response.json()) as AuthResponse;
}

async function requestAuth(endpoint: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const payload = await readJsonResponse(response);

  if (!response.ok) {
    throw new Error(payload.message || "Authentication request failed.");
  }

  return payload;
}

export const authService = {
  storageKey: AUTH_STORAGE_KEY,

  async login(email: string, password: string) {
    const payload = await requestAuth("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (!payload.token || !payload.user) {
      throw new Error("Authentication response was missing a token or user.");
    }

    return { token: payload.token, user: payload.user };
  },

  async getCurrentUser(token: string) {
    const payload = await requestAuth("/api/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!payload.user) {
      throw new Error("Session response was missing a user.");
    }

    return payload.user;
  },

  async createAdmin(name: string, email: string, password: string) {
    const payload = await requestAuth("/api/auth/admins", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    if (!payload.user) {
      throw new Error("Signup response was missing a user.");
    }

    return payload.user;
  },

  signInWithGoogle: startGoogleSignIn,
};
