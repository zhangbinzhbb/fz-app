<template>
  <div id="Knowledge" class="invDecision newsarticle has-comment">
    <headerx cat-title="投资决策"/>
    <div class="comment-content no-comment">
      <form action class="yh-search" @submit.prevent="search">
        <img src="@/assets/images/icon/search-img.png" class="search-img">
        <input
          ref="searchInput"
          v-model="pageInfo.params.keyWord"
          type="search"
          placeholder="搜索"
        >
      </form>
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div v-for="(item,index) in pageInfo.list" :key="index" class="item">
          <div class="tit">
            <div class="tit-left" @click="turnToDetail(item)">
              <span class="van-ellipsis">{{ item.projFullName }}</span>
            </div>
            <div class="tags">
              <span v-if="item.status" >{{ item.applyUserName }}</span>
              <span v-if="item.status" >{{ item.status }}</span>
            </div>
          </div>
          <div class="colums">
            <span class="item">
              关联基金或平台
              <a href="javascript:;" class="btm van-ellipsis">
                {{ item.projName || '--' }}
              </a>
            </span>
            <span class="item">
              提交时间
              <p class="btm van-ellipsis">{{ item.createDt || '--' }}</p>
            </span>
            <span class="item">
              决策日期
              <p class="btm">{{ item.deciDate || '--' }}</p>
            </span>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <loading-box v-model="showLoading"/>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 100,
          keyWord: '',
          groupId: this.$route.query.groupId,
          pkId: this.$route.query.pkId
        },
        list: [],
        postType: 'get',
        postUrl: '/projAppInfoOthList'
      },
      showLoading: true
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

      const cmd = 'OAInveDeciApprove'
      const taskId = ''
      const instId = item.processInstId
      const BIZKEY = item.pkId
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
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(this, isFirst, res => {
        this.isLoading = false
        this.showLoading = false
      })
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    }
  }
}
</script>
<style scoped lang="scss">
.invDecision{
  .yh-search{
    margin-bottom: 20px;
  }
}
.item{
  background: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  .tit{
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    padding: 40px 40px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tit-left{
      display: flex;
      align-items: center;
      width: 64%;
    }
    .tags{
      display: flex;
      span{
        font-size:24px;
        font-weight:400;
        line-height:33px;
        padding: 4px 10px;
        &:nth-child(1){
          color:rgba(49,149,252,1);
          background:rgba(74,144,226,0.1);
        }
        &:nth-child(2){
          color:rgba(237,125,17,1);
          background:rgba(248,141,38,0.14);
          margin-left: 10px;
        }
      }
    }
  }
  .colums{
    font-size:26px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:37px;
    text-align: center;
    margin-top: 40px;
    .item{
      display: inline-block;
      width: 30%;
      position: relative;
      vertical-align: top;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
      }
      &:after{
        content:'|';
        position: absolute;
        top: 20px;
        right: 0;
        color: #D7D7D7;
      }
      &:last-child:after{
        content: none;
      }
    }
  }
}
</style>
