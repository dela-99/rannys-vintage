const endpoint = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const databaseId = process.env.APPWRITE_DATABASE_ID || process.env.VITE_APPWRITE_DATABASE_ID;
const collectionId =
  process.env.APPWRITE_PRODUCTS_COLLECTION_ID ||
  process.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID ||
  "products";

const required = { endpoint, projectId, apiKey, databaseId };
const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error(`Missing required Appwrite env values: ${missing.join(", ")}`);
  process.exit(1);
}

const baseUrl = endpoint.replace(/\/$/, "");
const headers = {
  "Content-Type": "application/json",
  "X-Appwrite-Key": apiKey,
  "X-Appwrite-Project": projectId,
};

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (response.status === 409) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${body}`);
  }

  return response.json();
}

async function createCollection() {
  await request(`/databases/${databaseId}/collections`, {
    method: "POST",
    body: JSON.stringify({
      collectionId,
      name: "Products",
      documentSecurity: false,
      permissions: [],
      enabled: true,
    }),
  });
}

async function createAttribute(attribute) {
  const { type, ...body } = attribute;
  await request(`/databases/${databaseId}/collections/${collectionId}/attributes/${type}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

async function createIndex(key, attributes, type = "key", orders) {
  await request(`/databases/${databaseId}/collections/${collectionId}/indexes`, {
    method: "POST",
    body: JSON.stringify({
      key,
      type,
      attributes,
      orders,
    }),
  });
}

async function waitForAttributes(expectedKeys) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const result = await request(`/databases/${databaseId}/collections/${collectionId}/attributes`);
    const availableKeys = new Set(
      result.attributes
        .filter((attribute) => attribute.status === "available")
        .map((attribute) => attribute.key),
    );

    if (expectedKeys.every((key) => availableKeys.has(key))) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  throw new Error("Timed out waiting for Appwrite product attributes to become available.");
}

async function main() {
  await createCollection();

  const attributes = [
    { type: "string", key: "productId", size: 128, required: true },
    { type: "string", key: "slug", size: 128, required: true },
    { type: "string", key: "name", size: 255, required: true },
    { type: "string", key: "category", size: 64, required: true },
    { type: "string", key: "subcategory", size: 128, required: true },
    { type: "string", key: "description", size: 5000, required: true },
    { type: "float", key: "price", required: true, min: 0 },
    { type: "float", key: "oldPrice", required: false, min: 0 },
    { type: "integer", key: "stock", required: true, min: 0 },
    { type: "string", key: "images", size: 1000, required: true, array: true },
    { type: "string", key: "sizes", size: 64, required: false, array: true },
    { type: "string", key: "colors", size: 64, required: false, array: true },
    { type: "boolean", key: "featured", required: true },
    { type: "boolean", key: "trending", required: true },
    { type: "boolean", key: "visible", required: true },
    { type: "string", key: "status", size: 32, required: true },
    { type: "datetime", key: "createdAt", required: true },
    { type: "datetime", key: "updatedAt", required: true },
  ];

  for (const attribute of attributes) {
    await createAttribute(attribute);
  }

  await waitForAttributes(attributes.map((attribute) => attribute.key));

  const indexes = [
    ["status", ["status"]],
    ["visible", ["visible"]],
    ["category", ["category"]],
    ["slug", ["slug"], "unique"],
    ["createdAt", ["createdAt"]],
    ["updatedAt", ["updatedAt"]],
  ];

  for (const [key, attributes, type] of indexes) {
    await createIndex(key, attributes, type);
  }

  console.log(`Products collection ready: ${databaseId}/${collectionId}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
