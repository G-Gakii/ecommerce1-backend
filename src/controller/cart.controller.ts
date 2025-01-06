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
  getProductByID,
  updateCartItem,
  UpdateQuantityQuery,
} from "../queries/cart.queries";
import { v4 as uuidv4 } from "uuid";
import { addOrdersQuery } from "../queries/order.queries";

export const addToCart = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
    const { product_id, quantity } = req.body;
    if (!product_id || !quantity) {
      res.status(400).json({ message: "All fields required" });
      return;
    }
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const buyer_id = req.user.user_id;
    const existingProduct = await pool.query(getProductByID, [product_id]);
    if (
      existingProduct.rowCount &&
      buyer_id === existingProduct.rows[0].buyer_id
    ) {
      res.status(409).json({
        message: "Product already exist in cart.Do you want to edit?",
      });
      return;
    }

    const cart_id = uuidv4();
    const created_at = new Date();
    const updated_at = new Date();
    const product = await pool.query(getOneProductQuery, [product_id]);
    if (product.rowCount === 0 || product.rows[0].quantity < quantity) {
      res.status(400).json({ message: "Insufficient product quantity" });
      return;
    }
    const cartItem = await pool.query(addToCartQuery, [
      cart_id,
      buyer_id,
      product_id,
      quantity,
      created_at,
      updated_at,
    ]);
    await pool.query("COMMIT");
    res.status(201).json(cartItem.rows[0]);
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const getCartItem = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.user_id;

    const items = await pool.query(getItemInCartquery, [userId]);
    if (items.rowCount === 0) {
      res.status(200).json({ message: "No item found" });
      return;
    }
    await pool.query("COMMIT");
    res.status(200).json(items.rows);
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const UpdateCartItem = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
    const { id } = req.params;
    const cart_id = id;
    if (!req.user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const userId = req.user.user_id;
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
    if (cartItem.rows[0].buyer_id !== userId) {
      res.status(401).json({ message: `Only owner can update the item` });
      return;
    }
    const updated_at = new Date();
    const updatedItem = await pool.query(updateCartItem, [
      userId,
      product_id,
      quantity,
      updated_at,
      cart_id,
    ]);
    await pool.query("COMMIT");
    res.status(200).json(updatedItem.rows[0]);
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
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
    await pool.query("BEGIN");
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
    const userId = req.user.user_id;

    if (userId !== cartItemToDelete.rows[0].buyer_id) {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this item" });
      return;
    }
    await pool.query(deleteCartItemQuery, [id]);
    await pool.query("COMMIT");
    res.status(200).json({ message: "item deleted successfuly" });
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error${err.message}` });
    return;
  }
};

export const checkOut = async (req: AuthorizedRequest, res: Response) => {
  try {
    await pool.query("BEGIN");
    if (!req.user) {
      res.status(404).json({ message: "user not found" });
      return;
    }
    const userId = req.user.user_id;
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
        product_id: product.product_id,
        owner_id: product.owner_id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        description: product.description,
        category: product.category,
        created_at: product.created_at,
        updated_at: product.updated_at,
      });
      await pool.query(UpdateQuantityQuery, [item.quantity, item.product_id]);
    }

    for (let checkoutItem of checkedOutProducts) {
      const orderId = uuidv4();
      const created_at = new Date();
      const updated_at = new Date();
      await pool.query(addOrdersQuery, [
        orderId,
        checkoutItem.product_id,
        userId,
        checkoutItem.quantity,
        checkoutItem.price,
        checkoutItem.description,
        checkoutItem.category,
        created_at,
        updated_at,
        checkoutItem.owner_id,
      ]);
    }
    await pool.query(deleteUserItemsQuery, [userId]);
    await pool.query("COMMIT");
    res.status(200).json(checkedOutProducts);
    return;
  } catch (error) {
    await pool.query("ROLLBACK");
    const err = error as Error;
    res.status(500).json({ message: `Internal server error:${err.message}` });
    return;
  }
};
