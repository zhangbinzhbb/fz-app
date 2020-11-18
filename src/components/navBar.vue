/*
 * @Author: Wendy
 * @Date: 2019-11-27 08:23:33
 * @Last Modified by: Wendy
 * @Last Modified time: 2019-11-27 08:23:33
 * 不需要：可删除
 */
<template>
  <div>
    <router-view/>
    <mt-tabbar :class="{'isiPhonex':isx}" class="foot">
      <mt-tab-item id="Home">
        <router-link to="/home">
          <div class="mint-tab-item-icon">
            <img
              v-if="$route.name === 'Home'"
              slot="icon"
              src="@/assets/images/icon/home-active.png"
            >
            <img v-else slot="icon" src="@/assets/images/icon/home.png" alt>
          </div>
          <span :class="{'active':$route.name === 'Home'}">首页</span>
        </router-link>
      </mt-tab-item>
      <mt-tab-item id="Process">
        <router-link to="/process">
          <div class="mint-tab-item-icon">
            <img
              v-if="$route.name === 'Process'"
              slot="icon"
              src="@/assets/images/icon/process-active.png"
            >
            <img v-else slot="icon" src="@/assets/images/icon/process.png" alt>
            <div v-if="numb.taskCount>0" class="Numb">
              <p>{{ numb.taskCount>99?'99+':numb.taskCount }}</p>
            </div>
          </div>
          <span :class="{'active':$route.name === 'Process'}">流程中心</span>
        </router-link>
        <!-- <router-link to="myTask.html">
        </router-link>-->
      </mt-tab-item>
      <mt-tab-item id="discuss">
        <!-- <a :href="'http://58.211.245.60:9080/eipserver/static/mobileimweb_new.html?userId='+userInfo.userId"> -->
        <a href="javascript:void(0)" @click="turnToDetail()">
          <div class="mint-tab-item-icon">
            <img slot="icon" src="@/assets/images/icon/discuss.png">
            <div v-if="disscussShow" class="discussNumb"/>
          </div>社群
        </a>
      </mt-tab-item>
      <mt-tab-item id="Mail">
        <router-link to="Mail">
          <div class="mint-tab-item-icon">
            <img
              v-if="$route.name === 'Mail'"
              slot="icon"
              src="@/assets/images/icon/mail-active.png"
            >
            <img v-else slot="icon" src="@/assets/images/icon/mail.png" alt>
          </div>
          <span :class="{'active':$route.name === 'Mail'}">通讯录</span>
        </router-link>
      </mt-tab-item>
      <mt-tab-item id="Center">
        <router-link to="Center">
          <div class="mint-tab-item-icon">
            <img
              v-if="$route.name === 'Center'"
              slot="icon"
              src="@/assets/images/icon/profile-active.png"
            >
            <img v-else slot="icon" src="@/assets/images/icon/profile.png" alt>
          </div>
          <span :class="{'active':$route.name === 'Center'}">我的</span>
        </router-link>
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isx: false,
      timer: null,
      numb: {},
      disscussShow: false,
      userInfo: this.storage.get('yh-user') || {}
    }
  },
  watch: {
    '$route.name'(val) {}
  },
  created() {
    this.getList()
    clearInterval(this.timer)
    this.getDisscussNum()

    this.timer = setInterval(() => {
      this.getDisscussNum()
    }, 60000)
  },
  activated() {
    console.log('activated-nav')
    this.getList()
  },
  destroyed() {
    clearInterval(this.timer)
  },
  mounted() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      const isIphoneX = () => {
        return (
          /iphone/gi.test(navigator.userAgent) &&
          (screen.height === 812 && screen.width == 375)
        )
      }
      if (isIphoneX()) {
        this.isx = true
      }
    }
  },
  methods: {
    getList() {
      const uid = this.storage.get('yh-user').userId
      this.$axios.get(
        '/EipCountAction/getTaskCount.do',
        { userId: uid },
        res => {
          this.numb = res.dataContent
        }
      )
    },
    turnToDetail() {
      appcan.window.open('mobileimweb', './mobileimweb.html', 0, 4)
      this.disscussShow = false
    },
    //    获取 群聊
    getDisscussNum() {
      this.$axios.get('/EipCountAction/getCountStatistics.do', {}, res => {
        if (res.dataContent.IMCount > 0) {
          this.disscussShow = true
        } else {
          this.disscussShow = false
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.foot {
  position: fixed;
  z-index: 9999;
  display: none;
}
.isiPhonex {
  height: 130px;
}
.active {
  color: #b70007;
}
</style>
