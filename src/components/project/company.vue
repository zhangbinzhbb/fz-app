<template>
  <div class="company-top">
    <!-- <div class="name">{{name}}</div>
    <div class="right">
      <img :src="baseConfig.domain+'static/images/company/gz.png'" alt="" class="" @click="$router.push('/businessList')">
      <img :src="baseConfig.domain+'static/images/company/search.png'" alt="" class="" @click="$router.push('reportError')">
    </div> -->
    <div class="liner"></div>
  </div>
</template>

<script>
export default {
  name: 'company',
  data () {
    return {}
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  created () {},
  activated () {},
  methods: {}
}
</script>
<style scoped lang="scss">
.company-top {
  background: linear-gradient(90deg, #df0106, #b70007);
  // height: 80px;
  position: relative;
  .name {
    color: white;
    width: calc(100% - 150px);
    font-size: 30px;
    text-align: left;
    padding-left: 20px;
    font-weight: 800;
    height: 60px;
    line-height: 60px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .right {
    position: absolute;
    right: 20px;
    top: 0px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .liner {
    height: 20px;
    background: white;
  }
}
</style>
