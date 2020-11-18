<template>
  <div class="meetingRecord">
    <fd-form
      :model="detail"
      :schema="schema"
      :options="options"
      :btn-del="MEETING_ID"
      :title="MEETING_ID ? '会议记录编辑': '会议记录新增'"
      :btn-edit="MEETING_ID"
      is-btn
      is-back="back"
      @submit="submitHandler"
      @delete="deleteHandler"
      @back="back"
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
      MEETING_ID: this.$route.query.MEETING_ID,
      loadStatus: 'none'
    }
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {},
  methods: {
    formatDate(time) {
      var s = 0
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      s = Number(hour * 3600) + Number(min * 60)
      return s
    },
    back(model, fieldsModel) {
      if (this.MEETING_ID) {
        this.$router.push({ path: 'meetingRecordDetail', query: { MEETING_ID: this.MEETING_ID }})
      } else {
        if (model.MEETING_TITLE ||
            model.MEETING_DATE ||
            model.MEETING_ROOM_NAME ||
            model.MEETING_BEGIN_TIME ||
            model.MEETING_END_TIME) {
          this.$dialog.confirm({
            message: '是否保存编辑数据？'
          })
            .then(() => {
              this.storage.set('meetingRecordDraft', model)
              this.$router.push({ path: '/meetingRecordList' })
            })
            .catch(() => {
              this.storage.remove('meetingRecordDraft')
              this.$router.push({ path: '/meetingRecordList' })
            })
          return
        }
        // this.$router.push({ path: '/meetingRecordList' })
        this.$router.go(-1)
      }
    },
    submitHandler(params) {
      let postUrl = '/meetingRecordAction/addSave.do'
      if (this.MEETING_ID) {
        postUrl = '/meetingRecordAction/updateSave.do'
      }
      const data = params

      if (this.formatDate(data.MEETING_BEGIN_TIME) >= this.formatDate(data.MEETING_END_TIME)) {
        this.Toast(`结束时间不能早于开始时间！`)
        return
      }
      const errText = '字符超出限制！'
      if (data.MEETING_TITLE) {
        if (data.MEETING_TITLE.length > 50) {
          this.Toast(`会议主题${errText}`)
          return
        }
      }
      if (data.MEETING_PERSON) {
        if (data.MEETING_PERSON.length > 100) {
          this.Toast(`外部人员${errText}`)
          return
        }
      }
      if (data.MEETING_CONTENT) {
        if (data.MEETING_CONTENT.length > 500) {
          this.Toast(`会议内容${errText}`)
          return
        }
      }

      this.loadStatus = 'process'
      data.EXECUTOR_ID = params.meetingUserList.map(i => {
        return i.value
      }).join(',')
      data.EXECUTOR_NAME = params.meetingUserList.map(i => {
        return i.label
      }).join(',')
      data.ATTA_FILE_NAME = params.ATTACHMENT_LIST.map(i => {
        return i.fileName
      }).join(',')
      data.ATTA_FILE_OLD_NAME = params.ATTACHMENT_LIST.map(i => {
        return i.fileOldName
      }).join(',')
      data.ATTA_FILE_PATH = params.ATTACHMENT_LIST.map(i => {
        return i.filePath
      }).join(',')
      data.ATTA_FILE_SIZE = params.ATTACHMENT_LIST.map(i => {
        return i.fileSize
      }).join(',')
      data.ATTA_FILE_TYPE = params.ATTACHMENT_LIST.map(i => {
        return i.fileType
      }).join(',')
      data.ATTA_SERIAL_NO = params.ATTACHMENT_LIST.map(i => {
        return i.serialNo
      }).join(',')
      this.$axios.postJson(
        postUrl,
        data,
        res => {
          if (res.statue === '0') {
            this.loadStatus = 'success'
            setTimeout(() => {
              this.$router.push({ path: 'meetingRecordDetail', query: { MEETING_ID: res.commonMap.MEETING_ID, reload: true }})
            }, 1000)
            if (!this.MEETING_ID) {
              this.storage.remove('meetingRecordDraft')
            }
            return
          }
          this.Toast(res.msg)
          this.loadStatus = 'none'
        },
        err => {
          this.Toast(err.msg || '请求错误！')
          this.loadStatus = 'none'
        }
      )
    },
    deleteHandler(params) {
      this.$dialog.confirm({
        message: '确认删除'
      })
        .then(() => {
          this.$axios.postJson(
            '/meetingRecordAction/delete.do',
            { MEETING_ID: params.MEETING_ID },
            res => {
              this.Toast(res.msg)
              setTimeout(() => {
                this.$router.push({ path: '/meetingRecordList', query: { reload: true }})
              }, 1000)
            }
          )
        })
        .catch(() => {})
    }
  }
}
</script>
