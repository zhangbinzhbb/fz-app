<template>
  <div class="project-quality-list">
    <div v-for="(item,index) in list" :key="index" class="item" @click="turnToDetail(item)">
      <h2>
        <span class="h-left">
          <img src="@/assets/images/liucheng@2x.png" alt="">
          <span class="van-ellipsis"> {{ item.fileTitle }}</span>
        </span>
        <van-icon
          name="arrow"
          class="arrow-icon h-right"
        />
      </h2>
      <div class="inner-item">
        <div class="tit">
          <div class="tit-left fd-tit-right-tag-1">
            {{ item.fileTypeName }}
          </div>
          <div>
            <span class="fd-tit-right-tag">{{ item.draftsman }}</span>
            <span class="fd-tit-right-tag">{{ item.draftDt }}</span>
          </div>
        </div>
        <div class="label p">备注：</div>
        <div v-if="item.remark">
          <div v-if="item.remark.length>66 && !item.isCheck" class="p">
            {{ item.remark | contentFilter }}...<span class="expand-btn" @click.stop="expandChange(item,index)">展开</span>
          </div>
          <div v-else class="p">
            {{ item.remark }} <span v-if="item.remark.length>66" class="expand-btn" @click.stop="expandChange(item,index)">收起</span>
          </div>
        </div>
        <div v-else>
          --
        </div>
        <div class="file-con">
          <attachment :data="item.fileLists"/>
        </div>
      </div>
      <div class="grey-item"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    attachment: () => import('@/components/attachment/index')
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    },
    projObject: [String]
  },
  data() {
    return {}
  },
  methods: {
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.list[index], 'isCheck', check)
    },
    turnToDetail(item) {
      if (item.status === '0') {
        this.$toast('该协议未发起流程')
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
        // window.location.href = htmlPath
        window.open(htmlPath)
      }

      const address_url = appcan.locStorage.val('os') === '2' ? 'template_detail_workflow.html'
        : appcan.locStorage.val('publicFileName') + 'template/template_detail_workflow.html'

      const cmd = 'contractApproval'
      const taskId = ''
      const instId = item.processInstId
      const BIZKEY = item.fileId
      const FORMURI = ''
      const NODE_ID = 'EndEvent_1'
      const PROCESS_KEY = ''
      const projObject = this.projObject || ''

      appcan.locStorage.val('windowCloseType', 'close')

      let params = ''
      params = `&TASKINSTANCE_ID=${taskId}&PROCESSINSTANCE_ID=${instId}&BIZKEY=${BIZKEY}&FORMURI=${FORMURI}&NODE_ID=${NODE_ID}
          &PROCESS_KEY=${PROCESS_KEY}&NODE_TYPE=start&contractType=${item.firstParty}`
      if (item.firstParty === '1' || item.firstParty === '2') {
        params = `&TASKINSTANCE_ID=${taskId}&PROCESSINSTANCE_ID=${instId}&BIZKEY=${BIZKEY}&FORMURI=${FORMURI}&NODE_ID=${NODE_ID}
          &PROCESS_KEY=${PROCESS_KEY}&NODE_TYPE=start&contractType=${item.firstParty}&projectId=${projObject}`
      }
      turnToDetail(
        `${cmd}`,
        `template_detail`,
        params,
        `${address_url}`
      )
    }
  }
}
</script>

<style scoped lang="scss">
.project-quality-list{
  // height: 100vh;
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
