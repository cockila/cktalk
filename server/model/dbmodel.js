/**
 * 数据库表模型
 */

const mongoose = require('mongoose')
const db = require('../config/db')
const Schema = mongoose.Schema

// 用户表
const UserSchema = new Schema({
  name: { type: String },
  grade: { type: Number },
  imgurl: { type: String, default: '/user/user.jpg' },
  sex: { type: String, default: 'asexual' },
  email: { type: String },
  psw: { type: String },
  birth: { type: String },
  explain: { type: String },
  time: { type: Date },
  phone: { type: Number },
},{
  timestamps: true
})

// 好友表
const FriendSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },
  state: { type: String },  // 好友状态(0 已为好友，1 申请中，2 对方未同意 )
  markname: { type: String },
  time: { type: Date },
  lastTime: { type: Date },
})

// 一对一消息表
const MessageSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  friendID: { type: Schema.Types.ObjectId, ref: 'User' },
  state: { type: String },  // 好友状态(0 已为好友，1 申请中，2 对方未同意 )
  message: { type: String },
  types: { type: String },  // 内容类型(0文字,1图片,2音频,3定位)
  time: { type: Date },
  state: { type: Number }   // 消息状态(0已读，1未读)
})

// 群表
const GroupSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },                          // 群名
  imgurl: { type: String, default: '/user/user.jpg' },   // 群头像
  groupNum: { type: Number },                      // 群号
  notice: { type: String },
  time: { type: Date },
})

// 群成员表
const GroupUserSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },                         // 成员昵称
  tip: { type: Number, default: 0 },              // 群消息数
  shield: { type: Number },                       // 免打扰(0不屏蔽,1屏蔽)
  time: { type: Date },
  lastTime: { type: Date },
})

// 群消息表
const GroupMsgSchema = new Schema({
  groupID: { type: Schema.Types.ObjectId, ref: 'Group' },
  userID: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  types: { type: String },  // 内容类型(0文字,1图片,2音频,3定位)
  time: { type: Date },
})

module.exports = db.model('User', UserSchema, 'users')
module.exports = db.model('Friend', FriendSchema, 'friends')
module.exports = db.model('Message', MessageSchema, 'messages')
module.exports = db.model('Group', GroupSchema, 'groups')
module.exports = db.model('Groupuser', GroupUserSchema, 'groupusers')
module.exports = db.model('Groupmsg', GroupMsgSchema, 'groupmsgs')
