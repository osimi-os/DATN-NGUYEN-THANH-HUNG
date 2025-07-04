// Tạo server, gọi hàm kết nối đến cơ sở dữ liệu và định nghĩa các endpoint API
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// kết nối đến database
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/notification", notificationRouter);
app.use("/recommend", foodRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
