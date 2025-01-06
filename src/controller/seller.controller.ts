import { Request, Response } from "express";
import { AuthorizedRequest } from "../interface/auth.interface";
import pool from "../database/db";
import { getProductsBySellerQuery } from "../queries/products.queries";

export const getProductsBySeller = async (
  req: AuthorizedRequest,
  res: Response
) => {
  try {
    await pool.query("BEGIN");
    if (!req.user) {
      res.status(404).json({ message: "User  not found" });
      return;
    }
    const userId = req.user.user_id;
    const yourProducts = await pool.query(getProductsBySellerQuery, [userId]);
    if (yourProducts.rowCount === 0) {
      res.status(200).json({ message: "No product yet" });
      return;
    }
    await pool.query("COMMIT");
    res.status(200).json(yourProducts.rows);
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal Server error :${err.message}` });
    return;
  }
};
