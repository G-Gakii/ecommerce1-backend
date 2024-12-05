import express, { Request, Response } from "express";
import "dotenv/config";
import userRouter from "./router/users.router";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use("/api/ecommerce", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to ecommerce");
});

app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
