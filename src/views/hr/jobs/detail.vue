<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <span class="yh-add-more" @click="updateDetail">编辑</span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <basic-form :schema="schema" :model="detail"></basic-form>
    </div>
    <!--提交按钮-->
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  components: {
    'basicForm': () => import('@/components/basicForm/detail')
  },
  mixins: [mixins],
  data() {
    return {
      catTitle: '岗位详情'
    }
  },
  created() {
    // if (document.readyState === 'complete') this.something()
  },
  methods: {
    updateDetail() {
      this.$router.push({
        path: '/jobsNew',
        query: { id: this.$route.query.id }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
.titaltop{
  text-align: center;
  color: #000;
  font-size: 32px;
  padding: 26px;
  background: #fff;
}
/deep/ .fd-detail-group-content{
  .fd-detail-item:last-child{
    display: block!important;
  }
  .fd-detail-item:nth-of-type(7){
    display: block!important;
  }
  .textArea{
    font-size:28px;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:40px;
    margin-top:5px;

  }
}
</style>
