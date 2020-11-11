// 学生（用户）表
const mongoose = require("mongoose");
let userSchema = mongoose.Schema({
    _id:{type:String},
    userName:{type:String,required:true},  // 用于登录的用户名
    nickName:{type:String,required:true},  // 用于显示的昵称
    password:{type:String,required:true},
    headImg:{type:String}, // 头像地址
    email:{type:String}, // 邮箱
    profile:{type:String}, // 个人简介
    nation:{type:String}, // 民族
    mobile:{type:String}, // 手机号
    country:{type:String}, // 国家
    geographic:{type:String}, // 省市
    address:{type:String}, // 街道地址
    mobile:{type:String}, // 手机号
    college:{type:String}, // 所在学院 计算机科学与工程学院
    specializedSubject:{type:String}, // 所属专业，如 软件工程二班
    gender:{type:String}, // 性别 男male 女female
    // 枚举字段（user：普通用户，admin：管理员，sysadmin：超级管理员）
    currentAuthority:{type:String,default:"user"}  // 当前权限 默认是管理员
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let user = mongoose.model("users",userSchema);
module.exports = user;