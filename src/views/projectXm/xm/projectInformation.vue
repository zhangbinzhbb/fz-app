<template>
  <div class="has-comment">
    <div class="comment-content no-comment">
      <!-- 企业信息 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon6@2x.png">
        企业信息
        <van-icon
          :name="article.part1?'arrow-up':'arrow-down'"
          class="arrow-icon"
          @click="toggle('part1')"
        />
      </div>
      <div v-if="article.part1" class="reg-info">
        <div class="item">
          <span class="label">登记状态</span>
          <div class="ctx">{{ model.status? model.status:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">企业简称</span>
          <div class="ctx">{{ model.enName? model.enName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">主联系人</span>
          <div class="ctx">{{ model3.custName? model3.custName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">企业阶段</span>
          <div class="ctx">{{ model1.entePhase? model1.entePhase:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">清科行业</span>
          <div class="ctx">{{ model.qkIndustry? model.qkIndustry:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">七大行业</span>
          <div class="ctx">{{ model.sevenIndustry? model.sevenIndustry:'--' }}</div>
        </div>
        <div class="item item-column">
          <span class="label">主营业务</span>
          <div v-if="model.scope" style="width:100%;">
            <div v-if="model.scope.length>66 && !isCheck" class="ctx ctx-word-break">{{ model.scope | contentFilter }}...<span class="expand-btn" @click="isCheck = true">展开</span></div>
            <div v-else class="ctx ctx-word-break">{{ model.scope }} <span v-if="model.scope.length>66" class="expand-btn" @click="isCheck = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">
            --
          </div>
        </div>
      </div>
      <!-- 项目信息 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon6@2x.png">
        项目信息
        <van-icon
          :name="article.part2?'arrow-up':'arrow-down'"
          class="arrow-icon"
          @click="toggle('part2')"
        />
      </div>
      <div v-if="article.part2" class="reg-info">
        <div class="item">
          <span class="label">项目名称</span>
          <div class="ctx">{{ model1.projName? model1.projName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">登记时间</span>
          <div v-if="model1.createDt" class="ctx">{{ model1.createDt.substring(0,10) }}</div>
          <div v-else class="ctx">--</div>
        </div>
        <div class="item">
          <span class="label">所属平台</span>
          <div class="ctx">{{ model1.groupId? model1.groupId:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">分管合伙人</span>
          <div class="ctx">{{ model1.chargePartner? model1.chargePartner:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">项目经理</span>
          <div class="ctx">{{ model1.mangerName? model1.mangerName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">项目成员</span>
          <div class="ctx">{{ model1.memberName?model1.memberName:'--' }}</div>
        </div>
        <div class="item item-column">
          <span class="label">运营情况</span>
          <div v-if="model1.currentOperationSituation" style="width:100%;">
            <div v-if="model1.currentOperationSituation.length>66 && !isCheck1" class="ctx ctx-word-break">{{ model1.currentOperationSituation | contentFilter }}...<span class="expand-btn" @click="isCheck1 = true">展开</span></div>
            <div v-else class="ctx ctx-word-break">{{ model1.currentOperationSituation }} <span v-if="model1.currentOperationSituation.length>66" class="expand-btn" @click="isCheck1 = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">
            --
          </div>
        </div>
        <div class="item item-column">
          <span class="label">未来前景及亮点</span>
          <div v-if="model1.inveEvaluation" style="width:100%;">
            <div v-if="model1.inveEvaluation.length>66 && !isCheck2" class="ctx ctx-word-break">{{ model1.inveEvaluation | contentFilter }}...<span class="expand-btn" @click="isCheck2 = true">展开</span></div>
            <div v-else class="ctx ctx-word-break">{{ model1.inveEvaluation }} <span v-if="model1.inveEvaluation.length>66" class="expand-btn" @click="isCheck2 = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">
            --
          </div>
        </div>
      </div>
      <!-- 立项信息 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon7@2x.png">
        立项信息
        <van-icon
          :name="article.part3?'arrow-up':'arrow-down'"
          class="arrow-icon"
          @click="toggle('part3')"
        />
      </div>
      <div v-if="article.part3" class="reg-info">
        <div class="item">
          <span class="label">融资轮次</span>
          <div class="ctx">{{ model2.finaRounds ? model2.finaRounds :'--' }}</div>
        </div>
        <div class="item">
          <span class="label">融资金融</span>
          <div v-if="model2.finaAmountCurrencyString" class="ctx"> {{ model2.finaAmountCurrencyString }} <span v-if="model2.finaAmount!==null" class="money-red">{{ model2.finaAmount | formatMoney }}</span></div>
          <div v-else class="ctx">--</div>
        </div>
        <div class="item">
          <span class="label">投前估值</span>
          <div v-if="model2.beforeValuationCurrencyString" class="ctx"> {{ model2.beforeValuationCurrencyString }} <span v-if="model2.preMoney!==null" class="money-red">{{ model2.preMoney | formatMoney }}</span></div>
          <div v-else class="ctx">--</div>
        </div>
        <div class="item">
          <span class="label">投后估值</span>
          <div v-if="model2.afterValuationCurrencyString" class="ctx">  {{ model2.afterValuationCurrencyString }}<span v-if="model2.postMoney!==null" class="money-red">{{ model2.postMoney | formatMoney }}</span></div>
          <div v-else class="ctx">--</div>
        </div>
        <div class="item">
          <span class="label">出资主体</span>
          <div class="ctx">{{ model1.inveName? model1.inveName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">投资角色/类型</span>
          <div class="ctx">{{ model2.inveRole? model2.inveRole:'--' }}/{{ model2.inveType? model2.inveType:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">拟投资金额</span>
          <div v-if="model2.intendedAmountCurrencyString" class="ctx"> {{ model2.intendedAmountCurrencyString }}<span v-if="model2.intendedAmount!==null" class="money-red">{{ model2.intendedAmount | formatMoney }}</span></div>
          <div v-else class="ctx">--</div>
        </div>
        <div class="item">
          <span class="label">股数/占比(%)</span>
          <div class="ctx">{{ model2.inveShare? model2.inveShare:'--' }}/{{ model2.perShare? model2.perShare:'--' }}</div>
        </div>
        <div class="item item-column">
          <span class="label">其他重点关注信息</span>
          <div v-if="model2.focusInfo" style="width:100%;">
            <div v-if="model2.focusInfo.length>66 && !isCheck3" class="ctx ctx-word-break">{{ model2.focusInfo | contentFilter }}...<span class="expand-btn" @click="isCheck3 = true">展开</span></div>
            <div v-else class="ctx ctx-word-break">{{ model2.focusInfo }} <span v-if="model2.focusInfo.length>66" class="expand-btn" @click="isCheck3 = false">收起</span></div>
          </div>
          <div v-else class="item-column-empty">
            --
          </div>
        </div>
        <div class="item item-column">
          <span class="label">委派人员安排</span>
          <div class="ctx">{{ model2.majorMatter? model2.majorMatter:'--' }}</div>
        </div>
        <div class="item item-column">
          <span class="label">商业计划书</span>
          <div class="ctx"><attachment :data="model2.businessPlanFileLists"/></div>
        </div>
        <div class="item item-column">
          <span class="label">立项报告</span>
          <div class="ctx"><attachment :data="model2.projectReportFileLists"/></div>
        </div>
        <div class="item item-column">
          <span class="label">访谈纪要</span>
          <div class="ctx"><attachment :data="model2.summaryInterviewsFileLists"/></div>
        </div>
        <div class="item item-column">
          <span class="label">内容纪要</span>
          <div class="ctx"><attachment :data="model2.internalSummaryList"/></div>
        </div>
        <div class="item item-column">
          <span class="label">其他</span>
          <div class="ctx"><attachment :data="model2.anotherFileFileLists"/></div>
        </div>
      </div>
      <!-- 决议结果 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon9@2x.png">
        决议结果
        <van-icon
          :name="article.part4?'arrow-up':'arrow-down'"
          class="arrow-icon"
          @click="toggle('part4')"
        />
      </div>
      <div v-if="article.part4" class="reg-info">
        <div class="item">
          <span class="label">投票汇总结果</span>
          <div class="ctx">{{ voteMagModel.voteResult? voteMagModel.voteResult:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">投票汇总意见</span>
          <div class="ctx">{{ voteMagModel.collectOpinion? voteMagModel.collectOpinion:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">决议人</span>
          <div class="ctx">{{ voteMagModel.decisionName? voteMagModel.decisionName:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">决议时间</span>
          <div class="ctx">{{ voteMagModel.decisionDt? voteMagModel.decisionDt:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">决议结果</span>
          <div class="ctx">{{ voteMagModel.decisionResult? voteMagModel.decisionResult:'--' }}</div>
        </div>
        <div class="item">
          <span class="label">决议意见</span>
          <div class="ctx">{{ voteMagModel.decisionOpinion? voteMagModel.decisionOpinion:'--' }}</div>
        </div>
      </div>
      <!-- 审批信息 -->
      <div class="sub-title">
        <img src="@/assets/images/icons/icon1@2x.png">
        审批信息
        <van-icon
          :name="article.part5?'arrow-up':'arrow-down'"
          class="arrow-icon"
          @click="toggle('part5')"
        />
      </div>
      <div v-if="article.part5" class="fd-steps-info">
        <step-vertical :step-list="flowList"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    'step-vertical': () => import('./projectStepVertical'),
    attachment: () => import('@/components/attachment/index')
  },
  props: {
    modelData: {
      type: Object,
      default() {
        return {}
      }
    },
    voteList: {
      type: Array,
      default() {
        return []
      }
    },
    voteMagModel: {
      type: Object,
      default() {
        return {
          collectOpinion: null,
          decisionDt: null,
          decisionName: null,
          decisionResult: null,
          voteResult: null
        }
      }
    },
    flowList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      article: {
        part1: true,
        part2: true,
        part3: true,
        part4: true,
        part5: true
      },
      model: {},
      model1: {},
      model2: {},
      model3: {},
      isCheck: false,
      isCheck1: false,
      isCheck2: false,
      isCheck3: false
    }
  },
  watch: {
    modelData: {
      handler(newValue, oldValue) {
        // baseInfoSnapshotVO    //企业信息
        // ProjAppInfoSnapshotVO //立项信息
        // projInfoSnapshotVO    // 项目信息
        // custMemberSnapshotVO  // 主联系人信息
        this.model = this.modelData.baseInfoSnapshotVO
        this.model1 = this.modelData.projInfoSnapshotVO
        this.model2 = this.modelData.ProjAppInfoSnapshotVO
        this.model3 = this.modelData.custMemberSnapshotVO
      },
      deep: true
    }
  },
  methods: {
    expandChange(value) {},
    toggle(part) {
      this.article[part] = !this.article[part]
    }
  }
}
</script>
<style scoped lang="scss">
.item-column-empty{
  font-size: 28px;
  font-weight: 500;
  color: rgba(76, 76, 76, 1);
  text-align: left;
  width: 100%;
}
.expand-btn{
  font-size:28px;
  font-weight:500;
  color:rgba(74,144,226,1);
}
.ctx-word-break{
  word-break: break-all;
  white-space: pre-line;
}
.sub-title {
  display: block;
  width: 100%;
  font-size: 28px;
  background-color: #fdf1f1;
  padding: 0px 40px;
  overflow: hidden;
  box-sizing: border-box;
  line-height: 88px;
  img {
    width: 23px;
    height: 22px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
  .arrow-icon {
    float: right;
    margin-top: 30px;
  }
}
.reg-info {
  background: white;
  margin-bottom: 20px;
  padding: 20px 0 10px 0;
  .border {
    width: 670px;
    margin: 0 auto;
    border-bottom: 2px solid #f0f0f0;
    margin-bottom: 20px;
  }
  .item {
    padding: 10px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .label {
      font-size: 28px;
      font-weight: 500;
      color: #9e9e9d;
      line-height: 40px;
      vertical-align: top;
      display: inline-block;
      width: 240px;
    }
    .ctx {
      font-size: 28px;
      font-weight: 500;
      color: rgba(76, 76, 76, 1);
      line-height: 40px;
      display: inline-block;
      vertical-align: top;
      width: 400px;
      // background: yellow;
      text-align: right;
    }
  }
  .item-column {
    display: flex;
    flex-direction: column;
    .label {
      text-align: left;
      width: 100%;
    }
    .ctx {
      width: 100%;
      text-align: left;
    }
  }
  .long-label {
    .label {
      width: 450px;
    }
    .ctx {
      width: 200px;
    }
  }
}
.process {
  .col {
    width: 110px;
    display: inline-block;
    font-size: 28px;
    color: #333;
    line-height: 200%;
    text-align: center;
    img {
      width: 80%;
      height: 80px;
      object-fit: cover;
    }
  }
}
.person {
  background: white;
  padding: 40px;
}
</style>
