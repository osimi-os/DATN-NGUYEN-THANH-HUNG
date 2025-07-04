import express from "express";
import {
  createNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  deleteNotification,
  updateNotification,
  upload,
} from "../controllers/notificationController.js";

const router = express.Router();

// Tạo thông báo mới (có upload ảnh)
router.post("/create", upload.single("coverImage"), createNotification);
// Sửa thông báo (có upload ảnh)
router.put("/update/:id", upload.single("coverImage"), updateNotification);
// Lấy tất cả thông báo (admin)
router.get("/all", getAllNotifications);
// Lấy thông báo cho user
router.get("/user", getUserNotifications);
// Đánh dấu đã đọc
router.post("/read", markAsRead);
// Xóa thông báo
router.delete("/:id", deleteNotification);

export default router;
