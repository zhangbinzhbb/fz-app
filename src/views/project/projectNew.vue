<template>
  <div>
    <div class="DemandApproval has-comment">
      <headerx cat-title="项目新增"/>
      <basic-form
        ref="basicForm"
        :form="basicForm"
        :data="detail"
        @submit="submit"
        @reset="getDetail"
      />
    </div>
  </div>
</template>
<script>
import mixins from './mixins/index'
export default {
  components: {
    basicForm: () => import('@/components/basicForm/index')
  },
  mixins: [mixins],
  data() {
    return {
      projectList: []
    }
  },
  watch: {},
  created() {},
  methods: {
    submit(params) {
      if (this.isLoading) {
        return
      }
      const postUrl = '/projectInfoApp/add'
      const verifing = []
      const update = () => {
        this.isLoading = true
        this.$axios.postJson(
          postUrl,
          params,
          res => {
            this.Toast('保存成功！')
            this.storage.set('refresh-home-list', true)
            this.isLoading = false
            window.history.back(-1)
          },
          error => {
            this.isLoading = false
          }
        )
      }

      if (true || this.verify.verified(verifing)) {
        update()
      }
    }
  }
}
</script>
<style scoped lang="scss">
</style>
