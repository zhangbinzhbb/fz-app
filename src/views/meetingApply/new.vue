<template>
  <div class="newMeeting">
    <fd-form
      :model="detail"
      :schema="schema"
      :options="options"
      :is-btn="!APPLY_NO"
      :btn-edit="APPLY_NO"
      :btn-del="APPLY_NO"
      :is-back="true"
      :title="APPLY_NO ? '会议申请编辑': '会议申请新增'"
      @back="backHandler"
      @submit="submitHandler"
      @delete="deleteHandler"
    />
    <loading :load-type="loadStatus" @hide="loadStatus='none'" />
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    loading: () => import('@/components/loading')
  },
  mixins: [mixins],
  data() {
    return {
      APPLY_NO: this.$route.query.APPLY_NO,
      loadStatus: 'none'
    }
  },
  created() {},
  methods: {
    backHandler(value) {
      const APPLY_NO = this.APPLY_NO
      if (APPLY_NO) {
        this.$router.push({
          path: '/meetingDetail',
          query: { APPLY_NO }
        })
      } else {
        if (value.meetingName) {
          this.$dialog.confirm({
            message: '是否保存编辑数据？'
          })
            .then(() => {
              this.storage.set('meeting-apply-model', value)
              this.$router.push({ path: '/meetingList' })
            })
            .catch(() => {
              this.storage.remove('meeting-apply-model')
              this.$router.push({ path: '/meetingList' })
            })
          return
        }
        this.$router.go(-1)
      }
    },
    submitHandler(params) {
      params = this.setData(params)
      let postUrl = '/MyApplyMeetingAction/addMeeting.do'
      if (this.APPLY_NO) {
        postUrl = '/MyApplyMeetingAction/update.do'
        params.applyNo = this.APPLY_NO
      }

      const update = () => {
        this.$axios.post(
          postUrl,
          params,
          res => {
            if (res.statue === '0') {
              this.loadStatus = 'success'
              const APPLY_NO = res.commonMap.pkId
              if (this.APPLY_NO) {
                this.$router.push({ path: '/meetingDetail', query: { APPLY_NO }})
                return
              }
              this.storage.set('refresh-meeting-list', true)
              this.$router.push({
                path: '/meetingList'
              })
              this.storage.remove('meetingRecordDraft')
              return
            }
            this.Toast(res.msg)
            this.loadStatus = 'none'
          },
          error => {
            this.Toast(`${error.msg}`)
            this.loadStatus = 'none'
          }
        )
      }

      const verifing = [
        {
          name: 'compareDate',
          content: params.meetingStartTime + ';' + params.meetingEndTime,
          tip: '结束时间不能早于开始时间'
        },
        {
          name: 'appointMaxLength',
          content: params.meetingName + ';50',
          tip: '会议名称最大长度为50'
        },
        {
          name: 'appointMaxLength',
          content: params.remark + ';500',
          tip: '备注最大长度为500'
        }
      ]
      if (this.verify.verified(verifing)) {
        params.meetingStartTime += ':00'
        params.meetingEndTime += ':00'
        if (params.meetingNumber === 0) {
          this.Toast('请输入必填项')
          return
        } else if (params.meetingRoomId === 0) {
          this.Toast('请输入必填项')
          return
        }
        this.loadStatus = 'process'
        update()
      }
    },
    deleteHandler(params) {
      this.$dialog
        .confirm({
          title: '会议删除',
          message: '确定要删除该会议吗?'
        })
        .then(index => {
          const URL = '/MyApplyMeetingAction/removeMeeting.do'
          this.$axios.post(
            URL,
            { APPLY_NO: "'" + this.$route.query.APPLY_NO + "'" },
            res => {
              this.Toast('删除成功！')
              this.storage.set('refresh-meeting-list', true)
              this.$router.push({
                path: '/meetingList'
              })
            },
            error => {
              this.Toast(`${error.msg}`)
            }
          )
        })
        .catch(() => {
          this.Toast('取消成功！')
        })
    },
    setData(data) {
      const params = JSON.parse(JSON.stringify(data))
      const arr = []
      const arrName = []
      // 提供服务
      params.serviceList = data.serviceModelList.length ? data.serviceModelList.join(',') : ''
      data.meetingUserList.map(item => {
        arr.push(item.value)
        arrName.push(item.label)
      })
      params.participantIds = arr.join(',')
      params.participantsName = arrName.join(',')
      this.meetingList.forEach(item => {
        if (item.value === data.meetingRoomId) {
          params.meetingRoom = item.label
        }
      })
      params.remindMode = data.remindModeList.join(',')
      params.submitType = { 'isTrusted': true }

      delete params.remindModeList
      delete params.serviceModelList
      delete params.meetingUserList
      return params
    }
  }
}
</script>

<style lang="scss">
.newMeeting{
  .fd-checker-round{
    width: 90% !important;
  }
}
</style>
