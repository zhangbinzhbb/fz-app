<template>
  <div class="has-comment">
    <headerx cat-title="文件库">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <folder ref="folder" :proj-or-fund-id="funId" type="2" />
    </div>
  </div>
</template>
<script>
export default {
  components: {
    folder: () => import('@/components/attachment/folder')
  },
  data() {
    return {
      funId: this.$route.query.id
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
<style scoped lang="scss">

</style>
