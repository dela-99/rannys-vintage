import { Account, Client, Databases } from "appwrite";

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT ?? "";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "";
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "";
const productsCollectionId = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID ?? "products";

export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId,
  productsCollectionId,
};

export function isAppwriteConfigured() {
  return Boolean(endpoint && projectId);
}

export function isProductDatabaseConfigured() {
  return Boolean(endpoint && projectId && databaseId && productsCollectionId);
}

export const appwriteClient = new Client();

if (isAppwriteConfigured()) {
  appwriteClient.setEndpoint(endpoint).setProject(projectId);
}

export const appwriteAccount = new Account(appwriteClient);
export const appwriteDatabases = new Databases(appwriteClient);
