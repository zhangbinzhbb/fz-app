<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="填报统计">
      <template slot="right">
        <span class="yh-add-more" @click="handleClick">
          <img
            src="@/assets/images/icon/filter.png"
            alt="分类搜索"
            class="classify-search"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <div class="charts-title">项目定期更新</div>
      <div class="charts-con">
        <ve-histogram
          :settings="chartSettings"
          :y-axis="yAxis"
          :extend="chartExtend"
          :tooltip="tooltip"
          :data="chartData"
          :grid="grid"
          :legend="legend"
          height="327px"/>
      </div>
      <div
        v-if="detail.quarterReportQY.length"
        class="normal-item"
      >
        <div class="table-content">
          <table class="yh-table" cellspacing="0" border="2">
            <tr class="header">
              <th v-for="(item,index) in statisticsForm" :key="index">{{ item.label }}</th>
            </tr>
            <tr
              v-for="(td,key) in detail.quarterReportQY"
              :key="key"
            >
              <td>{{ td.userName }}</td>
              <td @click="toFinishRouter(td,'1')"><span class="f-underline">{{ td.isFinishNum }}</span></td>
              <td @click="toNotFinishRouter(td,'1')"><span class="f-underline">{{ td.isNotFinishNum }}</span></td>
              <td>{{ td.isFinishRate }}</td>
              <td>{{ td.isFinishRateOnTime }}</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="charts-title">基金定期更新</div>
      <div class="charts-con">
        <ve-histogram
          :settings="chartSettings"
          :y-axis="yAxis"
          :extend="chartExtend"
          :tooltip="tooltip"
          :data="chartData1"
          :grid="grid"
          :legend="legend "
          height="327px"/>
      </div>
      <div
        v-if="detail.quarterReportJJ.length"
        class="normal-item"
      >
        <div class="table-content">
          <table class="yh-table" cellspacing="0" border="2">
            <tr class="header">
              <th v-for="(item,index) in statisticsForm" :key="index">{{ item.label }}</th>
            </tr>
            <tr
              v-for="(td,key) in detail.quarterReportJJ"
              :key="key"
            >
              <td>{{ td.userName }}</td>
              <td @click="toFinishRouter(td,'2')"><span class="f-underline">{{ td.isFinishNum }}</span></td>
              <td @click="toNotFinishRouter(td,'2')"><span class="f-underline">{{ td.isNotFinishNum }}</span></td>
              <td>{{ td.isFinishRate }}</td>
              <td>{{ td.isFinishRateOnTime }}</td>
            </tr>
          </table>
        </div>
      </div>

    </div>
    <search-filter
      ref="rightPopup"
      :filter-list="filterList"
      :column="true"
      :radio="true"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>
<script>

export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half')
  },
  data() {
    this.colors = ['#FA8E69', '#FDA244']
    this.chartSettings = {
      stack: { '数量': ['完成数量', '未完成数量'] },
      showLine: ['完成率', '按时完成率'],
      axisSite: { right: ['完成率', '按时完成率'] }
    }
    this.tooltip = {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line' // 默认为直线，可选为：'line' | 'shadow'
      },
      formatter: function(params) { // 改鼠标悬浮提示值格式
        let relVal = params[0].name + '<br/>'
        if (params[0].seriesName !== undefined) {
          relVal += params[0].seriesName + ' : ' + Math.abs(params[0].value) + '<br/>'
          relVal += params[1].seriesName + ' : ' + Math.abs(params[1].value) + '<br/>'
          relVal += params[2].seriesName + ' : ' + Math.abs(params[2].value) + '%' + '<br/>'
          relVal += params[3].seriesName + ' : ' + Math.abs(params[3].value) + '%' + '<br/>'
        }
        return relVal
      }
    }
    this.yAxis = [
      {
        name: '数量',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: this.colors[0]
          }
        },
        axisTick: { show: false },
        splitLine: { show: false }
      },
      {
        name: '比例%',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: this.colors[1]
          }
        },
        axisTick: { show: false },
        splitLine: { show: true }
      }
    ]
    this.grid = {
      bottom: '6%'
    }
    this.chartExtend = {
      color: ['#FA8E69', '#FDA244', '#FDC06C', '#F6F49D'],
      series: { barWidth: 30 }
    }
    this.legend = {
      selectedMode: false,
      itemWidth: 10,
      itemGap: 5
    }
    return {
      showPicker: false,
      detail: { quarterReportQY: [], quarterReportJJ: [] },
      pkId: this.$route.query.pkId || 6,
      groupId: this.$route.query.groupId || 3,
      groupName: this.$route.query.groupName || '元禾控股',
      select: {
        defaultYearIndex: 0,
        platStatics: {
          year: this.getYear(),
          quarter: this.getQuarter()
        },
        year: 0,
        quarterYearList: [],
        quarterList: [
          {
            id: 1,
            name: '第一季度'
          },
          {
            id: 2,
            name: '第二季度'
          },
          {
            id: 3,
            name: '第三季度'
          },
          {
            id: 4,
            name: '第四季度'
          }
        ]
      },
      filterList: [
        {
          name: '年份',
          subList: [],
          labelName: 'label',
          labelId: 'value',
          radio: true
        },
        {
          name: '季度',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        }
      ],
      // quarterList:[]
      statisticsForm: [
        {
          label: '填报人员',
          name: ''
        },
        {
          label: '已完成',
          name: ''
        },
        {
          label: '未完成',
          name: ''
        },
        {
          label: '完成率',
          name: ''
        },
        {
          label: '按时完成率',
          name: ''
        }
      ],
      chartData: {
        columns: ['日期', '完成数量', '未完成数量', '完成率', '按时完成率'],
        rows: []
      },
      chartData1: {
        columns: ['日期', '完成数量', '未完成数量', '完成率', '按时完成率'],
        rows: []
      }
    }
  },
  created() {
    // this.getYearList()
    this.getAllYearList()
  },
  methods: {
    toNotFinishRouter(item, type) {
      const isNotFinishNum = item.isNotFinishNum
      if (isNotFinishNum === '0') {
        this.Toast('当前数量为0')
        return
      }
      const groupId = this.groupId
      const name = item.userName
      const sendMonthName = item.sendMonthName
      const str1 = sendMonthName.slice(0, 4)
      const str2 = sendMonthName.slice(6, 7)
      const time = `${str1}-${str2}`
      this.$router.push({ path: '/platStaticsNotFinished', query: { groupId, name, time, type }})
    },
    toFinishRouter(item, type) {
      const isFinishNum = item.isFinishNum
      if (isFinishNum === '0') {
        this.Toast('当前数量为0')
        return
      }
      const groupId = this.groupId
      const name = item.userName
      const sendMonthName = item.sendMonthName
      const str1 = sendMonthName.slice(0, 4)
      const str2 = sendMonthName.slice(6, 7)
      const time = `${str1}-${str2}`
      this.$router.push({ path: '/platStaticsFinished', query: { groupId, name, time, type }})
    },
    // 获取当前季度
    getCurrentQuarter() {
      const date = new Date()
      let year = date.getFullYear()
      const month = date.getMonth() + 1
      let quarter = ''
      const quarter1 = [1, 2, 3]
      const quarter2 = [4, 5, 6]
      const quarter3 = [7, 8, 9]
      const quarter4 = [10, 11, 12]
      // includes的用法----判断一个字符串或数组是否包含一个指定的值
      // 返回值：
      // true：如果搜索字符串在给定字符串内的任何地方找到;返回true
      // false：如果没有找到返回false
      if (quarter1.includes(month)) {
        year = year - 1
        quarter = '-' + 3
      } else if (quarter2.includes(month)) {
        year = year - 1
        quarter = '-' + 4
      } else if (quarter3.includes(month)) {
        quarter = '-' + 1
      } else if (quarter4.includes(month)) {
        quarter = '-' + 2
      }
      return year + quarter
    },
    // 平台填报统计-所有季度
    // getYearList() {
    //   const URL = '/eiMyHandle/getSendMonthAll'
    //   this.$axios.get(URL, {}, res => {
    //     const data = res.data.options
    //     const lableArr = []
    //     const quarter = this.getCurrentQuarter()
    //     data.map(item => {
    //       if (item.value === quarter) {
    //         this.select.platStatics.year = item.label
    //         this.getInit(item.value, item.label)
    //         item.isChecked = true
    //       }
    //       lableArr.push(item.label)
    //     })
    //     this.$set(this.filterList[0], 'subList', data)
    //     this.select.quarterYearList = lableArr
    //   })
    // },
    getAllYearList() {
      const URL = '/getYear'
      this.$axios.get(
        URL,
        {},
        res => {
          const data = res.data.model
          const arr = []

          const quarter = this.getCurrentQuarter()
          const quarterArr = quarter.split('-')
          const quarterList = [
            {
              value: '1',
              label: '第一季度'
            },
            {
              value: '2',
              label: '第二季度'
            },
            {
              value: '3',
              label: '第三季度'
            },
            {
              value: '4',
              label: '第四季度'
            }
          ]

          let year = ''
          let q = ''
          let q1 = ''
          data.forEach((item) => {
            const obj = {
              value: item.sendMonth,
              label: item.sendMonth
            }
            if (item.sendMonth === quarterArr[0]) {
              obj.isChecked = true
              year = item.sendMonth
            }
            arr.push(obj)
          })

          quarterList.forEach(item => {
            if (item.value === quarterArr[1]) {
              item.isChecked = true
              q = item.value
              q1 = item.label
            }
          })

          const v = `${year}-${q}`
          const b = `${year}年${q1}`

          if (v) {
            this.getInit(v, b)
          }

          this.$set(this.filterList[0], 'subList', arr)
          this.$set(this.filterList[1], 'subList', quarterList)
        }
      )
    },
    getInit(sendMonths, sendMonthNames) {
      this.getChartList(sendMonths, sendMonthNames)
      this.getTableList(sendMonths, sendMonthNames)
      this.getFundChartList(sendMonths, sendMonthNames)
      this.getFundTableList(sendMonths, sendMonthNames)
    },
    getChartList(sendMonths, sendMonthNames) {
      const URL = '/eiMyHandle/eiMyHandleForChart'
      const groupIds = this.groupId
      const groupNames = this.groupName
      this.$axios.get(
        URL,
        {
          sendMonths,
          sendMonthNames,
          groupIds,
          groupNames
        },
        res => {
          const data = res.data.eiMyHandleForChart
          // abscissa 季度
          // isFinishNum 完成数量
          // isNotFinishNum 未完成数量
          // isFinishRate 完成率
          // isFinishRateOnTime 按时完成率
          const arr = []
          data.map(item => {
            arr.push({
              '日期': item.abscissa,
              '完成数量': item.isFinishNum,
              '未完成数量': item.isNotFinishNum,
              '完成率': (item.isFinishRate * 100).toFixed(2),
              '按时完成率': (item.isFinishRateOnTime * 100).toFixed(2)
            })
          })
          this.$set(this.chartData, 'rows', arr)
        }
      )
    },
    getTableList(sendMonth, sendMonthName) {
      const URL = '/eiMyHandle/eiMyHandleDetail'
      const groupId = this.groupId
      const groupName = this.groupName
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          groupId,
          groupName,
          sendMonth,
          sendMonthName
        },
        res => {
          const data = res.data
          this.$set(this.detail, 'quarterReportQY', data)
        }
      )
    },
    getFundChartList(sendMonths, sendMonthNames) {
      const URL = '/eiPushFund/eiPushFundForChart'
      const groupIds = this.groupId
      const groupNames = this.groupName
      this.$axios.get(
        URL,
        {
          sendMonths,
          sendMonthNames,
          groupIds,
          groupNames
        },
        res => {
          const data = res.data.eiPushFundForChart
          const arr = []
          data.map(item => {
            arr.push({
              '日期': item.abscissa,
              '完成数量': item.isFinishNum,
              '未完成数量': item.isNotFinishNum,
              '完成率': (item.isFinishRate * 100).toFixed(2),
              '按时完成率': (item.isFinishRateOnTime * 100).toFixed(2)
            })
          })
          this.$set(this.chartData1, 'rows', arr)
        }
      )
    },
    getFundTableList(sendMonth, sendMonthName) {
      const URL = '/eiPushFund/eiPushFundDetail'
      const groupId = this.groupId
      const groupName = this.groupName
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          groupId,
          groupName,
          sendMonth,
          sendMonthName
        },
        res => {
          console.log('res.data:', res)
          const data = res.data
          this.$set(this.detail, 'quarterReportJJ', data)
        }
      )
    },
    // search-filter 分类筛选
    searchConfirm(obj) {
      const getChecked = (list, keyWord, keyWord1) => {
        const arr = []
        const arrLabel = []
        list.map(item => {
          if (item.isChecked) {
            arr.push(item[keyWord])
            arrLabel.push(item[keyWord1])
          }
        })
        return [arr, arrLabel]
      }

      // sendMonths：所选季度逗号分隔 2019-1
      // sendMonthNames：所选季度名逗号分隔  2019年第1季度
      // groupIds：所选平台id逗号分隔
      // groupNames：逗号分隔平台名称逗号分隔
      const arr = []
      this.filterList.map(item => {
        arr.push(getChecked(item.subList, item.labelId, item.labelName))
      })

      const a1 = arr[0]
      const a2 = arr[1]
      const b1 = a2[0]
      const b2 = a2[1]
      const sendMonthsArr = []
      b1.forEach(item => {
        const str = `${a1[0]}-${item}`
        sendMonthsArr.push(str)
      })

      const sendMonthsArr1 = []
      b2.forEach(item => {
        const str = `${a1[0]}年${item}`
        sendMonthsArr1.push(str)
      })
      const sendMonths = sendMonthsArr.join(',')
      const sendMonthNames = sendMonthsArr1.join(',')
      this.getInit(sendMonths, sendMonthNames)
    },
    searchReset() {
      const sendMonths = ''
      const sendMonthNames = ''
      this.getInit(sendMonths, sendMonthNames)
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
    },
    getYear() {
      const date = new Date()
      const year = date.getFullYear()
      return year.toString()
    },
    getQuarter() {
      const date = new Date()
      const month = date.getMonth() + 1
      return Math.ceil(month / 3) - 2
    }
  }
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     if (from.name === 'platform') {}
  //   })
  // }
}
</script>
<style scoped lang="scss">
.f-underline{
  text-decoration: underline;
  color:rgba(74,144,226,1);
}
.charts-title{
  font-size:30px;
  font-weight:500;
  color:rgba(76,76,76,1);
  height:88px;
  line-height: 88px;
  padding-left: 40px;
}
.select {
  text-align: center;
  height: 84px;
  line-height: 84px;
  font-size: 26px;
  font-weight: 500;
  color: rgba(76, 76, 76, 1);
  background: white;
}
.charts-con {
  background: white;
  padding-top: 30px;
  margin-bottom: 20px;
}
.select {
  text-align: center;
  height: 84px;
  line-height: 84px;
  font-size: 26px;
  font-weight: 500;
  color: rgba(76, 76, 76, 1);
  background: white;
}

.normal-item {
  text-align: left;
  box-sizing: border-box;
  border-bottom: 2px solid #e8e8e8;
  margin-top: 15px;
  background: white;
  .table-content {
    padding: 25px;
  }
  .title {
    font-size: 30px;
    line-height: 80px;
    color: #444;
    border-bottom: 2px solid #e8e8e8;
    padding: 0 25px;
    font-weight: 500;
  }

  .right {
    // padding-right: 25px;
    font-size: 28px;
    color: #b70007;
    float: right;
  }

  .con {
    padding: 25px;

    .item {
      font-size: 28px;
      color: #555;
      padding-bottom: 15px;
      word-break: break-all;

      .value {
        color: #888;
      }
    }
  }
  .yh-table {
    width: 100%;
    .header {
      th {
        font-size: 26px;
        color: #469eec;
        text-align: center;
        background: #e6f4ff;
        height: 55px;
        line-height: 55px;
        font-weight: normal;
      }
    }

    td {
      font-size: 25px;
      color: #333;
      text-align: center;
      line-height: 45px;
    }
  }
}
</style>
