<template>
  <div class="has-comment project-email-detail">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <h2>{{ model.title?model.title:'--' }}</h2>
      <div class="content">
        <div class="item-c">
          <span class="lable">发件人</span>
          <span class="value">{{ model.senderEmail?model.senderEmail:'--' }}</span>
        </div>
        <div class="item-c">
          <span class="lable">收件人</span>
          <span class="value">{{ model.addresseeEmail?model.addresseeEmail:'--' }}</span>
        </div>
        <div class="item-c">
          <span class="lable">抄送人</span>
          <span class="value">{{ model.ccEmail?model.ccEmail:'--' }}</span>
        </div>
        <div class="item-c">
          <span class="lable">时间</span>
          <span class="value">{{ model.emailDate?model.emailDate:'--' }}</span>
        </div>
        <!-- {{ model.mailContent?model.mailContent:'--' }} -->
        <div class="remark" v-html="model.mailContent || '--'"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      model: null,
      catTitle: '查看邮件详情'
    }
  },
  created() {
    this.getMailExchageAction(this.$route.query.id)
  },
  methods: {
    getMailExchageAction(mailId = '1221') {
      const URL = '/mailExchageAction/detail.do'
      this.$axios.get(
        URL,
        {
          mailId
        },
        res => {
          this.model = res.dataContent
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.project-email-detail{
  background-color: #fff;
  h2{
    padding: 22px 0 22px 40px;
    font-size:32px;
    font-weight:600;
    color:rgba(76,76,76,1);
    background:rgba(253,241,241,1);
  }
  .content{
    padding: 29px 40px 0;
    .item-c{
      display: flex;
      padding-bottom: 20px;
      .lable{
        width: 120px;
        font-size:28px;
        font-weight:500;
        color:rgba(158,158,157,1);
      }
      .value{
        width:calc(100% - 120px);
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
      }
    }
  }
  .remark{
    border-top: 1px solid #F0F0F0;
    padding-top: 29px;
    font-size:26px;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:1.6;
    word-break: break-all;
    white-space: pre-line;
  }
}
</style>
