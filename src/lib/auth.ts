export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT ?? "",
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "",
};

export function isAppwriteConfigured() {
  return Boolean(appwriteConfig.endpoint && appwriteConfig.projectId);
}

export async function signInWithGoogle() {
  if (!isAppwriteConfigured()) {
    return { success: false, reason: "Appwrite is not configured yet." as const };
  }

  return { success: true, reason: "Ready for Appwrite OAuth." as const };
}
