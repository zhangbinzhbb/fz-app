<template>
  <div class="has-comment">
    <headerx cat-title="合同信息">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <div v-for="(item,index) in [1,2,3]" :key="index" class="item">
        <div class="tit">
          <img src="" alt="">
          沙湖金融
        </div>
        <div class="p">
          <span class="label">申请人：</span>邓尚文
        </div>
        <div class="label p">合同内容：</div>
        <div class="p">
          此处显示合同内容，默认三行显示，可展开显示全部内容此处显示合同内容，默认三行显示，可展开显示全部内容此显示全部内容，默认三行显示，可...
          <span class="blue">展开</span>
        </div>
        <div class="file-con">
          <attachment :data="[{fileName:'ceshi'}]"/>
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
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
<style scoped lang="scss">
.item{
  background: white;
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  padding: 40px;
  margin-bottom: 20px;
  .tit  {
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:70px;
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
