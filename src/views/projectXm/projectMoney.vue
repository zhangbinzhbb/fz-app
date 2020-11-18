<template>
  <div class="has-comment project-home-assess">
    <headerx :cat-title="catTitle">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <div class="block">
        <h2 class="block-title">财务信息</h2>
        <div v-if="chartData.rows.length && !showLoading">
          <div class="chart-con">
            <ve-histogram :y-axis="yAxis" :data="chartData" :extend="chartExtend" :settings="chartSettings" :grid="grid" height="327px"/>
          </div>
          <div class="chart-con chart-con-money">
            <ve-histogram :y-axis="yAxis2" :data="chartData1" :extend="chartExtend" :grid="grid" :settings="chartSettings1" height="327px"/>
          </div>
        </div>
        <blank v-if="chartData.rows.length===0 && !showLoading"/>
      </div>
      <div class="block">
        <h2 class="block-title">人事信息</h2>
        <div v-if="chartData3.rows.length && !showLoading" class="chart-con">
          <ve-histogram :y-axis="yAxis1" :data="chartData3" :extend="chartExtend1" :grid="grid" height="327px"/>
        </div>
        <blank v-if="chartData3.rows.length===0 && !showLoading"/>
      </div>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>

export default {
  data() {
    this.chartSettings = {
      metrics: ['总资产', '净资产'],
      dimension: ['日期']
    }
    this.chartSettings1 = {
      metrics: ['半年', '全年'],
      dimension: ['日期']
    }
    this.yAxis = [
      {
        show: true,
        name: '元',
        position: 'left',
        axisLine: { show: true },
        axisTick: { show: false }
      }
    ]
    this.yAxis2 = [
      {
        show: true,
        name: '(净利润)元',
        position: 'left',
        axisLine: { show: true },
        axisTick: { show: false }
      }
    ]
    this.yAxis1 = [
      {
        show: true,
        position: 'left',
        axisLine: { show: true },
        axisTick: { show: false }
      }
    ]
    this.title = {
      left: 'center',
      text: '大数据量面积图'
    }
    this.legend = {
      top: 20
    }
    this.chartExtend = {
      color: ['#FA8E69', '#FDA244'],
      tooltip: {
        // formatter: function(data) {
        //   console.log('data:',data)
        //   return data.name + '<br/>' + data.seriesName + '：' + data.value + '万元'
        // }
      }
    }
    this.chartExtend1 = {
      color: ['#FA8E69', '#FDA244']
    }
    return {
      chartData: {
        columns: ['日期', '总资产', '净资产'],
        rows: []
      },
      chartData1: {
        columns: ['日期', '半年', '全年'],
        rows: []
      },
      chartData3: {
        columns: ['日期', '员工人数'],
        rows: []
      },
      grid: {
        bottom: '6%'
      },
      model: null,
      catTitle: '人事财务',
      showLoading: true
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projectObject = this.model.projObject
    const inveId = this.model.inveId

    this.getEnteMFinaInfoList(projectObject, inveId)
    this.getEnteMFinaInfoList1(projectObject, inveId)
    this.getEnteEmployeeOverviewList(projectObject, inveId)
  },
  methods: {
    // 财务信息
    getEnteMFinaInfoList(projectObject, inveId) {
      this.showLoading = true
      const URL = '/enteMFinaInfoList'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId
        },
        res => {
          // 处理数据
          const data = res.data
          const arr = []
          data.map(item => {
            const obj = {
              '日期': item.occurMonth,
              '总资产': item.totalAssetsN,
              '净资产': item.ownerEquityN
            }
            arr.push(obj)
          })
          this.$set(this.chartData, 'rows', arr)
          this.showLoading = false
        }
      )
    },
    getEnteMFinaInfoList1(projectObject, inveId) {
      const URL = '/enteMFinaInfoForChart'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId
        },
        res => {
          const data = res.data.enteMFinaInfoForChart
          const arr = []
          data.map(item => {
            const obj = {
              '日期': item.year,
              '半年': item.currentNetProfitY06N,
              '全年': item.currentNetProfitY12N
            }
            arr.push(obj)
          })
          this.$set(this.chartData1, 'rows', arr)
        }
      )
    },
    // 人事信息
    getEnteEmployeeOverviewList(projectObject, inveId) {
      const URL = '/EnteEmployeeOverviewList'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId
        },
        res => {
          const data = res.data
          const arr = []
          data.map(item => {
            const obj = {
              '日期': item.quarter,
              '员工人数': item.totalEmployees
            }
            arr.push(obj)
          })
          this.$set(this.chartData3, 'rows', arr)
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.yh-blank{
  padding: 60px 0;
}
.chart-con-money{
  margin-top: 20px;
}
.block-title{
  height:78px;
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  line-height:78px;
  padding-left: 40px;
}
.chart-con{
  background: #fff;
}
</style>
