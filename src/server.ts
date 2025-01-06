import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./router/users.router";
import productRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import sellerRouter from "./router/seller.router";
import orderRouter from "./router/order.router";

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/ecommerce", userRouter);
app.use("/api/ecommerce", productRouter);
app.use("/api/ecommerce", cartRouter);
app.use("/api/ecommerce", sellerRouter);
app.use("/api/ecommerce", orderRouter);

app.get("/api/ecommerce", (req: Request, res: Response) => {
  res.send("welcome to ecommerce");
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
