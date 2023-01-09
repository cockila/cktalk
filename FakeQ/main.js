import Vue from 'vue'
import App from './App'
import io from './components/socket/weapp.socket.io.js'	// 通信模块

Vue.config.productionTip = false

Vue.prototype.serverUrl = 'http://localhost:4000'		// 后端API baseUrl
Vue.prototype.socket = io('http://localhost:4001')	// socket端口

App.mpType = 'app'
 
const app = new Vue({
    ...App
})
app.$mount()
