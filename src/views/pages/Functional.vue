<template>
  <div class="mail" id="mail">
    <headerx :catTitle="catTitle"></headerx>
    <img :src="baseConfig.domain+'static/images/gnsx.png'" alt="" class="sx-img">
  </div>
</template>
<script>
// 此页面未用到
export default {
  components: {

  },
  data () {
    return {
      catTitle: '功能上线'
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.mail {
  z-index: 9999999;
  .sx-img {
    width: 100%;
  }
}
.mail-main {
  background-color: #fff;
  width: 100%;
  margin-top: 25px;
}
</style>
