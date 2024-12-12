import express, { Request, Response } from "express";
import "dotenv/config";
import userRouter from "./router/users.router";
import productRouter from "./router/products.router";
import cartRouter from "./router/cart.router";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/ecommerce", userRouter);
app.use("/api/ecommerce", productRouter);
app.use("/api/ecommerce", cartRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to ecommerce");
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
