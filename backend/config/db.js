// Kết nối với cơ sở dữ liệu
import mongoose from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://22022638:bakeryweb@cluster0.zcdqe8x.mongodb.net/food-del').then(() => console.log("DB connected"));
}

