<template>
	<view class="contents">
		<!-- 顶部 -->
		<view class="top-bar" >
			<view  class="top-bar-left" @tap="backOnePage">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center" @click="backOnePage">
				<view class="title">申请列表</view>
				
			</view>
			 
		</view>
		<!-- main -->
		<view class="main">
			<view class="requester animate__animated animate__flipInX animate__faster"
						v-for="(item, index) in friends" :key="item.id">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="head-img">
						<image class="" :src="item.imgurl" mode=""></image>
					</view>
					<view class="agree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="request-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changeTime(item.lastTime)}}</view>
				</view>
				<view class="notic">
					<text>留言：</text>
					{{item.msg}}
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myfun.js'
	
	export default {
		data() {
			return {
				friends: [], //模拟数据
				uid:'',
				imgurl: '',
				token: '',
			};
		},
		onLoad() {
			this.getStorages()
			this.friendReq()
		},
		methods:{
			// 同意申请
			agree(fid){
				uni.request({
					url: this.serverUrl+'/friend/updatefriendstate',
					data:{
						uid: this.uid,	
						fid: fid,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							for(let i=0; i<this.friends.length;i++){
								if(this.friends[i].id===fid){
									this.friends.splice(i, 1)
									uni.showToast({
									    title: '添加成功',
											icon:'none',
									    duration: 1500
									});
								}
							}
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},// 拒绝申请
			refuse(fid){
				uni.request({
					url: this.serverUrl+'/friend/deletefriend',
					data:{
						uid: this.uid,	
						fid: fid,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							for(let i=0; i<this.friends.length;i++){
								if(this.friends[i].id===fid){
									this.friends.splice(i, 1)
									uni.showToast({
									    title: '已拒绝',
											icon:'none',
									    duration: 1500
									});
								}
							}
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 好友申请
			friendReq(){
				uni.request({
					url: this.serverUrl+'/index/getfriend',
					data:{
						uid: this.uid,	
						state: 1,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							for(let i=0; i<res.length;i++){
								res[i].imgurl = this.serverUrl+'/' + res[i].imgurl
								this.getApplyMsg(res, i)	// 获取好友申请留言
							}
							this.friends = res
							// console.log(res)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
						}
					}
				})
			},
			// 获取好友申请留言
			getApplyMsg(arr, i){
				uni.request({
					url: this.serverUrl+'/index/getlastmsg',
					data:{
						uid: this.uid,	
						fid: arr[i].id,
						token: this.token
					},
					method: 'POST',
					success: (data)=>{
						let status = data.data.status
						let res = data.data.result
						if(status===200){
							let e = arr[i]
							e.msg = res.message
							arr.splice(i, 1, e)
						}else if(status===500){
							uni.showToast({
							    title: '服务器出错了...',
									icon:'none',
							    duration: 1500
							});
						}else if(status===300){	// token过期
							uni.navigateTo({
								url:'/pages/signin/signin?name='+this.myname
							})
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
						// this.imgurl = this.serverUrl+'/'+ value.imgurl
						this.token = value.token
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
			// 返回上一页
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
			changeTime(date) {
				return myfun.dataTime(date)
			},
		}
	}
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';

	/* 顶部 */
	.top-bar {
		background: rgba(255, 255, 255, 0.95);
		// box-shadow: none;
		// border: none;
		.top-bar-left {
			width: 88rpx;
			height: 100%;
			// float: left;
			i {
				display: inline-block;
				margin-top: 25rpx;
			}
		
		}
		
	}
	/* main */
	.main {
		padding: 108rpx $uni-spacing-col-base;
		.requester {
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
			border-radius: 20px;
			margin-top: 112rpx;
			padding: $uni-spacing-col-base;
			
			.request-top {
				display: flex;
				flex-direction: row;
				
				.btn {
					flex: auto;
					width: 100rpx;
					height: 64rpx;
					border-radius: 40rpx;
					text-align: center;
					line-height: 64rpx;
					font-size: 32rpx;
					font-weight: 400;
					box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
					
				}
				.reject {
					color: $uni-color-warning;
					background: rgba(255,93,91,0.1);
				}
				.agree {
					background: $uni-color-primary;
				}
				
				.head-img {
					margin-top: -102rpx;
					flex: auto;
					text-align: center;
					image {
						width: 144rpx;
						height: 144rpx;
						border-radius: 50%;
						box-shadow: 8rpx 10rpx 25rpx -5rpx rgba(117, 112, 117, 0.3);
					}
				}
				
			}
			.request-center {
				text-align: center;
				padding-top: 20rpx;
				padding-bottom: 40rpx;
				.title {
					font-size: 36rpx;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 50rpx;
				}
				.time {
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
					line-height: 34rpx;
				}
				
			}
			.notic {
				padding: 20rpx 32rpx;
				background-color: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				line-height: 40rpx;
			}
		}
	}
</style>
