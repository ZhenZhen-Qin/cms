/***
 * 社团的操作
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

const Community = require("../mongo/model/community.js");

/**
 * @api {post} /community/addCommunityInfo addCommunityInfo
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
Router.post("/addCommunityInfo", (req, res) => {
  const params = req.body;
  Community.insertMany(params)
    .then((data) => {
      if (data.length > 0) {
        res.send({
          err: 0,
          msg: "创建社团成功",
          data: null,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: -1,
        msg: "创建社团失败",
        data: null,
      });
    });
});

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
Router.post("/getCommunityList", (req, res) => {
  let {
    pageSize,
    current,
    communityScreen,
    userName
  } = req.body;
  let obj = {};
  if (communityScreen === "0") {
    // 查找全部
    Community.find()
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
  } else {
    Community.find({
        creatorUserName: userName
      })
      .then((data) => {
        // 获取总条数
        obj.total = data.length;
        return Community.find({
          creatorUserName: userName
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
  }
});

/**
 * @api {post} /community/findCommunitysByType findCommunitysByType
 * @apiName findCommunitysByType
 * @apiGroup community
 *
 * @apiParam {String} typeid  根据书的类别查找书
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/findCommunitysByCreator", (req, res) => {
  let {
    creatorUserName,
    pageSize,
    page
  } = req.body;
  Community.find({
      creatorUserName,
    })
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
});

/**
 * @api {post} /community/findUnitCommunity findUnitCommunity
 * @apiName findUnitCommunity
 * @apiGroup community
 *
 * @apiParam {String} _id  根据书的_id查找书
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/findUnitCommunity", (req, res) => {
  let {
    _id
  } = req.body;
  let obj = {};
  Community.find({
      _id,
    })
    .then((data) => {
      obj.total = data.length;
      obj.communitylist = data;
      res.send({
        err: 0,
        msg: "查询成功",
        data: obj,
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
 * @api {post} /community/findCommunityByKw findCommunityByKw
 * @apiName findCommunityByKw
 * @apiGroup community
 *
 * @apiParam {String} keyword 模糊查询的关键字
 * @apiParam {String} pageSize
 * @apiParam {String} page
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/findCommunityByKw", (req, res) => {
  let {
    keyword,
    pageSize,
    page
  } = req.body;
  let obj = {};
  // Goods.find({name:{$regex:'肉'}})
  Community.find({
      $or: [{
          communityname: {
            $regex: keyword,
          },
        },
        {
          typeid: {
            $regex: keyword,
          },
        },
        {
          author: {
            $regex: keyword,
          },
        },
        {
          publish: {
            $regex: keyword,
          },
        },
        {
          communitydesc: {
            $regex: keyword,
          },
        },
      ],
    })
    .then((data) => {
      // 获取总条数
      obj.total = data.length;
      return Community.find({
          $or: [{
              communityname: {
                $regex: keyword,
              },
            },
            {
              typeid: {
                $regex: keyword,
              },
            },
            {
              author: {
                $regex: keyword,
              },
            },
            {
              publish: {
                $regex: keyword,
              },
            },
            {
              communitydesc: {
                $regex: keyword,
              },
            },
          ],
        })
        .limit(Number(pageSize))
        .skip((Number(page) - 1) * Number(pageSize));
    })
    .then((data) => {
      obj.communitylist = data;
      res.send({
        err: 0,
        msg: "find success",
        data: obj,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: -1,
        msg: "find error",
        data: null,
      });
    });
});

/**
 * @api {post} /community/updateCommunityInfo updateCommunityInfo
 * @apiName updateCommunityInfo
 * @apiGroup community
 *
 * @apiParam {String} _id 社团id
 * @apiParam {String} typeid 类别id
 * @apiParam {String} communityname 书名
 * @apiParam {String} author 作者
 * @apiParam {String} publish 出版社
 * @apiParam {String} publicDate 出版日期
 * @apiParam {String} unitprice 单价
 * @apiParam {String} communityimg 图书缩略图
 * @apiParam {String} communitydesc 图书描述
 * @apiParam {String} stock 库存
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/updateCommunityInfo", (req, res) => {
  let {
    name,
    creatorUserName,
    creatorNickName,
    teacher,
    createTime,
    updateTime,
    type,
    desc,
    status,
    reason,
  } = req.body;
  Community.updateOne({
      _id: req.body._id,
    }, {
      $set: {
        name,
        creatorUserName,
        creatorNickName,
        teacher,
        createTime,
        updateTime,
        type,
        desc,
        status,
        reason,
      },
    })
    .then((data) => {
      res.send({
        err: 0,
        msg: "修改成功",
        data: null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: -1,
        msg: "修改失败",
        data: null,
      });
    });
});

/**
 * @api {post} /community/removeCommunityInfo removeCommunityInfo
 * @apiName removeCommunityInfo
 * @apiGroup community
 *
 * @apiParam {String} _id 数据库自动生成的图书ID
 *
 * @apiSuccess {Number} err 错误码 0：ok  -1 失败
 * @apiSuccess {String} msg  结果信息
 * @apiSuccess {String} data  返回数据
 */
Router.post("/removeCommunityInfo", (req, res) => {
  let id = req.body._id;
  console.log(id);
  Community.deleteOne({
      _id: id,
    })
    .then((data) => {
      res.send({
        err: 0,
        msg: "delete success",
        data: null,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send({
        err: -1,
        msg: "delete error",
        data: null,
      });
    });
});

module.exports = Router;