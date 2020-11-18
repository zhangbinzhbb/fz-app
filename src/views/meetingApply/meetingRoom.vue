<template>
  <div class="meetingRoom" style="background: #fff;">
    <headerx
      :cat-title="catTitle"
      router-name="日程"
      page-type="back"
      @select-month="selecTMonthHanle"
      @closeBack="$router.push({path: '/'})">
      <template slot="right">
        <img src="@/assets/images/icon/add.png" alt="" srcset="" @click="moreToggle">
      </template>
    </headerx>
    <!-- 右上角更多 -->
    <more ref="more" :more-btns="moreBtns">
      <template>
        <div
          v-for="(item,key) in moreBtns"
          :key="key"
          class="item"
          @click="$router.push({path:item.url})"
        >
          <img :src="item.imgSrc" alt>
          {{ item.name }}
        </div>
      </template>
    </more>
    <!-- comment-content  -->
    <div class="no-comment">
      <div class="schedule-page">
        <div class="calendar-content">
          <Calendar
            id="toTop"
            ref="Calendar"
            :text-top="textTop"
            :is-date="false"
            :is-hg="isShow"
            :select-dete="selectDete"
            @choseDay="choseDayHandler"
          />
        </div>
        <meeting-panel :search-date="searchDate" :style="{marginTop:maxTop?'120px':''}" class="meeting-panel-content"/>
      </div>
    </div>

    <van-popup v-model="show" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        class="yh-datePicker"
        type="date"
        @cancel="cancelHanle"
        @confirm="confirmHanle"
      />
    </van-popup>
  </div>
</template>

<script>
import Calendar from '@/components/vueCalendarComponent/index'
import meetingPanel from './components/meetingPanel/index'
export default {
  components: {
    more: () => import('@/components/more/index'),
    Calendar,
    meetingPanel
  },
  data() {
    return {
      moreBtns: [
        {
          name: '会议申请',
          url: 'meetingNew',
          imgSrc: require('@/assets/images/more/meeting-apply.png')
        },
        {
          name: '申请记录',
          url: 'meetingList',
          imgSrc: require('@/assets/images/more/meeting-record.png')
        }
      ],
      catTitle: '',
      show: false,
      currentDate: new Date(),
      // 日期控件
      textTop: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      isShow: true,
      selectDete: '',
      searchDate: '',
      maxTop: false
    }
  },
  created() {
    const newDate = new Date()
    const y = this.getQueryDate(newDate)
    this.setDateInit(y)
    if (y) {
      const time = this.getQueryDate(new Date(), 1)
      this.searchDate = time
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() { // 改变元素#searchBar的top值
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop// 滚动条距离顶部的距离
      if (scrollTop > 140) {
        // console.log('大于140')
        // this.maxTop = true
      }
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
    choseDayHandler(value) {
      const time = this.setDateInit(value)
      this.searchDate = time
    },
    changeWayHanle() {
      this.isShow = !this.isShow
    },
    moreToggle() {
      this.$refs.more.showToggle()
    },
    selecTMonthHanle() {
      this.show = true
    },
    cancelHanle() {
      this.show = false
    },
    confirmHanle(value) {
      this.show = false
      const y = this.getQueryDate(value)
      const yArray = y.split('/')
      this.catTitle = `${yArray[0]}年 ${yArray[1]}月`
      const time = this.getQueryDate(value, 1)
      this.searchDate = time
      this.selectDete = y
      this.$refs.Calendar.ChoseMonth(y)
    },
    getQueryDate(newDate, type) {
      newDate = newDate || new Date()
      const year = newDate.getFullYear() // 获取完整的年份(4位,1970-????)
      let month = newDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let date = newDate.getDate() // 获取当前日(1-31)
      let result
      if (type === 1) {
        month = month < 10 ? '0' + month : month
        date = date < 10 ? '0' + date : date
        result = year + '-' + month + '-' + date
        return result
      }
      month = month < 10 ? month : month
      date = date < 10 ? date : date
      result = year + '/' + month + '/' + date
      return result
    }
  }
}
</script>
<style lang="scss">
.meetingRoom{
  .comment-content{
    background-color: #fff;
  }
  .meeting-panel-content{
    margin-top:65px;
  }
  .schedule-page {
    height: 100%;
    padding: 0 0px;
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
}
</style>

