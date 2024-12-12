import { Request, Response } from "express";
import pool from "../database/db";
import { getOneProductQuery } from "../queries/products.queries";
import { AuthorizedRequest } from "../interface/auth.interface";
import {
  addToCartQuery,
  cartItemsQuery,
  deleteCartItemQuery,
  deleteUserItemsQuery,
  getCartItemById,
  getItemInCartquery,
  updateCartItem,
  UpdateQuantityQuery,
} from "../queries/cart.queries";

export const addToCart = async (req: AuthorizedRequest, res: Response) => {
  try {
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.id;
    const product = await pool.query(getOneProductQuery, [product_id]);
    if (product.rowCount === 0 || product.rows[0].quantity < quantity) {
      res.status(400).json({ message: "Insufficient product quantity" });
      return;
    }
    const cartItem = await pool.query(addToCartQuery, [
      userId,
      product_id,
      quantity,
    ]);
    res.status(201).json(cartItem.rows[0]);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const getCartItem = async (req: AuthorizedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.id;

    const items = await pool.query(getItemInCartquery, [userId]);
    if (items.rowCount === 0) {
      res.status(200).json({ message: "No item found" });
      return;
    }
    res.status(200).json(items.rows);
    return;
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const UpdateCartItem = async (req: AuthorizedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    const product = await pool.query(getOneProductQuery, [product_id]);
    if (!product.rowCount || product.rows[0].quantity < quantity) {
      res.status(400).json({ message: "Insufficient product quantity" });
      return;
    }

    const cartItem = await pool.query(getCartItemById, [id]);
    if (!cartItem.rowCount) {
      res.status(404).json({ message: "Cart item not found" });
      return;
    }
    if (cartItem.rows[0].user_id !== userId) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this item" });
      return;
    }
    const updatedItem = await pool.query(updateCartItem, [
      userId,
      product_id,
      quantity,
      id,
    ]);
    res.status(200).json(updatedItem.rows[0]);
    return;
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const DeleteItemFromCart = async (
  req: AuthorizedRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const cartItemToDelete = await pool.query(getCartItemById, [id]);
    if (!cartItemToDelete.rowCount) {
      res.status(404).json({ message: "item not found" });
      return;
    }
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.id;

    if (userId !== cartItemToDelete.rows[0].user_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to update this item" });
      return;
    }
    await pool.query(deleteCartItemQuery, [id]);
    res.status(200).json({ message: "item deleted successfuly" });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const checkOut = async (req: AuthorizedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    const userId = req.user.id;
    const cartItemsResult = await pool.query(getItemInCartquery, [userId]);
    if (cartItemsResult.rowCount === 0) {
      res.status(200).json({ message: "cart is empty" });
      return;
    }
    const cartItems = cartItemsResult.rows;
    const checkedOutProducts = [];
    for (let item of cartItems) {
      if (!item.product_id) {
        res.status(400).json({ message: "Product ID missing in cart item" });
        return;
      }
      const productItem = await pool.query(cartItemsQuery, [item.product_id]);
      if (productItem.rowCount === 0) {
        res.status(404).json({ message: "product not found" });
        return;
      }
      const product = await productItem.rows[0];
      if (product.quantity < item.quantity) {
        res
          .status(400)
          .json({ message: `Insufficient quantity of ${item.name}` });
        return;
      }
      checkedOutProducts.push({
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        descrption: product.description,
      });
      await pool.query(UpdateQuantityQuery, [item.quantity, item.product_id]);
    }
    await pool.query(deleteUserItemsQuery, [userId]);
    res.status(200).json(checkedOutProducts);
    return;
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};
