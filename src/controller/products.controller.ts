import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import pool from "../database/db";
import "dotenv/config";
import {
  addProductQueries,
  DeleteProductQuery,
  getOneProductByNameQuery,
  getOneProductQuery,
  getProductsBySellerQuery,
  getProductsQuery,
  updateProductQuery,
} from "../queries/products.queries";
import { AuthorizedRequest } from "../interface/auth.interface";
import { v4 as uuidv4 } from "uuid";

import { userByIdQuery } from "../queries/user.queries";

export const addProduct = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
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

    const owner_id = req.user.user_id;

    for (let product of products) {
      const { name, description, price, quantity, category } = product;
      if (!name || !description || !price || !quantity || !category) {
        res.status(400).json({ message: "All fields required" });
        return;
      }
      const existingProduct = await pool.query(getOneProductByNameQuery, [
        name,
      ]);

      if (
        existingProduct.rowCount &&
        owner_id === existingProduct.rows[0].owner_id
      ) {
        res.status(409).json({
          Message: `${existingProduct.rows[0].name} already exist.`,
        });
        return;
      }
      const productId = uuidv4();
      const created_at = new Date();

      const updated_at = new Date();
      const newProduct = await pool.query(addProductQueries, [
        productId,
        name,
        description,
        price,
        quantity,
        category,
        owner_id,
        created_at,
        updated_at,
      ]);
    }

    res.status(201).json(products);
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    let err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
    return;
  }
};
export const getProducts = async (req: Request, res: Response) => {
  try {
    await pool.query("BEGIN");
    const products = await pool.query(getProductsQuery);
    res.status(200).json(products.rows);
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    await pool.query("BEGIN");
    const { id } = req.params;

    const product = await pool.query(getOneProductQuery, [id]);
    if (!product.rows[0]) {
      res.status(404).json({ message: "product not found" });
      return;
    }
    await pool.query("COMMIT");
    res.status(200).json(product.rows);
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export const UpdateProduct = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
    const { id } = req.params;

    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.user_id;
    const { name, description, price, quantity, category } = req.body;
    if (!name && !description && !price && !quantity && !category) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const product = await pool.query(getOneProductQuery, [id]);
    if (product.rowCount === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    const created_at = product.rows[0].created_at;

    const updated_at = new Date();

    if (product.rows[0].owner_id !== userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updatedProduct = await pool.query(updateProductQuery, [
      name,
      description,
      price,
      quantity,
      userId,

      category,
      created_at,
      updated_at,
      id,
    ]);
    await pool.query("COMMIT");
    res.status(200).json(updatedProduct.rows[0]);
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
    return;
  }
};

export const deleteProduct = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
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

    if (product.rows[0].owner_id !== req.user.user_id) {
      res.status(401).json({ message: "Unathorized" });
      return;
    }
    await pool.query(DeleteProductQuery, [id]);
    await pool.query("COMMIT");
    res.status(200).json("Product deleted successfully");
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};
