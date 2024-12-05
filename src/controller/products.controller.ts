import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import pool from "../database/db";
import {
  addProductQueries,
  DeleteProductQuery,
  getOneProductQuery,
  getProductsQuery,
  updateProductQuery,
} from "../queries/products.queries";

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name && !description && !price && !quantity) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "unathorized" });
      return;
    }
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    let userId;
    let decode: JwtPayload | string;
    decode = jwt.verify(token, process.env.SECRET_TOKEN as string);
    if (typeof decode === "object" && decode !== null && "id" in decode) {
      userId = decode.id;
    }
    const newProduct = await pool.query(addProductQueries, [
      name,
      description,
      price,
      quantity,
      userId,
    ]);
    res.status(201).json(newProduct.rows[0]);
    return;
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
    res.status(200).json(product.rows);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export const UpdateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;
    if (!name && !description && !price && !quantity) {
      res.status(400).json({ message: "All fields required" });
      return;
    }

    const updatedProduct = await pool.query(updateProductQuery, [
      name.description,
      price,
      quantity,
      id,
    ]);
    res.status(200).json(updatedProduct.rows);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await pool.query(DeleteProductQuery, [id]);
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error ${err.message}` });
  }
};
