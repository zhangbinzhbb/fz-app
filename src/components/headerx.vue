<template>
  <div class="yh-header-x yhHeader leftToRight yh-header-trans">
    <div class="header">
      <div id="headerTop"/>
      <div v-if="pageType!='home'" class="yh-back-btn" @click="goback()">
        <img src="@/assets/images/icon/back-new.png" alt="" srcset="" class="back" >
      </div>
      <!-- 为了将流程中心的位置靠中间显示 -->
      <div v-if="pageType ==='home'" class="back"/>
      <span v-if="catTitle && routerName" class="title" @click="selectMonth">
        <!--  <van-icon name="play" class="bottom-r-icon"/> -->
        {{ catTitle }} <img width="13px" height="7px" src="@/assets/images/bottom-r-icon.png" alt="" srcset="">
      </span>
      <span v-else class="title"> {{ catTitle }} </span>
      <div v-if="!catTitle">
        <slot name="title">{{ pageType }}</slot>
      </div>
      <div class="right-icon">
        <slot name="right"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Headerx',
  props: {
    catTitle: {
      type: String,
      default: () => {
        return null
      }
    },
    pageType: {
      type: String,
      default: () => {
        return null
      }
    },
    backType: {
      type: String,
      default: () => {
        return null
      }
    },
    routerName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isTrans: null
    }
  },
  created() {
    // setHeaderThis()
  },
  methods: {
    goback() {
      if (this.backType === 'closePopup') {
        // ios12关闭右侧弹框时，需要恢复主页面'has-comment'Class
        const yhPage = document.getElementsByClassName('yh-page')
        yhPage[0].children[0].classList.add('has-comment')
        this.$emit('closePopup', this.backType)
        return
      }
      if (this.pageType === 'back') {
        this.$emit('closeBack')
        return
      }
      if (this.$route.query.closeType) {
        window.close()
      } else {
        window.history.back(-1)
      }
    },
    selectMonth() {
      this.$emit('select-month')
    }
  }
}
</script>
<style lang="scss">
#headerTop{
  background: #b70007;
  /*height:0px;*/
}
.yh-header-x {
  width: 100%;
  background: #b70007;
  letter-spacing: 1px;
  line-height: 92px;
  color: #fff;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  text-align: center;
  z-index: 1998;
  box-sizing: border-box;
  .title {
    display: inline-block;
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: absolute;
    font-size:32px;
    color:rgba(255,255,255,1);
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    .bottom-r-icon{
      position: absolute;
      bottom: 30px;
      /* Rotate div */
      transform:rotate(90deg);
      -ms-transform:rotate(90deg); /* Internet Explorer */
      -moz-transform:rotate(90deg); /* Firefox */
      -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
      -o-transform:rotate(90deg); /* Opera */
    }
  }
  .yh-back-btn{
    float: left;
    position: relative;
    top: 27px;
    left:20px;
    width:60px;
    height:60px;
  }
  .back {
    position: absolute;
    left: 0;
    top: 0;
    width:22px;
    height:39px;
  }
  .commentBack {
    width: 30px;
    height: 30px;
    float: left;
    position: relative;
    top: 30px;
    left: 30px;
  }
  .header {
    padding-right: 30px;
    box-sizing: border-box;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.right-icon {
  font-size:30px;
  float: right;
  color:rgba(255,255,255,1);
  display: flex;
  align-items: center;
  height: 100%;
  img{
    width: 40px;
    height: 40px;
  }
}

.yh-header-trans {
  background: #b60005;
  .message {
    display: inline-block;
    width: 50px;
    height: 50px;
    font-size: 20px;
    vertical-align: middle;
    line-height: 58px;
    color: #fff;
  }
}
</style>
