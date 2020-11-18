<template>
  <div class="mail" id="mail">
    <div class="mail-bg">
        <headerx :catTitle="catTitle"></headerx>
        <img :src="baseConfig.domain+'static/images/downloa.png'" alt="" class="sx-img" style="width:100%;">
        <a class="downloa-btn">立即下载</a>
    </div>
  </div>
</template>
<script>
// 此页面未用到
export default {
  components: {

  },
  data () {
    return {
      catTitle: '元禾控股移动办公管理系统'
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.mail {
    z-index: 9999999;
    .mail-bg {
        background-color: #fff;
        position: absolute;
        top: 70px;
        right: 0;
        bottom: 0;
        left: 0;
    }
}
.mail-main {
    background-color: #fff;
    width: 100%;
    margin-top: 25px;
}
.downloa-btn{
  display: block;
  margin: 0 auto;
  text-align: center;
  line-height: 90px;
  color:#B80000;
  width:490px;
height:89px;
border: 4px solid #B80000;
border-radius: 50px;
margin-top: 40px;
}
</style>
