import { appwriteAccount, isAppwriteConfigured } from "@/lib/appwrite";
import { getRoleForEmail, type UserRole } from "@/lib/auth-roles";
import { AppwriteException, ID, OAuthProvider, type Models } from "appwrite";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function assertConfigured() {
  if (!isAppwriteConfigured()) {
    throw new Error("Appwrite is not configured. Add endpoint and project ID environment values.");
  }
}

function sanitizeUser(user: Models.User<Models.Preferences>): AuthUser {
  return {
    id: user.$id,
    name: user.name,
    email: user.email,
    role: getRoleForEmail(user.email),
  };
}

export function normalizeAuthError(error: unknown, fallback = "Authentication failed.") {
  if (error instanceof AppwriteException) {
    if (error.type === "user_invalid_credentials" || error.code === 401) {
      return "The email or password is incorrect.";
    }

    if (error.type === "user_not_found") {
      return "No account exists for that email address.";
    }

    if (error.type === "user_email_already_exists" || error.code === 409) {
      return "An account already exists for that email address.";
    }

    if (error.type === "general_network_error") {
      return "Network error. Check your connection and try again.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function buildOAuthRedirectUrl(params: Record<string, string>) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
}

export const authService = {
  async login(email: string, password: string) {
    assertConfigured();
    await appwriteAccount.createEmailPasswordSession({ email, password });
    return this.getCurrentUser();
  },

  async register(name: string, email: string, password: string) {
    assertConfigured();
    await appwriteAccount.create({
      userId: ID.unique(),
      email,
      password,
      name,
    });
    await appwriteAccount.createEmailPasswordSession({ email, password });
    return this.getCurrentUser();
  },

  loginWithGoogle() {
    assertConfigured();
    const success = buildOAuthRedirectUrl({ oauth: "success" });
    const failure = buildOAuthRedirectUrl({ authError: "google_cancelled" });
    appwriteAccount.createOAuth2Session({
      provider: OAuthProvider.Google,
      success,
      failure,
    });
  },

  async logout() {
    assertConfigured();
    try {
      await appwriteAccount.deleteSession({ sessionId: "current" });
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 401) {
        return;
      }
      throw error;
    }
  },

  async getCurrentUser() {
    assertConfigured();
    const user = await appwriteAccount.get();
    return sanitizeUser(user);
  },

  async createJwt() {
    assertConfigured();
    const token = await appwriteAccount.createJWT();
    return token.jwt;
  },

  async isAuthenticated() {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};
