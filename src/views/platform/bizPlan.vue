// 季度文件对象字段显示补全QuotaConfList
<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="经营计划"/>
    <div class="comment-content no-comment">
      <!--   2.13 图表 -->
      <block v-if="quotaConfList.length && !showLoading">
        <div class="select">
          <div class="tit" @click="showPicker=true">
            {{ (dateValue+'年度')||'选择年份' }}
            <van-icon name="arrow-down"/>
          </div>
          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              :columns="quotaConfList"
              :default-index="defaultIndx"
              show-toolbar
              value-key="belongYear"
              @cancel="showPicker = false"
              @confirm="onConfirm"
            />
          </van-popup>
        </div>
        <div v-for="(chart,idx) in detail.QuotaConfDetailCharts" :key="idx" class="charts-con">
          <p class="legend-t">{{ chart.columns[1] }}</p>
          <ve-histogram :legend="legend" :y-axis="yAxis" :data="chart" :settings="chartSettings" :grid="grid" height="327px"/>
        </div>
        <div class="files-con">
          <div class="item">
            <div v-for="(att,key) in ['一','二','三','四']" :key="key" class="file-list">
              第{{ att }}季度上传附件：
              <attachment :data="fileObj['att'+(key+1)+'List']" :is-show-line="true"/>
            </div>
          </div>
        </div>
      </block>
      <block v-else>
        <blank/>
      </block>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>
export default {
  components: {
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    this.legend = {
      show: false
    }
    this.yAxis = [
      {
        show: true,
        name: '',
        position: 'left',
        axisLine: { show: true },
        axisTick: { show: false }
      }
    ]
    this.grid = {
      bottom: '6%'
    }
    return {
      showPicker: false,
      dateValue: '',
      defaultIndx: 0,
      platFormId: this.$route.query.pkId,
      groupId: this.$route.query.groupId,
      entId: this.$route.query.entId,
      detail: {
        QuotaConfDetailCharts: []
      },
      fileObj: {},
      quotaConfList: [],
      showLoading: true,
      chartSettings: {
        itemStyle: {
          color: '#FDC06C'
        }
      }
    }
  },
  watch: {

  },
  created() {
    this.getQuotaConfList()
  },
  activated() {},
  methods: {
    onConfirm(e) {
      this.dateValue = e.belongYear
      this.fileObj = e
      this.showPicker = false
      let yItem = ''
      this.quotaConfList.forEach(item => {
        if (this.dateValue === item.belongYear) {
          yItem = item
        }
      })
      if (yItem) {
        this.dateValue = yItem.belongYear
        this.fileObj = yItem
        this.getQuotaConfDetail(yItem.pkId)
      }
    },
    // 经营计划---年份列表
    getQuotaConfList() {
      this.$axios.get(
        '/QuotaConfList',
        {
          length: 100,
          currPage: 1,
          groupId: this.groupId
        },
        res => {
          this.quotaConfList = res.data
          if (this.quotaConfList.length) {
            this.dateValue = this.quotaConfList[0].belongYear
            const quotaConfList = this.quotaConfList[0]

            const att1List = quotaConfList.att1List[0].fileOldName ? quotaConfList.att1List : []
            const att2List = quotaConfList.att2List[0].fileOldName ? quotaConfList.att2List : []
            const att3List = quotaConfList.att3List[0].fileOldName ? quotaConfList.att3List : []
            const att4List = quotaConfList.att4List[0].fileOldName ? quotaConfList.att4List : []
            quotaConfList.att4List = att4List
            quotaConfList.att3List = att3List
            quotaConfList.att2List = att2List
            quotaConfList.att1List = att1List
            this.fileObj = this.quotaConfList[0]
            // att3List
            this.getQuotaConfDetail(this.quotaConfList[0].pkId)
          }
          this.showLoading = false
        }
      )
    },
    getQuotaConfDetail(confId) {
      this.$axios.get(
        '/QuotaConfDetail',
        {
          confId: confId
        },
        res => {
          const arr = []
          res.data.map(item => {
            const quotaName = item.quotaName
            let name = ''
            if (quotaName.indexOf('项目') > -1) {
              name = '项目立项数(个)'
            } else if (quotaName.indexOf('投资') > -1) {
              name = '投资项目数(个)'
            } else {
              name = item.quotaName
            }
            const yArray = [
              '第一季度',
              '第二季度',
              '第三季度',
              '第四季度',
              '全年'
            ]
            const getRows = (item, name) => {
              const array = []
              yArray.map((row, index) => {
                const obj = {}
                obj['季度'] = row
                if (row === '全年') {
                  obj[name] = item.planVal
                } else {
                  const i = index + 1
                  obj[name] = item['resultQ' + i]
                }
                array.push(obj)
              })
              return array
            }
            const obj = {
              columns: ['季度', name],
              rows: getRows(item, name)
            }
            arr.push(obj)
          })
          this.$set(this.detail, 'QuotaConfDetailCharts', arr)
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.legend-t{
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  text-align: center;
  position: absolute;
  top: 30px;
  width:100%;
}
.charts-con {
  background: white;
  margin-top: 20px;
  position: relative;
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
.files-con {
  padding: 40px;
  background: white;
  margin-top: 20px;
  .item {
    font-size: 28px;
    font-weight: 500;
    color: rgba(158, 158, 157, 1);
    line-height: 40px;
    margin-bottom: 20px;
    .file-list {
      margin-top: 20px;
    }
  }
}
</style>
