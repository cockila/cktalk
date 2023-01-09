/**
 * 数据库CRUD
 *  直接与数据库(mongoose APi)交互，不涉及前端需求逻辑
 */

const bcrypt = require('./bcrypt');
const dbModel = require('../model/dbmodel');
// const e = require('cors');
const jwt = require('../dao/jwt');
const { query } = require('express');
// 表
const User = dbModel.model('User')
const Friend = dbModel.model('Friend')
const Group = dbModel.model('Group')
const Groupuser = dbModel.model('Groupuser')
const Message = dbModel.model('Message')
const Groupmsg = dbModel.model('Groupmsg')

/**************************************** */
/**
 * 新建用户-增
 * @param {用户名} name 
 * @param {邮箱} mail 
 * @param {密码} psw
 * @param {status} res 
 */
exports.buildUser = (name, mail, psw, res) => {
  let password = bcrypt.encryption(psw) // 密码加密
  let data = {                          // 与数据表字段对应
    name: name,
    email: mail,
    psw: password,
    time: new Date(),
  }
  let user = new User(data)
  // 保存
  user.save((err, result)=>{
    if(err) res.send({status:500})
    else res.send({status:200})
  })
}

/**
 * 匹配用户表元素个数-查
 * @param {用户名/邮箱} data 
 * @param {name/mail} type 
 * @param {0 / >0} res 
 */
exports.countUserValue = (data, type, res)=>{
  let wherestr = {}
  wherestr[type] = data
  User.countDocuments(wherestr, (err, result)=>{
    if(err) res.send({status:500})
    else res.send({status:200, result})
  })
}

/**
 * 登陆用户验证-查
 * @param {用户名/邮箱} data 
 * @param {用户密码} psw 
 * @param {} res 
 */
exports.userMatch = (data, psw, res)=>{
  let wherestr = { $or:[{'name': data}, {'email': data}] }
  let out = {'name':1, 'imgurl': 1, 'psw': 1}

  User.find(wherestr, out, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      if(result===''){
        res.send({status:400})
      } else {
        result.map((e)=>{
          const pswMatch = bcrypt.verification(psw, e.psw)
          if(pswMatch){
            let token = jwt.generateToken(e._id)
            let back = {    // 返回给前端的数据
              id: e._id,
              name: e.name,
              imgurl: e.imgurl,
              token: token,
            }
            res.send({status:200, back})
          }else {
            res.send({status:400})
          }

        })
      }
    }
  })
}

/**************************************** */
/**
 * 搜索用户 
 * @param {用户名/邮箱} data 
 * @param {*} res 
 */
exports.searchUser = (data, res)=>{
  let wherestr
  if(data === 'italk'){
    wherestr = {}
  }else {
    // 模糊搜索
    wherestr = { $or:[{'name':{$regex:data}}, {'email':{$regex:data}}] }
  }
  let out = {'name':1, 'email': 1, 'imgurl': 1}
  User.find(wherestr, out, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200, result})
    }
  })
}

/**
 * 判断是否为好友
 * @param {用户id} uid 
 * @param {好友id} fid 
 * @param {*} res 
 */
exports.isFriend = (uid, fid, res)=>{
  let wherestr = { 'userID': uid, 'friendID':fid, 'state': 0 }
  Friend.findOne(wherestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      if(result) {
        res.send({status:200}) // 不是好友
      }else{
        res.send({status:400})  // 是好友
      }
    }
  })
}

/**
 * 搜索群 
 * @param {群名} data 
 * @param {*} res 
 */
 exports.searchGroup = (data, res)=>{
  let wherestr
  if(data === '西西'){
    wherestr = {}
  }else {
    // 模糊搜索
    wherestr = { $or:[{'name':{$regex:data}}]}
  }
  let out = {'name':1, 'imgurl': 1}
  Group.find(wherestr, out, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200, result})
    }
  })
}

/**
 * 判断是否在群内
 * @param {用户id} uid 
 * @param {群id} gid 
 * @param {*} res 
 */
 exports.isInGroup = (uid, gid, res)=>{
  let wherestr = { 'userID': uid, 'groupID':gid }
  Groupuser.findOne(wherestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      if(result) {
        res.send({status:200}) // 在群内
      }else{
        res.send({status:400})  // 不在群内
      }
    }
  })
}

/**************************************** */
/**
 * 用户详情
 * @param {用户id} id 
 * @param {*} res 
 */
exports.userDetial = (id, res) => {
  let wherestr = { '_id': id }
  let out = {"psw": 0}
  User.findOne(wherestr, out, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200, result})
    }
    // res.send({status:200, result})
  })
}

/**
 * 用户信息修改
 * @param {用户数据} data
 * @param {*} res 
 */
exports.userUpdate = (data, res)=>{
  let updatestr = {}

  // 判断是否有密码
  if(typeof(data.psw) != 'undefined') {
    User.find({'_id':data.id}, {'psw': 1}, (err, result)=>{
      if(err){
        res.send({status:500})
      } else {
        if(result===''){
          res.send({status:400})
        } 
        result.map((e)=>{
          const pswMatch = bcrypt.verification(data.psw, e.psw)
          if(pswMatch){
            // 密码验证成功
            if(data.type === 'psw'){  // 修改密码
              let password = bcrypt.encryption(data.psw)
              updatestr[data.type] = password
              update(data.id, updatestr, res)
            } else {
              // 邮箱匹配
              updatestr[data.type] = data.data  // 其他修改
              User.countDocuments(updatestr, (err, result)=>{
                if(err) res.send({status:500})
                else {
                  if(result===0) {  // 没有匹配项，可以修改
                    update(data.id, updatestr, res)
                  }else {
                    res.send({status:201})  // 已存在邮箱
                  }
                }
              })
            }
          }else {
            // 密码匹配失败
            res.send({status:400})
          }
        })
      }
    })
  }else if(data.type ==='name'){  // 如果是用户名 先进行匹配
    updatestr[data.type] = data.data  
    User.countDocuments(updatestr, (err, result)=>{
      if(err) res.send({status:500})
      else {
        if(result===0) {  // 没有匹配项，可以修改
          update(data.id, updatestr, res)
        }else {
          res.send({status:300})  // 已存在密码
        }
      }
    })
  } else {
    // 一般修改项
    updatestr[data.type] = data.data  // 'name': '被修改后的数据'
    update(data.id, updatestr, res)
  }
}

/**
 * 获取好友昵称
 * @param {uid、fid} data 
 * @param {*} res 
 */
exports.getMarkName = (data, res)=>{
  let wherestr = { 'userID':data.uid, 'friendID': data.fid }
  let out ={'markname': 1}
  Friend.findOne(wherestr, out, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200, result})
    }
  })
}

/**
 * 修改好友昵称
 * @param {修改数据} data 
 * @param {*} res 
 */
exports.updateMarkName = (data, res)=>{
  let wherestr = { 'userID':data.uid, 'friendID': data.fid }
  let updatestr = { 'markname': data.name }
  Friend.updateOne(wherestr, updatestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200})
    }
  })
}

/**
 * 添加好友表
 * @param {用户id} uid
 * @param {好友id} fid
 * @param {关系状态} state
 * @param {*} res 
 */
exports.buildFriend = (uid, fid, state, res)=>{
  let data = {                          // 与数据表字段对应
    userID: uid,
    friendID: fid,
    state: state,
    time: new Date(),
    lastTime: new Date(),
  }
  let friend = new Friend(data)
  // 保存
  friend.save((err, result)=>{
    if(err) console.log('申请好友出错')
    // else res.send({status:200})
  })
}

/**
 * 私聊消息
 * @param {用户id} uid 
 * @param {好友id} fid 
 * @param {消息内容} msg 
 * @param {消息类型} type 
 * @param {*} res 
 */
exports.insertMsg = (uid, fid, msg, types, res)=>{
  let data = {
    userID: uid,
    friendID: fid,
    message: msg,
    types: types,
    time: new Date(),
    state: 1, // 消息状态 （0已读，1未读）
  }
  let message = new Message(data)
  message.save((err, result)=>{
    if(res){
      if(err) res.send({status:500})
      else res.send({status:200})  
    }
    
  })

}

/**************************************** */
/**
 * 好友申请
 * @param {} data 
 * @param {*} res 
 */
exports.applyFriend = (data, res)=>{
  
  let wherestr = {'userID': data.uid, 'friendID': data.fid}
  Friend.countDocuments(wherestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      // 1.判断是否已经申请过
      if (result === 0) { // 1.1 第一次申请
        this.buildFriend(data.uid, data.fid, 2)
        this.buildFriend(data.fid, data.uid, 1)
      } else {            // 1.2 已经申请过
        this.updateLastMsgTime(data)
      }
      // 1.3 添加消息
      this.insertMsg(data.uid, data.fid, data.msg, 0, res)
    }
  })

  // 2.
}

/**
 * 更新好友关系（同意）
 * @param {用户、好友id} data 
 * @param {*} res 
 */
exports.updateFriendState = (data, res)=>{
  let wherestr = { $or:[{'userID':data.uid,'friendID': data.fid}, {'userID':data.fid,'friendID':data.uid}] }
  // 好友状态更新：0
  Friend.updateMany(wherestr, { 'state': 0}, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200})
    }
  })
}

/**
 * 更新好友关系（拒绝、删除）
 * @param {用户、好友id} data 
 * @param {*} res 
 */
exports.deleteFriend = (data, res)=>{
  let wherestr = { $or:[{'userID':data.uid,'friendID': data.fid}, {'userID':data.fid,'friendID':data.uid}] }
  // 好友状态更新：0
  Friend.deleteMany(wherestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200})
    }
  })
}
  
/**
 * 更新好友最后一条消息时间
 * @param {*} uid 
 * @param {*} fid 
 */
exports.updateLastMsgTime = (data)=>{
  let wherestr = { $or:[{'userID':data.uid,'friendID': data.fid}, {'userID':data.fid,'friendID':data.uid}] }
  let updatestr = {'lastTime': new Date()}

  Friend.updateMany(wherestr, updatestr, (err, result)=>{
    if(err) console.log('更新时间错误')
  })
}

/**
 * 按需获取好友列表(弃)
 * @param {} data 
 * @param {*} res 
 */
exports.getUsersd = (data, res)=>{
  let query = Friend.find({})
  // 查询条件
  query.where( { 'userID':data.uid, 'state': data.state } )
  // 查找fid，关联的user对象
  query.populate( 'friendID')
  // 排序方式
  query.sort({'lastTime':-1})
  // 查询结果
  query.exec().then( function (e){
    let result = e.map((ver)=>{
      return {
        id: ver.friendID._id,
        name: ver.friendID.name,
        markname: ver.markname,
        imgurl: ver.friendID.imgurl,
        lastTime: ver.lastTime,
        type: 0
      }
    })
    res.send({status:200, result})
  }).catch(err=>res.send({status:500}))
}

/**
 * 按需获取好友列表，异步
 * @param {} data 
 * @param {*} res 
 */
exports.getUsers1 = (data, res)=>{
  return new Promise((resolve, reject)=>{
    let query = Friend.find({})
    // 查询条件
    query.where( { 'userID':data.uid, 'state': data.state } )
    // 查找fid，关联的user对象
    query.populate( 'friendID')
    // 排序方式
    query.sort({'lastTime':-1})
    // 查询结果
    query.exec().then( function (e){
      let result = e.map((ver)=>{
        return {
          id: ver.friendID._id,
          name: ver.friendID.name,
          markname: ver.markname,
          imgurl: ver.friendID.imgurl,
          lastTime: ver.lastTime,
          type: 0,
        }
      })
      resolve({status:200, result})
    }).catch(err=>reject({status:500}))
  }).then(function onFulfilled(value){
    res.send(value)
  })
  
}

/**
 * 按要求获取一对一消息
 * @param {*} uid 
 * @param {*} fid 
 * @param {*} res 
 */
exports.getOneMsg = (data, res)=>{
  let query = Message.findOne({})
  // 查询条件
  query.where( { $or:[{'userID':data.uid,'friendID': data.fid}, {'userID':data.fid,'friendID':data.uid}] } )
  // 排序方式
  query.sort({'time':-1})
  // 查询结果
  query.exec().then( function (ver){
    let result =  {
      message: ver.message,
      types: ver.types,
      time: ver.time,
    }
    // console.log(ver)
    res.send({status:200, result})
  }).catch(err=>res.send({status:500}))
}

/**
 * 一对一消息未读消息数
 * @param {*} data 
 * @param {*} res 
 */
exports.unreadMsg = (data, res) => {
  // 汇总条件
  let wherestr = {'userID': data.fid, 'friendID': data.uid, 'state':1 }
  Message.countDocuments(wherestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200, result})
    }
  })
}

/**
 * 更新未读消息数（清0）
 * @param {*} data 
 * @param {*} res 
 */
exports.updateMsg = (data, res)=>{
  let wherestr = {'userID': data.uid, 'friendID': data.fid, 'state':1 }
  let updatestr = {'state':0} // 更新为已读状态
  Message.updateMany(wherestr, updatestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200})
    }
  })
}

/**
 * 按要求获取群列表
 * @param {*} uid  用户所在的群
 * @param {*} res 
 */
exports.getGroup = (uid, res) =>{
  let query = Groupuser.find({})
  // 查询条件
  query.where( { 'userID':uid } )
  // 查找fid，关联的群对象
  query.populate( 'GroupID')
  // 排序方式
  query.sort({'lastTime':-1})
  // 查询结果
  query.exec().then( function (e){
    let result = e.map((ver)=>{
      return {
        id: ver.groupID._id,
        name: ver.groupID.name,
        markname: ver.name,
        imgurl: ver.groupID.imgurl,
        lastTime: ver.lastTime,
        tip: ver.tip,
        type: 1,
      }
    })
    res.send({status:200, result})
  }).catch(err=>res.send({status:500}))
}

/**
 * 按要求获取群消息
 * @param {*} id 
 * @param {*} res 
 */
exports.getOneGroupMsg = (gid, res)=>{
  let query = Groupmsg.findOne({})
  // 查询条件
  query.where({'groupID':gid})
  // 关联的user对象
  query.populate( 'userID')
  // 排序方式
  query.sort({'time':-1})
  // 查询结果
  query.exec().then( function (ver){
    let result =  {
      message: ver.message,
      types: ver.types,
      time: ver.time,
      name: ver.userID.name // 谁发的
    }
    res.send({status:200, result})
  }).catch(err=>res.send({status:500}))
}

/**
 * 更新群未读消息数（清0）
 * @param {*} data 
 * @param {*} res 
 */
exports.updateGroupMsg = (data, res)=>{
  let wherestr = {'userID': data.uid, 'groupID': data.gid }
  let updatestr = {'tip':0} // 更新为已读状态
  Groupmsg.updateOne(wherestr, updatestr, (err, result)=>{
    if(err){
      res.send({status:500})
    } else {
      res.send({status:200})
    }
  })
}


/**
 * 分页获取私聊消息
 * @param {*} data uid、fid、nowPage、pageSize
 * @param {*} res 
 */
exports.msg = (data, res) =>{
  
  let skipNum = (data.nowPage)*data.pageSize  // 跳过的条数

  let query = Message.find({})

  // 查询条件
  query.where( { $or:[{'userID':data.uid,'friendID': data.fid}, {'userID':data.fid,'friendID':data.uid}] } )
  // 排序方式
  query.sort({'time':-1})
  // 查找fid，关联的发送方对象
  query.populate( 'userID')
  // 跳过条数
  query.skip(skipNum)
  // 每页条数
  query.limit(data.pageSize)
  // 查询结果
  query.exec().then( function (e){
    let result = e.map((ver)=>{
      return {
        id: ver._id,
        message: ver.message,
        types: ver.types,
        time: ver.time,

        fromId: ver.userID._id,
        imgurl: ver.userID.imgurl,
      }
    })
    res.send({status:200, result})
  }).catch(err=>res.send({status:500}))
}

/******************************************************** */
// 更新数据的方法
function update(data, update, res) {
  User.findByIdAndUpdate(data, update, (err, resu)=>{
    if(err) res.send({status:500})
    else res.send({status:200})
  })
}

// 异步重写
function getUser(data) {
  return new Promise((resolve, reject)=>{
    let query = Friend.find({})
    // 查询条件
    query.where( { 'userID':data.uid, 'state': data.state } )
    // 查找fid，关联的user对象
    query.populate( 'friendID')
    // 排序方式
    query.sort({'lastTime':-1})
    // 查询结果
    query.exec().then( function (e){
      let result = e.map((ver)=>{
        return {
          id: ver.friendID._id,
          name: ver.friendID.name,
          markname: ver.markname,
          imgurl: ver.friendID.imgurl,
          lastTime: ver.lastTime,
          type: 0,
        }
      })
      resolve({status:200, result})
    }).catch(err=>reject({status:500}))
  })
}

function getOneMsg(uid, fid) {
  return new Promise((resolve, reject)=>{
    let query = Message.findOne({})
    // 查询条件
    query.where( { $or:[{'userID':data.uid,'friendID': data.fid}, {'userID':data.fid,'friendID':data.uid}] } )
    // 排序方式
    query.sort({'time':-1})
    // 查询结果
    query.exec().then( function (ver){
      let result =  {
        message: ver.message,
        types: ver.types,
        time: ver.time,
      }
      resolve({status:200, result})
    }).catch(err=>reject({status:500}))
  })
}

function unreadMsg(uid, fid) {
  return new Promise((resolve, reject)=>{
    let wherestr = {'userID': data.uid, 'friendID': data.fid, 'state':1 }
    Message.countDocuments(wherestr, (err, result)=>{
      if(err){
        resolve({status:500})
      } else {
        reject({status:200, result})
      }
    })
  })
}

exports.getUsers = (data, res)=>{
  doIt(data, res)
}

// 联合查找好友及最后一条消息及未读数据
async function doIt(data, res){
  let result,bb,cc,err
  [err, result] = await getUser(data).then(data => [null, data]).catch(err=>[err, null])
  for(var i=0; i<result.length;i++){
    [err, bb] = await getOneMsg(data.uid, result[i].id)
      .then(data=>[null, data]).catch(err=>[err, null])
    if(bb.types === 0){
      // 文字
    } else if(bb.types === 1){
      bb.message = '[图片]'
    } else if(bb.types === 2){
      bb.message = '[音频]'
    } else if(bb.types === 3){
      bb.message = '[位置]'
    }
    result[i].msg = bb.message
    [err, cc] = await unreadMsg(data.uid, result[i].id)
      .then(data=>[null, data]).catch(err=>[err, null])
      result[i].tip = cc
  }
  if(err){
    res.send(err)
  }else {
    res.send({status:200, result})
  }
}
