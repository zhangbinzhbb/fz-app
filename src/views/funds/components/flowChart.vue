// 查看流程图
<template>
  <div class="flow-chart" style="">
    <headerx cat-title="流程图" page-type="back" @closeBack="$emit('close')"/>
    <div class="box">
      <iframe
        :src="'http://eip.oriza.com/sysweb/action/workflowProcess!flowGraphicsSvg.action?defId='+chartid"
        frameborder="0"
        height="100%"
        width="100%" />

        <!-- <iframe
        id="frame"
        src="http://172.30.70.166:9090/sysweb/action/workflowProcess!flowGraphicsSvg.action?defId=ei_sh_ContractCheckProcess:6:01e8305f-253c-411c-843d-1fea46851ed8"
        frameborder="0"
        height="100%"
        width="100%" /> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    chartid: {
      type: String,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  created() {},
  mounted() {}
}
</script>

<style lang="scss">
.flow-chart{
  width: 100%;
  height: 100%;
  .yh-header-x {
    z-index: 3100;
  }
  .box{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    margin-top: 155px;
    overflow: scroll;

  }
}
#formdiv{
  width: 60%;
  height: 100%;
  overflow: scroll;
  background-color: white;
  margin-top:70px
}
</style>
