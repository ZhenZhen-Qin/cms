/**   
 * 创建数据模型
 * 社团表
 */ 
const mongoose = require("mongoose"); 
let bookSchema = mongoose.Schema({
    cmId:{type:String,required:true}, // 社团id
    name:{type:String,required:true}, // 社团名称
    creatorId:{type:String}, // 社团创建者id
    creatorName:{type:String}, // 社团创建者名称
    teacher:{type:String,required:true}, // 社团指导老师
    createTime:{type:String}, // 社团创建时间
    typeId:{type:String}, // 社团类别Id
    desc:{type:String}, // 社团描述
    order:{type:String}, // 其他
    status:{type:Number} // 社团状态 0:已注销，1:审核中 2:审核通过，3:审核不通过
});

//注意：数据库的集合名，在这里会被自动转化为复数，所以建立集合的时候尽量为复数
let communities = mongoose.model("communities",bookSchema);
module.exports = communities;