import express from "express";
import { ID, Query } from "appwrite";
import { requireAppwriteAdmin } from "../middleware/appwriteAuthMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "../utils/appwriteCollections.js";

const router = express.Router();

const orderStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const messageStatuses = ["new", "open", "pending", "resolved", "archived"];

router.use(requireAppwriteAdmin);

function parsePagination(req, fallbackLimit = 25) {
  const limit = Math.min(Math.max(Number(req.query.limit) || fallbackLimit, 1), 100);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  return { limit, offset };
}

function textMatches(document, search, fields) {
  if (!search) {
    return true;
  }

  const query = search.toLowerCase();
  return fields.some((field) =>
    String(document[field] || "")
      .toLowerCase()
      .includes(query),
  );
}

function normalizeList(result, search, fields) {
  const documents = search
    ? result.documents.filter((document) => textMatches(document, search, fields))
    : result.documents;

  return {
    documents,
    total: search ? documents.length : result.total,
  };
}

function getStartOfTodayIso() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const [products, pendingOrders, todaysOrders, allOrders, customers, messages, subscribers] =
      await Promise.all([
        listDocuments("products", [Query.limit(100)]),
        listDocuments("orders", [Query.equal("orderStatus", "pending"), Query.limit(1)]),
        listDocuments("orders", [
          Query.greaterThanEqual("createdAt", getStartOfTodayIso()),
          Query.limit(1),
        ]),
        listDocuments("orders", [Query.limit(100)]),
        listDocuments("customers", [Query.limit(1)]),
        listDocuments("messages", [Query.equal("unread", true), Query.limit(1)]),
        listDocuments("subscribers", [Query.limit(1)]),
      ]);

    const lowStockProducts = products.documents.filter(
      (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5,
    );
    const outOfStockProducts = products.documents.filter(
      (product) => Number(product.stock || 0) <= 0,
    );
    const revenue = allOrders.documents.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const recentActivity = allOrders.documents
      .slice(0, 5)
      .map((order) => `${order.orderNumber || "Order"} is ${order.orderStatus || "pending"}`);

    res.json({
      success: true,
      summary: {
        totalProducts: products.total,
        pendingOrders: pendingOrders.total,
        todaysOrders: todaysOrders.total,
        revenue,
        lowStock: lowStockProducts.length,
        outOfStock: outOfStockProducts.length,
        subscribers: subscribers.total,
        customers: customers.total,
        unreadMessages: messages.total,
        recentActivity,
      },
    });
  }),
);

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const search = String(req.query.q || "").trim();
    const [products, orders, customers, messages] = await Promise.all([
      listDocuments("products", [Query.limit(50)]),
      listDocuments("orders", [Query.limit(50)]),
      listDocuments("customers", [Query.limit(50)]),
      listDocuments("messages", [Query.limit(50)]),
    ]);

    res.json({
      success: true,
      results: {
        products: products.documents.filter((item) =>
          textMatches(item, search, ["name", "category", "subcategory"]),
        ),
        orders: orders.documents.filter((item) =>
          textMatches(item, search, ["orderNumber", "customerName", "email", "orderStatus"]),
        ),
        customers: customers.documents.filter((item) =>
          textMatches(item, search, ["name", "phone", "email", "status"]),
        ),
        messages: messages.documents.filter((item) =>
          textMatches(item, search, ["name", "email", "subject", "body", "status"]),
        ),
      },
    });
  }),
);

router.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const { limit, offset } = parsePagination(req);
    const queries = [Query.orderDesc("createdAt"), Query.limit(limit), Query.offset(offset)];

    if (req.query.status && req.query.status !== "all") {
      queries.push(Query.equal("orderStatus", req.query.status));
    }

    const result = await listDocuments("orders", queries);
    const normalized = normalizeList(result, req.query.search, [
      "orderNumber",
      "customerName",
      "phone",
      "email",
      "orderStatus",
      "paymentStatus",
    ]);

    res.json({ success: true, orders: normalized.documents, total: normalized.total });
  }),
);

router.get(
  "/orders/:id",
  asyncHandler(async (req, res) => {
    const order = await getDocument("orders", req.params.id);
    res.json({ success: true, order });
  }),
);

router.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;

    if (!orderStatuses.includes(status)) {
      res.status(400);
      throw new Error("Invalid order status.");
    }

    const existing = await getDocument("orders", req.params.id);
    const history = JSON.parse(existing.statusHistory || "[]");
    history.push({ status, note: note || "", createdAt: new Date().toISOString() });

    const order = await updateDocument("orders", req.params.id, {
      orderStatus: status,
      statusHistory: JSON.stringify(history),
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, order });
  }),
);

router.patch(
  "/orders/:id/notes",
  asyncHandler(async (req, res) => {
    const order = await updateDocument("orders", req.params.id, {
      notes: req.body.notes || "",
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, order });
  }),
);

router.get(
  "/inventory",
  asyncHandler(async (req, res) => {
    const { limit, offset } = parsePagination(req);
    const result = await listDocuments("products", [
      Query.orderDesc("updatedAt"),
      Query.limit(limit),
      Query.offset(offset),
    ]);
    const normalized = normalizeList(result, req.query.search, [
      "name",
      "category",
      "subcategory",
      "slug",
    ]);

    res.json({ success: true, products: normalized.documents, total: normalized.total });
  }),
);

router.patch(
  "/inventory/:id",
  asyncHandler(async (req, res) => {
    const product = await updateDocument("products", req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, product });
  }),
);

router.get(
  "/customers",
  asyncHandler(async (req, res) => {
    const { limit, offset } = parsePagination(req);
    const queries = [Query.orderDesc("dateJoined"), Query.limit(limit), Query.offset(offset)];

    if (req.query.status && req.query.status !== "all") {
      queries.push(Query.equal("status", req.query.status));
    }

    const result = await listDocuments("customers", queries);
    const normalized = normalizeList(result, req.query.search, [
      "name",
      "phone",
      "email",
      "status",
    ]);

    res.json({ success: true, customers: normalized.documents, total: normalized.total });
  }),
);

router.get(
  "/customers/:id",
  asyncHandler(async (req, res) => {
    const customer = await getDocument("customers", req.params.id);
    const orders = await listDocuments("orders", [
      Query.equal("email", customer.email),
      Query.orderDesc("createdAt"),
      Query.limit(20),
    ]);

    res.json({ success: true, customer, orders: orders.documents });
  }),
);

router.get(
  "/messages",
  asyncHandler(async (req, res) => {
    const { limit, offset } = parsePagination(req);
    const queries = [Query.orderDesc("updatedAt"), Query.limit(limit), Query.offset(offset)];

    if (req.query.status && req.query.status !== "all") {
      queries.push(Query.equal("status", req.query.status));
    }

    const result = await listDocuments("messages", queries);
    const normalized = normalizeList(result, req.query.search, [
      "name",
      "email",
      "subject",
      "body",
      "status",
    ]);

    res.json({ success: true, messages: normalized.documents, total: normalized.total });
  }),
);

router.patch(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    const updates = { ...req.body, updatedAt: new Date().toISOString() };

    if (updates.status && !messageStatuses.includes(updates.status)) {
      res.status(400);
      throw new Error("Invalid message status.");
    }

    const message = await updateDocument("messages", req.params.id, updates);
    res.json({ success: true, message });
  }),
);

router.post(
  "/messages/:id/replies",
  asyncHandler(async (req, res) => {
    const existing = await getDocument("messages", req.params.id);
    const replies = JSON.parse(existing.replies || "[]");
    replies.push({
      body: req.body.body,
      author: req.appwriteUser.email,
      createdAt: new Date().toISOString(),
    });

    const message = await updateDocument("messages", req.params.id, {
      replies: JSON.stringify(replies),
      status: existing.status === "new" ? "open" : existing.status,
      unread: false,
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message });
  }),
);

router.delete(
  "/messages/:id",
  asyncHandler(async (req, res) => {
    await deleteDocument("messages", req.params.id);
    res.json({ success: true });
  }),
);

router.post(
  "/messages",
  asyncHandler(async (req, res) => {
    const now = new Date().toISOString();
    const message = await createDocument("messages", ID.unique(), {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || "",
      subject: req.body.subject,
      body: req.body.body,
      status: "new",
      internalNotes: "",
      replies: JSON.stringify([]),
      unread: true,
      createdAt: now,
      updatedAt: now,
    });

    res.status(201).json({ success: true, message });
  }),
);

export default router;
