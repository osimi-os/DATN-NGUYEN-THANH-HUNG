// Định nghĩa cấu trúc bảng user trong cơ sở dữ liệu
import mongoose from "mongoose"

const userSChema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    cartData:{type:Object,default:{}},
    sex:{type:String},
    birthday:{type:Date},
    phone:{type:String},
    address:{type:String}
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model("user",userSChema);

export default userModel;