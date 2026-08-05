import { Query } from "appwrite";

const endpoint = (
  process.env.APPWRITE_ENDPOINT ||
  process.env.VITE_APPWRITE_ENDPOINT ||
  ""
).replace(/\/$/, "");
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID;
const collectionId =
  process.env.APPWRITE_PRODUCTS_COLLECTION_ID ||
  process.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID ||
  "products";

function assertConfigured() {
  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    throw new Error("Appwrite product API is not configured.");
  }
}

function buildUrl(path, queries = []) {
  const url = new URL(`${endpoint}${path}`);
  queries.forEach((query) => url.searchParams.append("queries[]", query));
  return url;
}

async function request(path, options = {}, queries = []) {
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

function collectionPath(path = "") {
  return `/databases/${databaseId}/collections/${collectionId}${path}`;
}

export function productListQueries({ category, status, visible, limit = 25, offset = 0 } = {}) {
  const queries = [Query.limit(Number(limit)), Query.offset(Number(offset))];

  if (category && category !== "all") {
    queries.push(Query.equal("category", category));
  }

  if (status && status !== "all") {
    queries.push(Query.equal("status", status));
  }

  if (typeof visible === "boolean") {
    queries.push(Query.equal("visible", visible));
  }

  queries.push(Query.orderDesc("updatedAt"));
  return queries;
}

export const appwriteProducts = {
  list(params = {}) {
    return request(collectionPath("/documents"), {}, productListQueries(params));
  },

  get(documentId) {
    return request(collectionPath(`/documents/${encodeURIComponent(documentId)}`));
  },

  create(documentId, data) {
    return request(collectionPath("/documents"), {
      method: "POST",
      body: JSON.stringify({ documentId, data }),
    });
  },

  update(documentId, data) {
    return request(collectionPath(`/documents/${encodeURIComponent(documentId)}`), {
      method: "PATCH",
      body: JSON.stringify({ data }),
    });
  },

  delete(documentId) {
    return request(collectionPath(`/documents/${encodeURIComponent(documentId)}`), {
      method: "DELETE",
    });
  },
};
