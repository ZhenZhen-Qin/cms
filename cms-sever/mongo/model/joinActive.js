// 学生参与活动表
const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
    userName:{type:String,required:true}, // 学生用户名
    userNick:{type:String,required:true}, // 学生昵称 
    activeId:{type:String}, // 活动ID
    activeName:{type:String}, // 活动名称
    createTime:{type:Number}, // 活动创建时间
});

let model = mongoose.model("join_active",modelSchema);
module.exports = model;