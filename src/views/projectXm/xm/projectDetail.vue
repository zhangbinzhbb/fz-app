<template>
  <div class="has-comment project-home-xm-detail">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <div class="tab-header" style="height:100%">
        <div >
          <van-tabs v-model="active" @click="onClick">
            <van-tab v-for="item in tabList" :key="item.value" :title="item.label" :name="item.value">
              <project-information v-show="active === '1'" :model-data="editLixiangModel" :vote-mag-model="voteMagModel" :flow-list="flowList"/>
              <quality-list v-show="active === '2'" :list="qualityList"/>
              <project-decision v-show="active === '3'" :model-data="JueCeModel" :vote-mag-model="decisionVoteMagModel" :flow-list="decisionFlowList"/>
              <contract-list v-show="active === '4'" :proj-object="projObject" :list="contractList"/>
              <pay-list v-show="active === '5'" :list="payList"/>
            </van-tab>
          </van-tabs>
        </div>
        <blank v-if="active === '2' && qualityList.length==0"/>
        <blank v-if="active === '4' && contractList.length==0"/>
        <blank v-if="active === '5' && payList.length==0"/>
      </div>
      <!-- </van-pull-refresh> -->
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'project-information': () => import('./projectInformation'),
    'quality-list': () => import('./projectQualityList'),
    'contract-list': () => import('./projectContractList'),
    'pay-list': () => import('./projectPayList'),
    'project-decision': () => import('./projectDecision')
  },
  data() {
    return {
      tabList: [
        { label: '立项信息', value: '1' },
        { label: '投资决策', value: '3' },
        { label: '合同签署', value: '4' },
        { label: '投资支付', value: '5' },
        { label: '质量评估', value: '2' }
      ],
      editLixiangModel: null,
      voteList: [],
      voteMagModel: null,
      flowList: [],
      qualityList: [],
      JueCeModel: null,
      decisionVoteMagModel: null,
      decisionFlowList: [],
      contractList: [],
      payList: [],
      active: '1',
      catTitle: '项目详情',
      model: null,
      isLoading: false,
      projId: '',
      projObject: ''
    }
  },
  created() {
    let projId = ''
    let projObject = ''
    if (this.$route.query.projId) {
      projId = this.$route.query.projId
      projObject = this.$route.query.projObject
    } else {
      // 项目
      this.model = this.storage.get('groupObj') || {}
      const name = this.model.enName ? this.model.enName : this.model.projObjectName
      this.catTitle = name
      projId = this.model.projId
      projObject = this.model.projObject
    }
    this.projId = projId
    this.projObject = projObject
    this.getProjectApprovalInit(projId)
  },
  methods: {
    onRefresh() {
      const projId = this.projId
      this.getProjectApprovalInit(projId)
      this.getProjectDecisionInit(projId)
      this.getQualityList(projId)
      this.getContractList(projId)
      this.getPayList(projId)
      setTimeout(() => {
        this.isLoading = false
      }, 2000)
    },
    onClick(name, title) {
      const projId = this.projId
      if (name === '1') {
        this.getProjectApprovalInit(projId)
      }
      if (name === '2') {
        this.getQualityList(projId)
      }
      if (name === '3') {
        this.getProjectDecisionInit(projId)
      }
      if (name === '4') {
        this.getContractList(projId)
      }
      if (name === '5') {
        this.getPayList(projId)
      }
    },
    // 立项- init
    getProjectApprovalInit(projId) {
      this.getProjAppInfoDetail(projId)
      this.getDetailVoteMag(projId)
      this.getDetailflowList(projId)
    },
    // 决策 - init
    getProjectDecisionInit(projId) {
      this.getDetailJueCe(projId)
      this.getDetailVoteMagDecision(projId)
      this.getDetailflowListDecision(projId)
    },
    // 立项 - 基本信息
    getProjAppInfoDetail(id) {
      const URL = `/projectPC/projAppInfoDetailPC/${id}`
      this.$axios.get(
        URL,
        {},
        res => {
          this.editLixiangModel = res.data
        }
      )
    },
    // 立项- 决议结果
    getDetailVoteMag(id) {
      const URL = `/projAppVoteMagInfo/${id}`
      this.$axios.get(
        URL,
        {},
        res => {
          const data = res.data
          const arr = Object.keys(data)
          if (arr.length === 0) return
          this.voteMagModel = res.data.model
        }
      )
    },
    // 立项 - 审批信息
    getDetailflowList(projId) {
      const URL = '/projAppFixflowTaskList'
      this.$axios.get(
        URL,
        { projId },
        res => {
          this.flowList = res.data
        }
      )
    },
    // 质量评估
    getQualityList(projId) {
      const URL = '/scParamAppList'
      this.$axios.get(
        URL,
        {
          currPage: 1,
          pageSize: 1000,
          projId
        },
        res => {
          this.qualityList = res.data
        }
      )
    },
    // 投资决策- 基本信息
    getDetailJueCe(id) {
      const URL = `/projectPC/projDecisionInfoDetailPC/${id}`
      this.$axios.get(
        URL,
        {},
        res => {
          this.JueCeModel = res.data
        }
      )
    },
    // 投资决策- 决议结果
    getDetailVoteMagDecision(id) {
      const URL = `/projDecisionVoteMagInfoGQ/${id}`
      this.$axios.get(
        URL,
        {},
        res => {
          const data = res.data
          const arr = Object.keys(data)
          if (arr.length === 0) return
          this.decisionVoteMagModel = res.data.model
        }
      )
    },
    // 投资决策 - 审批信息
    getDetailflowListDecision(projId) {
      const URL = '/projDecisionFixflowTaskListGQ'
      this.$axios.get(
        URL,
        { projId },
        res => {
          this.decisionFlowList = res.data
        }
      )
    },
    // 合同签署
    getContractList(projId) {
      const URL = '/projContractFileAppTQList'
      this.$axios.get(
        URL,
        {
          currPage: 1,
          pageSize: 1000,
          projId
        },
        res => {
          const data = res.data
          data.map(item => {
            item.isCheck = false
          })
          this.contractList = data
        }
      )
    },
    getPayList(projId) {
      const URL = '/XjlTPaymentRequestList'
      this.$axios.get(
        URL,
        {
          currPage: 1,
          pageSize: 1000,
          projId
        },
        res => {
          this.payList = res.data
        }
      )
    }
  }
}
</script>

<style lang="scss">
.project-home-xm-detail{
  .van-tabs__line {
    bottom: 20PX;
    width: 44px!important;
  }
}
</style>
