<template>
  <folder ref="folder" :cat-title="catTitle" :group-id="model.groupId" :proj-object="model.projObject" type="1"/>
</template>
<script>
export default {
  components: {
    folder: () => import('@/components/attachment/folder')
  },
  data() {
    return {
      model: null,
      catTitle: '文件库'
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name
  },
  methods: {}
}
</script>

