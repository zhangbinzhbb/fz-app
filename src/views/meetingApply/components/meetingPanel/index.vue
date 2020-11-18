<template>
  <div class="meeting-panel-contanier">
    <div class="meeting-panel-left">
      <ul class="time-content">
        <li v-for="(item,index) in time" :key="index">{{ item }}</li>
      </ul>
    </div>
    <div class="meeting-panel-right">
      <div class="meeting-room">
        <swiper :options="swiperOption">
          <swiper-slide v-for="(item,index) in timeList" :key="index" class="swiper-slide-room">
            <room :time-obj="item" :num="index"/>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import room from './room'
import mixins from './mixins/index'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    room,
    swiper,
    swiperSlide
  },
  mixins: [mixins],
  props: {
    searchDate: String
  },
  data() {
    return {
      timeList: [],
      swiperOption: {
        slidesPerView: 'auto'
      }
    }
  },
  watch: {
    searchDate(time) {
      this.getList(true)
    }
  },
  created() {
    // const time = '2019-12-29 08:10'
    // const time1 = '2019-12-31 17:20'
    // const t_obj = this.filterTime(time)
    // const t_obj1 = this.filterTime(time1)

    // console.log('t_obj:', t_obj)
    // console.log('t_obj1:', t_obj1)
    // const index = t_obj1.index - t_obj.index
    // const half = t_obj1.half - t_obj.half
    // console.log('index:', index)
    // // 确认top、height
    // // const top_index = t_obj.index + (t_obj.half) / 10
    // const top_index = t_obj.index * 7.5
    // // 一格位90 总共1194 占比7.5
    // console.log('top_index:', top_index)

    // const itemObj = {
    //   name: t_obj.label,
    //   name1: t_obj1.label,
    //   top: top_index
    // }
    this.getList(true)
  },
  methods: {
    getList(isFirst) {
      const URL = '/MyApplyMeetingAction/getMeetingPanel.do'
      this.$axios.get(
        URL,
        {
          searchDate: this.searchDate
        },
        res => {
          const list = res.dataContent
          this.timeList = this.init(list)
        }
      )
    },
    init(list) {
      const arr = []
      list.forEach(item => {
        let t_obj = ''
        let t_obj1 = ''
        let index = ''
        let half = ''
        let top_index = ''

        if (item.SubList.length) {
          item.SubList.forEach(sitem => {
            if (item.MEETING_ROOM_ID === sitem.MEETING_ROOM_ID + '') {
              const itemObj = {
                name: '',
                name1: '',
                top: '',
                h: ''
              }
              const obj = {
                id: '',
                title: '',
                list: []
              }
              t_obj = this.filterTime(sitem.MEETING_START_TIME)
              t_obj1 = this.filterTime(sitem.MEETING_END_TIME)

              index = t_obj1.index - t_obj.index
              half = Math.abs(Number(t_obj1.half - t_obj.half))
              // top_index = t_obj.index * 7.70
              top_index = (t_obj.index + t_obj.half / 100) * 7.70
              // 选中的会议室 一格是15.4%
              itemObj.name = t_obj.label
              itemObj.name1 = t_obj1.label
              itemObj.top = top_index // 一格位90 总共1194 占比7.5
              // 69+
              // itemObj.h = (index * 7.70) || 7.70
              itemObj.h = half ? (index + half / 100) * 7.70 + 2 || 7.70 : index * 7.70 || 7.70
              obj.id = item.MEETING_ROOM_ID
              obj.title = item.MEETING_ROOM_NAME
              obj.list.push(itemObj)
              arr.push(obj)
            }
          })
        } else {
          const obj = {
            id: '',
            title: '',
            list: []
          }
          obj.id = item.MEETING_ROOM_ID
          obj.title = item.MEETING_ROOM_NAME
          arr.push(obj)
        }
      })

      var map = {}, dest = []
      for (var i = 0; i < arr.length; i++) {
        var ai = arr[i]
        if (!map[ai.id]) {
          dest.push({
            id: ai.id,
            title: ai.title,
            list: ai.list
          })
          map[ai.id] = ai
        } else {
          for (var j = 0; j < dest.length; j++) {
            var dj = dest[j]
            if (dj.id === ai.id) {
              dj.list = [...dj.list, ...ai.list]
              break
            }
          }
        }
      }
      return dest
    },
    filterTime(time) {
      if (!time) return
      const time_a = time.split(':')
      const firstTime = time_a[0]
      const lastTime = time_a[1]
      // 判断多出时间结算
      // const half_time = lastTime.substring(0, 1)
      const half_time = lastTime
      let s_index = null
      this.time1.forEach((item, index) => {
        if (item.indexOf(firstTime) > -1) {
          s_index = index
        }
      })
      const obj = {
        label: time,
        index: s_index,
        half: half_time
      }
      return obj
    }
  }
}
</script>

<style lang="scss" scoped>
.meeting-panel-contanier{
  display: flex;
  border-top: 2px solid rgba(245,245,245,1);
  .meeting-panel-left{
    padding-top:80px;
    box-sizing: border-box;
    border-right: 2px solid rgba(245,245,245,1);
    .time-content{
      li{
        font-size:28px;
        font-weight:500;
        height: 90px;
        line-height: 90px;
        text-align: center;
        background:rgba(248,248,248,1);
        box-sizing: border-box;
        color:rgba(45,57,56,1);
        padding: 0 13px;
        &:first-child{
          border-top: 1px solid rgba(233,233,233,1);
        }
        &:last-child{
          border-top: 1px solid rgba(233,233,233,1);
        }
        &+li{
          border-top: 1px solid rgba(233,233,233,1);
        }
      }
    }
  }
  .meeting-panel-right{
    width: 100%;
    overflow: hidden;
    .meeting-room{
      display: flex;
      .swiper-slide-room{
        width: 135px;
      }
    }
  }
}
</style>
