<template>
  <div class="">
    <headerx cat-title="定期报告">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment yh-new-list">
      <van-pull-refresh v-model="isloading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
          class="refresh-box"
        >
          <div v-for="(item, index) in list" :key="index" class="report-item">
            {{ item.rptTitle }}
            <div class="item">
              <span class="label">报告基准日</span>
              {{ item.rptDt }}
            </div>
            <div class="item">
              <span class="label">填写日期</span>
              {{ item.createDt }}
            </div>
            <div class="item">
              <span class="label">填写人</span>
              {{ item.createByName }}
            </div>
            <div class="item">
              <span class="label">分类</span>
              {{ item.rptTypeName }}
            </div>
            <div class="item">
              <span class="label">附件</span>
              <template v-if="item.attachmentList.length===0 || !item.attachmentList[0].fileOldName">--</template>
            </div>
            <div v-if="item.attachmentList.length>0&&item.attachmentList[0].fileOldName" class="border">
              <attachment :data="item.attachmentList" />
            </div>
          </div>
          <blank v-if="list.length===0&&!isloading" style="height: calc(100vh - 60px)"/>
          <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length>3"/>
        </div>
      </van-pull-refresh>
    </div>

  </div>
</template>
<script>
export default {
  components: {
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    return {
      funId: this.$route.query.id,
      isloading: true,
      pageInfo: {
        params: {
          length: 10,
          currPage: 1,
          fundId: this.$route.query.id
        },
        postType: 'get',
        list: [],
        postUrl: '/fundAnalysisReportList'
      },
      list: []
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.list = res.list
          this.isloading = false
        }
      )
    },
    onRefresh() {
      this.search()
    },
    search() {
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    }
  }
}
</script>
<style scoped lang="scss">
.report-item{
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
      width: 160px;
    }
  }
  .border{
    border-top: 2px solid #e8e8e8;
  }
}
</style>
