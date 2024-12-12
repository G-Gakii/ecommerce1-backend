import { Router } from "express";
import {
  addToCart,
  checkOut,
  DeleteItemFromCart,
  getCartItem,
  UpdateCartItem,
} from "../controller/cart.controller";
import autheticateUser from "../middleware/autheticate.middleware";

const router = Router();

router.post("/cart", autheticateUser, addToCart);
router.get("/cart", autheticateUser, getCartItem);
router.put("/cart/:id", autheticateUser, UpdateCartItem);
router.delete("/cart/:id", autheticateUser, DeleteItemFromCart);
router.post("/cart/checkout", autheticateUser, checkOut);

export default router;
