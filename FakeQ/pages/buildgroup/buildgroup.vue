0<template>
	<view class="content">
		<view class="top-bar">
			<view  @click="backOnePage" class="top-bar-left">
				<view class="text" @tap="back">
					取消
				</view>
			</view>
			<view class="top-bar-center">
				<view class="title">创建群聊</view>
			</view>
			<view class="top-bar-right">
				<view class="pice">
					
				</view>
			</view>
			<view class="main">
				<!-- 群头像 -->
				<view class="top">
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image src="../../static/images/img/avatar1.jpg" @tap="upload" class="pan"></image>
					<image :src="cropFilePath" @tap="upload" class="user-img"></image>
				</view>
				<!-- 群名字 -->
				<view class="group-name">
					<input class="group-name-imput" type="text" placeholder="为群取个名字" v-model="name">
				</view>
				<view class="title">
					用户
				</view>
					</view>
				<!-- 选择用户 -->
				<view class="friends">
					
					<view class="user" v-for="(item,index) in friends" :key="index" @tap="selectFriend(index)">
						<view class="selected" :class="{isselected:item.selected}">
							<image src="" mode="" v-if="item.selected"></image>
						</view>
						<image class="user-img" :src="item.imgurl"></image>
						<view class="name">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-bar">
			<!-- <view v-if="relation == 2" @tap="addFriendBtn" class="bottom-btn btn1">加为好友</view> -->
			<view class="bottom-btn btn1" :class="{noselecte:selec && name.length>0}" @tap="submit">创建{{selectedn}}</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				uid:'',
				token:'',
				gimgurl:'',
				tempFilePath:'',
				headimg:'',
				selectedn:0,
				name:'',
				friends:[], //好友数组
				user:[]
			}
		},
		components: {ImageCropper},
		onReady:function(){
			
		},
		onLoad:function(){
			this.selectedNober();
			this.getStorages();
			this.getFriends();
		},
		computed:{
			selec:function(){
				if(this.selectedn>0){
					return true;
				}else{
					return false;
				}
			}
		},
		methods: {
			back:function(){
				uni.navigateTo({
					url:'../index/index'
				})
			},
			//获取缓存数据
			getStorages:function() {
				try{
					const value = uni.getStorageSync('user')
					if(value) {
						this.uid = value.id
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
			selectedNober:function(){
				for(let i=0;i<this.friends.length;i++){
					if(this.friends[i].selected){
						this.selectedn++;
					}
				}
			},
			//头像裁剪
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ["album"], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift();
					},
				});
			},
			// confirm(e){
			// 	console.log(e.detail.tempFilePath2)
			// }
			// 头像上传
			confirm(e) {
				this.tempFilePath = "";
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				
				uni.uploadFile({
					url: this.serverUrl+'/files/upload',	//"后端地址上传图片接口地址",
					filePath: this.headimg,
					name: "file",
					fileType: "image",
					formData:{
						url: 'group',
						name: this.uid+new Date().getTime(),		//文件名
						token: this.token,
					},		// 传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;	// 上传的图片 
						// 更新本地存储信息
						// console.log(backstr)
						this.gimgurl = backstr
						
					},
					complete(){
						
					},
					fail(e) {
						console.log("this is errormes " + e.message);
					},
				});
				},
				cancel() {
					console.log('canceled')
				},
				//获取好友
				getFriends(){
					uni.request({
						url: this.serverUrl+'/index/getfriend',
						data:{
							uid: this.uid,	// 传参来的id
							state: 0,
							token: this.token
						},
						method: 'POST',
						success: (data)=>{
							this.refresh = true
							let status = data.data.status
							let res = data.data.result
							if(status===200){
								if(res.result.length>0){
									this.noone = false
									for(let i=0; i<res.result.length;i++){
										res.result[i].imgurl = this.serverUrl+ res.result[i].imgurl
										if(res.result[i].markname){
											res.result[i].name = res.result[i].markname
										}
										this.friends.push(res.result[i])
									}
									
								}
							
								// this.friends = myfun.mySort(this.friends, 'lastTime', 0)
								// for(let i=0;i<this.friends.length; i++){
								// 	this.getLastMsg(this.friends, i)	// 获取最后一条消息
								// 	this.getUnread(this.friends, i)		// 获取未读消息数
									
								// }
								// uni.stopPullDownRefresh()
								// this.getGroups()	// 群列表
								
								// console.log(this.friends)
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
					console.log(friends)
				},
			// 动态选择好友
			selectFriend:function(e){
				if(this.friends[e].selected){
					this.friends[e].selected=false;
					this.selectedn--;
				}else{
					this.friends[e].selected=true;
					this.selectedn++;
					if(this.selectedn==0){
						
					}
				}
			},
			//创建提交
			submit:function(){
				//符合条件提交
				if(this.selec && name.length>0){
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].selected){
							this.user.push(this.friends[i].id);
						}
					}
				uni.request({
					url: this.serverUrl+'/group/creategroup',
					data:{
						uid: this.uid,	// 传参来的id
						token: this.token,
						name:this.name,
						imgurl:this.gimgurl,
						user:this.user,
					},
					method: 'POST',
					success: (data)=>{
						this.refresh = true
						let status = data.data.status
						
						if(status===200){
							uni.navigateTo({
								url:'../index/indexs'
							})
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
				}
			}
		}
	}
</script>


<style lang="scss">
	@import '../../commons/css/mycss.scss';
	.top-bar{
		background: rgba(255,255,255,1);
		border-bottom: 1px solid $uni-border-color;
	}
	.main{
		
		display: flex;
		flex-direction: column;
		.top{
			padding-top: 148rpx;
			position: fixed;
			background-color: #fff;
			width: 100%;
			z-index: 100;
		}
		.group-img{
			margin: 0 auto;
			width: 196rpx;
			height: 196rpx;
			background: #ffe431;
			box-shadow: 0px 36rpx 40rpx 0px rgba(39,40,50,0.1);
			border-radius: 40rpx;
			overflow: hidden;
			.img{
				width: 196rpx;
				height: 196rpx;
			}
			.pan{
				position: absolute;
			}
		}
		.group-name{
			padding: 62rpx $uni-spacing-col-base;
		}
		.group-name-input{
			text-align: center;
			background: $uni-bg-color-grey;
			font-size: 32px;
	
			color: #272832;
			line-height: 44px;
			height: 92px;

			border-radius: 46px; 
		}
		.title{
			padding-top: $uni-spacing-row-base $uni-spacing-col-base 20rpx;
			font-size: 44rpx;
			font-weight: 600;
			color: #272832;
			line-height: 60rpx;
		}
		.friends{
			padding: $uni-spacing-col-base 20rpx; 
			.title{
				padding-top: $uni-spacing-row-base;
				font-size: 44rpx;
				font-weight: 600;
				color: #272832;
				line-height: 60rpx;
			}
			.user{
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 120rpx;
				.selected{
					flex: none;
					margin-right: 30rpx;
					width: 48rpx;
					height: 48rpx;
					background: rgba(255, 228, 49, 0.5);
					border-radius: 24rpx;
					position: relative;
					.selected-img{
						width: 30rpx;
						height: 30rpx;
						position: absolute;
						left: 10rpx;
						top: 16rpx;
					}
					
				}
				.isselected{
					background: rgba(255,228,49,1);
				}
				.user-img{
					width: 80rpx;
					height: 80rpx;
					border-radius: $uni-border-radius-base;
				}
				.name{
					padding-right: 32rpx;
					font-size: 36rpx;
					color: $uni-text-color;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}
	}
	.bottom-bar{
		background: rgba(250, 250, 250, 0.9);
		box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.25);
		.bottom-btn{
			background: $uni-color-primary;
			margin: 0 $uni-spacing-col-base;
		}
		.noselecte{

			background: $uni-color-primary;
		}
	}
</style>
