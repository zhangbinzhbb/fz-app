<template>
  <div class="">
    <fd-form
      :model="detail"
      :schema="schema"
      :options="options"
      title="请假申请"
      is-btn
      @submit="submitHandler"
    />
    <loading :load-type="loadStatus" @hide="loadStatus='none'" />
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  name: '',
  components: {
    fdForm: () => import('@/components/form/form'),
    loading: () => import('@/components/loading')
  },
  mixins: [mixins],
  props: {},
  data() {
    return {
      loadStatus: 'none'
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    submitHandler(params) {
      const postUrl = '/LeaveListAction/SubmitLeaveApply.do'

      let participantsName = ''
      if (this.detail.manageUsers.length > 1) {
        this.Toast('代理人员只可选择一人！')
        return
      }

      const updateParams = () => {
        const user = this.storage.get('yh-user')
        participantsName = this.detail.manageUsers.map(i => {
          return i.label
        }).join(',')

        return `?param="申请日期"="${this.detail.ApplyDate}"@"填表人账号"="${
          user.loginName
        }"@"remarks"="${
          this.detail.remarks === undefined ? '' : this.detail.remarks
        }"@"leaveList"="组织":"${this.detail.UnitName}","工号":"${
          this.detail.EmployeeId
        }","姓名":"${this.detail.TrueName}","请假类别":"${
          this.detail.LeaveTypeId
        }","开始日期":"${this.detail.startDate.split(' ')[0]}","结束日期":"${
          this.detail.endDate.split(' ')[0]
        }","开始时间":"${this.detail.startDate.split(' ')[1]}","结束时间":"${
          this.detail.endDate.split(' ')[1]
        }","工作代理人":"${participantsName}","请假原因":"${
          this.detail.reason === undefined ? '' : this.detail.reason
        }"  `
      }
      this.loadStatus = 'process'
      this.$axios.post(
        postUrl + updateParams(),
        null,
        res => {
          if (res.statue === '0') {
            this.loadStatus = 'success'
            return
          }
          this.Toast(res.msg || '请求错误！')
          this.loadStatus = 'none'
        },
        res => {
          if (res.statue === '0') {
            this.loadStatus = 'success'
            return
          }
          this.Toast(res.msg || '请求错误！')
          this.loadStatus = 'none'
        },
      )
    }
  }
}
</script>
<style lang="scss" scoped></style>
