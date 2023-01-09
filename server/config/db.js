/*
*   数据库基础配置
* */

const mongoose = require('mongoose')

const db = mongoose.createConnection('mongodb://127.0.0.1:27017/italk', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

db.on('error', console.error.bind(console, 'connet error:'))
db.once('open', ()=>{
  console.log('Connet italk-db success!')
})

/* 加载models文件夹下所有模型文件 */
// require('require-all')(__dirname + '/../model')

module.exports = db

