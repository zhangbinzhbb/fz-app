<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="投资付款"/>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
          <div v-for="(item,index) in pageInfo.list" :key="index" class="item-box">
            <div class="h-top" @click="turnToDetail(item)">
              <span class="h-left"><img src="@/assets/images/liucheng@2x.png" alt="">
                <span class="van-ellipsis"> {{ item.receiver }}</span>
              </span>
              <span class="h-right">
                {{ item.investor }}
                <van-icon
                  name="arrow"
                  class="arrow-icon h-right"
                />
              </span>
            </div>
            <div class="colums">
              <span class="item">
                本期付款金额
                <p class="btm">￥{{ item.rmbInveAmount | money }}</p>
              </span>
              <span class="item">
                累计付款金额
                <p v-if="item.sumInveAmount" class="btm">￥{{ item.sumInveAmount | money }}</p>
                <p v-else class="btm">--</p>
              </span>
              <span class="item">
                申请时间
                <p class="btm">{{ item.appDt }}</p>
              </span>
              <span class="item">
                申请人
                <p class="btm">{{ item.appUser }}</p>
              </span>
            </div>
            <div class="grey-item"/>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0"/>
      <loading-box v-model="showLoading"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      pageInfo: {
        params: {
          pageSize: 5,
          currPage: 1,
          groupId: this.$route.query.groupId,
          pkId: this.$route.query.pkId
        },
        list: [],
        postType: 'get',
        postUrl: '/paymentRequestList'
      },
      showLoading: true,
      isLoading: false,
      isLoadingAll: false
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    turnToDetail(item) {
      if (item.status === '草稿') {
        this.$toast('该出资记录未发起流程')
        return
      }
      const turnToDetail = (cmd, tempPageType, params, htmlPath) => {
        var name = cmd + '_detail'
        var thisPageName = appcan.locStorage.val('thisPageName') || 'myTaskList'
        appcan.locStorage.val('templateParams', params)
        appcan.locStorage.val('template_cmd', cmd)
        appcan.locStorage.val('fromPageName', thisPageName)
        // 必须有，调用父页面js需使用此页面名称
        appcan.locStorage.val('thisPageName', name)
        window.open(htmlPath)
      }
      const address_url = appcan.locStorage.val('os') === '2' ? 'template_detail_workflow.html'
        : appcan.locStorage.val('publicFileName') + 'template/template_detail_workflow.html'

      const cmd = 'OAInvePaymentApprove_41'
      const taskId = ''
      const instId = item.processInstId
      const BIZKEY = item.pqId
      const FORMURI = ''
      const NODE_ID = 'EndEvent_1'
      const PROCESS_KEY = ''

      appcan.locStorage.val('windowCloseType', 'close')

      turnToDetail(
        `${cmd}`,
        `template_detail`,
        `&TASKINSTANCE_ID=${taskId}&PROCESSINSTANCE_ID=${instId}&BIZKEY=${BIZKEY}&FORMURI=${FORMURI}&NODE_ID=${NODE_ID}
          &PROCESS_KEY=${PROCESS_KEY}&NODE_TYPE=start`,
        `${address_url}`
      )
    },
    onRefresh() {
      this.getList(true)
    },
    loadMore() {
      if (this.isLoadingAll) return
      this.getList(false)
    },
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(this, isFirst, res => {
        this.showLoading = false
        this.isLoadingAll = res.isAll
      })
    }
  }
}
</script>
<style scoped lang="scss">
.item-box{
  background: white;
  position: relative;
  .h-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px 26px;
    background:rgba(253,241,241,1);
    .h-left{
      font-size:30px;
      font-weight:500;
      color:rgba(76,76,76,1);
      display: flex;
      align-items: center;
      width: 70%;
      img{
        width: 22px;
        height: 22px;
        margin-right: 11px;
      }
    }
    .h-right{
      display: flex;
      align-items: center;
      color: #4C4C4C;
      font-size:28px;
      font-weight:500;
      i{
        font-size: 14PX;
      }
    }
  }
  .grey-item{
    height: 10px;
    width: 100%;
    background-color: rgba(0,0,0,0.1);
  }
  .colums{
    text-align: center;
    padding: 10px 0 20px;
    .item{
      display: inline-block;
      width: calc(50% - 50px);
      position: relative;
      font-size:24px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
      text-align: left;
      padding-top: 20px;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
        font-size:28px;
        font-weight:500;
        line-height:40px;
      }
    }
  }
}
</style>
