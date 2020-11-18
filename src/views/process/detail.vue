<template>
  <div class="has-comment process-contanier">
    <headerx cat-title="融资对接"/>
    <div v-if="model" class="comment-content no-comment">
      <div>
        <div class="healthy-detail-group">
          <p class="healthy-detail-group-legend">申请信息</p>
          <div class="healthy-detail-item">
            <span class="label">标题</span>
            <span class="value">{{ model.TITLE || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">发布人</span>
            <span class="value">{{ model.ISSUER || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">发布时间</span>
            <span class="value">{{ model.ISSUE_DT || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">项目联系人</span>
            <span class="value">{{ model.PROJECT_LINKMAN_NAME || '--' }}-{{ model.MOBILEPHONE || '--' }}</span>
          </div>
        </div>
        <div class="healthy-detail-group">
          <p class="healthy-detail-group-legend">项目信息</p>
          <div class="healthy-detail-item">
            <span class="label">企业名称</span>
            <span class="value">{{ model.ENTE_NAME || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">行业</span>
            <span class="value">{{ model.INDUSTRY_NAME || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">融资轮次</span>
            <span class="value">{{ model.FINANCING_RAUND_CODE_NAME || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">所属省市</span>
            <span class="value">{{ model.PROVINCE_NAME || '--' }}{{ model.CITY_NAME || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">融资金额</span>
            <span class="value">{{ model.FINANCING_AMOUNT_RESULT || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">历史融资金</span>
            <span class="value">{{ model.FINANCING_AMOUNT_HIS_RESULT || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">历史投资人</span>
            <span class="value">{{ model.INVESTOR_HIS || '--' }}</span>
          </div>
          <div class="healthy-detail-item">
            <span class="label">项目简介</span>
            <span class="value">{{ model.PROJECT_BRIEF || '--' }}</span>
          </div>
          <div class="healthy-detail-item" style="flex-direction: column;">
            <span class="label">附件</span>
            <span class="value">
              <attachment :data="model.fileList"/>
            </span>
          </div>
        </div>
        <div v-if="model.hasDock==='0'" class="process-button">
          <span @click="getDock">点我，对接项目</span>
        </div>
      </div>
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
      model: null,
      pkId: this.$route.query.pkId || ''
    }
  },
  created() {
    const URL = '/faProjectInfoAction/detail.do'
    const pkId = this.pkId
    this.$axios.get(URL, {
      pkId
    }, res => {
      this.model = res.dataContent
    })
  },
  methods: {
    getDock() {
      const pkId = this.model.PK_ID
      const URL = '/faDockInfoAction/dock.do'
      this.$axios.get(URL, {
        pkId
      }, res => {
        window.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.process-contanier{
  .healthy-detail-group-legend{
    padding: 0 40px;
    height:88px;
    line-height: 88px;
    font-size: 24px;
    color:rgba(76,76,76,1);
    background:rgba(253,241,241,1);
  }
  .process-button{
    padding: 0 40px;
    span{
      font-size:28px;
      font-weight:500;
      color:rgba(255,255,255,1);
      margin:40px 0;
      height:76px;
      line-height: 76px;
      text-align: center;
      background:rgba(182,0,5,1);
      border-radius:4px;
      display: inline-block;
      width: 100%;
    }
  }
  .healthy-detail-group{
    background-color: #fff;
    &+.healthy-detail-group{
      margin-top: 18px;
    }
    .healthy-detail-item-1{
      display: flex;
      flex-direction: column;
      .healthy-detail-item-check{
        display: flex;
        justify-content: space-between;
        padding: 30px 0;
        &+.healthy-detail-item-check{
          border-top: 1px solid #F0F0F0;
        }
      }
      h2{
        font-size:28px;
        font-weight:500;
        color:rgba(158,158,157,1);
      }
    }
    .healthy-detail-item{
      display: flex;
      justify-content: space-between;
      padding: 30px 40px;
      &+.healthy-detail-item{
        border-top: 1px solid #F0F0F0;
      }
      span{
        font-size:28px;
        font-weight:500;
      }
      .label{
        color:rgba(158,158,157,1);
      }
      .value{
        color:rgba(76,76,76,1);
      }
    }
  }
}
</style>

