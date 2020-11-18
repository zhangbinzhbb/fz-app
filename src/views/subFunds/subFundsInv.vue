<template>
  <div class="has-comment">
    <headerx :cat-title="detail.projInfoDetail.projObjectName|| detail.projInfoDetail.projName"/>
    <div class="comment-content no-comment">
      <div style="height:100%">
        <!-- 图片加印章 -->
        <!--        <company :name="detail.projInfoDetail.projObjectName"/>-->
        <div class="bg-white">
          <!--项目投资-->
          <van-tabs v-model="active">
            <van-tab v-for="item in tabList" :key="item.value" :title="item.label" :name="item.value">
              <company-information v-if="active === '0' && checkPermission(basicForm[0][0].permission)" :form="basicForm[0]" :detail="detail"/>
              <company-information v-if="active === '1' && checkPermission(basicForm[1][0].permission)" :form="basicForm[1]" :detail="detail"/>
              <company-information v-if="active === '2' && checkPermission(basicForm[2][0].permission)" :form="basicForm[2]" :detail="detail"/>
              <!--              <company-information v-if="active === '3' && checkPermission(basicForm[3].permission)" :form="basicForm[3]" :detail="detail"/>-->
              <contract-list v-if="active === '3' && checkPermission(basicForm[3][0].permission)" :group-id="detail['projInfoDetail'].groupId" :list="detail['projContractFileList']" class="contract-list"/>
              <pay-list v-if="active === '4' && checkPermission(basicForm[4][0].permission)" :group-id="detail['projInfoDetail'].groupId" :list="detail['XjlTPaymentRequestList']" class="pay-list"/>
              <!--              <company-information v-if="active === '4' && checkPermission(basicForm[4][0].permission)" :form="basicForm[4]" :detail="detail"/>-->
            </van-tab>
          </van-tabs>
          <div/>
        </div>
        <blank v-if="active === '3' && detail.projContractFileList.length==0"/>
        <blank v-if="active === '4' && detail.XjlTPaymentRequestList.length==0"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    company: () => import('@/components/project/company'),
    attachment: () => import('@/components/attachment/index'),
    'pay-list': () => import('./projectPayList'),
    'contract-list': () => import('./projectContractList'),
    'company-information': () => import('@/components/project/informationNew')
  },
  data() {
    return {
      foudsId: this.$route.query.id || 15481,
      showDesAll: true,
      active: '0',
      tabList: [
        { label: '立项信息', value: '0' },
        { label: '尽调报告', value: '1' },
        { label: '投资决策', value: '2' },
        { label: '合同签署', value: '3' },
        { label: '投资支付', value: '4' }
      ],
      detail: {
        projInfoDetail: {},
        ledgerMagAppList: []
      },
      barSetting: {
        legendName: {
          出资: '出资',
          收款: '收款'
        }
      },
      basicForm: [
        [
          {
            title: '立项信息',
            objName: 'projAppInfo',
            permission: '50020100',
            list: [
              {
                label: '立项时间（审批完时间）',
                name: 'setupDt'
              },
              {
                label: '出资主体',
                name: 'inveName'
              },
              {
                label: '拟投资金额不超过(元)',
                name: 'intendedAmount',
                filter: 'money'
              },
              {
                label: '拟投资比例不超过(%)',
                name: 'perShare'
              },
              {
                label: '决策事项',
                name: 'majorMatter',
                type: 'more',
                isShowAll: false
              },
              {
                label: '投资理由',
                name: 'inveReason',
                type: 'more',
                isShowAll: false
              },
              {
                label: '商业计划书',
                name: 'bizPlanAttList',
                type: 'attachment'
              },
              {
                label: '立项报告',
                name: 'projReportAttList',
                type: 'attachment'
              },
              {
                label: '其他',
                name: 'otherAttList',
                type: 'attachment'
              }
            ]
          },
          {
            title: '决议结果',
            objName: 'projAppVoteMagInfo',
            permission: '50020100',
            list: [
              {
                label: '投票汇总结果',
                name: 'voteResult'
              },
              {
                label: '投票汇总意见',
                name: 'collectOpinion'
              },
              {
                label: '决议人',
                name: 'decisionName'
              },
              {
                label: '决议时间',
                name: 'decisionDt'
              },
              {
                label: '决议结果',
                name: 'decisionResult'
              },
              {
                label: '决议意见',
                name: 'decisionOpinion'
              }
            ]
          },
          {
            title: '审批信息',
            objName: 'projAppFixflowTaskList',
            permission: '50020100',
            isDecision: 'y',
            list: [
              {
                label: '基金名称',
                name: 'subFundName'
              },
              {
                label: '附件',
                name: 'rptFileAttList',
                type: 'attachment'
              },
              {
                label: '备注',
                name: 'keyword'
              }
            ]
          }
        ],
        [{
          title: '尽调报告',
          objName: 'dueDiligenceRpt',
          permission: '50020202',
          list: [
            {
              label: '基金名称',
              name: 'subFundName'
            },
            {
              label: '附件',
              name: 'rptFileAttList',
              type: 'attachment'
            },
            {
              label: '备注',
              name: 'keyword'
            }
          ]
        }],
        [
          {
            title: '投资决策',
            permission: '50020204',
            objName: 'projDecisionInfo',
            list: [
              {
                label: '决策时间',
                name: 'decisionDt'
              },
              {
                label: '拟投资金额(元)',
                name: 'intendedAmount',
                filter: 'money'
              },
              {
                label: '出资主体',
                name: 'inveName'
              },
              {
                label: '决策事项',
                name: 'majorMatter',
                type: 'more',
                isShowAll: false
              },
              {
                label: '咨询委员会成员',
                name: 'advisoryCommName'
              },
              {
                label: '决策会议纪要',
                name: 'decisionAttList',
                type: 'attachment'
              },
              {
                label: '决策相关材料',
                name: 'remarkAttList',
                type: 'attachment'
              }
            ]
          },
          {
            title: '决议结果',
            objName: 'projDecisionVoteMagInfo',
            permission: '50020204',
            list: [
              {
                label: '投票汇总结果',
                name: 'voteResult'
              },
              {
                label: '投票汇总意见',
                name: 'collectOpinion'
              },
              {
                label: '决议人',
                name: 'decisionName'
              },
              {
                label: '决议时间',
                name: 'decisionDt'
              },
              {
                label: '决议结果',
                name: 'decisionResult'
              },
              {
                label: '决议意见',
                name: 'decisionOpinion'
              }
            ]
          },
          {
            title: '审批信息',
            objName: 'projDecisionFixflowTaskList',
            permission: '50020204',
            isDecision: 'n', //  用来区分立项 审批
            list: [
              {
                label: '基金名称',
                name: 'subFundName'
              },
              {
                label: '附件',
                name: 'rptFileAttList',
                type: 'attachment'
              },
              {
                label: '备注',
                name: 'keyword'
              }
            ]
          }
        ],
        [{
          title: '合同签署',
          objName: 'projContractFileList',
          permission: '50020301',
          type: 'list',
          list: [
            {
              label: '标题',
              name: 'fileTitle'
            },
            {
              label: '类别',
              name: 'fileTypeName'
            },
            {
              label: '上传人',
              name: 'draftsman'
            },
            {
              label: '签订日期',
              name: 'draftDt'
            },
            {
              label: '附件',
              name: 'fileLists',
              type: 'attachment'
            }
          ]
        }],
        [{
          title: '投资支付',
          objName: 'XjlTPaymentRequestList',
          permission: '50020303',
          type: 'list',
          list: [
            {
              label: '出资主体',
              name: 'investor'
            },
            {
              label: '出资日期',
              name: 'payDt'
            },
            {
              label: '本期付款金额',
              name: 'payAmount'
            },
            {
              label: '申请人',
              name: 'appUser'
            },
            {
              label: '状态',
              name: 'statusName'
            }
          ]
        }]
      ],
      permission: '' //        50020100,50020101,50020201,50020202,50020203,50020204,50020301,50020303,50020501,50020502,50020503
    }
  },
  computed: {
    checkPermission(key) {
      return function(key) {
        let result = false
        if (this.permission.indexOf(key) > -1) {
          result = true
        }
        return result
      }
    }
  },
  watch: {
    tabIndex: function(val, oldVal) {
    }
  },
  created() {
    this.getPermission()
  },
  methods: {
    showToggle(formName, index) {
      this.showDesAll = !this.showDesAll
    },
    // 项目投资-详情
    getDetail() {
      const urlList = [
        'projInfoDetail', // 项目基本信息
        'projAppVoteMagInfo', // 决议结果
        'projDecisionInfo', // 获取项目决策 信息
        'dueDiligenceRpt', // 尽职调查报告
        'projDecisionVoteMagInfo', // 项目决策 决议结果
        'projAppInfo', // 获取立项信息
        // '', // 审批流程
        'projContractFileList', // 获取合同列表
        'XjlTPaymentRequestList', // XjlTPaymentRequestList
        'projDecisionFixflowTaskList', // 获取项目决策 流程
        'projAppFixflowTaskList'

      ]
      const request = (item, index) => {
        const url = index < 6 ? `/${item}/${this.foudsId}` : `/${item}`
        this.$axios.get(
          url,
          {
            projId: this.foudsId,
            pageSize: 100,
            currPage: 1,
            projOrFundId: this.foudsId,
            itemType: 3
          },
          res => {
            if (item === 'projInfoDetail') {
              res.data.model.projOverviewOrigin = res.data.model.projOverview
              if (res.data.model.projOverview && res.data.model.projOverview.length > 50) {
                res.data.model.projOverview = res.data.model.projOverview.slice(0, 50) + '...'
                this.showDesAll = false
              }
              res.data.model.projStatus = this.getProjectStatus(
                res.data.model.projStatus
              )
              res.data.model.allRequestMoney = res.data.model.allRequestMoney || 0
              res.data.model.quitMoney = res.data.model.quitMoney || 0
              res.data.model.allRequestMoney += '人民币'
              res.data.model.quitMoney += '人民币'
              this.getLedgerMagAppList(
                null,
                res.data.model.projObject,
                res.data.model.inveId
              )
            }
            if (item === 'projAppInfo') {
              res.data.model.intendedAmount = res.data.model.intendedAmount || ''
              res.data.model.intendedAmount +=
                ' ' + (res.data.model.intendedCurrency || '')
              if (res.data.model.intendedAmount.trim() == '') {
                res.data.model.intendedAmount = '--'
              }
            }
            if (item === 'XjlTPaymentRequestList') {
              // res.data.map(listItem => {
              //   listItem.payAmount += ' ' + listItem.payCurrency
              // })
            }
            if (item === 'projDecisionInfo') {
              if (res.data.model.decisionDt) {
                res.data.model.decisionDt = res.data.model.decisionDt.slice(
                  0,
                  10
                )
              }
              if (res.data.model.intendedAmount) {
                res.data.model.intendedAmount += ' ' + res.data.model.intendedCurrency
              }
            }
            this.$set(this.detail, item, res.data.model || res.data)
          }
        )
      }
      urlList.map((item, index) => {
        request(item, index)
      })
      console.log('detail', this.detail)
    },
    getPermission() {
      this.$axios.get(
        'appFuncPermissionList',
        { fatherid: 5002, projId: this.foudsId },
        res => {
          const arr = []
          res.data.map(item => {
            item.childList.map(value => {
              arr.push(value.id)
            })
          })
          this.permission = arr.join(',')
          this.getDetail()
        }
      )
    }
  }
}
</script>
<style lang="scss">
  @import "sass/projectBoss.scss";
  .van-tabs__line{
    width:6%!important;
    bottom: 35px;
  }
  .contract-list{
      >.item{
        border-top:28px solid #f8f8f8!important;
        margin-top:0!important;
    }
  }
  .pay-list{
    >.item{
      border-top:28px solid #f8f8f8!important;
      margin-top:0!important;
      .colums{
        /*margin-top: 15px!important;*/
        .item{
          color:#9e9e9d;
          vertical-align: top!important;
        }
      }

    }
  }
</style>
