
// 社团成员列表(学生加入社团列表)
const mongoose = require("mongoose");
let adminSchema = mongoose.Schema({
    communityId:{type:String,required:true},  // 社团id
    communityName:{type:String,required:true},  // 社团名称
    creatorUserName:{type:String,required:true},  // 社团创建者的用户名
    creatorNickName:{type:String,required:true},  // 社团创建者的昵称
    memberName:{type:String,required:true},  // 社团成员用户名
    memberNick:{type:String,required:true},  // 社团成员昵称
    isAdmin:{type:String,required:true},  // 是否是管理员 ‘1’是  0‘否’
    createTime:{type:String,required:true}, // 创建时间
    status:{type:String,required:true}, // 状态，是否通过审核  ’1‘通过，2审核不通过‘’,’0‘审核中
    reason:{type:String}, // 申请加入社团理由
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let admin = mongoose.model("cm_admin",adminSchema);
module.exports = admin;