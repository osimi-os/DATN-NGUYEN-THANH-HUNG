// Định nghĩa cấu trúc bảng food trong cơ sở dữ liệu
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    ratings: [
      {
        userId: { type: String, required: true },
        name: { type: String, required: false },
        comment: { type: String, required: true },
        rating: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Thêm indexes để tối ưu performance
foodSchema.index({ name: 1 }); // Index cho tìm kiếm theo tên
foodSchema.index({ category: 1 }); // Index cho filter theo category
foodSchema.index({ name: "text" }); // Text index cho full-text search
foodSchema.index({ createdAt: -1 }); // Index cho sắp xếp theo thời gian

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
