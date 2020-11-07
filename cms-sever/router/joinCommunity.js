/***
 * 学生加入社团
 */
const express = require("express");
const Router = express.Router();
const querystring = require("querystring");
var bodyParser = require("body-parser");
Router.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const JoinCommunity = require("../mongo/model/joinCommunity.js");

/**
 * @api {post} /community/getCommunityList getCommunityList
 * @apiName getCommunityList
 * @apiGroup community
 *
 * @apiParam {String} pageSize
 * @apiParam {String} page
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/getJoinCommunityList", (req, res) => {
    let {
        pageSize,
        current,
        communityId,
    } = req.body;
    let obj = {};
    // 查找全部
    if (communityId) {
        JoinCommunity.find({
                communityId
            })
            .then((data) => {
                // 获取总条数
                obj.total = data.length;
                return Community.find({
                        communityId
                    })
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

    } else {
        JoinCommunity.find()
            .then((data) => {
                // 获取总条数
                obj.total = data.length;
                return Community.find()
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
    }

});


/**
 * @api {post} /community/addCommunityInfo 加入社团
 * @apiName addCommunityInfo
 * @apiGroup community
 *
 * @apiParam {String} cmId 社团ID
 * @apiParam {String} name 社团名称
 * @apiParam {String} creatorId 创建者id
 * @apiParam {String} creatorName 创建者姓名
 * @apiParam {String} teacher 指导老师
 * @apiParam {String} createTime 创建时间
 * @apiParam {String} typeId 社团类别
 * @apiParam {String} desc 描述
 * @apiParam {String} order 其他
 * @apiParam {String} status 社团状态 0:已注销，1:审核中 2:审核成功，3:审核失败
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 err
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/joinCommunity", (req, res) => {
    const params = req.body;
    // 加入之前先查询 社团id和用户名称是否存在 避免重复加入
    JoinCommunity.find({
            communityId: params.communityId,
            userName: params.userName
        })
        .then((data) => {
            if (data && data.length > 0) {
                res.send({
                    err: -2,
                    msg: "重复提交",
                    data: null,
                });
            } else {
                JoinCommunity.insertMany(params)
                    .then((data) => {
                        if (data.length > 0) {
                            res.send({
                                err: 0,
                                msg: "操作成功",
                                data: null,
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send({
                            err: -1,
                            msg: "操作失败",
                            data: null,
                        });
                    });
            }
        })
        .catch((err) => {
            console.log(err)
            res.send({
                err: -1,
                msg: '查询错误',
                data: null
            })
        })
});



module.exports = Router;