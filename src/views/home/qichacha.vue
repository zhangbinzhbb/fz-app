<template>
  <div style="">
    <headerx cat-title="查企业"/>
    <iframe :src="src" width="100%" height="100%"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: 'https://pro-h5.qichacha.com/demo'
    }
  },
  created() {
    // console.log(this.src)
  }
}
</script>

<style scoped>
  .yh-content .yh-page{
    overflow-x: hidden;
  }
</style>
