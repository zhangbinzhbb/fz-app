<template>
  <section :style="{backgroundImage:'url('+require('@/assets/images/1.png')+')'}" class="wh_container">
    <div
      :class="{'wh_content_all_height':isHg,'wh_content_all_bg':isHg}"
      :style="{'background-color':bgColor}"
      class="wh_content_all">
      <!-- pre-next -->
      <div v-if="isDate" class="wh_top_changge">
        <li v-if="direction" @click="PreMonth(myDate,false)">
          <div class="wh_jiantou1"/>
        </li>
        <li class="wh_content_li">{{ dateTop }}</li>
        <li v-if="direction" @click="NextMonth(myDate,false)">
          <div class="wh_jiantou2"/>
        </li>
      </div>
      <!-- 星期 -->
      <div class="wh_content wh_content_time">
        <div v-for="(tag,index) in textTop" :key="index" class="wh_content_item">
          <div class="wh_top_tag">{{ tag }}</div>
        </div>
      </div>
      <!-- 日期-时间 -->
      <div class="wh_content wh_content_day">
        <div v-for="(item,index) in list" :key="index" class="wh_content_item" @click="clickDay(item,index)">
          <div
            :class="[
              { wh_isMark: item.isMark},
              {wh_other_dayhide:item.otherMonth!=='nowMonth'},
              {wh_want_dayhide:item.dayHide},
              {wh_isToday:item.isToday && chooseFlag },
              {wh_chose_day:item.chooseDay},
              setClass(item)
            ]"
            class="wh_item_date"
          >{{ item.id }}
          </div>
        </div>
      </div>
    </div>
    <div :class="{'wh-calendar-way-active':isHg}" class="wh-calendar-way">
      <img src="@/assets/images/schedule/icon-top.png" @click="changeWayHanle">
    </div>
  </section>
</template>
<script>
import timeUtil from './calendar'
export default {
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ['一', '二', '三', '四', '五', '六', '日']
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    },
    direction: {
      type: Boolean,
      default: true
    },
    bgColor: {
      type: String,
      default: ''
    },
    isDate: {
      type: Boolean,
      default: true
    },
    selectDete: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTop: '',
      chooseFlag: true,
      isHg: true,
      chooseTime: ''
    }
  },
  watch: {
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    isHg: {
      handler(val, oldVal) {
        this.getList(this.myDate)
      },
      deep: true
    },
    selectDete: {
      handler(val, oldVal) {
        this.chooseFlag = false
        this.getList(this.myDate)
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart()
        this.getList(this.myDate)
      },
      deep: true
    }
  },
  created() {
    this.intStart()
    this.myDate = new Date()
  },
  mounted() {
    this.getList(this.myDate)
  },
  methods: {
    changeWayHanle() {
      this.isHg = !this.isHg
    },
    intStart() {
      timeUtil.sundayStart = this.sundayStart
    },
    setClass(data) {
      const obj = {}
      obj[data.markClassName] = data.markClassName
      return obj
    },
    clickDay(item, index) {
      this.chooseFlag = false
      if (item.otherMonth === 'nowMonth' && !item.dayHide) {
        this.getList(this.myDate, item.date)
        this.chooseFlag = false
      }
      if (item.otherMonth !== 'nowMonth') {
        item.otherMonth === 'preMonth'
          ? this.PreMonth(item.date)
          : this.NextMonth(item.date)
        this.chooseFlag = false
      }
    },
    ChoseMonth(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = new Date(date)
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    PreMonth(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'preMonth')
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    NextMonth(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date)
      this.myDate = timeUtil.getOtherMonth(this.myDate, 'nextMonth')
      this.$emit('changeMonth', timeUtil.dateFormat(this.myDate))
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay)
      } else {
        this.getList(this.myDate)
      }
    },
    forMatArgs() {
      let markDate = this.markDate
      let markDateMore = this.markDateMore
      markDate = markDate.map(k => {
        return timeUtil.dateFormat(k)
      })
      markDateMore = markDateMore.map(k => {
        k.date = timeUtil.dateFormat(k.date)
        return k
      })
      return [markDate, markDateMore]
    },
    getList(date, chooseDay, isChosedDay = true) {
      const [markDate, markDateMore] = this.forMatArgs()
      this.dateTop = `${date.getFullYear()}年${date.getMonth() + 1}月`
      const arr = timeUtil.getMonthList(this.myDate)
      for (let i = 0; i < arr.length; i++) {
        let markClassName = ''
        const k = arr[i]
        k.chooseDay = false
        const nowTime = k.date
        const t = new Date(nowTime).getTime() / 1000
        // 看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || ''
          }
        }
        // 标记选中某些天 设置class
        k.markClassName = markClassName
        k.isMark = markDate.indexOf(nowTime) > -1
        // 无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide
        if (k.isToday) {
          this.$emit('isToday', nowTime)
        }
        const flag = !k.dayHide && k.otherMonth === 'nowMonth'
        if (chooseDay && chooseDay === nowTime && flag) {
          this.$emit('choseDay', nowTime)
          this.chooseTime = nowTime
          this.historyChose.push(nowTime)
          k.chooseDay = true
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime &&
          !chooseDay &&
          flag
        ) {
          k.chooseDay = true
        }
      }
      let index = 0
      const result = []
      if (this.isHg) {
        const getYDate = this.chooseFlag ? this.getQueryDate() : this.chooseTime
        if (this.chooseTime) {
          this.selectDete = ''
        }
        const selectDete = this.selectDete
        for (let i = 0; i < arr.length; i += 7) {
          result.push(arr.slice(i, i + 7))
        }

        if (selectDete) {
          index = this.getFilterDate(result, selectDete)
        } else {
          index = this.getFilterDate(result, getYDate)
        }
      }
      this.list = this.isHg ? result[index] : arr
    },
    getFilterDate(result, key) {
      for (let i = 0; i < result.length; i++) {
        if (result[i].length) {
          for (let k = 0; k < result[i].length; k++) {
            if (result[i][k].date === key) {
              return i
            }
          }
        }
      }
    },
    getQueryDate() {
      const newDate = new Date()
      const year = newDate.getFullYear() // 获取完整的年份(4位,1970-????)
      let month = newDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let date = newDate.getDate() // 获取当前日(1-31)
      month = month < 10 ? month : month
      date = date < 10 ? date : date
      const result = year + '/' + month + '/' + date
      return result
    }
  }
}
</script>

<style lang="scss">
.wh_container{
  background-size: cover;
  .wh_content_all{
    padding: 0 30px 16px;
  }
  .wh_content_time{
    display: flex;
    padding: 36px 0 26px;
    .wh_content_item{
      width: 14%;
      .wh_top_tag{
        font-size:22px;
        color:rgba(255,255,255,1);
        text-align: center;
      }
    }
  }
}

.wh_content_all {
  // background-color: #B60005;
  overflow: hidden;
}

.wh-calendar-way{
  // background-color: #b60005;
  height: 48px;
  img{
    width:97px;
    height: 97px;
    display: block;
    margin: 0 auto;
  }
}
.wh-calendar-way-active{
  img{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* IE 9 */
    -moz-transform:rotate(180deg); /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari and Chrome */
    -o-transform:rotate(180deg); /* Opera */
  }
}

@media screen and (min-width: 460px) {
  .wh_item_date:hover {
    background: #71c7a5;
    cursor: pointer;
  }
}

.wh_container {
  width: 100%;
}

.wh_top_changge {
  display: flex;
}

.wh_top_changge li {
  cursor: pointer;
  display: flex;
  color: #fff;
  font-size: 18px;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 47px;
}

.wh_top_changge .wh_content_li {
  cursor: auto;
  flex: 2.5;
}

.wh_content_all_height {
  height: 168px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}

.wh_content:first-child .wh_content_item_tag,
.wh_content:first-child .wh_content_item {
  color: #ddd;
  font-size: 16px;
}

.wh_content_item,
wh_content_item_tag {
  font-size: 15px;
  width: 14%;
  text-align: center;
  color: #fff;
  position: relative;
}

.wh_content_item {
  font-family: DINCondensed-Bold!important;
}

.wh_top_tag {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_item_date {
  width: 66px;
  height: 66px;
  line-height: 66px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size:34px;
  font-weight:400;
  font-family: DINCondensed-Bold!important;
}

.wh_jiantou1 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  transform: rotate(-45deg);
}

.wh_jiantou1:active,
.wh_jiantou2:active {
  border-color: #ddd;
}

.wh_jiantou2 {
  width: 12px;
  height: 12px;
  border-top: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  transform: rotate(45deg);
}

.wh_content_item>.wh_isMark {
  margin: auto;
  border-radius: 100px;
  background: blue;
  z-index: 2;
}

.wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}

.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}

.wh_content_item .wh_isToday {
  background: #fff;
  color: #000;
  border-radius: 100px;
}

.wh_content_item .wh_chose_day {
  background: #fff;
  color: #000;
  border-radius: 100px;
}

</style>
