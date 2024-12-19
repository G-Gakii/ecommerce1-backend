import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  UpdateProduct,
} from "../controller/products.controller";
import autheticateUser from "../middleware/autheticate.middleware";
import authorizedRole from "../middleware/authorization.middle";

const router = Router();

router.get("/product", getProducts);
router.get("/product/:id", autheticateUser, getOneProduct);

router.post("/product", autheticateUser, authorizedRole(["shop"]), addProduct);
router.put(
  "/product/:id",
  autheticateUser,
  authorizedRole(["shop"]),
  UpdateProduct
);
router.delete(
  "/product/:id",
  autheticateUser,
  authorizedRole(["shop"]),
  deleteProduct
);
export default router;
