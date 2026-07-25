// TODO: Replace with Convex authentication

export const authService = {
  async signInWithEmail(email: string, password: string): Promise<void> {
    console.log("Signing in with email and password", email, password);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  async signInWithGoogle(): Promise<void> {
    console.log("Signing in with Google");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },

  async signOut(): Promise<void> {
    console.log("Signing out");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
};