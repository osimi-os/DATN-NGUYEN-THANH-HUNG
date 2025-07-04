// Định nghĩa các routes cho order
import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  updateRated,
  getReportData,
  addOrderItemRating,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.put("/:orderId", updateRated);
orderRouter.get("/report", getReportData);
orderRouter.post("/:orderId/rate/:itemId", authMiddleware, addOrderItemRating);

// Test route
orderRouter.get("/test", (req, res) => {
  res.json({ success: true, message: "Order API is working" });
});

export default orderRouter;
