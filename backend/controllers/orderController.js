// Controllers order nhận các yêu cầu HTTP từ routes order để xử lý các logic liên quan đến order
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 0.0039),
      },
      quantity: item.Quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: Math.round(20000 * 0.0039),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndUpdate(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// api for updating order rated
const updateRated = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findByIdAndUpdate(orderId, { rated: true });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.json({
      success: true,
      message: "Order rated status updated successfully",
    });
  } catch (error) {
    console.error("Error updating rated status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// api for getting report data
const getReportData = async (req, res) => {
  try {
    console.log("getReportData called");
    const { timeFilter = "6" } = req.query;
    console.log("timeFilter:", timeFilter);

    const orders = await orderModel.find({});
    console.log("Orders found:", orders.length);

    const users = await userModel.find({});
    console.log("Users found:", users.length);

    // Lọc đơn hàng theo thời gian
    let filteredOrders = orders;
    if (timeFilter !== "all") {
      const months = parseInt(timeFilter);
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - months);
      filteredOrders = orders.filter(
        (order) => new Date(order.date) >= cutoffDate
      );
    }
    console.log("Filtered orders:", filteredOrders.length);

    // Tính tổng doanh thu
    const totalRevenue = filteredOrders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    // Tính số đơn hàng
    const totalOrders = filteredOrders.length;

    // Tính số khách hàng
    const totalCustomers = users.length;

    // Tính doanh thu theo tháng (6 tháng gần nhất)
    const monthlyRevenue = [];
    const currentDate = new Date();
    const monthsToShow =
      timeFilter === "all" ? 12 : Math.min(parseInt(timeFilter), 12);

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const month = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const nextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        1
      );

      const monthOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.date);
        return orderDate >= month && orderDate < nextMonth;
      });

      const monthRevenue = monthOrders.reduce(
        (sum, order) => sum + (order.amount || 0),
        0
      );

      monthlyRevenue.push({
        month: month.toLocaleDateString("vi-VN", {
          month: "short",
          year: "numeric",
        }),
        revenue: monthRevenue,
        orders: monthOrders.length,
      });
    }

    // Tính doanh thu theo trạng thái đơn hàng
    const revenueByStatus = filteredOrders.reduce((acc, order) => {
      const status = order.status || "Unknown";
      acc[status] = (acc[status] || 0) + (order.amount || 0);
      return acc;
    }, {});

    const statusData = Object.keys(revenueByStatus).map((status) => ({
      status,
      revenue: revenueByStatus[status],
    }));

    // Tính doanh thu theo khách hàng (top 10)
    const revenueByCustomer = {};
    filteredOrders.forEach((order) => {
      const user = users.find((u) => u._id.toString() === order.userId);
      const customerName = user ? user.name : "Unknown";
      revenueByCustomer[customerName] =
        (revenueByCustomer[customerName] || 0) + (order.amount || 0);
    });

    const topCustomers = Object.keys(revenueByCustomer)
      .map((name) => ({ name, revenue: revenueByCustomer[name] }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Thống kê đơn hàng theo trạng thái
    const ordersByStatus = filteredOrders.reduce((acc, order) => {
      const status = order.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const statusCountData = Object.keys(ordersByStatus).map((status) => ({
      status,
      count: ordersByStatus[status],
    }));

    // Thống kê đơn hàng theo ngày trong tuần
    const ordersByDayOfWeek = filteredOrders.reduce((acc, order) => {
      const orderDate = new Date(order.date);
      const dayOfWeek = orderDate.toLocaleDateString("vi-VN", {
        weekday: "long",
      });
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
      return acc;
    }, {});

    const dayOfWeekData = Object.keys(ordersByDayOfWeek).map((day) => ({
      day,
      count: ordersByDayOfWeek[day],
    }));

    // Tính tỷ lệ thanh toán
    const paidOrders = filteredOrders.filter((order) => order.payment).length;
    const paymentRate = totalOrders > 0 ? (paidOrders / totalOrders) * 100 : 0;

    // Tính tỷ lệ đánh giá
    const ratedOrders = filteredOrders.filter((order) => order.rated).length;
    const ratingRate = totalOrders > 0 ? (ratedOrders / totalOrders) * 100 : 0;

    const responseData = {
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalOrders,
          totalCustomers,
          paymentRate: Math.round(paymentRate * 100) / 100,
          ratingRate: Math.round(ratingRate * 100) / 100,
        },
        monthlyRevenue,
        revenueByStatus: statusData,
        topCustomers,
        ordersByStatus: statusCountData,
        ordersByDayOfWeek: dayOfWeekData,
      },
    };

    console.log("Response data prepared successfully");
    res.json(responseData);
  } catch (error) {
    console.error("Error in getReportData:", error);
    res.json({ success: false, message: "Error" });
  }
};

// Thêm đánh giá cho item trong order
const addOrderItemRating = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { userId, name, comment, rating } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const item = order.items.find(
      (i) => i._id?.toString() === itemId || i.id === itemId
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    if (!item.ratings) item.ratings = [];
    item.ratings.push({ userId, name, comment, rating });

    // Thêm vào food.ratings
    const foodModel = (await import("../models/foodModel.js")).default;
    const food = await foodModel.findById(itemId);
    if (food) {
      food.ratings.push({ userId, name, comment, rating });
      await food.save();
    }

    await order.save();
    res.json({ success: true, message: "Rating added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  updateRated,
  getReportData,
  addOrderItemRating,
};
