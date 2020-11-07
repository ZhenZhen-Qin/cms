const express = require('express');
const Router = express.Router();
const querystring = require('querystring');
var bodyParser = require('body-parser');
Router.use(bodyParser.urlencoded({
    extended: false
}));

const User = require('../mongo/model/user.js');

/**
 * @api {post} /user/userLogin userLogin
 * @apiName userLogin
 * @apiGroup user
 *
 * @apiParam {String} uname 前端传过来的可以是用户名和邮箱
 * @apiParam {String} pwd 登录密码
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/login', (req, res) => {
    console.log(req.body);
    var dataObj = req.body;

    User.find({
            $and: [{
                $or: [{
                    'userName': dataObj['userName']
                }]
            }, {
                'password': dataObj['password']
            }]
        })
        .then((data) => {
            console.log(data);
            if (data[0]['userName'] == dataObj['userName'] && data[0]['password'] == dataObj['password']) {
                res.send({
                    currentAuthority: data[0].currentAuthority,
                    status: 'ok',
                    type: 'account',
                    userName: data[0].userName,
                    nickName: data[0].nickName,
                });
            }
        })
        .catch((err) => {
            console.log(err);
            res.send({
                currentAuthority: "guest",
                status: "error",
                type: "account",
            });
        })
});

//超级管理员添加新的普通管理员
/**
 * @api {post} /user/addUserInfo addUserInfo
 * @apiName addUserInfo
 * @apiGroup user
 *
 * @apiParam {String} uname 用户名
 * @apiParam {String} pwd 登录密码
 * @apiParam {String} status 权限
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/register', (req, res) => {
    const {
        userName,nickName,password,mobile,currentAuthority,college,specializedSubject,gender
    } = req.body
    User.insertMany({
        userName,nickName,password,mobile,currentAuthority,college,specializedSubject,gender
        })
        .then((data) => {
            res.send({
                currentAuthority,
                status: 'ok',
            })
        })
        .catch((err) => {
            console.log(err);
            res.send({
                err: -1,
                msg: '注册失败',
                data: null
            })
        })
});


/**
 * @api {post} /user/findUserInfo findUserInfo
 * @apiName findUserInfo
 * @apiGroup user
 *
 * @apiParam {String} uname 前端传过来的用户名或者邮箱
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/findUserInfo', (req, res) => {
    let uname = req.body.uname;
    User.find({
            $or: [{
                'uname': uname
            }, {
                'email': uname
            }]
        })
        .then((data) => {
            console.log(data);
            res.send({
                err: 0,
                msg: 'find Success',
                data: data
            })
        })
        .catch((err) => {
            console.log(err);
            res.send('fail')
        })
});


/**
 * @api {post} /user/findUserInfo findUserInfo
 * @apiName findUserInfo
 * @apiGroup user
 *
 * @apiParam {String} uname 前端传过来的用户名或者邮箱
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/getUserList', (req, res) => {
    let {
        pageSize,
        current,
    } = req.body;
    let obj = {};
        // 查找全部
        User.find()
        .then((data) => {
            // 获取总条数
            obj.total = data.length;
            return User.find()
            .limit(Number(pageSize)).sort([
                ['createTime', 'desc']
            ])
            .skip((Number(current) - 1) * Number(pageSize));
        })
        .then((data) => {
            obj.current = current;
            obj.data = data;
            obj.pageSize = pageSize;
            obj.success = true;
            res.send(obj);
        })
        .catch((err) => {
            console.log(err);
            res.send({
            err: -1,
            msg: "查询错误",
            data: null,
            });
        });
       
});

//邮箱验证码的处理
const email = require('./sendMail.js');
//获取post请求的时候要加上下面两句代码才能获取请求的参数
Router.use(bodyParser.urlencoded({
    extended: false
}));
let check = {};
//获取验证码


/**
 * @api {post} /user/getCode getCode
 * @apiName getCode
 * @apiGroup user
 *
 * @apiParam {String} mail 邮箱地址
 *
 * @apiSuccess {Number} err 错误码 0：ok -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 *
 */
Router.post('/getCode', (req, res) => {
    console.log(req.body);
    let mail = req.body.mail;
    if (!mail) {
        return res.send('参数错误')
    }
    let code = parseInt(Math.random(1000, 9999) * 10000);
    check[mail] = code;
    //发送邮件是异步操作
    email.sendMail(mail, code, (state) => {
        if (state) {
            res.send('验证码发送nook')
        } else {
            res.send({
                err: 0,
                msg: 'getCodeSuccess',
                data: code
            })
            // res.sendStatus(code)
        }
    })
});

module.exports = Router;