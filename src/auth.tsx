import { authService, type AuthUser } from "@/services/authService";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type StoredAuthSession = {
  token: string;
  user: AuthUser;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredSession(): StoredAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(authService.storageKey);
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as StoredAuthSession;
    if (!session.token || !session.user) {
      return null;
    }
    return session;
  } catch {
    window.localStorage.removeItem(authService.storageKey);
    return null;
  }
}

function storeSession(session: StoredAuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(authService.storageKey);
    return;
  }

  window.localStorage.setItem(authService.storageKey, JSON.stringify(session));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredAuthSession | null>(() => readStoredSession());
  const [isLoading, setIsLoading] = useState(Boolean(session?.token));
  const sessionToken = session?.token ?? null;

  const signOut = useCallback(() => {
    setSession(null);
    storeSession(null);
  }, []);

  useEffect(() => {
    if (!sessionToken) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    authService
      .getCurrentUser(sessionToken)
      .then((user) => {
        if (!isMounted) {
          return;
        }
        const verifiedSession = { token: sessionToken, user };
        setSession(verifiedSession);
        storeSession(verifiedSession);
      })
      .catch(() => {
        if (isMounted) {
          signOut();
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [sessionToken, signOut]);

  const signIn = useCallback(async (email: string, password: string) => {
    const nextSession = await authService.login(email, password);
    setSession(nextSession);
    storeSession(nextSession);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      await authService.createAdmin(name, email, password);
      await signIn(email, password);
    },
    [signIn],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isLoading,
      signIn,
      signUp,
      signOut,
    }),
    [isLoading, session, signIn, signOut, signUp],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
