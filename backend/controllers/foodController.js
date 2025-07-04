// Controllers food nhận yêu cầu HTTP từ routes food để xử lý các logic liên quan đến food
import foodModel from "../models/foodModel.js";
import fs from "fs";
import fetch from "node-fetch";
import orderModel from "../models/orderModel.js";

// Thêm food
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// danh sách tất cả food - Tối ưu với pagination và select fields
const listFood = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const category = req.query.category || "";
    const search = req.query.search || "";

    // Tạo query filter
    let filter = {};
    if (category && category !== "All") {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    // Chỉ select các fields cần thiết để giảm kích thước response
    const foods = await foodModel
      .find(filter)
      .select("name description price category image ratings")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean(); // Sử dụng lean() để tăng tốc độ

    // Đếm tổng số records cho pagination
    const total = await foodModel.countDocuments(filter);

    res.json({
      success: true,
      data: foods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// API riêng cho admin - lấy tất cả dữ liệu
const listAllFood = async (req, res) => {
  try {
    const foods = await foodModel
      .find({})
      .select("name description price category image")
      .lean();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// xóa food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// lấy ra sản phẩm bằng id
const getFoodById = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({ success: true, data: food });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};

// thêm đánh giá
const addComment = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    food.ratings.push({
      userId: req.body.userId,
      comment: req.body.comment,
      rating: req.body.rating,
    });

    await food.save();
    res.json({ success: true, message: "Added comment" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Tìm kiếm sản phẩm
const searchFood = async (req, res) => {
  try {
    const search = req.query.search || "";
    const foods = await foodModel.find({
      name: { $regex: search, $options: "i" },
    });
    res.json({ success: true, message: "Searched", data: foods });
  } catch (error) {
    console.error("Error searching for food:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// Lấy ra sản phẩm bằng tên
const getFoodByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name parameter is required",
      });
    }

    const food = await foodModel.findOne({ name: name });

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      message: "Get food by name successful.",
      data: food,
    });
  } catch (error) {
    console.error("Error fetching food by name:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Cập nhật thông tin món ăn
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    };

    // Nếu có ảnh mới thì cập nhật luôn
    if (req.file) {
      const food = await foodModel.findById(id);
      if (food?.image) {
        fs.unlink(`uploads/${food.image}`, () => {});
      }
      updateData.image = req.file.filename;
    }

    await foodModel.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ success: true, message: "Food updated successfully" });
  } catch (error) {
    console.error("Update food error:", error);
    res.status(500).json({ success: false, message: "Error updating food" });
  }
};

// Lấy danh sách categories
const getCategories = async (req, res) => {
  try {
    const categories = await foodModel.distinct("category");
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

// API recommend món ăn
const getRecommendations = async (req, res) => {
  try {
    const { item_name, user_name } = req.query;

    // Lấy thông tin món ăn hiện tại
    const currentFood = await foodModel.findOne({ name: item_name });

    if (!currentFood) {
      return res.json({
        success: true,
        recommendations: [],
        message: "Food not found",
      });
    }

    // Gọi AI model để lấy recommendations
    try {
      const aiResponse = await fetch(
        `http://localhost:8000/recommend/?item_name=${encodeURIComponent(
          item_name
        )}&user_name=${encodeURIComponent(user_name || "anonymous")}`
      );

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();

        if (aiData.recommendations && aiData.recommendations.length > 0) {
          // Lấy thông tin chi tiết của các món ăn được recommend
          const recommendedFoods = await foodModel
            .find({ name: { $in: aiData.recommendations } })
            .select("name price image category description")
            .lean();

          // Sắp xếp theo thứ tự của AI recommendations
          const sortedRecommendations = aiData.recommendations
            .map((itemName) =>
              recommendedFoods.find((food) => food.name === itemName)
            )
            .filter((food) => food); // Loại bỏ những món không tìm thấy

          return res.json({
            success: true,
            recommendations: sortedRecommendations,
            message: "AI recommendations generated successfully",
            algorithm: "AI-Powered Collaborative Filtering",
          });
        }
      }
    } catch (aiError) {
      console.log(
        "AI service not available, falling back to category-based recommendations"
      );
    }

    // Fallback: Tìm các món ăn cùng category và dựa trên hành vi mua hàng
    let recommendations = await foodModel
      .find({
        category: currentFood.category,
        _id: { $ne: currentFood._id },
      })
      .limit(6)
      .select("name price image category description")
      .lean();

    // Nếu user đã đăng nhập, thêm logic dựa trên hành vi mua hàng
    if (user_name && user_name !== "anonymous") {
      try {
        // Lấy lịch sử đơn hàng của user
        const userOrders = await orderModel
          .find({
            userId: user_name,
            status: { $in: ["completed", "delivered"] },
          })
          .populate("items.foodId");

        if (userOrders.length > 0) {
          // Phân tích hành vi mua hàng
          const userPreferences = {};

          userOrders.forEach((order) => {
            order.items.forEach((item) => {
              const category = item.foodId.category;
              userPreferences[category] =
                (userPreferences[category] || 0) + item.quantity;
            });
          });

          // Sắp xếp categories theo tần suất mua
          const sortedCategories = Object.entries(userPreferences)
            .sort(([, a], [, b]) => b - a)
            .map(([category]) => category);

          // Lấy thêm recommendations từ categories ưa thích
          for (const category of sortedCategories.slice(0, 2)) {
            if (recommendations.length >= 10) break;

            const categoryFoods = await foodModel
              .find({
                category: category,
                _id: { $ne: currentFood._id },
                name: { $nin: recommendations.map((r) => r.name) },
              })
              .limit(5)
              .select("name price image category description")
              .lean();

            recommendations.push(...categoryFoods);
          }
        }
      } catch (orderError) {
        console.log("Error fetching user orders:", orderError);
      }
    }

    // Nếu vẫn chưa đủ, lấy thêm món khác
    if (recommendations.length < 6) {
      const additionalFoods = await foodModel
        .find({
          _id: { $ne: currentFood._id },
          category: { $ne: currentFood.category },
          name: { $nin: recommendations.map((r) => r.name) },
        })
        .limit(6 - recommendations.length)
        .select("name price image category description")
        .lean();

      recommendations.push(...additionalFoods);
    }

    // Giới hạn kết quả
    recommendations = recommendations.slice(0, 10);

    res.json({
      success: true,
      recommendations: recommendations,
      message: "Recommendations generated successfully",
      algorithm: "Category-based with User Behavior Analysis",
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Error generating recommendations",
      recommendations: [],
    });
  }
};

export {
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
};
