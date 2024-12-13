import { Router } from "express";
import {
  addToCart,
  checkOut,
  DeleteItemFromCart,
  getCartItem,
  UpdateCartItem,
} from "../controller/cart.controller";
import autheticateUser from "../middleware/autheticate.middleware";
import authorizedRole from "../middleware/authorization.middle";

const router = Router();

router.post("/cart", autheticateUser, authorizedRole(["buyer"]), addToCart);
router.get("/cart", autheticateUser, authorizedRole(["buyer"]), getCartItem);
router.put(
  "/cart/:id",
  autheticateUser,
  authorizedRole(["buyer"]),
  UpdateCartItem
);
router.delete(
  "/cart/:id",
  autheticateUser,
  authorizedRole(["buyer"]),
  DeleteItemFromCart
);
router.post(
  "/cart/checkout",
  autheticateUser,
  authorizedRole(["buyer"]),
  checkOut
);

export default router;
