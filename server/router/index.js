/**
 * 后端路由表
 *  - 前端发起请求以匹配
 *  - post /signup/add 注册页
 *  - post /signup/judge 匹配
 */

const dbserver = require('../dao/dbserver'); // 数据库CRUD
const emailserver = require('../dao/emailserver') // 发送邮箱
// server处理方法
const signup = require('../server/signup') // 注册方法
const signin = require('../server/signin') // 登陆方法
const search = require('../server/search') // 搜索页方法
const userdetial = require('../server/userdetial') // 用户信息方法
const friend = require('../server/friend') // 用户信息方法
const index = require('../server/index') // 用户信息方法
const chat = require('../server/chat') // 用户信息方法

module.exports = function (app) {

  app.get('/', (req, res) => {
    // dbserver.findUser(res)
    res.send('hello world')
  })

  // 邮箱测试
  app.post('/mail', (req, res) => {
    let mail = req.body.mail // 用户输入的mail，需要body-parser解析
    emailserver.emailSignUp(mail, res)
  })

  /***************************************** */
  // 注册页
  app.post('/signup/add', (req, res) => {
    signup.signUp(req, res)
  })
  // 匹配用户/邮箱是否存在
  app.post('/signup/judge', (req, res) => {
    signup.judgeValue(req, res)
  })

  /**************************************** */
  // 登陆验证
  app.post('/signin/match', (req, res) => {
    signin.signIn(req, res)
  })

  // 提交token匹配测试
  // app.post('/signin/test', (req, res) => {
  //   // signin.testToken(req, res)
  //   res.send('这里token正确')
  // })

  /**************************************** */
  // 搜索用户
  app.post('/search/user', (req, res) => {
    search.searchUser(req, res)
  })
  // 是否为好友
  app.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res)
  })
  // 搜索群
  app.post('/search/group', (req, res) => {
    search.searchGroup(req, res)
  })
  // 是否在群内
  app.post('/search/isingroup', (req, res) => {
    search.isInGroup(req, res)
  })

  /**************************************** */
  // 用户详情
  app.post('/user/detial', (req, res) => {
    userdetial.userDetial(req, res)
  })
  // 用户信息修改
  app.post('/user/update', (req, res) => {
    userdetial.userUpdate(req, res)
  })
  // 好友昵称获取
  app.post('/user/getmarkname', (req, res) => {
    userdetial.getMarkName(req, res)
  })
  // 好友昵称修改
  app.post('/user/updatemarkname', (req, res) => {
    userdetial.updateMarkName(req, res)
  })

  /**************************************** */
  // 申请好友
  // 此接口会在好友表、消息表中创建新字段哦~
  app.post('/friend/apply', (req, res) => {
    friend.applyFriend(req, res)
  })
  // 好友状态更新（同意）
  app.post('/friend/updatefriendstate', (req, res) => {
    friend.updateFriendState(req, res)
  })
  // 好友状态更新（拒绝/删除）
  app.post('/friend/deletefriend', (req, res) => {
    friend.deleteFriend(req, res)
  })

  /**************************************** */
  // 获取好友列表
  app.post('/index/getfriend', (req, res) => {
    index.getFriend(req, res)
  })
  // 获取最后一条好友消息
  app.post('/index/getlastmsg', (req, res) => {
    index.getLastMsg(req, res)
  })
  // 获取好友未读消息数
  app.post('/index/unreadmsg', (req, res) => {
    index.unreadMsg(req, res)
  })
  // 更新好友未读消息数
  app.post('/index/updatemsg', (req, res) => {
    index.updateMsg(req, res)
  })

  // 获取群列表
  app.post('/index/getgroup', (req, res) => {
    index.getGroup(req, res)
  })
  // 获取最后一条群消息
  app.post('/index/getlastgroupmsg', (req, res) => {
    index.getLastMsg(req, res)
  })
  // 更新群未读消息数
  app.post('/index/updategroupmsg', (req, res) => {
    index.updateGroupMsg(req, res)
  })


  /**************************************** */
  // 聊天消息分页查询
  app.post('/chat/msg', (req, res) => {

    chat.msg(req, res)
  })


}