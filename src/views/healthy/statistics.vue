<template>
  <div class="healthy-statistics has-comment">
    <headerx cat-title="健康统计"/>
    <div class="comment-content no-comment">
      <div>
        <h2 class="deadline-t">数据截至{{ detail.subDate }}</h2>
        <div class="statistics-header">
          <div class="item">
            <p class="t1">到岗</p>
            <p class="t2">{{ detail.todayPost }}</p>
            <p class="t3">较昨日{{ detail.todayPost - detail.yesterdayPost }}</p>
          </div>
          <div class="item">
            <p class="t1">健康</p>
            <p class="t2">{{ detail.todayHealth }}</p>
            <p class="t3">较昨日{{ detail.todayHealth - detail.yesterdayHealtht }}</p>
          </div>
          <div class="item">
            <p class="t1">异常</p>
            <p class="t2">{{ detail.todayUnUnHealth }}</p>
            <p class="t3">较昨日{{ detail.todayUnUnHealth - detail.yesterdayUnUnHealth }}</p>
          </div>
          <div class="item">
            <p class="t1">未返苏</p>
            <p class="t2">{{ detail.todayNSuz }}</p>
            <p class="t3">较昨日{{ detail.todayNSuz - detail.yesterdayNSu }}</p>
          </div>
        </div>
        <div class="chart-area">
          <ve-line :data="chartData" height="327px"/>
        </div>
        <div class="table-content">
          <healthyTable :data-sheet="dataSheet"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    healthyTable: () => import('@/views/healthy/index')
  },
  data() {
    return {
      tableHeader: [
        '填报日期', '到岗', '健康状态', '已采取措施'
      ],
      List: [],
      chartData: {
        columns: ['日期', '在岗', '异常'],
        rows: []
      },
      dataSheet: [],
      detail: ''
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const URL = '/dailyHealthyAction/statistic.do'
      this.$axios.get(
        URL,
        {},
        res => {
          const data = res.dataContent
          this.detail = data

          const groupStatisticList = data.groupStatisticList
          const d = []
          groupStatisticList.map(item => {
            const NAME = item.NAME
            const COME = `${item.POST}/${item.SHOULDPOST}`
            const HEALTH = `${item.HEALTH}/${item.UNHEALTH}`
            const BYWAY = item.BYWAY
            const TOUCH = item.TOUCH
            const NSUZ = item.NSUZ
            const arr = [NAME, COME, HEALTH, BYWAY, TOUCH, 0, NSUZ]
            d.push(arr)
          })
          this.dataSheet = d

          const healthTrendList = data.healthTrendList
          const arr = []
          healthTrendList.map(item => {
            arr.push({
              '日期': item.DATESTR,
              '在岗': item.POST,
              '异常': item.SITUATION
            })
          })
          this.$set(this.chartData, 'rows', arr)
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.healthy-statistics{
  .deadline-t{
    font-size: 34px;
    padding: 10px 20px 10px 0;
    text-align: right;
  }
  .statistics-header{
    background-color: #fff;
    display: flex;
    padding: 20px 0;
    .item{
      flex: 1;
      color:#333;
      text-align: center;
      .t1{
        font-size:36px;
      }
      .t2{
        font-size:48px;
        padding: 5px 0;
      }
      .t3{
        font-size:24px;
      }
    }
  }
  .chart-area{
    background-color: #fff;
    margin: 20px 0;
  }
  .table-content{
    background-color: #fff;
  }
}
</style>
