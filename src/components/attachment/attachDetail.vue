<template>
  <div style="height:980px">
    <!-- :catTitle="catTitle" -->
    <headerx cat-title="附件预览"/>
    <!-- width="100%" height="100%" -->
    <iframe :src="src" width="100%" height="100%"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: this.$route.query.src
    }
  },
  created() {
    this.src = this.$route.query.src
    // console.log(this.src)
  }
}
</script>

<style>
</style>
