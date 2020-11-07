
// 社团管理员列表
const mongoose = require("mongoose");
let adminSchema = mongoose.Schema({
    communityId:{type:String,required:true},  // 社团id
    communityName:{type:String,required:true},  // 社团名称
    creatorUserName:{type:String,required:true},  // 社团创建者的用户名
    creatorNickName:{type:String,required:true},  // 社团创建者的昵称
    adminName:{type:String,required:true},  // 管理员用户名
    adminNick:{type:String,required:true},  // 管理员昵称
    createTime:{type:String,required:true}, // 创建时间
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let admin = mongoose.model("cm_admin",adminSchema);
module.exports = admin;