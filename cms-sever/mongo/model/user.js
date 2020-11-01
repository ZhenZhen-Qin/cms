// 创建数据模型
const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    _id:{type:String},
    userName:{type:String,required:true},  // 用于登录的用户名
    nickName:{type:String,required:true},  // 用于显示的昵称
    password:{type:String,required:true},
    currentAuthority:{type:String,default:"user"}  // 当前权限 默认是管理员
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let user = mongoose.model("user",userSchema);
module.exports = user;