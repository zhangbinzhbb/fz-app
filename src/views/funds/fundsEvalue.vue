<template>
  <div class="has-comment">
    <headerx cat-title="定期估值">
      <template slot="right"/>
    </headerx>
    <div v-if="activeDt" class="comment-content no-comment">
      <div v-if="isChart" class="chart-con" style="height:5.5rem">
        <ve-line :data="chartData" :settings="chartSettings" :colors="colors" :events="chartEvents" height="6.5rem"/>

      </div>
      <!-- <div id="chart" ref="chart" style="width: 100%;height: 200px" /> -->
      <div v-for="(item, index) in list" :key="index" class="evalue-item" >
        <div class="item">
          <span class="label">估值基准日</span>
          {{ item.valuDt || '--' }}
        </div>
        <div class="item">
          <span class="label">整体估值</span>
          <template v-if="item.wholeVal">
            ￥{{ item.wholeVal }}亿元
          </template>
          <template v-else>--</template>
        </div>
        <div class="item">
          <span class="label">元禾占比</span>
          <template v-if="item.ratioAsLp">
            {{ item.ratioAsLp || '-' }}%
          </template>
          <template v-else>--</template>
        </div>
        <div class="item">
          <span class="label">元禾占比估值</span>
          <template v-if="item.yhVal">
            ￥{{ item.yhVal }}亿元
          </template>
          <template v-else>--</template>
        </div>
        <div class="item">
          <span class="label">填报人</span>
          {{ item.createByName || '--' }}
        </div>
        <div class="item">
          <span class="label">填报时间</span>
          {{ item.createDt || '--' }}
        </div>
      </div>
    </div>
    <blank v-if="list.length===0&&!isLoading"/>
  </div>
</template>
<script>
// import VeLine from 'v-charts/lib/line.common'
export default {
  components: {},
  data() {
    const _this = this
    this.chartEvents = {
      click(e) {
        _this.activeDt = e.name
      }
    }
    return {
      funId: this.$route.query.id,
      isLoading: false,
      isChart: false,
      colors: ['#FA8E69', '#FDA244'],
      chartSettings: {
        area: true
      },
      chartData: {
        columns: ['日期', '估值(亿元)'],
        rows: []
      },
      list: [],
      activeDt: ''
      // activeInfo: {}
    }
  },
  watch: {
    // activeDt(v) {
    //   this.activeInfo = this.list.filter(i => {
    //     return i.valuDt === v
    //   })[0]
    // }
  },
  created() {
    // this.getChart()
    this.getChartData()
    // setTimeout(() => {
    //   this.setChart()
    // }, 2000)
  },
  methods: {
    setChart() {
      const main = this.$refs.chart
      if (!main) return
      var myChart = echarts.init(main)
      myChart.setOption({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {},
          emphasis: {
            itemStyle: {
              color: {}
            }
          }
        }]
      })
      myChart.getZr().on('click', (params) => {
        console.log(params)
      })
    },
    getChart() {
      this.$axios.get(`/bdTFundValuationChart`,
        { fundId: this.funId },
        res => {

        })
    },
    getChartData() {
      this.isLoading = true
      this.$axios.get(`/bdTFundValuationList`,
        { fundId: this.funId,
          length: 100,
          currPage: 1 },
        res => {
          this.isLoading = false
          if (res.data.length > 0) {
            const data = res.data.map(i => {
              return Object.assign({}, i, { time: (new Date(i.valuDt)).getTime() })
            })
            this.chartData.rows = this.sortarr(data).map(i => {
              return {
                '日期': i.valuDt,
                '估值(亿元)': i.wholeVal
              }
            })
            this.list = res.data
            this.activeDt = res.data[0].valuDt
            this.isChart = true
          }
        })
    },
    sortarr(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          /**
           * 比较第j位和j+1的initial值
           * 如果j位的initial值比j+1位的initial值大，那么他们的位置发生交换
           * 如果j位的initial值比j+1位的initial值小，那么位置不变
           */
          if (arr[j].time > arr[j + 1].time) {
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    }
  }
}
</script>
<style scoped lang="scss">
.chart-con{
  background: white;
  margin-bottom: 20px;
  padding-top: 40px;
}
.evalue-item{
  background: white;
  margin-bottom: 20px;
  font-size:32px;
  font-weight:600;
  color:rgba(76,76,76,1);
  line-height:45px;
  padding: 40px;
  line-height: 200%;
  .item{
    font-size:28px;
    font-weight:400;
    color:rgba(76,76,76,1);
    line-height:200%;
    display: flex;
    justify-content: space-between;
    .label{
      color:rgba(158,158,157,1);
      display: inline-block;
      width: 190px;
    }
  }
  .border{
    border-top: 2px solid #e8e8e8;
  }
}
</style>
