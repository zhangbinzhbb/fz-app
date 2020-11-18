<template>
  <div>
    <headerx cat-title="基金总览" page-type="back" @closeBack="$router.push({path: '/home'})">
      <template slot="right">
        <span @click="$router.push({path: '/Fundperdetail', query:{time: valuDt, timeName: textDt}})">业绩</span>
      </template>
    </headerx>
    <div class="Fundperformance">
      <div class="time">
        <div class="chooseValue" style="display:flex;align-items:center;" @click="checkDt">
          {{ textDt }} &nbsp;
          <van-icon name="arrow-down" />
        </div>
      </div>
      <fd-select ref="select" v-model="valuDt" :options="option1" value-key="text" @change="delChange" />
      <div class="Fundperformance_title">
        <div>
          <div class="Fundperformance_val">￥{{ titleData.currentAmount | filterValue }}  <span>亿元</span></div>
          <div class="Fundperformance_key">基金认缴规模</div>
        </div>
        <div>
          <div class="Fundperformance_val">{{ titleData.fundCount |filterValue }}  <span>个</span></div>
          <div class="Fundperformance_key">主导管理基金</div>
        </div>
        <div>
          <div class="Fundperformance_val">￥{{ titleData.investAmount |filterValue }}  <span>亿元</span></div>
          <div class="Fundperformance_key">累计出资金额</div>
        </div>
        <div>
          <div class="Fundperformance_val">￥{{ titleData.backAmount |filterValue }}  <span>亿元</span></div>
          <div class="Fundperformance_key">累计回收金额</div>
        </div>
      </div>
      <div class="Fundperformance_chart">
        <div>
          <div>
            <h6>累计基金管理规模(亿元)</h6>
            <span>主导管理基金(直投基金,专项基金,VC母基金)</span>
          </div>
          <div id="leijiChart" :style="{height: '200px'}"/>
        </div>
      </div>

      <div class="Fundperformance_chart">
        <div>
          <div>
            <h6>基金状态</h6>
          </div>
          <div id="jijinStatusChart" :style="{height: '200px'}"/>
        </div>
      </div>

      <div class="Fundperformance_chart">
        <div>
          <div>
            <h6>基金认缴规模(亿元)</h6>
            <span>主导管理基金(直投基金,专项基金,VC母基金)</span>
          </div>
          <div id="yuanherenjiaoChart" :style="{height: '200px'}"/>
        </div>
      </div>

      <div class="Fundperformance_chart">
        <div>
          <div>
            <h6>平台基金规模(亿元)</h6>
          </div>
          <div id="pintaijijinChart" :style="{height: '350px'}"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    'fd-select': () => import('@/components/select/select')
  },
  filters: {
    filterValue(val) {
      if (val) {
        return val
      } else {
        return ''
      }
    }
  },
  data() {
    return {
      valuDt: '',
      textDt: '当前',
      option1: [
        {
          text: '当前',
          value: ''
        },
        {
          text: `${new Date().getFullYear()}年06月30日`,
          value: `${new Date().getFullYear()}-06-30`
        },
        {
          text: `${new Date().getFullYear() - 1}年12月31日`,
          value: `${new Date().getFullYear() - 1}-12-31`
        },
        {
          text: `${new Date().getFullYear() - 1}年06月30日`,
          value: `${new Date().getFullYear() - 1}-06-30`
        }
      ],
      titleData: {
        currentAmount: '',
        fundCount: '',
        investAmount: '',
        backAmount: ''
      },
      initLeijijinjineData: { valuDt: [], current: [] },
      initjijinStatusChartData: { legendData: [], seriesData: [] },
      initrenjiaoData: { valuDt: [], plan: [] },
      initpintaijijinData: { data: [], name: [] }
    }
  },
  created() {
    this.getOptionText()
    // this.getOptionText()
  },
  mounted() {
    // this.delTime()
    this.getcomprehensive()
  },
  methods: {
    checkDt() {
      this.$refs.select.showPicker()
    },
    delChange(val) {
      console.log(val)
      this.valuDt = val.value
      this.textDt = val.text
      this.titleData = {}
      this.initLeijijinjineData = { valuDt: [], current: [] }
      this.initrenjiaoData = { valuDt: [], plan: [] }
      this.initjijinStatusChartData = { legendData: [], seriesData: [] }
      this.initpintaijijinData = { data: [], name: [] }
      this.getcomprehensive()
    },
    // 处理可选时间范围
    getOptionText() {
      const myDate = new Date()
      const month = myDate.getMonth() + 1
      if (month >= 2 && month < 8) {
        this.option1[1] = {
          text: `${new Date().getFullYear() - 1}年12月31日`,
          value: `${new Date().getFullYear() - 1}-12-31`
        }
        this.option1[2] = {
          text: `${new Date().getFullYear() - 1}年06月30日`,
          value: `${new Date().getFullYear() - 1}-06-30`
        }
        this.option1[3] = {
          text: `${new Date().getFullYear() - 2}年12月31日`,
          value: `${new Date().getFullYear() - 2}-12-31`
        }
      } else if (month < 2) {
        this.option1[1] = {
          text: `${new Date().getFullYear() - 1}年06月30日`,
          value: `${new Date().getFullYear() - 1}-06-30`
        }
        this.option1[2] = {
          text: `${new Date().getFullYear() - 2}年12月31日`,
          value: `${new Date().getFullYear() - 2}-12-31`
        }
        this.option1[3] = {
          text: `${new Date().getFullYear() - 2}年06月30日`,
          value: `${new Date().getFullYear() - 2}-06-30`
        }
      }
    },
    getcomprehensive() {
      console.log(this.valuDt)
      const URL = '/fundCharts/operateData'
      this.$axios.postJson(URL, { valuDt: this.valuDt }).then(res => {
        //   处理头部信息
        // const obj0 = { val: `￥${res.currentAmount}(亿元)`, key: '基金认缴规模' }
        // const obj1 = { val: `${res.fundCount}个`, key: '主导管理基金' }
        // const obj2 = { val: `￥${res.investAmount}(亿元)`, key: '累计出资金额' }
        // const obj3 = { val: `￥${res.backAmount}(亿元)`, key: '累计回收金额' }

        this.titleData.currentAmount = res.currentAmount
        this.titleData.fundCount = res.fundCount
        this.titleData.investAmount = res.investAmount
        this.titleData.backAmount = res.backAmount

        this.$forceUpdate()
        // 处理累计基金管理规模
        res.currentList.forEach(el => {
          this.initLeijijinjineData.valuDt.push(el.valuDt)
          this.initLeijijinjineData.current.push(Number(el.current))
        })
        this.initLeijijinjine(this.initLeijijinjineData)
        // 处理基金状态
        res.stsList.forEach(el => {
          const obj = {}
          obj.value = el.COUNT
          obj.name = el.CODE_NAME
          this.initjijinStatusChartData.seriesData.push(obj)
          this.initjijinStatusChartData.legendData.push(el.CODE_NAME)
        })
        this.initjijinStatusChart(this.initjijinStatusChartData)

        // 元和认缴规模
        res.currentList.forEach(el => {
          this.initrenjiaoData.valuDt.push(el.valuDt)
          this.initrenjiaoData.plan.push(Number(el.plan))
        })
        this.initrenjiao(this.initrenjiaoData)

        // 平台基金规模
        res.groupCurrentAmount.forEach(el => {
          const obj = {
            type: 'bar',
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true, // 开启显示
                  position: 'right', // 在上方显示
                  formatter: function(param) {
                    return param.seriesName
                  }
                }
              }
            }
          }
          const name = el.GROUP_NAME || '元禾'
          obj.name = name
          obj.data[0] = el.CURRENT_AMOUNT
          this.initpintaijijinData.data.push(obj)
          this.initpintaijijinData.name.push(name)
        })
        this.initpintaijijin(this.initpintaijijinData)
      })
    },
    initLeijijinjine(val) {
      var myChart = echarts.init(document.getElementById('leijiChart'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: val.valuDt,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: val.current,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                },
                color: params => {
                  const colorList = [
                    // '#8D6DE1', '#64ABF4', '#67C6DD', '#64E3AC', '#E8E243', '#BED951', '#F76D55', '#FD9553', '#FFC958'
                    '#9DF3D6', '#A0E5F0', '#3195FC', '#C1A6F2', '#FA8E69', '#7FD3E5', '#FDC06C', '#F6F49D', '#DBEC7C', '#9DF3D6', '#A0E5F0'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    },
    initjijinStatusChart(val) {
      var myChart = echarts.init(document.getElementById('jijinStatusChart'))
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: val.legendData
        },
        // color: ['#F8775B', '#7FD3E5'],
        color: ['#FA8E69', '#7FD3E5', '#FDC06C', '#F6F49D', '#DBEC7C', '#9DF3D6', '#A0E5F0', '#3195FC', '#C1A6F2'],
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                formatter: '{per|{d}%}',
                backgroundColor: '#eee',
                borderColor: '#666',
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 22,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 33
                  },
                  per: {
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            labelLine: {
              normal: {
                show: true
              }
            },
            data: val.seriesData
          }
        ]
      })
    },
    initrenjiao(val) {
      var myChart = echarts.init(document.getElementById('yuanherenjiaoChart'))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: val.valuDt,
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: val.plan,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top'
                },
                color: params => {
                  const colorList = [
                    '#9DF3D6', '#A0E5F0', '#3195FC', '#C1A6F2', '#FA8E69', '#7FD3E5', '#FDC06C', '#F6F49D', '#DBEC7C', '#9DF3D6', '#A0E5F0'
                  ]
                  return colorList[params.dataIndex]
                }
              }
            }
          }
        ]
      })
    },
    initpintaijijin(val) {
      console.log('val.seriesData:', val.data)
      const data = val.data
      const label = []
      data.map(item => {
        console.log(item.name)
        const name = item.name || ''
        label.push(name)
      })
      console.log('label:', label)

      var myChart = echarts.init(document.getElementById('pintaijijinChart'))
      myChart.setOption({
        tooltip: {},
        legend: {
          data: val.name
        },
        grid: {
          containLabel: true,
          top: 100
        },
        barCategoryGap: 10,
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
          position: 'top'
        },
        yAxis: {
          type: 'category',
          data: ['']
        },
        color: ['#FA8E69', '#7FD3E5', '#FDC06C', '#F6F49D', '#DBEC7C', '#9DF3D6', '#A0E5F0', '#3195FC', '#C1A6F2'],
        series: data
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .Fundperdetail {
    .list {
      .title{
        >span:nth-of-type(2){
          font-size: 26px!important;
        }
      }
    }
  }
  /deep/ .van-dropdown-item.van-dropdown-item--up{
    bottom:0!important;
  }
  /deep/ .fd-select{
    display: none!important;
  }
  .chooseValue{
    font-size: 28px;
    font-weight: 500;
    color: rgba(158, 158, 157, 1);
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 15px 30px;
    background: #fff;
  }
</style>
