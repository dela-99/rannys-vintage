export function buildProductQuery(queryParams) {
  const {
    keyword,
    category,
    subcategory,
    minPrice,
    maxPrice,
    color,
    size,
    tag,
    isFeatured,
    isTrending,
    isVisible,
  } = queryParams;

  const query = {};

  if (keyword) {
    query.$text = { $search: keyword };
  }

  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (color) query.colors = color;
  if (size) query.sizes = size;
  if (tag) query.tags = tag;
  if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
  if (isTrending !== undefined) query.isTrending = isTrending === "true";
  if (isVisible !== undefined) query.isVisible = isVisible === "true";

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  return query;
}

export function buildSort(sort) {
  const sortMap = {
    newest: "-createdAt",
    oldest: "createdAt",
    "price-low": "price",
    "price-high": "-price",
    trending: "-isTrending -createdAt",
    featured: "-isFeatured -createdAt",
  };

  return sortMap[sort] || "-createdAt";
}

export function getPagination(queryParams) {
  const page = Math.max(Number(queryParams.page) || 1, 1);
  const limit = Math.min(Math.max(Number(queryParams.limit) || 12, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}
