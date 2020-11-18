<template>
  <div id="myschedule" class="myschedule has-comment" style="margin-top: -1px;">
    <headerx v-if="!flag" :cat-title="catTitle" router-name="日程" page-type="back" @closeBack="$router.push({path: '/'})" @select-month="selecTMonthHanle">
      <template slot="right">
        <img src="@/assets/images/icon/add.png" alt="" srcset="" @click="moreToggle">
      </template>
    </headerx>
    <more ref="more" :more-btns="moreBtns">
      <template>
        <div
          v-for="(item,key) in moreBtns"
          :key="key"
          class="item"
          @click="toRouter(item)"
        >
          <img :src="item.imgSrc" alt>
          {{ item.name }}
        </div>
      </template>
    </more>
    <div class="comment-content no-comment" style="height:100%;">
      <div class="schedule-page">
        <div class="calendar-page">
          <div class="calendar-content">
            <Calendar
              ref="Calendar"
              :text-top="textTop"
              :is-date="false"
              :is-hg="isShow"
              :select-dete="selectDete"
              @choseDay="choseDayHandler"
            />
          </div>
        </div>
        <div class="tabs-content">
          <ul class="tabs-title">
            <li v-for="item in tabNav" :key="item.value" @click="tabChange(item.value)">
              <span :class="{'name-active':item.value===active}" class="name">{{ item.label }}</span>
              <span v-if="item.value===active" class="active"/>
            </li>
          </ul>
          <div class="content">
            <div v-if="active=='2'">
              <schedule-item :list="focusList" :date="pageInfo.showDate" :active="active" type="focus"/>
              <blank v-if="!pageInfo.isLoading&&focusList.length==0" class="yh-blank-empty"/>
            </div>
            <div v-else>
              <schedule-item :list="todayList" :date="pageInfo.showDate" :flag="flag" :active="active"/>
              <blank v-if="!pageInfo.isLoading&&todayList.length==0" class="yh-blank-empty"/>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="datePicker.show" position="bottom">
      <van-datetime-picker
        v-model="datePicker.value"
        class="yh-datePicker"
        type="date"
        @confirm="popupConfirm()"
        @cancel="datePicker.show=false"
      />
    </van-popup>
    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        class="yh-datePicker"
        type="date"
        @cancel="cancelHanle"
        @confirm="confirmHanle"
      />
    </van-popup>
    <vueTreeSelect ref="rightPopupTreeSelect" :default-array="usersList" cat-title="新增关注" @select-change="userSelectChange"/>
    <loading-box v-model="globalLoading" type="2"/>
  </div>
</template>
<script>
import Calendar from '@/components/vueCalendarComponent/index'
import { toWeekName } from '@/utils/filter.js'
export default {
  components: {
    scheduleItem: () => import('./components/scheduleItem'),
    more: () => import('@/components/more/index'),
    vueTreeSelect: () => import('@/components/vueTreeSelect/index'),
    Calendar
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
          imgSrc: require('@/assets/images/more/scheduleNew.png')
        },
        {
          name: '新增关注',
          url: 'follow?pageType=focus',
          imgSrc: require('@/assets/images/more/scheduleAdd.png')
        },
        {
          name: '取消关注',
          url: 'follow?pageType=focusCancel',
          imgSrc: require('@/assets/images/more/scheduleReduce.png')
        }
      ],
      catTitle: '2019年 03月',
      show: false,
      currentDate: new Date(),
      textTop: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isShow: true,
      selectDete: '',
      tabNav: [
        {
          label: '我的日程',
          value: '1'
        },
        {
          label: '关注日程',
          value: '2'
        }
      ],
      active: '1',
      usersList: []
    }
  },
  created() {
    const newDate = new Date()
    const y = this.getQueryDateTitle(newDate)
    const yArray = y.split('/')
    this.catTitle = `${yArray[0]}年 ${yArray[1]}月`
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
    userSelectChange(arr) {
      if (arr.length > 0) {
        this.checkedArray = []
        arr.forEach(item => {
          this.checkedArray.push(item.value)
        })
        this.commonFocusUpdate(true)
      }
    },
    commonFocusUpdate(status) {
      this.focusUpdate(status)
    },
    toRouter(item) {
      if (item.name === '新增关注') {
        this.$refs.rightPopupTreeSelect.showPopup()
        this.$refs.more.showToggle()
        return
      }
      this.$router.push({ path: item.url })
    },
    moreToggle() {
      this.$refs.more.showToggle()
    },
    changeWayHanle() {
      this.isShow = !this.isShow
    },
    close() {
      this.popupVisible = false
    },
    choseDayHandler(time) {
      const weekDay = toWeekName(time)
      const newDate = this.setDateInit(time)
      const result = `${newDate} ${weekDay}`
      this.$set(this.pageInfo.params, 'queryDate', result)
      if (result) this.getList(true)
    },
    setDateInit(time) {
      const yArray = time.split('/')
      this.catTitle = `${yArray[0]}年 ${yArray[1]}月`
      let month = yArray[1]
      let day = yArray[2]
      const year = yArray[0]
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      const result = year + '-' + month + '-' + day
      return result
    },
    getQueryDateTitle(newDate) {
      newDate = newDate || new Date()
      const year = newDate.getFullYear() // 获取完整的年份(4位,1970-????)
      let month = newDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let date = newDate.getDate() // 获取当前日(1-31)
      // let str = '星期' + '日一二三四五六'.charAt(newDate.getDay())
      month = month < 10 ? month : month
      date = date < 10 ? date : date
      // const result = year + '-' + month + '-' + date + ' ' + str
      const result = year + '/' + month + '/' + date
      return result
    },
    selecTMonthHanle() {
      this.show = true
    },
    cancelHanle() {
      this.show = false
    },
    confirmHanle(value) {
      this.show = false
      const y = this.getQueryDateTitle(value)
      const yArray = y.split('/')
      this.catTitle = `${yArray[0]}年 ${yArray[1]}月`
      this.selectDete = y
      this.$refs.Calendar.ChoseMonth(y)
    },
    tabChange(index) {
      this.active = index
    },
    /*  */
    /*  */
    /*  */
    getQueryDate(type, newDate) {
      this.pageInfo.showDate = this.pageInfo.showDate || new Date()
      if (type === 'now') {
        const lyear = newDate.substr(0, 4)
        const lstr = newDate.substr(5)
        const lmonth = lstr.substr(0, lstr.indexOf('/')) - 1
        const lday = lstr.substr(lstr.indexOf('/') + 1)
        this.pageInfo.showDate = new Date(lyear, lmonth, lday)
        newDate = new Date(
          this.pageInfo.showDate.getTime()
        )
      }
      newDate = newDate || new Date()
      const year = newDate.getFullYear() // 获取完整的年份(4位,1970-????)
      let month = newDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let date = newDate.getDate() // 获取当前日(1-31)
      const str = '星期' + '日一二三四五六'.charAt(newDate.getDay())
      month = month < 10 ? '0' + month : month
      date = date < 10 ? '0' + date : date
      const result = year + '-' + month + '-' + date + ' ' + str
      this.pageInfo.showDate = newDate
      this.$set(this.pageInfo.params, 'queryDate', result)
      this.today = month + '月' + date + '日'
      const preDate = new Date(newDate.getTime() - 24 * 60 * 60 * 1000)
      const nextDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000)
      let month1 = preDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let date1 = preDate.getDate() // 获取当前日(1-31)
      month1 = month1 < 10 ? '0' + month1 : month1
      date1 = date1 < 10 ? '0' + date1 : date1
      this.yesterday = month1 + '月' + date1 + '日'
      let month2 = nextDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let date2 = nextDate.getDate() // 获取当前日(1-31)
      month2 = month2 < 10 ? '0' + month2 : month2
      date2 = date2 < 10 ? '0' + date2 : date2
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
        // this.todayList = res.list.myAgendaList.todayList
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

<style lang="scss" scoped>
.yh-blank-empty{
  padding-top:60px !important;
  padding-bottom: 0!important;
}
.myschedule{
  background-color: #fff;
  .schedule-content{
    padding-left: 40px;
    padding-right: 48px;
  }
  .schedule-page {
    height: auto;
    padding: 0 0px;
    .calendar-page{
      margin-bottom: 50px;
    }
    .calendar-way{
      background-color: #b60005;
      height: 48px;
      img{
        width:97px;
        height: 97px;
        display: block;
        margin: 0 auto;
      }
    }
    .calendar-way-active{
      img{
        transform:rotate(180deg);
        -ms-transform:rotate(180deg); /* IE 9 */
        -moz-transform:rotate(180deg); /* Firefox */
        -webkit-transform:rotate(180deg); /* Safari and Chrome */
        -o-transform:rotate(180deg); /* Opera */
      }
    }
  }

  .tabs-content{
    .tabs-title{
      padding: 12px 0 44px;
      display: flex;
      justify-content: center;
      li{
        cursor: pointer;
        display: flex;
        flex-direction: column;
        .name{
          // width:104px;
          padding: 0 5px;
          height:37px;
          font-size:26px;
          font-weight:500;
          color:rgba(76,76,76,1);
          line-height:37px;
          margin-bottom: 5px;
        }
        .name-active{
          color:rgba(182,0,5,1);
          font-weight: bold;
        }
        .active{
          width:44px;
          height:4px;
          margin:0 auto;
          background:rgba(182,0,5,1);
          border-radius:5px;
        }
        &+li{
          padding-left:64px;
        }
      }
    }
    .content{
      text-align: left;
    }
  }
}

</style>
