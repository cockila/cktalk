<template>
	<view class="contents animate__animated animate__fadeIn animate__faster">
		<!-- 顶部 -->
		<view class="top-bar">
			<view class="search-div">
				<i class="iconfont icon-searchsousuo"></i>
				<input @input="search" class="search" focus="true" type="search" value="" placeholder="输入用户名/邮箱" placeholder-style="color: #aaa; font-weight:400;"/>
			</view>
			<view class="top-bar-right" @click="backOnePage">
				<view class="text">
					取消
				</view>
			</view>
		</view>
		
		<!-- 主体 -->
		<view class="main">
			<view class="search-user result">
				<view class="title" v-show="usrArr.length > 0">用户</view>
				<view class="list user animate__animated animate__fadeIn animate__faster "
							v-for="(item, index) in usrArr"
							:keys="item.id">
					<navigator :url="'../userhome/userhome?id='+item._id">
						<image :src="item.imgurl" mode=""></image>
					</navigator>
					
					<view class="names">
						<view v-html="item.names" class="name"></view>
						<view v-html="item.emails" class="email"></view>
					</view>
			<!-- 		<view v-show="item.tip!==2"
								@tap="modify(item,data)"
								class="right-btn"
							  :class="{'add': item.tip===0, 'send': item.tip===1}">
						{{item.tip===1 ? '发消息' : '加好友'}}
					</view> -->
				<view v-show="item.tip==0"
							@tap="modify(item)"
							class="right-btn"
						  :class="{'add': item.tip===0, 'send': item.tip===1}">
					{{item.tip===1 ? '发消息' : '加好友'}}
				</view>
				<view v-show="item.tip==1"
						@tap="toChatRoom(item)"
							class="right-btn"
						  :class="{'add': item.tip===0, 'send': item.tip===1}">
					{{item.tip===1 ? '发消息' : '加好友'}}
				</view>
				</view>

			</view>
			
		</view>
	
		<!-- 弹出层 -->
		<view v-show="showModify" class="modify animate__animated animate__slideInUp animate__faster">
			<view class="modify-header ">
				<view class="close" @click="showModify=false">退出</view>
				<view class="title">添加好友</view>
				<view class="define" @tap="addFriendSub(sendfid)">发送</view>
			</view>
			<view class="modify-main">
				
				<textarea v-model="msg" 
									class="modify-content"/>
			</view>
		</view>
		
	<!-- 	<myFootBar :pageIndex="pageIndex"></myFootBar> -->
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myfun.js'
	// import myFootBar from '@/components/myFootBar.vue'
	
	export default {
		data() {
			return {
				pageIndex: 1,
				usrArr: [],
				uid: '',
				token: '',
				markname: '小明',
				myname: '',
				name: '',
				friends:[],
				showModify: false,
				msg:''	// 添加好友信息
			};
		},
		// components:{myFootBar},
		onLoad() {
			this.getStorages()
		
		},
		methods: {
			// 获取搜索词-节流
			search:myfun.debounce(function(e){
				this.usrArr = []
				let searchVal = e.detail.value
				
				if(searchVal.length>0)
					this.searchUser(searchVal)
			}, 200),
			// 寻找关键词匹配好友
			searchUser(e) {
				uni.request({
					url: this.serverUrl+'/search/user',
					data:{
						data: e,	// 传参来的id
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						// console.log(status)
						let arr = data.data.result
						if(status===200){
							arr =  arr.map((item, index)=>{
								this.isMyFriend(item, e)
							})
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
					}
				})
			},
			
			// 判断是否为好友
			isMyFriend (item ,e){
				let tip = 0
				let exp = eval("/"+e+"/g")
				// console.log(item._id, this.uid)
				if(item._id === this.uid){
					tip = 2
					item.tip = tip
					item.imgurl=this.serverUrl+'/'+item.imgurl
					item.names = item.name.replace(exp, "<span style='color:#4AAAFF'>"+e+"</span>")
					item.emails = item.email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>")
					this.usrArr.push(item)
				}else {
					uni.request({
					url: this.serverUrl+'/search/isfriend',
					data:{
						uid: this.uid,	// 传参来的id
						fid: item._id,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						// console.log(status)
						let arr = data.data.result
						if(status===200){	// 是好友
							tip = 1
							item.tip = tip
						}else if(status===400){	// 不是好友
							tip = 0
							item.tip = tip
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}else if(status===500){	
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
						item.id = item._id
						item.type = 0
						item.tip = tip
						item.imgurl=this.serverUrl+'/'+item.imgurl
						item.names = item.name.replace(exp, "<span style='color:#4AAAFF'>"+e+"</span>")
						item.emails = item.email.replace(exp, "<span style='color:#4AAAFF;'>"+e+"</span>")
						this.usrArr.push(item)
						console.log(this.usrArr)
					}
				})
				}
				// console.log(item.tip, tip)
				
			},
			
			// 弹出框
			modify(user,data){
				if(user.tip === 0){	// 加好友
					this.showModify = true
					this.msg = this.myname+'请求添加为好友~'
					this.sendfid = user._id
					// console.log(user)
				}else if(user.tip === 1){	// 跳转发消息
					// uni.navigateTo({
					// 	url:'../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type
					// })
				}
			},
			// 发送好友请求
			addFriendSub(fid){
				uni.request({
					url: this.serverUrl+'/friend/apply',
					data:{
						uid: this.uid,	// 传参来的id
						fid: fid,
						msg: this.msg,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						// console.log(status)
						let arr = data.data.result
						if(status===200){
							this.showModify = false	// 关闭
							uni.showToast({
							    title: '好友请求发送成功',
									icon:'none',
							    duration: 1500
							});
							
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}
					}
				})
			},
			// 获取缓存数据
			getStorages() {
				try{
					const value = uni.getStorageSync('user')
					if(value) {
						this.uid = value.id
						this.imgurl = this.serverUrl+'/'+ value.imgurl
						this.token = value.token
						this.myname = value.name
					}else {
						uni.navigateTo({
							url: '../signin/signin',
						})
					}
					
					// console.log(value)
				}catch(e){
					//TODO handle the exception
				}
			},
			toChatRoom(data){
				uni.navigateTo({
					url:'../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type
				})
				// console.log('aaaaaa')
			},	
			// 返回上一页
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
		},
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	
	page{
		// background: url(../../static/images/search/bg.png) no-repeat ;
	}
	/* 顶部 */
	.top-bar {
		.search-div {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			z-index: -1;
			padding: 14rpx 118rpx 14rpx 32rpx;
			box-sizing: border-box;
			// background: #eee;
			.search {
				padding: 0 60rpx 0 12rpx;
				height: 60rpx;
				background: $uni-bg-color-grey;
				border-radius: 10rpx;
			}
			i {
				position: absolute;
				right: 130rpx;
				top: 24rpx;
			}
		}
		.top-bar-right {
			float: right;
			padding-right: 8rpx;
			margin-top: 9rpx;
			box-shadow: none;
			.text {
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 70rpx;
			}
		}
	}
	/* 主体 */
	.main {
		padding: 88rpx $uni-spacing-col-base;
		
		.result {
			padding-top: $uni-spacing-col-base;
			.title {
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}
			.list {
				width: 100%;
				height: 90rpx;
				padding: 20rpx 0;
				
				image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}
			}
			.names {
				float: left;
				padding-left: $uni-spacing-col-base;
				
				.name {
					font-size: 36rpx;
					color: $uni-text-color;
					line-height: 50rpx;
				}
			}
			.email {
				font-size: $uni-font-size-sm;
				color: $uni-text-color;
				line-height: 28rpx;
			}
			.right-btn {
				float: right;
				width: 120rpx;
				height: 48rpx;
				border-radius: 24rpx;
				font-size: $uni-font-size-sm;
				line-height: 48rpx;
				text-align: center;
			}
			.send {
				background: $uni-color-primary;
				color: $uni-text-color;
			}
			.add {
				background: rgba(74, 170, 255, 0.1);
				color: $uni-color-success;
			}
		}
	}
	/* 弹出框 */
	.modify {
		position: absolute;
		z-index: 1002;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		
		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;
			box-shadow: 1rpx 1rpx 20rpx 2rpx rgba(117, 112, 117, 0.2);
			
			.close {
				padding-left: 32rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			.title {
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.define {
				padding-right: $uni-spacing-col-base;
				font-size: 35rpx;
				color: $uni-color-success;
				line-height: 88rpx;
			}
		}
		.modify-main {
			display: flex;
			flex-direction: column;
			padding: $uni-spacing-col-base;
			.modify-pwd {
				padding: 0 22rpx;
				margin-bottom: $uni-spacing-col-base;
				flex: auto;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
			.modify-content {
				flex: 1;
				// width: 686rpx;
				height: 386;
				padding: 22rpx;
				margin: 0 auto;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
			
		}
	}
</style>
