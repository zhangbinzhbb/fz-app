<template>
  <folder ref="folder" :cat-title="catTitle" :group-id="groupId" :proj-or-fund-id="pkId" type="4"/>
</template>
<script>
export default {
  components: {
    folder: () => import('@/components/attachment/folder')
  },
  data() {
    return {
      model: null,
      catTitle: '文件库',
      groupId: this.$route.query.groupId,
      pkId: this.$route.query.pkId
    }
  },
  created() {},
  methods: {}
}
</script>
