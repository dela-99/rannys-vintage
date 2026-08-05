import { asyncHandler } from "./asyncHandler.js";

const appwriteEndpoint = (
  process.env.APPWRITE_ENDPOINT ||
  process.env.VITE_APPWRITE_ENDPOINT ||
  ""
).replace(/\/$/, "");
const appwriteProjectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;

function getBearerToken(req) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

async function getAppwriteUser(jwt) {
  if (!appwriteEndpoint || !appwriteProjectId) {
    throw new Error("Appwrite server auth is not configured.");
  }

  const response = await fetch(`${appwriteEndpoint}/account`, {
    headers: {
      "X-Appwrite-JWT": jwt,
      "X-Appwrite-Project": appwriteProjectId,
    },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export const requireAppwriteAdmin = asyncHandler(async (req, res, next) => {
  const token = getBearerToken(req);

  if (!token) {
    res.status(401);
    throw new Error("Authentication is required.");
  }

  const user = await getAppwriteUser(token);

  if (!user?.email) {
    res.status(401);
    throw new Error("Invalid Appwrite session.");
  }

  const adminEmails = getAdminEmails();

  if (!adminEmails.includes(user.email.toLowerCase())) {
    res.status(403);
    throw new Error("Admin access is required.");
  }

  req.appwriteUser = user;
  next();
});
