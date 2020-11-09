
// 活动表
const mongoose = require("mongoose");
let adminSchema = mongoose.Schema({
    activeName:{type:String,required:true},  // 活动名称
    activeAddr:{type:String},  // 活动地点
    desc:{type:String},  // 活动描述
    startTime:{type:Number,required:true},  // 活动开始时间
    endTime:{type:Number,required:true},  // 活动结束时间
    createTime:{type:Number,required:true},  //
    communityId:{type:String,required:true},  // 社团Id
    communityName:{type:String,required:true},  // 社团名称
    creatorUserName:{type:String},  // 社团创建者用户名
    creatorNickName:{type:String},  // 社团创建者昵称
    status:{type:String,required:true},  // 活动状态 0下线，1上线
    upperLimit:{type:Number,required:true}, // 参与人数上线
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let admin = mongoose.model("active",adminSchema);
module.exports = admin;