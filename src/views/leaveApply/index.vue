<template>
  <div class="">
    <headerx cat-title="请假申请">
      <template slot="right">
        <div v-if="permissions===1">
          <span class="yh-add-more" style="position: relative;top: -2px;" @click="$router.push({path:'/leaveAdd'})">
            <img
              src="@/assets/images/icon/add.png"
              alt=""
              class="classify-search"
            >
          </span>
        </div>
      </template>
    </headerx>
    <div v-if="permissions===1">
      <div class="van-tab-box">
        <!-- <van-tabs v-model="activeYear" @click="checkYear">
          <van-tab
            v-for="(item,index) in yearList"
            :key="index"
            :name="item"
            :title="item"/>
        </van-tabs> -->
        <div class="leave-apply-chart-detail">
          <div class="charts-box">
            <div class="circle">
              <div ref="main" style="width:100px;height:100px"/>
            </div>
            <div :class="HolidayInfoList.length>3?'more-type':''" class="text"> <!-- more-type -->
              <p><i class="progress"/>已用<span>{{ HolidayYear.USEDAYS | format_day }}</span>天</p>
              <p><i class="progress-bar"/>未用<span>{{ HolidayYear.REMAINDAYS | format_day }}</span>天</p>
            </div>
          </div>
          <div v-if="HolidayInfoList.length>0" class="leave-days">
            <ul>
              <li
                v-for="(item,index) in HolidayInfoList"
                :key="index"
                :class="HolidayInfoList.length>3?'more-type':''"
              >
                <span class="title">{{ item.CLASSNAME }}</span>
                <div class="process-box">
                  <div
                    class="progress-bar" >
                    <span v-if="item.USEDAYS!=0&&item.USEDAYS!=item.VACDAYS" :style="{width:((item.USEDAYS)/Number(item.VACDAYS)*100)+'%'}" class="progress">{{ Number(item.USEDAYS) | format_day }}</span>
                  </div>
                  <span class="number">{{ Number(item.VACDAYS) | format_day }}天</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="list">
        <div class="select-time-section">
          <span class="year-name">{{ year || '' }}</span>
          <span class="year-label" @click="isSelectYear = true">年份<van-icon name="arrow-down" /></span>
        </div>
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div v-for="(item, index) in T_Json" :key="index" class="item">
            <img :src="require('@/assets/images/leave/icon'+item.imgType+'.png')" alt="">
            <div class="text">
              <div class="info">
                <p>{{ item.AttendanceType }}</p>
                <p>{{ item.STARTDATE }} {{ item.StartTime }}至{{ item.ENDDATE }} {{ item.EndTime }}</p>
              </div>
              <p class="tag">{{ item.Hours | format_day }}天</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="T_Json.length<=0" class="notlist">
        <img src="@/assets/images/icon/blank.png" alt="">
      </div>

      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&T_Json.length>5"/>
      <van-popup
        v-model="isSelectYear"
        :style="{ height: '260px' }"
        position="bottom"
      >
        <van-picker
          :columns="columns"
          show-toolbar
          class="yh-datePicker"
          @confirm="selectYearchanga"
          @cancel="isSelectYear=false"
        />
      </van-popup>
    </div>
    <div
      v-else-if="permissions===2"
      style="font-size: 20px;
    margin: 40px 0;text-align:center"
    >EHR申请人信息为空,请联系管理员</div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  filters: {
    format_day(v) {
      if (v) {
        if (Number(v) > 0) {
          return Number(v).toFixed(1)
        } else {
          return 0
        }
      }
      return 0
    }
  },
  props: {},
  data() {
    this.chartSettings = {
      radius: [30, '100%'],
      offsetY: 50,
      hoverAnimation: false,
      legendHoverLink: false,
      label: {
        show: true,
        position: 'center',
        formatter: '年休假'
      },
      labelLine: {
        show: false
      },
      itemStyle: {
        color: seriesIndex => {
          if (seriesIndex.dataIndex === 0) {
            return {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#FDC06CFF' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#FFC958FF' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          } else {
            return {
              type: 'linear',
              x: 0,
              y: 1,
              x2: 0,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#FA8E69FF' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#F76D55FF' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          }
        }
      }
    }
    return {
      permissions: 0,
      yearList: [],
      activeYear: '',
      year: '',
      HolidayYear: {}, // 年休假
      HolidayInfoList: [], // 其他休假

      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          startDate: '',
          endDate: '',
          LeavePersonId: ''
        },
        postType: 'post',
        list: [],
        postUrl: '/LeaveListAction/GetLeaveHistory.do'
      },
      isSelectYear: false,
      columns: [],
      T_Json: [] // 请假列表
    }
  },
  computed: {
    formatterYear(v) {
      return v + ''
    }
  },
  watch: {
    year(v) {
      console.log('v:', v)
      this.pageInfo.params.startDate = v + '-01-01'
      this.pageInfo.params.endDate = v + '-12-31'
      this.getList(true)
    }
  },
  created() {
    this.getInfo()
  },
  mounted() {},
  methods: {
    initYear() {
      this.activeYear = new Date().getFullYear()
      this.year = new Date().getFullYear()
      let activeYear = new Date().getFullYear()
      const list = []
      const picklist = []
      for (let i = 0; i < 10; i++) {
        picklist.push(activeYear + '')
        activeYear -= 1
      }
      list.push('其他')
      this.yearList = list
      console.log(activeYear + '')
      this.columns = picklist
    },
    getInfo() {
      const userInfo = this.storage.get('yh-user') || null
      this.$axios.get(
        '/LeaveListAction/leaveList.do',
        {
          loginName: userInfo.loginName
        },
        res => {
          const data = res.dataContent
          if (data.userInfo) {
            this.permissions = 2
          } else {
            this.permissions = 1
            this.pageInfo.params.LeavePersonId = data.PersonEntity.PersonId || ''
            this.initYear()
            if (data.HolidayInformation.T_Json) {
              this.HolidayInfoList = data.HolidayInformation.T_Json.filter(i => {
                return i.CLASSNAME !== '年休假'
              })
              this.HolidayYear = data.HolidayInformation.T_Json.filter(i => {
                return i.CLASSNAME === '年休假'
              })[0]

              this.$nextTick(() => {
                this.setEchart(this.HolidayYear)
              })
            }
          }
        }
      )
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst, res => {
          if (!res.list.T_Json) {
            this.T_Json = []
            return
          }
          this.T_Json = res.list.T_Json.map(i => {
            if (i.AttendanceType.indexOf('年休假') > -1) {
              i.imgType = '01'
            } else if (i.AttendanceType.indexOf('带薪病假') > -1) {
              i.imgType = '02'
            } else if (i.AttendanceType.indexOf('事假') > -1) {
              i.imgType = '03'
            } else if (i.AttendanceType.indexOf('扣薪病假') > -1) {
              i.imgType = '04'
            } else if (i.AttendanceType.indexOf('婚嫁') > -1) {
              i.imgType = '05'
            } else if (i.AttendanceType.indexOf('产假') > -1) {
              i.imgType = '06'
            } else if (i.AttendanceType.indexOf('丧假') > -1) {
              i.imgType = '07'
            } else if (i.AttendanceType.indexOf('护理假') > -1) {
              i.imgType = '08'
            } else {
              i.imgType = '09'
            }
            return i
          })
        })
    },
    checkYear(item) {
      this.activeYear = item
      if (item === '其他') {
        this.isSelectYear = true
        return
      }
      this.year = item
    },
    selectYearchanga(v) {
      this.year = v
      this.isSelectYear = false
    },
    loadMore() {
      this.getList(false)
    },
    setEchart(data) {
      const main = this.$refs.main
      if (!main) return
      var myChart = echarts.init(main)
      myChart.setOption({
        tooltip: {
          show: false,
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          show: false,
          orient: 'vertical',
          x: 'left',
          data: ['剩余', '已使用']
        },
        color: ['#FDC06C', '#FA8E69'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['60%', '100%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            silent: true,
            label: {
              normal: {
                position: 'center',
                formatter: '年休假',
                color: '#333333'

              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { name: '剩余', value: data.REMAINDAYS },
              { name: '已使用', value: data.USEDAYS }
            ]
          }
        ]
      })
    }
  }
}
</script>
<style lang="scss">
.select-time-section{
  height:110px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  border-bottom: 1px solid #F0F0F0;
  .year-name{
    font-size:34px;
    font-weight:bold;
    color:rgba(182,0,5,1);
  }
  .year-label{
    font-size:28px;
  }
}
.van-tab-box {
  .van-tabs__nav{
    display: flex !important;
    justify-content: space-around !important;
  }
  .van-tabs__line{
    bottom: 20px;
    width: 44px !important;
  }
  .van-tab{
    width: 20% !important;
    flex-basis:16% !important;
  }
  .van-tabs--line .van-tabs__wrap {
    height: 100px;
    line-height: 100px;
    .van-tabs__nav--line {
      margin-bottom: 18px;
      padding-bottom: 0;
    }
    .van-tabs__line {
      height: 5px;
      background-color: #b60005;
    }
    .van-tab span {
      line-height: 100px;
      font-weight: bold;
    }
  }
}
.leave-apply-chart-detail{
  background-color: #fff;
  margin-top: 18px;
  padding: 40px 30px 50px 30px;
  display: flex;
  justify-content: space-around;
  .progress-bar{
   background-color: #FEC65F;
  }
  .progress{
    // background-color: #F98362;
    background: linear-gradient(to bottom,#f9ac97, #F98362, #f9ac97)
  }

  .charts-box{
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    justify-items: center;
    align-items: center;
    // .circle{
    //   width: 220px;
    //   height: 220px;
    // }
    &>span{
      font-size: 28px;
      position:absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
    }
    .text{
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      margin-top: 16px;
      color: #666;
      &.more-type{
        flex-flow: column nowrap;
        justify-content: flex-start;
      }
      p{
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: flex-end;
        margin: 8px;
        color: #3C3C3CFF;
        line-height: 20px;
        i{
          display: block;
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
        span{
          font-size: 32px;
          line-height: 24px;
          margin: 0 4px;
        }
      }
    }
  }
  .leave-days{
    background:rgba(248,248,248,1);
    box-sizing: border-box;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    ul{
      li{
        margin: 10px 20px;
        .title{
          font-size:28px;
          font-weight:400;
          color:#4C4C4CFF;
          line-height: normal;
          margin: 10px 0 10px 10px;
        }
        .process-box{
          display: flex;
          align-items: center;
          margin: 10px 0 10px 10px;
          .progress-bar{
            height:38px;
            position: relative;
            width: 160px;
            .progress{
              height:100%;
              position: absolute;
              left: 0;
              text-align: center;
              line-height:38px;
              font-size: 30px;
              color: #fff;
            }
          }
          .number{
            font-size:30px;
            font-weight:bold;
            color:rgba(76,76,76,1);
            padding-left: 10px;
          }
        }
        &.more-type{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin: 10px 0;
           .title{
            width: 120px;
            text-align: right;
          }
        }
      }
    }
  }
}
.list{
  margin-top: 20px;
  .item{
    padding: 30px 0 30px 30px;
    background: #fff;
    border-bottom: 1px solid #efefef;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 32px;
    img{
      width: 80px;
      height: 80px;
      margin-right: 20px;
    }
    .text{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: calc(100% - 140px);
      .info{
        height: 80px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        p:first-child{
          color: #333333;
        }
        p:last-child{
          color: #999999;
          font-size: 26px;
        }
      }
      .tag{
        padding: 8px 12px;
        background: #feefe1;
        color: #eb7e28;
        font-size: 24px;
      }
    }
  }
}
.notlist{
  display: block;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 180px 0;
  background: #fff;
  img{
    width: 300px;
  }
}
</style>
