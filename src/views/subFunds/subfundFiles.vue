<template>
  <div class="has-comment">
    <headerx :cat-title="this.$route.query.projName || this.$route.query.projName "/>
    <div class="comment-content no-comment">
      <div v-if="checkPermission('50020503')" style="height:100%">
        <folder ref="folder" :proj-or-fund-id="foudsId" type="3"/>
      </div>
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
      foudsId: this.$route.query.id,
      permission: ''
    }
  },
  computed: {
    checkPermission(key) {
      return function(key) {
        let result = false
        if (this.permission.indexOf(key) > -1) {
          result = true
        }
        return result
      }
    }
  },
  created() {
    this.getPermission()
  },
  methods: {
    getPermission() {
      this.$axios.get(
        'appFuncPermissionList',
        { fatherid: 5002, projId: this.foudsId },
        res => {
          const arr = []
          res.data.map(item => {
            item.childList.map(value => {
              arr.push(value.id)
            })
          })
          this.permission = arr.join(',')
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">

</style>
