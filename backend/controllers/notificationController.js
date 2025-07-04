import notificationModel from "../models/notificationModel.js";
import multer from "multer";
import path from "path";

// Cấu hình multer cho upload ảnh bìa
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "_notification" + ext);
  },
});
export const upload = multer({ storage });

// Tạo thông báo mới
export const createNotification = async (req, res) => {
  try {
    const { title, content, type, target } = req.body;
    let coverImage = req.file ? req.file.filename : undefined;
    const notification = await notificationModel.create({
      title,
      content,
      type,
      target,
      coverImage,
    });
    res.json({ success: true, data: notification });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating notification", error });
  }
};

// Sửa thông báo
export const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, target } = req.body;
    let updateData = { title, content, type, target };
    if (req.file) updateData.coverImage = req.file.filename;
    const notification = await notificationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    res.json({ success: true, data: notification });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating notification", error });
  }
};

// Lấy tất cả thông báo (admin)
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel
      .find()
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching notifications", error });
  }
};

// Lấy thông báo cho user (theo userId hoặc all)
export const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.query;
    const notifications = await notificationModel
      .find({
        $or: [{ target: "all" }, { target: userId }],
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user notifications",
      error,
    });
  }
};

// Đánh dấu đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { notificationId, userId } = req.body;
    await notificationModel.findByIdAndUpdate(notificationId, {
      $addToSet: { readBy: userId },
    });
    res.json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error marking as read", error });
  }
};

// Xóa thông báo (admin)
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting notification", error });
  }
};
