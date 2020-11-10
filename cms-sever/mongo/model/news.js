// 关于活动的资讯表
const mongoose = require("mongoose");
let modelSchema = mongoose.Schema({
    title:{type:String,required:true}, // 标题
    content:{type:String,required:true}, // 内容 
    activeId:{type:String}, // 活动ID
    activeName:{type:String}, // 活动名称
    createTime:{type:Number}, // 资讯创建时间
});

let model = mongoose.model("news",modelSchema);
module.exports = model;