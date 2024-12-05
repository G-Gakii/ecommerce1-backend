import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getOneProduct,
  getProducts,
  UpdateProduct,
} from "../controller/products.controller";

const router = Router();

router.get("/product", getProducts);
router.get("/product/:id", getOneProduct);
router.post("/product", addProduct);
router.put("/product/:id", UpdateProduct);
router.delete("/product/:id", deleteProduct);
export default router;
