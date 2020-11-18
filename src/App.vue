<template>
  <div
    id="app"
    :class="{'ios-class':isIos12,'android-class-defalut':isAndroid12,'ios-class-defalut':isIos}"
    class="yh-content"
  >
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="yh-page"/>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="yh-page"/>
    <div v-if="toTopFlag" class="toTop" @click="backTop">
      <img src="@/assets/images/icon/toTop.png" alt>
      顶部
    </div>
  </div>
</template>

<script>
import { checkVersion } from '@/utils/updateVersion'
import { Dialog } from 'vant'
import baseConfig from './utils/constant'

export default {
  name: 'App',
  data() {
    return {
      toTopFlag: false
    }
  },
  watch: {
    '$route.name'(val) {
      this.closeToTop()
    }
  },
  created() {
    this.setHeightTitle()
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener('scroll', this.scrollToTop, true)
    })
  },
  destroyed() {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  methods: {
    toAPP() {
      const u = navigator.userAgent
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      const version = appcan.locStorage.val('version')
      if (isAndroid || version == '3.0.12') return
      Dialog.confirm({
        title: '版本更新',
        message: '是否更新ios版本'
      }).then(() => {
        this.appDown()
      }).catch(() => {})
    },
    // 点击下载按钮判断
    appDown() {
      window.location.href = 'https://itunes.apple.com/cn/app/%E5%85%83%E7%A6%BE%E6%8E%A7%E8%82%A1eip/id1159267162?mt=8'
      this.storage.set('version-update', true)
    },
    // 安卓退出应用
    appExit() {
      let c1c = 0
      appcan.window.monitorKey({
        id: '0',
        enable: '1',
        callback: function(id) {
          if (c1c > 0) {
            // uexWidgetOne.exit(0)
          } else {
            // uexWindow.toast(0, 5, '再按一次退出应用', 2000)
            c1c = 1
            setTimeout(function() {
              c1c = 0
            }, 2000)
          }
        }
      })
    },
    // 更新版本
    updateVerson() {
      const versonId = 2
      let timer
      if (this.baseConfig.ENV !== 'PROD') {
        return
      }
      checkVersion()
      timer = setInterval(() => {
        checkVersion()
      }, 21600000)
      if (appcan.locStorage.val('yh-vue-verson') !== versonId) {
        // if (this.storage.get('yh-vue-verson') !== versonId) {
        timer = setInterval(() => {
          this.$dialog
            .confirm({
              title: '提示',
              message: '是否删除缓存'
            })
            .then(() => {
              if (this.baseConfig.ENV === 'PROD') {
                appcan.locStorage.val('cleanCache', true)
                appcan.locStorage.val('yh-vue-verson', versonId)
                // this.storage.set('cleanCache', true)
                // this.storage.set('yh-vue-verson', versonId)

                alert('clean')
                appcan.window.open({
                  name: 'root',
                  data: 'login.html',
                  aniId: 10,
                  type: 4
                })
              }
            })
            .catch(() => {
              // on cancel
            })
        }, 20000)
      } else {
        clearInterval(timer)
      }
    },
    closeToTop() {
      this.toTopFlag = false
    },
    // 点击回到顶部
    backTop() {
      document.getElementsByClassName('comment-content')[0].scrollTop = 0
    },

    // 超出 出现
    scrollToTop() {
      const that = this
      const el = document.getElementsByClassName('comment-content')[0]
      if (el === undefined) { return }
      const scrollTop = el.scrollTop
      if (this.$route.meta.keepAlive) {
        this.storage.set('scorll-info', { top: scrollTop })
      }
      that.scrollTop = scrollTop
      if (that.scrollTop > 200) {
        this.toTopFlag = true
      } else {
        this.toTopFlag = false
      }
    }
  }
}
document.body.onselectstart = function() {
  return false
}
</script>

<style>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  font-family:PingFangSC-Medium,PingFang SC;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.toTop {
  width: 68px;
  height: 68px;
  position: fixed;
  bottom: 240px;
  right: 30px;
  font-size: 25px;
  text-align: center;
}
</style>
