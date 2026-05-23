export function formatWhatsAppOrderMessage(order) {
  const products = order.products
    .map((item, index) => {
      const size = item.size ? ` | Size: ${item.size}` : "";
      const color = item.color ? ` | Color: ${item.color}` : "";
      return `${index + 1}. ${item.name}${size}${color} | Qty: ${item.quantity} | GHS ${item.price}`;
    })
    .join("\n");

  return [
    "New Ranny's Vintage Clothing Order",
    "",
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `City: ${order.customer.city}`,
    `Address: ${order.customer.address}`,
    order.customer.deliveryNotes ? `Notes: ${order.customer.deliveryNotes}` : null,
    "",
    "Products:",
    products,
    "",
    `Subtotal: GHS ${order.subtotal}`,
    `Shipping: GHS ${order.shippingFee}`,
    `Total: GHS ${order.total}`,
    `Payment: ${order.paymentMethod}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function toWhatsAppUrl(message, phoneNumber = process.env.WHATSAPP_BUSINESS_NUMBER) {
  const normalized = String(phoneNumber || "").replace(/[^\d]/g, "");
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
