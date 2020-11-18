<template>
  <div class="has-comment project-home-assess">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <div class="block">
        <h2 class="block-title">定期估值</h2>
        <div class="chart-con">
          <lineSimple v-if="tableData.length" :tree-data="tableData" width="100%" height="6.5rem" />
        </div>
        <blank v-if="tableData.length==0 && !showLoading"/>
      </div>
      <div class="block">
        <h2 class="block-title">定期报告</h2>
        <div v-for="(item,index) in EpValuRptList" :key="index" class="assess-item">
          <p>{{ item.rptTitle }}</p>
          <van-row class="card">
            <van-col span="12" class="row-column">
              <span class="title">报告日期</span>
              <span class="content">{{ item.rptDt }}</span>
            </van-col>
            <van-col span="12" class="row-column">
              <span class="title">报告人员</span>
              <span class="content">{{ item.rptBy }}</span>
            </van-col>
          </van-row>
          <van-row class="card">
            <van-col span="24" class="row-column">
              <span class="title">附件</span>
              <attachment :data="item.fileLists"/>
            </van-col>
          </van-row>
        </div>
        <blank v-if="EpValuRptList.length==0 && !showLoading"/>
      </div>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>

export default {
  components: {
    lineSimple: () => import('@/components/charts/lineSimple'),
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    return {
      tableData: [],
      EpValuRptList: [],
      model: null,
      catTitle: '定期事项',
      showLoading: true
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projectObject = this.model.projObject
    const inveId = this.model.inveId
    this.getList(projectObject, inveId)
    this.getEpValuRpt(projectObject, inveId)
  },
  methods: {
    // 定期估值
    getList(projectObject, inveId) {
      const URL = '/projRegularAssessList'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId
        },
        res => {
          this.tableData = res.data.reverse()
        }
      )
    },
    // 定期分析报告
    getEpValuRpt(projectObject, inveId) {
      this.showLoading = true
      const URL = '/epValuRpt'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId
        },
        res => {
          this.EpValuRptList = res.data
          this.showLoading = false
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
.assess-item{
  background-color: #fff;
  padding: 40px 40px 30px;
  &+.assess-item{
    margin-top: 20px;
  }
  p{
    font-size:28px;
    font-weight:600;
    color:rgba(76,76,76,1);
    line-height:40px;
  }
  .card{
    padding-top: 35px;
  }
  .row-column{
    display: flex;
    flex-direction: column;
    .title{
      font-size:24px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
      padding-bottom: 7px;
    }
    .content{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
    }
  }

}
.file-list-column{
  display: flex;
  flex-direction: column;
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
