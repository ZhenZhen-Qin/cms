const express = require("express");
const app = express();
const path = require("path");
const cors=require('cors');
const $ = require("jquery");

const  db = require("./mongo/mongoose.js");


//跨域问题要加上
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    console.log('拦截处理');
    // 可以用作拦截器做拦截处理
    next()//是否执行继续
})

// app.get("/api/user/login",(req,res)=>{
//     console.log('login')
//     //这里的res获取到的请求是很多数据的，res.query返回的是前端地址栏传过来的对象
// });
console.log(__dirname);
//静态资源的引用
app.use('/view',express.static(path.join(__dirname,'./view')));
app.use('/public',express.static(path.join(__dirname,'./public')));
app.use(express.json());

// 分发路由
// 登录相关
const adminRouter = require('./router/user.js');
app.use("/api/user",adminRouter);

// 社团相关接口
const communityRouter = require('./router/community.js');
app.use("/api/community",communityRouter);

// 活动相关接口
const activeRouter = require('./router/active.js');
app.use("/api/active",activeRouter);


// 资讯相关接口
const newsRouter = require('./router/news.js');
app.use("/api/news",newsRouter);

// 学生加入社团相关接口
const communityAdminRouter = require('./router/joinCommunity.js');
app.use("/api/admin",communityAdminRouter);

// 学生加入活动相关接口
const joinActiveRouter = require('./router/joinActive.js');
app.use("/api/joinActive",joinActiveRouter);

const upload = require('./router/upload.js');
app.use("/upload/upload",upload);

//生成验证码
const getCode = require('./router/setCode.js');
app.use("/getCode",getCode);
//发送验证码
const sendMail = require('./router/sendEmail.js');
app.use("/sendMail",sendMail);
//验证前端传过来的验证码是否正确
const VerificationCode = require('./router/setCode.js');
app.use("/VerificationCode",VerificationCode);


app.listen(3000,()=>{
    console.log("server start in port " + 3000)
});













