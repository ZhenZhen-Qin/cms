/***
 * 社团管理员相关
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

const CommunityAdmin = require("../mongo/model/joinCommunity.js");

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
Router.post("/getCommunityAdminList", (req, res) => {
  let {
    communityId,
    isAdmin
  } = req.body;

  CommunityAdmin.find(isAdmin ? {
      isAdmin,
      communityId
    } : {
      communityId,
    })
    .limit(100)
    .sort([
      ["createTime", "desc"]
    ])
    .then((data) => {
      res.send({
        err: 0,
        msg: "查询成功",
        data,
      });
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
Router.post("/addCommunityAdmin", (req, res) => {
  const params = req.body;
  // 加入之前先查询 社团id和用户名称是否存在 避免重复加入
  CommunityAdmin.find({
      communityId: params.communityId,
      memberName: params.memberName,
    })
    .then((data) => {
      if (data && data.length > 0) {
        res.send({
          err: -2,
          msg: "重复提交",
          data: null,
        });
      } else {
        CommunityAdmin.insertMany(params)
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
      console.log(err);
      res.send({
        err: -1,
        msg: "查询错误",
        data: null,
      });
    });
});


/**
 * @api {post} /book/removeBookInfo removeBookInfo
 * @apiName removeBookInfo
 * @apiGroup book
 *
 * @apiParam {String} _id 数据库自动生成的图书ID
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post('/delete', (req, res) => {
  CommunityAdmin.deleteOne({
      _id: req.body._id
    })
    .then((data) => {
      res.send({
        err: 0,
        msg: "移除成功",
        data: null
      })
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: -1,
        msg: "操作失败",
        data: null
      })
    })
});



/**
 * @api {post} /borrowbook/updateBorrowBook updateBorrowBook
 * @apiName updateBorrowBook
 * @apiGroup borrowbook
 *
 * @apiParam {String} readerName 读者名不可更改
 * @apiParam {String} bookname 书名
 * @apiParam {String} bookid 书ID
 * @apiParam {String} borrowDate 借书日期
 * @apiParam {String} returnDate 还书日期
 * @apiParam {String} fine 逾期的罚金
 *
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/updateStatus", (req, res) => {
  const params = req.body;
  CommunityAdmin.updateOne({
      _id: params._id
    }, {
      $set: {
        ...params
      }
    })
    .then((data) => {
      console.log(data);
      res.send({
        err: 0,
        msg: "操作成功",
        data: null,
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        err: -1,
        msg: '操作失败',
        data: null
      })
    })
})

module.exports = Router;