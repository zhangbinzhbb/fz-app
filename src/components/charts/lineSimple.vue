<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart-line'
    },
    id: {
      type: String,
      default: 'chartTine'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    treeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chart: null,
      data0: [],
      data1: [],
      data2: []
    }
  },
  watch: {
    treeData(data) {
      const arr = data
      this.getFilterArray(arr)
      this.initChart()
    }
  },
  mounted() {
    const data = this.treeData
    this.getFilterArray(data)
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getFilterArray(data) {
      const yearArray = []
      const lineArray = []
      const lineArray1 = []
      for (let i = 0; i < data.length; i++) {
        const arr = data[i].valuDt.split('-')
        const d = `${arr[0]}${arr[1]}`

        yearArray.push(d)
        const wholeValueN = data[i].wholeValueN ? data[i].wholeValueN : 0

        lineArray.push(Number(wholeValueN))
        lineArray1.push((Number(data[i].holdShare)).toFixed(2))

        this.data0 = yearArray
        this.data1 = lineArray
        this.data2 = lineArray1
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const _self = this
      const colors = ['#FA8E69', '#67C6DD']
      const commonOption = {
        color: colors,
        backgroundColor: '#fff',
        title: {
          show: false
        },
        legend: {// 小标签
          data: ['整体估值', '占比'],
          x: 'center', // 标签位置
          y: 'top',
          itemGap: 15, // 标签之间间距
          show: true,
          selectedMode: false
        },
        tooltip: {
          trigger: 'axis',
          padding: 10,
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'line' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) { // 改鼠标悬浮提示值格式
            const data = _self.treeData
            let relVal = params[0].name + '<br/>'
            if (params[0].seriesName !== undefined) {
              const wholeValue = data[params[0].dataIndex].wholeValue ? data[params[0].dataIndex].wholeValue : 0
              relVal += params[0].seriesName + ' : ' + wholeValue + '万元' + '<br/>'
              relVal += params[1].seriesName + ' : ' + Math.abs(params[1].value) + '%' + '<br/>'
            }
            return relVal
          }
        },
        grid: {
          left: '15%',
          right: '15%',
          bottom: 20
        },
        xAxis: {
          type: 'category',
          data: this.data0
        },
        yAxis: [
          {
            type: 'value',
            name: '整体估值(万元)',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '占比',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '整体估值',
            data: this.data1,
            type: 'bar',
            smooth: true,
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: '20%'
          },
          {
            name: '占比',
            data: this.data2,
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            label: {
              normal: {
                show: true,
                position: 'top',
                formatter: function(value) {
                  return value.value + '%'
                }
              }
            }
          }
        ]
      }
      this.chart.setOption(commonOption, true)
    }
  }
}
</script>
