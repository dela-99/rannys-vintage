import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { formatWhatsAppOrderMessage, toWhatsAppUrl } from "../utils/whatsappMessage.js";

async function buildOrderItems(items) {
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findOne({ _id: item.product, isVisible: true });

    if (!product) {
      throw new Error(`Product unavailable: ${item.product}`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} has only ${product.stock} item(s) in stock`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.optimizedUrl || product.images[0]?.url,
      quantity: Number(item.quantity),
      size: item.size,
      color: item.color,
      price: product.discountPrice || product.price,
    });
  }

  return orderItems;
}

export const createOrder = asyncHandler(async (req, res) => {
  const { customer, products, paymentMethod, shippingFee = 0 } = req.body;

  if (!customer || !Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error("Customer details and products are required");
  }

  const orderItems = await buildOrderItems(products);
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + Number(shippingFee);

  const orderPayload = {
    customer,
    products: orderItems,
    subtotal,
    shippingFee: Number(shippingFee),
    total,
    paymentMethod,
  };

  const whatsAppMessage = formatWhatsAppOrderMessage(orderPayload);
  const order = await Order.create({
    ...orderPayload,
    whatsAppMessage,
    whatsAppUrl: toWhatsAppUrl(whatsAppMessage),
  });

  res.status(201).json({ success: true, order });
});

export const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  const query = req.query.status ? { status: req.query.status } : {};

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate("products.product", "name slug images")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Order.countDocuments(query),
  ]);

  res.json({
    success: true,
    orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("products.product");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({ success: true, order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const wasPending = order.status === "pending";

  if (wasPending && status === "confirmed") {
    for (const item of order.products) {
      const result = await Product.updateOne(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );

      if (result.modifiedCount === 0) {
        res.status(409);
        throw new Error(`Insufficient stock to confirm ${item.name}`);
      }
    }
  }

  order.status = status;
  await order.save();

  res.json({ success: true, order });
});
