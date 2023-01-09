<template>
	<view>
		
		<fooBar :list="list" @toIndex='toIndex()'></fooBar>
	</view>
</template>

<script>
	import fooBar from '@/components/yx-bottomBar/yx-bottomBar.vue'
	
	export default {
		name:"myFootBar",
		data() {
			return { 
				list: [
					{
						"iconPath": "/static/images/footbar/index1.png",
						"selectedIconPath": "/static/images/footbar/index.png",
						"text": "消息"
					},
					{
						"iconPath": "/static/images/footbar/fi1.png",
						"selectedIconPath": "/static/images/footbar/fi.png",
						"text": "联系人"
					},
					{
						"iconPath": "/static/images/footbar/star1.png",
						"selectedIconPath": "/static/images/footbar/star.png",
						"text": "动态"
					},
				],
			};
		},
		components:{
			fooBar
		},
		
		methods: {
			toIndex (index) {
				// console.log(index)
				this.index = index
				if(index === 0){
					this.url = '/pages/index/index'
					this.toPage()
				} else if(index === 1) {
					
					this.url = '/pages/search/search'
					this.toPage()
				}
			},
	
		}
	}
</script>

<style lang="scss">

</style>
