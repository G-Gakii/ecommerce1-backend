import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import pool from "../database/db";
import "dotenv/config";
import {
  addProductQueries,
  DeleteProductQuery,
  getOneProductQuery,
  getProductsQuery,
  updateProductQuery,
} from "../queries/products.queries";
import { AuthorizedRequest } from "../interface/auth.interface";
import { log } from "console";

export const addProduct = async (req: AuthorizedRequest, res: Response) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      res
        .status(400)
        .json({ message: "request body must be an array of products" });
      return;
    }
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.id;

    for (let product of products) {
      const { name, description, price, quantity } = product;
      if (!name || !description || !price || !quantity) {
        res.status(400).json({ message: "All fields required" });
        return;
      }
      const newProduct = await pool.query(addProductQueries, [
        name,
        description,
        price,
        quantity,
        userId,
      ]);
    }

    res.status(201).json(products);
  } catch (error) {
    let err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
    return;
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await pool.query(getProductsQuery);
    res.status(200).json(products.rows);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await pool.query(getOneProductQuery, [id]);
    if (!product.rows[0]) {
      res.status(404).json({ message: "product not found" });
      return;
    }
    res.status(200).json(product.rows);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export const UpdateProduct = async (req: AuthorizedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.id;
    const { name, description, price, quantity } = req.body;
    if (!name && !description && !price && !quantity) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const product = await pool.query(getOneProductQuery, [id]);
    if (product.rowCount === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.rows[0].user_id !== req.user.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedProduct = await pool.query(updateProductQuery, [
      name,
      description,
      price,
      quantity,
      userId,
    ]);
    res.status(200).json(updatedProduct.rows[0]);
    return;
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
    return;
  }
};

export const deleteProduct = async (req: AuthorizedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const product = await pool.query(getOneProductQuery, [id]);
    if (product.rowCount === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    

    if (product.rows[0].user_id !== req.user.id) {
      res.status(401).json({ message: "Unathorized" });
      return;
    }
    await pool.query(DeleteProductQuery, [id]);
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};
