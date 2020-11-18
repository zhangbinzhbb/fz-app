<template>
  <div>
    <div class="short-key" @click="popupVisible = true">
      <img src="@/assets/images/icon/plus.png" alt>
    </div>
    <!-- pop-transition -->
    <!-- 点击加号的弹出框 -->
    <van-popup v-model="popupVisible" :style="{ height: '40%' }" position="bottom">
      <div class="short-key-con">
        <ul class="short-key-list">
          <li
            v-for="(item,index) in iconList"
            v-if="
              (isPageHome&&item.page!='project')
            ||(!isPageHome&&item.page!='index')"
            v-show="$route.name!=item.url"
            :key="index"
          >
            <div>
              <img :src="item.img" alt @click="toJumpHandler(item)">
            </div>
            {{ item.name }}
          </li>
          <li>
            <div @click="popupVisible = false">
              <img src="@/assets/images/icon/short-close.png" alt>
            </div>关闭
          </li>
        </ul>
      </div>

    </van-popup>
  </div>
</template>

<script>
import projectNew from '@/assets/images/icon/short-project.png'
import scheduleNew from '@/assets/images/icon/short-process.png'
import visitNew from '@/assets/images/icon/short-reception.png'
import projectProcessNew from '@/assets/images/icon/short-project2.png'
import leaveNew from '@/assets/images/icon/short-leave.png'
import meetingFileAdd from '@/assets/images/icon/meetFile.png'
import projectXm from '@/assets/images/icon/short-work.png'
import projectQy from '@/assets/images/icon/short-work.png'
import meetingNew from '@/assets/images/icon/short-work.png'
import shortSign from '@/assets/images/icon/short-sign.png'

export default {
  name: 'ShortCut',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      popupVisible: false,
      isPageHome: true,
      iconList: [
        // {
        //   name: '新建项目',
        //   img: projectNew,
        //   url: 'projectNew',
        //   page: 'all'
        // },
        {
          name: '新建日程',
          img: scheduleNew,
          url: 'scheduleNew',
          page: 'index'
        },
        {
          name: '来访接待',
          img: visitNew,
          url: 'visitAdd',
          page: 'index'
        },
        {
          name: '项目进展',
          img: projectProcessNew,
          url: 'projectHomeProcessNew',
          page: 'all'
        },
        {
          name: '请假',
          img: leaveNew,
          url: 'leaveAdd',
          page: 'index'
        },
        {
          name: '会议记录',
          img: meetingFileAdd,
          url: 'meetingRecordAdd',
          page: 'all'
        },
        {
          name: '项目维度',
          img: projectXm,
          url: 'projectIndex',
          page: 'project'
        },
        {
          name: '企业维度',
          img: projectQy,
          url: 'projectXm',
          page: 'project'
        },
        {
          name: '会议申请',
          img: meetingNew,
          url: 'meetingNew',
          page: 'index'
        },
        {
          name: '签到',
          img: shortSign,
          url: 'signInCode',
          page: 'index'
        }
      ]
    }
  },
  watch: {
    '$route.name'(val) {
      this.closePopup()
    },
    popupVisible(val) {
      const yhApplications = this.storage.get('yh-applications') || {}
      let projectFlag = false
      yhApplications.slideMenu.map(item => {
        if (item.cmd === 'project') {
          projectFlag = true
        }
      })
      if (!projectFlag) {
        this.iconList.forEach((item, index) => {
          if (item.name === '项目进展') {
            this.iconList.splice(index, 1)
          }
        })
      }
    }
  },
  created() {
    this.isPageHome = this.$route.path === '/home' || this.$route.path === '/'
  },
  activated() {},
  methods: {
    closePopup() {
      this.popupVisible = false
    },
    toJumpHandler(item) {
      if (item.name === '新建项目') {
        this.$toast('该功能暂未开放')
        return
      }
      // if (item.name === '项目进展') {
      //   this.$toast('该功能暂未开放')
      //   return
      // }
      this.$router.push({ path: item.url })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.short-key {
  width: 72px;
  height: 72px;
  position: fixed;
  bottom: 120px;
  right: 30px;
}
.short-key-con{
  text-align: center;
  .short-key-list {
    color: #000;
    font-size: 24px;
    width: 640px;
    padding: 52px 0 0 0;
    text-align: left;
    display: inline-block;
    li {
      display: inline-block;
      width: 210px;
      margin-bottom: 27px;
      text-align: center;
      img {
        width: 83px;
        margin-bottom: 8px;
      }
      &:last-child {
        margin-left: -8px;
      }
    }
  }
}

</style>
