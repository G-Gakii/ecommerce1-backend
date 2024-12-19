import pool from "../database/db";
import { AuthorizedRequest } from "../interface/auth.interface";
import { Response } from "express";
import {
  deleteOrderQuery,
  getOrderItemById,
  getOrderQuery,
} from "../queries/order.queries";
import { read } from "fs";

export const getOrderByShop = async (req: AuthorizedRequest, res: Response) => {
  if (!req.user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const userId = req.user.user_id;

  const orderItems = await pool.query(getOrderQuery, [userId]);

  if (orderItems.rowCount === 0) {
    res.status(200).json({ message: "No order yet" });
    return;
  }
  res.status(200).json(orderItems.rows);
  return;
};

export const deleteOrder = async (req: AuthorizedRequest, res: Response) => {
  const { id } = req.params;
  if (!req.user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const userId = req.user.user_id;

  const orderItem = await pool.query(getOrderItemById, [id]);
  if (orderItem.rowCount === 0) {
    res.status(404).json({ message: "Item not found" });
    return;
  }

  if (orderItem.rows[0].owner_id !== userId) {
    res.status(401).json({ message: "Unathorized" });
    return;
  }
  await pool.query(deleteOrderQuery, [id]);
  res.status(200).json({ message: "Product deleted Successfully" });
};
