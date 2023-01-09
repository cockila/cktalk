<template>
	<view>
		<view class="top-bar">
			<view @click="backOnePage"  class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center">
				<view class="title">资料卡</view>
				
			</view>
			<view class="top-bar-right">
				<view class="more">
					<i class="iconfont icon-gengduo"></i>
				</view>	
			</view>
		</view> 
		
		<view class="top-bar bgbar" :animation="animationData1">
			<view @click="backOnePage"  class="top-bar-left">
				<i class="iconfont icon-xiazai6"></i>
			</view>
			<view class="top-bar-center">
				<view class="title">资料卡</view>
				
			</view>
			<view class="top-bar-right">
				<view class="more">
					<i class="iconfont icon-gengduo"></i>
				</view>	
			</view>
		</view> 
		
		<view class="bg">
			<image src="" mode=""></image>
		</view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">今天</view>
					<view class="time">2020/11/11</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="title">群成员</view>
						<view class="more">
							管理群成员
						</view>
						<image src="" mode="" class="more-img"></image>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item,index) in groupmember" :key="index">
							<view class="imgs">
								<image src="" mode="aspectFill" class="delete" ></image>
								<image :src="item.imgurl" mode="aspectFit" class="user-img"></image>
							</view>
							<view class="name">
								{{item.name}}
							</view>
						</view>
						<view class="member-li">
							<view class="imgs">
								<image src="" mode="aspectFit" class="user-add"></image>
							</view>
							<view class="name">
								邀请
							</view>
						</view>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="row" @tap="modify('gname','群名称','asd', true)">
						<view class="title" >
							群名称
						</view>
						<view class="cont">
							今天天气
						</view>
						<view class="more">
							<image src="../chatroom/img/avatar1.jpg" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">
							群头像
						</view>
						<view class="cont">
							<view class="user-head" v-if="id === uid">
								<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
								
								<image :src="gimg" @tap="upload" class="group-img"></image>
							</view>
						<!-- 	<image :src="gimg" mode="aspectFill" class="group-img"></image> -->
						</view>
						<view class="more">
							<image src="../chatroom/img/avatar1.jpg" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modify('gnotice','群公告','asd', true)">
						<view class="title">
							群公告
						</view>
						<view class="cont">
							今天天气
						</view>
						<view class="more">
							<image src="../chatroom/img/avatar1.jpg" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row" @tap="modify('giname','群内名','asd', true)">
						<view class="title">
							群内名
						</view>
						<view class="cont">
							今天天气
						</view>
						<view class="more">
							<image src="../chatroom/img/avatar1.jpg" mode="aspectFill"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">
							消息免打扰
						</view>
						<view class="cont">
						</view>
						<view class="more">
						<switch :checked="swit" @change="switchChange" color="rgba(255,228,49,1)" class="switch" />
						</view>
					</view>
				</view>
				<view class="bt2">
					解散群
				</view>
			</view>
			<view v-show="showModify" :style="{bottom:-+widHeight+'px'}" :animation="animationData1" class="modify animate__animated animate__slideInUp animate__faster">
				<view class="modify-header ">
					<view class="close" @click="showModify=false">退出</view>
					<view class="title">{{modifyTitle}}</view>
					<view class="define" @tap="modifySub">保存</view>
				</view>
				<view class="modify-main">
				<textarea v-model="data" class="modify-content" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				gid:'',
				gimg:'',
				swit:false,
				top:0,
				groupmember:[],
				animationData1:{},
				tempFilePath: "",
				modifyTitle:'',
				data:'',
				oldData:'',
				type:'',
				animationData:{},
				isModfiy:false,
				widHeight:'1000',
			}
		},
		onLoad:function(e){
			this.gid=e.gid;
			this.gimg = e.gimg;
			this.getMember();
		},
		onReady:function(){
			this.getTop();
		},
		components:{ImageCropper},
		methods: {
			backOnePage() {
				uni.navigateBack({
					delta:1
				})
			},
			//滑块监听
			switchChange:function(){
				console
			},
			//获取页面高度
			getTop() {
				// console.log(this.top)
				const query = uni.createSelectorQuery().in(this)
				query.select('.main-inner').boundingClientRect(data=>{
					this.top = data.top
					console.log(this.top)
				})
			},
			//顶部切换动画
			addAnimat:function(){
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'linear',
				})
				if(this.top<60){
					animation.opacity(1).step();
				}else{
					animation.opacity(0).step();
				}
				this.animationData1 = animation.export();
			}
			},
			
			getMember:function(){
				let members = datas.Friends();
				for(let i=0;i<members.length;i++){
					members[i].imgurl = '../../static/images/img' + members[i].imgurl;
					this.groupmember.push(members[i])
				}
			},
						// 群头像裁剪
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

			confirm(e) {
				this.tempFilePath = "";
				this.gimg = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				
				// uni.uploadFile({
				// 	url: this.serverUrl+'/files/upload',	//"后端地址上传图片接口地址",
				// 	filePath: this.headimg,
				// 	name: "file",
				// 	fileType: "image",
				// 	formData:{
				// 		url: 'user',
				// 		name: this.uid,		//文件名
				// 		token: this.token
				// 	},		// 传递参数
				// 	success: (uploadFileRes) => {
				// 		var backstr = uploadFileRes.data;	// 上传的图片 
				// 		// 更新本地存储信息
				// 		try {
				// 			uni.setStorageSync('user', {
				// 				'id':this.uid,
				// 				'name':this.myname,
				// 				'imgurl':backstr, 
				// 				'token':this.token,
				// 			})
				// 		} catch(e) {
				// 			console.log('数据存储错误')
				// 		}
				// 		this.update(backstr, 'imgurl', undefined)
				// 		// console.log(backstr)
				// 	},
				
				// 	fail(e) {
				// 		// console.log("this is errormes " + e.message);
				// 	},
				// });
			},
			cancel() {
				this.tempFilePath = "";
			},
			modify(t, type, oldData, hasPwd) {
				this.showModify=true
				
				if(this.showModify) {
					this.modifyTitle = type
					this.data = oldData
					
					this.olddata = oldData
					this.type = t
				}
			},
			// 确定提交修改项
			modifySub(){
				// 未修改不提交
				if(this.data.length>0 && this.data !==this.olddata){
					if(this.type === 'markname'){// 修改好友昵称
						this.updateFriendMN()
						this.markname = this.data
						// console.log(this.markname,this.data)
					}
					else if(this.type === 'email'){
						let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-z0-9]+\.([a-zA-z]{2,4})$/
						if(reg.test(this.data)) {
							this.update(this.data, this.type,)	// 更新
							this.user[this.type] = this.data	// 页面更新
						}else {
							uni.showToast({
							    title: '邮箱格式错误',
									icon:'none',
							    duration: 1500
							});
						}
					}
					
					else {		//修改其他项
						this.update(this.data, this.type,)	// 更新
						this.user[this.type] = this.data	// 页面更新
					}
					// this.showModify = false
					
				} else {
					uni.showToast({
					    title: '未修改内容',
							icon:'none',
					    duration: 1500
					});
				}
			},
			onPageScroll:function(){
				this.getTop();
				this.addAnimat()
			},
		}
	
</script>

<style lang="scss">
	@import '../../commons/css/mycss.scss';
	.clear{clear:both;}
	.bgbar{
		opacity: 0;
		background-color: #fff;
	}
	.bg{
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;
		.bg-img{
			width: 100%;
			height: 750px;
		}
	}
	.main{
		padding-top: 360rpx;
		.main-inner{
			width: 100%;
			min-height: 720rpx;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
		}
		.inf{
			padding: $uni-spacing-row-base $uni-spacing-col-base 0;
			padding-bottom: 40rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #eee;
			.name{
				float: left;
				font-size: 48rpx;
				font-weight: 600;
				color: #272832;
				line-height: 66rpx;
			}
			.time{
				float: right;
				font-size: 28rpx;
				color: rgba(39, 40, 50, 0.5);
				line-height: 66rpx;
			}
			.notice{
				padding-top: 20rpx;
				
				clear: both;
				font-size: 28rpx;
				color: #272832;
				line-height: 40rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
		.member{
			border-bottom: 1px solid #eee;
			.top{
				padding: $uni-spacing-row-base $uni-spacing-col-base 0;
				box-sizing: border-box;
				height: 100rpx;
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.title{
					flex: 1;
					font-size: 36rpx;
					font-weight: 600;
					color: #272832;
				}
				.more{
					float: right;
					padding-right: 20rpx;
					font-size: 32rpx;
					font-weight: 400;
					color: rgba(39, 40, 50, 0.6);
				}
				.more-img{
					width: 16rpx;
					height: 28rpx;
				}
			}
			.member-ls{
				width: 100%;
				padding: 20rpx 16rpx;
				box-sizing: border-box;
			}
			.member-li{
				padding-bottom: 32rpx;
				width: 20%;
				float: left;
				text-align: center;
				.imgs{
					display: inline-block;
					position: relative;
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
					background-color: $uni-color-primary;
				}
				.user-img{
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
				}
				.delete{
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					top: -16rpx;
					right: -16rpx;
					z-index: 10;
				}
				.name{
					padding:0 8rpx;
					font-size: 28rpx;
					color: #272832;
					line-height: 40rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
				.user-add{
					width: 104rpx;
					height: 104rpx;
					padding: 32rpx;
					box-sizing: border-box;
				}
			}
		}
		.mitem{
				display: flex;
				flex-direction: column;
				padding-top: 22rpx;
				border-bottom: 1px solid #eee;
				width: 100%;
				.row {
					display: flex;
					flex-direction: row;
				}
				.title {
					flex: none;
					padding: 0 $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
				}
				.head {
					display: flex;
					align-items: center;
				}
				.cont {
					
					flex: auto;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
					height: 112rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.group-img{
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
					margin-top: 16rpx;
				}
				.user-head {
					flex: auto;
				}
				.user-img {
					width: $uni-img-size-lg;
					height: $uni-img-size-lg;
					border-radius: $uni-border-radius-base;
				}
				.more {
					flex: none;
					padding-right: 18rpx;
					display: flex;
					align-items: center;
					height: 112rpx;
					i {
						font-size: $uni-font-size-lg;
						color: $uni-text-color-grey;
					}
			 }
			 .switch{
				 margin-right: 22rpx;
			 }
		}
		.bt2{
			margin-top: 80rpx;
			text-align: center;
			font-size: $uni-font-size-lg;
			color: $uni-color-warning;
			line-height: 88rpx;
			padding-bottom: env(safe-area-inset-bottom);
		}
	}
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
			// 密码框
			.modify-pwd-bar {
				padding: 0 22rpx;
				margin-bottom: $uni-spacing-col-base;
				flex: auto;
				width: 94%;
				height: 88rpx;
				background: $uni-bg-color-grey;
				border-radius: $uni-border-radius-base;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}
		}
	}
</style>
