/*
import * as React from "react";
import { useRouter } from "@tanstack/react-router";

export type UserRole = "admin" | "customer" | "staff";

export interface AuthState {
  user: { name: string; role: UserRole } | null;
  session: unknown | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  status: "loading" | "unauthenticated" | "authenticated";
}

const AuthContext = React.createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthState["user"]>(null);
  const [session, setSession] = React.useState<unknown | null>(null);
  const [status, setStatus] = React.useState<AuthState["status"]>("loading");
  const router = useRouter();

  React.useEffect(() => {
    // This is where you'll check for an existing session with Convex
    setStatus("unauthenticated");
  }, []);

  const signIn = async (email: string, pass: string) => {
    // Temporary sign-in logic
    if (email === "admin@rannys.com" && pass === "admin") {
      setUser({ name: "Ranny", role: "admin" });
      setSession({ id: "temp-session" });
      setStatus("authenticated");
    } else {
      setUser({ name: "Customer", role: "customer" });
      setSession({ id: "temp-session" });
      setStatus("authenticated");
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setStatus("unauthenticated");
    router.invalidate();
  };

  const value: AuthState = {
    user,
    session,
    signIn,
    signOut,
    status,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
*/
