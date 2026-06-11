import { Request, Response } from "express";
import { Product } from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Error creating product", error });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: "i" };

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stock } = req.body; // Array of { size, quantity }
  try {
    const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Update failed" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed" });
  }
};