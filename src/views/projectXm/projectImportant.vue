<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <div v-for="(item,index) in LIST" :key="index" class="item" @click="turnToDetail(item)">
        <h2>
          <span class="h-left">
            <img src="@/assets/images/liucheng@2x.png" alt="">
            <span class="van-ellipsis">{{ item.meetingTitle }}</span>
          </span>
          <van-icon
            name="arrow"
            class="arrow-icon h-right"
          />
        </h2>
        <div class="inner-item">
          <div class="tit">
            <div class="tit-left fd-tit-right-tag-1">
              {{ item.eventType }}
            </div>
            <div>
              <span class="fd-tit-right-tag">{{ item.applyUserName }}</span>
              <span class="fd-tit-right-tag">{{ item.applyUserDate }}</span>
            </div>
          </div>
          <div class="label p">内容：</div>
          <div v-if="item.meetSubject.length>66 && !item.isCheck" class="p">
            {{ item.meetSubject | contentFilter }}...<span class="expand-btn" @click.stop="expandChange(item,index)">展开</span>
          </div>
          <div v-else class="p">
            {{ item.meetSubject }} <span v-if="item.meetSubject.length>66" class="expand-btn" @click.stop="expandChange(item,index)">收起</span>
          </div>
          <div v-if="item.fileLists.length" class="file-con">
            <attachment :data="item.fileLists"/>
          </div>
        </div>
      </div>
      <blank v-if="LIST.length==0 && !showLoading"/>
      <loading-box v-model="showLoading"/>
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
      LIST: [],
      model: null,
      catTitle: '重要事项',
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
  },
  methods: {
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.LIST[index], 'isCheck', check)
    },
    // 重要事项
    getList(projectObject, inveId) {
      this.showLoading = true
      const URL = '/epThreemeetingInfo'
      this.$axios.get(
        URL,
        {
          pageSize: 1000,
          currPage: 1,
          projectObject,
          inveId
        },
        res => {
          this.showLoading = false
          this.LIST = res.data
        }
      )
    },
    turnToDetail(item) {
      if (item.status === '1') {
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

      const cmd = this.getGroupIdLabel(item.groupId)
      const taskId = ''
      const instId = item.processInstId
      const BIZKEY = item.pkId
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
    getGroupIdLabel(groupId) {
      // const groupId = [
      //   { label: '元禾直投', value: '4' },
      //   { label: '元禾战略', value: '6' },
      //   { label: '元禾新兴', value: '18' },
      //   { label: '元禾原点', value: '3' },
      //   { label: '元禾凯风', value: '2' },
      //   { label: '元禾重元', value: '5' },
      //   { label: '元禾谷风', value: '11' },
      //   { label: '元禾璞华', value: '15' },
      //   { label: '元禾润新', value: '14' },
      //   { label: '元禾辰坤', value: '1' },
      //   { label: '国开开元', value: '13' },
      //   { label: '中新创投领军托管', value: '9' },
      //   { label: '元禾厚望', value: '16' },
      //   { label: '沙湖金融', value: '19' },
      //   { label: '银杏投资', value: '20' },
      //   { label: '测试平台', value: '586' }
      // ]

      // 辰坤  ThreeMeetingReview
      // 厚望 ThreeMeetingReview
      // 银杏 ThreeMeetingReview
      // 华创 ThreeMeetingReviewHC
      // 润新 ThreeMeetingReview
      // 新兴 ThreeMeetingReview
      // 原点 ThreeMeetingReview
      // 直投 ThreeMeetingReviewGQPG
      // 重元 ThreeMeetingReview
      // 创投 ThreeMeetingReview

      let label = ''

      const groupIdLabel = [
        { label: 'ThreeMeetingReview', value: '1' },
        { label: 'ThreeMeetingReview', value: '16' },
        { label: 'ThreeMeetingReview', value: '20' },
        { label: 'ThreeMeetingReviewHC', value: '15' },
        { label: 'ThreeMeetingReview', value: '14' },
        { label: 'ThreeMeetingReview', value: '18' },
        { label: 'ThreeMeetingReview', value: '3' },
        { label: 'ThreeMeetingReviewGQPG', value: '4' },
        { label: 'ThreeMeetingReview', value: '5' },
        { label: 'ThreeMeetingReview', value: '9' }
      ]
      groupIdLabel.forEach(item => {
        if (item.value === groupId) {
          label = item.label
        }
      })
      return label
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
      width:90%;
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
  .tit  {
    font-size:28px;
    font-weight:500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .p-flex{
    display: flex;
    span{
      &:nth-child(1){
        padding-right: 60px;
      }
    }
  }
  .p{
    padding: 10px 0;
    line-height: 48px;
  }
  .label{
    font-size:28px;
    font-weight:500;
    color:rgba(158,158,157,1);
    em{
      color: #4c4c4c;
      font-style: normal;
    }
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
