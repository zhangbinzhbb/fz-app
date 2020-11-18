<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="重要事项"/>
    <div class="comment-content no-comment">
      <form action class="yh-search" @submit.prevent="search">
        <img src="@/assets/images/icon/search-img.png" class="search-img">
        <input
          ref="searchInput"
          v-model="searchId"
          type="search"
          placeholder="搜索"
        >
      </form>
      <div v-for="(item,index) in List" :key="index" class="item">
        <h2 @click="turnToDetail(item)">
          <span class="h-left">
            <img src="@/assets/images/liucheng@2x.png" alt="">
            <span class="van-ellipsis"> {{ item.projFullName }}</span>
          </span>
          <van-icon
            name="arrow"
            class="arrow-icon h-right"
          />
        </h2>
        <div class="inner-item">
          <div class="tit">
            <div class="tit-left fd-tit-right-tag-1">
              {{ item.deptName }}
            </div>
            <div>
              <span v-if="item.djUsername" class="fd-tit-right-tag">{{ item.djUsername }}</span>
              <span v-if="item.meetingDate" class="fd-tit-right-tag">{{ item.meetingDate }}</span>
            </div>
          </div>
          <div class="label p">内容：</div>
          <div v-if="item.remark">
            <div v-if="item.remark.length>66 && !item.isCheck" class="p">
              {{ item.remark | contentFilter }}...<span class="expand-btn" @click="expandChange(item,index)">展开</span>
            </div>
            <div v-else class="p">
              {{ item.remark }} <span v-if="item.remark.length>66" class="expand-btn" @click="expandChange(item,index)">收起</span>
            </div>
          </div>
          <div v-else>
            --
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      searchId: '',
      List: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    turnToDetail(item) {
      if (item.status === '草稿') {
        this.$toast('该信息未发起流程')
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

      const cmd = 'OAThreeMeetApprove'
      const taskId = ''
      const instId = item.processInstId
      const BIZKEY = item.meetingId
      const FORMURI = ''
      const NODE_ID = 'EndEvent_1'
      const PROCESS_KEY = ''

      appcan.locStorage.val('windowCloseType', 'close')

      let params = ''
      params = `&TASKINSTANCE_ID=${taskId}&PROCESSINSTANCE_ID=${instId}&BIZKEY=${BIZKEY}&FORMURI=${FORMURI}&NODE_ID=${NODE_ID}
          &PROCESS_KEY=${PROCESS_KEY}&NODE_TYPE=start&contractType=${item.firstParty}`
      if (item.firstParty === '1' || item.firstParty === '2') {
        params = `&TASKINSTANCE_ID=${taskId}&PROCESSINSTANCE_ID=${instId}&BIZKEY=${BIZKEY}&FORMURI=${FORMURI}&NODE_ID=${NODE_ID}
          &PROCESS_KEY=${PROCESS_KEY}&NODE_TYPE=start&contractType=${item.firstParty}&projectId=${this.model.projObject}`
      }
      turnToDetail(
        `${cmd}`,
        `template_detail`,
        params,
        `${address_url}`
      )
    },
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.List[index], 'isCheck', check)
    },
    getList() {
      const URL = '/otherThreeMeetingList'
      this.$axios.get(
        URL,
        {
          pageSize: 100,
          currPage: 1,
          searchId: this.searchId,
          groupId: this.$route.query.groupId,
          pkId: this.$route.query.pkId
        },
        res => {
          this.List = res.data
        }
      )
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList()
    }
  }
}
</script>

<style scoped lang="scss">
.classify-search {
  width: 44px;
  height:37px;
}
.yh-search{
  position: relative;
  background: white;
  input{
    text-align: left;
    margin: 10px 0;
    line-height: 68px;
    height: 68px;
  }
}
.yh-search .search-img{
  width: 40px;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
.key-item{
  background: white;
  margin-bottom: 20px;
  padding: 40px;
  .tit{
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:40px;
    width: 560px;
    display: inline-block;
    vertical-align: top;
  }
  .right{
    font-size:24px;
    font-weight:400;
    color:rgba(237,125,17,1);
    line-height:33px;
    background: rgba(248, 141, 38, 0.14);
    padding: 0 10px;
    float: right;
  }
  .colums{
    text-align: center;
    margin-top: 10px;
    .item{
      display: inline-block;
      width: calc(50% - 50px);
      position: relative;
      font-size:24px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
      text-align: left;
      margin-bottom: 20px;
      vertical-align: top;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:40px;
      }
    }

  }
  .files{
    font-size:28px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:40px;
    border-top: 2px solid #f0f0f0;
    padding-top: 30px;
    margin-top: 20px;
  }
  .content{
    font-size:28px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:40px;
    border-top: 2px solid #f0f0f0;
    padding-top: 30px;
    .text{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
      margin-top: 10px;
    }
    .blue{
      color:#3195fc !important;
    }
  }
}
.expand-btn{
  font-size:28px;
  font-weight:500;
  color:rgba(74,144,226,1);
}
.item{
  background: white;
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  h2{
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
      width: 90%;
      img{
        width: 22px;
        height: 22px;
        margin-right: 11px;
      }
    }
    .h-right{
      font-size: 14PX;
    }
  }
  .inner-item{
    padding: 20px 40px;
  }
  .grey-item{
    height: 10px;
    width: 100%;
    background-color: rgba(0,0,0,0.1);
  }
  .tit  {
    font-size:28px;
    font-weight:500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .p{
    padding: 10px 0;
    line-height: 48px;
    word-wrap: break-word;
  }
  .label{
    font-size:28px;
    font-weight:500;
    color:rgba(158,158,157,1);
  }
  .blue{
    color: #4A90E2;
  }
  .file-con{
    border-top: 2px solid #e8e8e8;
    margin-top: 20px;
  }
}
</style>
