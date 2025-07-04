// Controllers user nhận các yêu cầu HTTP từ routes và tương tác với model user để xử lý đăng nhập, đăng kí, lấy thông tin và cập nhật thông tin người dùng
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Đăng nhập người dùng
const loginUser = async (req, res) => {
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false,message:"User doesn't exists"});
        }

        const isMatch = await bcrypt.compare(password,user.password)

        if (!isMatch) {
            return res.json({success:false, message:"Invalid password"})
        }

        const token = createToken(user._id);
        res.json({success:true, token, name: user.name})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// Tạo token
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Đăng kí người dùng
const registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try {
        const exists = await userModel.findOne({email});
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }

        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false,message:"Please enter a strong password"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name: name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true,token: token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// Lấy thông tin người dùng
const getUser = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        res.json({success:true, data: userData})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

// Thay đổi thông tin người dùng
const changeUser = async (req, res) => {
    const { email, name, sex, birthday, phone, address } = req.body;

    try {
        let user = await userModel.findById(req.body.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email) {
            user.email = email
        }

        if (name) {
            user.name = name
        }

        if (sex) {
            user.sex = sex
        }

        if (birthday) {
            user.birthday = birthday
        }

        if (phone) {
            user.phone = phone
        }

        if (address) {
            user.address = address
        }

        await user.save();
        res.status(200).json({success: true, message: "Success to change information"});
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false, message: "Error"});
    }
};

export {loginUser, registerUser, getUser, changeUser}