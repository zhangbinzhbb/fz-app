<template>
  <div class="project-quality-list">
    <div v-for="(item,index) in list" :key="index" class="item" >
      <h2 @click="turnToDetail(item,groupId)">
        <span class="h-left"><img src="@/assets/images/liucheng@2x.png" alt=""><span class="fileTypeName">{{ item.fileTitle }}</span></span>
<!--        <img class="h-right" src="@/assets/images/cc@2x.png" alt="">-->
        <van-icon
          name="arrow"
          class="arrow-icon h-right"
        />
      </h2>
      <div class="inner-item">
        <div class="tit" @click="turnToDetail(item,groupId)">
          <div :class="{'tit-left': item.fileTypeName}">
            {{ item.fileTypeName }}
          </div>
          <div>
            <span :class="{'tit-right-tag1': item.draftsman }">{{ item.draftsman || '' }}</span>
            <span :class="{'tit-right-tag': item.draftDt }"> {{ item.draftDt }}</span>
          </div>
        </div>
        <!--        <div class="p">-->
        <!--          <span class="label">申请人：</span>{{ item.draftsman || '&#45;&#45;' }}-->
        <!--        </div>-->
        <div class="label p" @click="turnToDetail(item,groupId)">备注：</div>
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
        <div class="file-con">
          <attachment :data="item.fileLists"/>
        </div>
      </div>
      <div class="grey-item"/>
    </div>
<!--    <blank v-if="list.length==0"/>-->
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
    groupId: {
      type: String, Number,
      default() {
        return ''
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.list[index], 'isCheck', check)
    },
    turnToDetail(item, groupId) {
      if (item.status === '0') {
        this.Toast('该协议未发起流程')
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
      let cmd = ''
      if (groupId == 18) {
        cmd = 'contractApprovalXX'
      } else if (groupId == 1) {
        cmd = 'contractApprovalCK'
      }
      const taskId = ''
      const instId = item.processInstId
      const BIZKEY = item.fileId
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
    }
  }
}
</script>

<style scoped lang="scss">
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
    border-top:none!important;
    h2{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 40px 26px;
      background:rgba(253,241,241,1);
      .h-left{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        display: flex;
        align-items: center;
        img{
          width: 22px;
          height: 22px;
          margin-right: 11px;
        }
        span{
          /*font-size:26px;*/
          font-weight:400;
          color:rgba(76,76,76,1);
        }
      }
      .h-right{
        /*width: 8px;*/
        /*height: 8px;*/
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
    .tit{
      font-size:22px;
      font-weight:400;
      color:rgba(76,76,76,1);
      line-height:70px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .tit-left{
        color: #ed7d11;
        background: rgba(248,141,38,.14);
        padding:5px 8px;
        line-height: initial;
      }
    }

    .tit-right-tag,.tit-right-tag1{
      font-size:22px;
      font-weight:400;
      color:rgba(3,170,74,1);
      background:rgba(58,204,120,0.23);
      padding: 3px 8px;
    }
    .tit-right-tag1{
      color: #3195fc;
      background: rgba(49,149,252,.23);
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
