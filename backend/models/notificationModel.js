import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["promo", "new_product", "system", "custom"],
    default: "custom",
  },
  createdAt: { type: Date, default: Date.now },
  target: { type: String, default: "all" }, // "all" hoặc userId cụ thể
  readBy: [{ type: String }], // userId đã đọc
  coverImage: { type: String }, // link ảnh bìa
});

const notificationModel =
  mongoose.models.notification ||
  mongoose.model("notification", notificationSchema);

export default notificationModel;
