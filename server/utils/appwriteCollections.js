import { Query } from "appwrite";

const endpoint = (
  process.env.APPWRITE_ENDPOINT ||
  process.env.VITE_APPWRITE_ENDPOINT ||
  ""
).replace(/\/$/, "");
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID;

const collectionIds = {
  products:
    process.env.APPWRITE_PRODUCTS_COLLECTION_ID ||
    process.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID ||
    "products",
  orders: process.env.APPWRITE_ORDERS_COLLECTION_ID || "orders",
  customers: process.env.APPWRITE_CUSTOMERS_COLLECTION_ID || "customers",
  messages: process.env.APPWRITE_MESSAGES_COLLECTION_ID || "messages",
  subscribers: process.env.APPWRITE_SUBSCRIBERS_COLLECTION_ID || "subscribers",
};

function assertConfigured() {
  if (!endpoint || !projectId || !apiKey || !databaseId) {
    throw new Error("Appwrite operations API is not configured.");
  }
}

function buildUrl(path, queries = []) {
  const url = new URL(`${endpoint}${path}`);
  queries.forEach((query) => url.searchParams.append("queries[]", query));
  return url;
}

export async function appwriteRequest(path, options = {}, queries = []) {
  assertConfigured();

  const response = await fetch(buildUrl(path, queries), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Appwrite-Key": apiKey,
      "X-Appwrite-Project": projectId,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite request failed: ${response.status} ${body}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function collectionPath(collectionName, path = "") {
  return `/databases/${databaseId}/collections/${collectionIds[collectionName]}${path}`;
}

export function listDocuments(collectionName, queries = []) {
  return appwriteRequest(collectionPath(collectionName, "/documents"), {}, queries);
}

export function getDocument(collectionName, documentId) {
  return appwriteRequest(
    collectionPath(collectionName, `/documents/${encodeURIComponent(documentId)}`),
  );
}

export function createDocument(collectionName, documentId, data) {
  return appwriteRequest(collectionPath(collectionName, "/documents"), {
    method: "POST",
    body: JSON.stringify({ documentId, data }),
  });
}

export function updateDocument(collectionName, documentId, data) {
  return appwriteRequest(
    collectionPath(collectionName, `/documents/${encodeURIComponent(documentId)}`),
    {
      method: "PATCH",
      body: JSON.stringify({ data }),
    },
  );
}

export function deleteDocument(collectionName, documentId) {
  return appwriteRequest(
    collectionPath(collectionName, `/documents/${encodeURIComponent(documentId)}`),
    {
      method: "DELETE",
    },
  );
}

export { Query, collectionIds, databaseId };
