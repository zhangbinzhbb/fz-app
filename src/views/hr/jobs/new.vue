<template>
  <div class="DemandApproval">
    <fd-form
      :model="detail"
      :schema="schema"
      :is-btn="!id"
      :btn-edit="id"
      :title="catTitle"
      @submit="submit"
    />
    <loading :load-type="loadStatus" />
  </div>
</template>
<script>
import mixins from './mixins/index'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    loading: () => import('@/components/loading/index')
  },
  mixins: [mixins],
  data() {
    return {
      catTitle: this.$route.query.id ? '岗位详情' : '新增岗位',
      id: this.$route.query.id,
      loadStatus: 'none'
    }
  },
  created() {
    this.Toast('需要上传附件，请到PC端操作')
  },
  methods: {
    submit(params) {
      if (this.isLoading) {
        return
      }
      let postUrl = '/jobDemand/add'
      if (this.$route.query.id) {
        postUrl = '/jobDemand/update/' + this.$route.query.id
        // this.fileFnSetParams('fileSetting', "uploadFiles", params)
      }
      // 插入公司名称
      this.schema.groups[0].fields[0].props.options.map((item, index) => {
        if (item.value === params.groupId) {
          params.groupName = item.label
        }
      })
      // eslint-disable-next-line no-unreachable
      this.schema.groups[0].fields[1].props.options.map((item, index) => {
        if (item.value === params.depId) {
          params.depName = item.label
        }
      })
      const verfing = [
        {
          name: 'appointMaxLength',
          content: params.jobName + ';10',
          tip: '岗位名称最大长度10'
        },
        {
          name: 'appointMaxLength',
          content: params.jobDesc + ';500',
          tip: '岗位描述最大长度500'
        },
        {
          name: 'appointMaxLength',
          content: params.jobRequirement + ';500',
          tip: '岗位要求最大长度500'
        },
        {
          name: 'appointMaxLength',
          content: params.remandNum + ';3',
          tip: '招聘人数最大长度3'
        },
        {
          name: 'compareDate',
          content: params.startTime + ';' + params.endTime,
          tip: '结束时间不能早于开始时间'
        }
      ]

      const update = () => {
        this.isLoading = true
        this.$axios.postJson(
          postUrl,
          params,
          res => {
            this.loadStatus = 'success'
            this.storage.set('refresh-jobs-list', true)
            this.isLoading = false
            setTimeout(function() {
              this.loadStatus = 'none'
              window.history.back(-1)
            }, 1000)
          },
          error => {
            this.Toast(`${error.msg}`)
            this.loadStatus = 'none'
            this.isLoading = false
          }
        )
      }
      const reg = new RegExp('^[0-9]*$')
      if (!reg.test(params.remandNum)) {
        this.Toast('招聘人数只能为数值')
        return
      }
      console.log("params",params)
      // return
      if (this.verify.verified(verfing)) {
        update()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
</style>
