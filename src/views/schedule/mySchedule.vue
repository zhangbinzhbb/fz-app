<template>
  <div id="myschedule" class="myschedule has-comment">
    <headerx v-if="!flag" cat-title="日程">
      <template slot="right">
        <i class="mintui mintui-more" @click="moreToggle"/>
      </template>
    </headerx>
    <more ref="more" :more-btns="moreBtns">
      <template>
        <div
          v-for="(item,key) in moreBtns"
          :key="key"
          class="item"
          @click="$router.push({path:item.url})"
        >
          <img :src="baseConfig.domain+item.imgSrc" alt>
          {{ item.name }}
        </div>
      </template>
    </more>
    <div class="comment-content no-comment">
      <!-- 其他页面所用 -->
      <div class="schedule-page">
        <van-icon name="arrow-left" class="floatLeft" @click="dayBefore()"/>
        <p class="schedule-page-l" @click="dayBefore()">{{ yesterday }}</p>
        <p class="span" @click="datePicker.show=false">{{ today }}
          <span class="hr"/>
        </p>
        <p class="schedule-page-r" @click="dayAfter()">{{ tomorrow }}</p>
        <van-icon name="arrow" class="floatLeft" @click="dayAfter()" />
      </div>

      <div class="clear"/>
      <p v-if="todayList.length && !flag" class="schedule-title">我的日程</p>
      <div class="clear"/>
      <schedule-item :list="todayList" :date="pageInfo.showDate" :flag="flag" active="1" class="home-schedule-list"/>
      <div v-if="focusList.length && !flag" class>
        <p class="schedule-title">我的关注</p>
        <div class="clear"/>
        <schedule-item :list="focusList" :date="pageInfo.showDate" type="focus"/>
      </div>
      <blank v-if="!pageInfo.isLoading&&todayList.length==0&&focusList.length==0&&!flag"/>
      <van-popup v-model="datePicker.show" position="bottom">
        <van-datetime-picker
          v-model="datePicker.value"
          class="yh-datePicker"
          type="date"
          @confirm="popupConfirm()"
          @cancel="datePicker.show=false"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    scheduleItem: () => import('./components/scheduleItem'),
    more: () => import('@/components/more/index')
  },
  props: {
    flag: {
      type: Number,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      today: '',
      yesterday: '',
      tomorrow: '',
      popupVisible: false,
      datePicker: {
        show: false,
        value: new Date()
      },
      pageInfo: {
        params: {
          curPage: 1,
          pageSize: 100
        },
        list: [],
        postUrl: '/agendaAction/myAgendaListAll.do'
      },
      todayList: [],
      focusList: [],
      moreBtns: [
        {
          name: '新增日程',
          url: 'scheduleNew',
          imgSrc: 'static/images/icon13.png'
        },
        {
          name: '新增关注',
          url: 'follow?pageType=focus',
          imgSrc: 'static/images/icon14.png'
        },
        {
          name: '取消关注',
          url: 'follow?pageType=focusCancel',
          imgSrc: 'static/images/icon15.png'
        }
      ]
    }
  },
  created() {
    this.getQueryDate()
    this.getList(true)
  },
  activated() {
    if (this.storage.get('refresh-schedule-list')) {
      this.getList(true)
      this.storage.remove('refresh-schedule-list')
    }
  },
  methods: {
    moreToggle() {
      this.$refs.more.showToggle()
    },
    close() {
      this.popupVisible = false
    },
    dayBefore() {
      this.getQueryDate('before')
      this.getList(true)
    },
    dayAfter() {
      this.getQueryDate('next')
      this.getList(true)
    },
    getQueryDate(type, newDate) {
      this.pageInfo.showDate = this.pageInfo.showDate || new Date()
      if (type === 'next') {
        newDate = new Date(
          this.pageInfo.showDate.getTime() + 24 * 60 * 60 * 1000
        )
      }
      if (type === 'before') {
        newDate = new Date(
          this.pageInfo.showDate.getTime() - 24 * 60 * 60 * 1000
        )
      }
      newDate = newDate || new Date()
      const year = newDate.getFullYear() // 获取完整的年份(4位,1970-????)
      const month = newDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      const date = newDate.getDate() // 获取当前日(1-31)
      // console.log(year + '-' + month + '-' + date)
      const str = '星期' + '日一二三四五六'.charAt(newDate.getDay())
      // month = month < 10 ? '0' + month : month
      // date = date < 10 ? '0' + date : date
      const result = year + '-' + month + '-' + date + ' ' + str
      this.pageInfo.showDate = newDate
      this.$set(this.pageInfo.params, 'queryDate', result)
      this.today = month + '月' + date + '日'
      const preDate = new Date(newDate.getTime() - 24 * 60 * 60 * 1000)
      const nextDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000)
      const month1 = preDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      const date1 = preDate.getDate() // 获取当前日(1-31)
      // month1 = month1 < 10 ? '0' + month1 : month1
      // date1 = date1 < 10 ? '0' + date1 : date1
      this.yesterday = month1 + '月' + date1 + '日'
      const month2 = nextDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      const date2 = nextDate.getDate() // 获取当前日(1-31)
      // month2 = month2 < 10 ? '0' + month2 : month2
      // date2 = date2 < 10 ? '0' + date2 : date2
      this.tomorrow = month2 + '月' + date2 + '日'
    },
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        const arr = [
          {
            SubList: res.list.myAgendaList.todayList,
            UserId: res.list.myAgendaList.todayList.length
              ? res.list.myAgendaList.todayList[0].UserId
              : null
          }
        ]
        this.todayList = res.list.myAgendaList.todayList.length ? arr : []
        this.focusList = res.list.attentionAgendaList
      })
    },
    popupConfirm() {
      this.getQueryDate(null, this.datePicker.value)
      this.datePicker.show = false
      this.getList(true)
    }
  }
}
</script>
<style scoped lang="scss">
.mint-popup {
  position: fixed;
  background: #fff;
  top: 125px;
  right: -55px;
  left: auto;
  border-radius: 8px;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-transition: 0.2s ease-out;
  transition: 0.2s ease-out;
  ul {
    width: 252px;
    height: 231px;
  }
  &:before {
    display: inline-block;
    width: 0;
    height: 0;
    border: solid transparent;
    border-width: 15px;
    border-bottom-color: #fff;
    content: '';
    position: absolute;
    top: -20px;
    right: 110px;
  }
}
.pop-android {
  top: 85px;
  &::before {
    top: -60px;
  }
}
.mint-popup-2::before {
  display: none;
}
.schedule-page {
  height: 80px;
  background-color: #fff;
  font-size: 28px;
  line-height: 80px;
  padding: 0 40px;
  p {
    line-height: 80px;
    width: 30%;
    text-align: center;
    float: left;
    font-size:24px;
    font-weight:400;
    color:rgba(76,76,76,1);
  }
  .span {
    color: #B60005;
    position: relative;
    font-size:26px;
    .hr {
      width: 44px;
      height: 4px;
      border: 0;
      background: #B60005;
      position: absolute;
      left: calc(50% - 22px);
      z-index: 10;
      bottom: 8%;
      margin-left:0;
    }
  }
  .floatLeft {
    width: 5%;
    float: left;
    color: rgba(76, 76, 76, 0.5);
    line-height: 80px;
    font-size: 28px;
  }
}
.schedule-title {
  float: left;
  color: #000;
  font-size: 30px;
  margin: 20px 0px 20px 20px;
}
.mint-tab-container-item {
  padding-bottom: 40px;
}
.myschedule-ul li {
  width: 210px;
  margin: 0 auto;
  color: #000;
  height: auto;
  border-bottom: 2px solid #e5e5e5;
  line-height: 76px;
  font-size: 30px;
  position: relative;
  a {
    padding-left: 35px;
  }
  img {
    width: 37px;
    height: 37px;
    position: absolute;
    top: 17px;
    left: 10px;
  }
}
.mint-tabbar {
  display: none !important;
}
.mintui-more {
  font-size: 40px !important;
}
.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
</style>

<style lang="scss">
// home - 日程show
.home-schedule-list{
  padding-left:40px;
  padding-right:40px;
  background: #fff;
  .schedule-son2 {
    .schedule-son-lv2{
      ul{
        li{
          padding: 0 40px 20px 42px !important;
          &:before {
            left:12px!important;
          }
          .img-conter{
            left:0!important;
          }
          .title{
            width:400px!important;
          }
        }
      }
    }
  }
}
</style>

