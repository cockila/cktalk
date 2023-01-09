<template>
  <view class="bottom">
    <view class="nav-box">
      <view class="nav-tab"
            :class="[home===index?'nav-tab-active':'nav-tab-normal']"
            v-for="(item,index) in list"
            :key="index"
            @click="toIndex(index)">
        <view class="nav-icon">
          <view class="circle">
            <image :src="home===index?item.selectedIconPath:item.iconPath"></image>
          </view>
        </view> 
        <view class="nav-text">
          {{item.text}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
   list:Array
  },
  components: {},
  data () {
    return {
      home: 0,
			url: ''
    }
  },
  onLoad () {

  },
  methods: {
    toPage () {
      uni.navigateTo({
				url: this.url
      })
    },
    toIndex (index) {
      this.$emit('toIndex', index)
      this.home = index
			
    }
  }
}
</script>

<style scoped lang="scss">
$navHeight:59px; //导航栏高度
$navBoxHeight:34px; //导航栏盒子高度，XR系列底部HOME健
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: $navHeight;
  // box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.06);
  background: #fff;
  z-index: 10;
}

.nav-tab {
  fiex: 1;
  text-align: center;
  width: 100%;
  height: $navHeight;
}

.nav-icon {
  height: 30px;
  // color: $mediumGrey;
  box-sizing: border-box;
  padding: 4px 0 2px 0;
  .circle {
    image {
      width: 100%;
      height: 100%;
    }
  }
}

.nav-icon .iconfont {
  font-size: 20px;
}

.nav-text {
  font-size: 32rpx;
  height: 19px;
  // color: $mediumGrey;
  font-weight: 200;
}
.nav-tab-normal {
     .nav-icon {
				display:flex;
				align-items: center;
				justify-content: center;
			 }
			.circle {
				height: 20px;
				width: 20px;
				line-height: 38px;
				position: relative;
				border-radius: 50%;
			}
}
.nav-tab-active .circle {
  height: 28px;
  width: 28px;
  line-height: 38px;
  position: relative;
  // top: -14px;
  left: calc(50% - 12px);
  border-radius: 50%;
  // background: $dominantHue;
  // box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  image {
    width: 100%;
    height: 100%;
  }
}

.nav-tab-active .iconfont {
  color: #fff;
}

.nav-tab-active .nav-text {
  // color: $dominantHue;
}
.nav-box {
  /* position: absolute; */
  display: flex;
  width: 100%;
  box-sizing: border-box;
}

/*苹果x适配 H5APP*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .bottom {
    height: $navHeight+$navBoxHeight;
  }
}

/*苹果xs适配 H5APP*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
  .bottom {
    height: $navHeight+$navBoxHeight ;
  }
}

/*苹果xr适配 H5APP*/
@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
  .bottom {
    height: $navHeight+$navBoxHeight;
  }
}
</style>