// Controllers cart nhận các yêu cầu HTTP từ routes cart để xử lý các logic liên quan đến giỏ hàng
import userModel from "../models/userModel.js"

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1
        } else {
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true, message:"Added to cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// Xóa sản phẩm khỏi giỏ hàng
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true, message:"Remove from cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// lấy dữ liệu giỏ hàng của người dùng
// const getCart = async (req, res) => {
//     try {
//         let userData = await userModel.findById(req.body.userId);
//         let cartData = await userData.cartData;
//         res.json({success:true, cartData})
//     } catch (error) {
//         console.log(error);
//         res.json({success:false, message:"Error"})
//     }
// }
const getCart = async (req, res) => {
    try {
        // Check if userId is provided
        if (!req.body.userId) {
            return res.json({ success: false, message: "userId is required" });
        }
        let userData = await userModel.findById(req.body.userId);
        // Check if userData is null
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData;
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}


export {addToCart, removeFromCart, getCart}