// Định nghĩa các routes cho food
import express from "express";
import multer from "multer";
import {
  addFood,
  listFood,
  listAllFood,
  removeFood,
  getFoodById,
  addComment,
  searchFood,
  getFoodByName,
  updateFood,
  getCategories,
  getRecommendations,
} from "../controllers/foodController.js";

const router = express.Router();

// Cấu hình multer để upload file
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// API endpoints - Sắp xếp theo thứ tự ưu tiên
router.get("/categories", getCategories); // API lấy categories
router.get("/recommend", getRecommendations); // API recommend
router.get("/search", searchFood);
router.get("/name", getFoodByName);
router.get("/list", listFood); // API tối ưu cho frontend
router.get("/list-all", listAllFood); // API cho admin
router.post("/add", upload.single("image"), addFood);
router.post("/remove", removeFood);
router.put("/update/:id", upload.single("image"), updateFood);
router.get("/:id", getFoodById);
router.post("/:id/comment", addComment);

export default router;
