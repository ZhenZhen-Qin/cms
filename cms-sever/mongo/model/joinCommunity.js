// 学生加入社团表
const mongoose = require("mongoose");
let joinSchema = mongoose.Schema({
    _id:{type:String},
    communityId:{type:String,required:true},  // 社团id
    communityName:{type:String,required:true},  // 社团名称
    userName:{type:String,required:true},  // 学生用户名
    nickName:{type:String,required:true},  // 学生姓名
    createTime:{type:String,required:true}, // 加入时间
    reason:{type:String}, // 申请理由
    status:{type:String,required:true}, // 状态，0审核中，1审核通过
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let join = mongoose.model("join",joinSchema);
module.exports = join;