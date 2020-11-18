<template>
  <div class="">
    <fd-form
      :model="detail"
      :schema="schema"
      :options="options"
      :title="APPLY_NO ? detail.VISIT_COMPANY: '来访接待新增'"
      :is-sbumit-save="APPLY_NO"
      is-btn
      btn-edit
      is-back="back"
      @submit="submitHandler"
      @submitSave="submitSave"
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
      APPLY_NO: this.$route.query.APPLY_NO,
      loadStatus: 'none'
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    back(model, fieldsModel) {
      if (this.APPLY_NO) {
        this.$router.push({ path: 'visitDetail', query: { APPLY_NO: this.APPLY_NO }})
      } else {
        this.$router.push({ path: 'visitList' })
      }
    },
    submitHandler(params) {
      let postUrl = '/applyVisitAction/addVisit.do'
      if (this.APPLY_NO) {
        postUrl = '/applyVisitAction/updateSave.do'
      }
      this.submitFunc(params, postUrl)
    },
    submitSave(params) {
      const postUrl = '/applyVisitAction/saveAndSendMsg.do'
      this.submitFunc(params, postUrl)
    },
    submitFunc(params, postUrl) {
      const data = params
      if (data.manageUsers.length > 1) {
        this.Toast('维护人员只可选择一人！')
        return
      }
      const errText = '字符超出限制！'
      if (data.VISIT_PERSON_LIST) {
        if (data.VISIT_PERSON_LIST.length > 250) {
          this.Toast(`来访人员${errText}`)
          return
        }
      }
      if (data.VISIT_COMPANY) {
        if (data.VISIT_COMPANY.length > 100) {
          this.Toast(`来访单位${errText}`)
          return
        }
      }
      if (data.VISIT_CONNECT_NAME) {
        if (data.VISIT_CONNECT_NAME.length > 25) {
          this.Toast(`联络人${errText}`)
          return
        }
      }
      if (data.VISIT_CONNECT_MOBILE) {
        if (data.VISIT_CONNECT_MOBILE.length > 25) {
          this.Toast(`联络人手机${errText}`)
          return
        }
      }
      if (data.VISIT_CAR) {
        if (data.VISIT_CAR.length > 25) {
          this.Toast(`车牌号${errText}`)
          return
        }
      }
      if (data.REMARK) {
        if (data.REMARK.length > 250) {
          this.Toast(`备注${errText}`)
          return
        }
      }
      //
      if (data.VISITOR_REMARK) {
        if (data.VISITOR_REMARK.length > 500) {
          this.Toast(`人员说明${errText}`)
          return
        }
      }
      if (data.VISITOR_ACCOMPANY_REMARK) {
        if (data.VISITOR_ACCOMPANY_REMARK.length > 500) {
          this.Toast(`陪同人员${errText}`)
          return
        }
      }
      if (data.VISIT_ARRANGE) {
        if (data.VISIT_ARRANGE.length > 500) {
          this.Toast(`行程安排${errText}`)
          return
        }
      }
      if (data.VISIT_CONTENT) {
        if (data.VISIT_CONTENT.length > 500) {
          this.Toast(`参观内容${errText}`)
          return
        }
      }
      if (data.TIME_LENGTH) {
        if (data.TIME_LENGTH.length > 100) {
          this.Toast(`时长要求${errText}`)
          return
        }
      }
      if (data.WELCOMEWORD) {
        if (data.WELCOMEWORD.length > 250) {
          this.Toast(`欢迎词${errText}`)
          return
        }
      }
      if (data.LED) {
        if (data.LED.length > 250) {
          this.Toast(`其他要求${errText}`)
          return
        }
      }

      // 维护人
      data.MANAGER_NAME = data.manageUsers.map(i => {
        return i.label
      }).join(',')
      data.MANAGER_ID = data.manageUsers.map(i => {
        return i.value
      }).join(',')
      if (data.SERVICE_LIST) {
        if (typeof data.SERVICE_LIST === 'object') {
          data.SERVICE_LIST = data.SERVICE_LIST.join(',')
        }
      }
      if (data.MEETING_SERVICE_LIST) {
        if (typeof data.MEETING_SERVICE_LIST === 'object') {
          data.MEETING_SERVICE_LIST = data.MEETING_SERVICE_LIST.join(',')
        }
      }

      // 会议室选人
      data.MEETINGUSER_NAMES = data.meettingPersons.map(i => {
        return i.label
      }).join(',')
      data.MEETINGUSER_IDS = data.meettingPersons.map(i => {
        return i.value
      }).join(',')

      // 展厅选人
      data.EXHIBITIONUSER_NAMES = data.exhibitionPersons.map(i => {
        return i.label
      }).join(',')
      data.EXHIBITIONUSER_IDS = data.exhibitionPersons.map(i => {
        return i.value
      }).join(',')

      // 附件
      data.VISIT_ATTA_FILE_NAME = data.VISIT_ATTA_LIST.map(i => {
        return i.fileName
      }).join(',')
      data.VISIT_ATTA_FILE_OLD_NAME = data.VISIT_ATTA_LIST.map(i => {
        return i.fileOldName
      }).join(',')
      data.VISIT_ATTA_FILE_PATH = data.VISIT_ATTA_LIST.map(i => {
        return i.filePath
      }).join(',')
      data.VISIT_ATTA_FILE_SIZE = data.VISIT_ATTA_LIST.map(i => {
        return i.fileSize
      }).join(',')
      data.VISIT_ATTA_FILE_TYPE = data.VISIT_ATTA_LIST.map(i => {
        return i.fileType
      }).join(',')
      data.VISIT_ATTA_SERIAL_NO = data.VISIT_ATTA_LIST.map(i => {
        return i.serialNo
      }).join(',')

      // 人员附件
      data.VISIT_PERSON_FILE_NAME = data.VISIT_PERSON_ATTA_LIST.map(i => {
        return i.fileName
      }).join(',')
      data.VISIT_PERSON_FILE_OLD_NAME = data.VISIT_PERSON_ATTA_LIST.map(i => {
        return i.fileOldName
      }).join(',')
      data.VISIT_PERSON_FILE_PATH = data.VISIT_PERSON_ATTA_LIST.map(i => {
        return i.filePath
      }).join(',')
      data.VISIT_PERSON_FILE_SIZE = data.VISIT_PERSON_ATTA_LIST.map(i => {
        return i.fileSize
      }).join(',')
      data.VISIT_PERSON_FILE_TYPE = data.VISIT_PERSON_ATTA_LIST.map(i => {
        return i.fileType
      }).join(',')
      data.VISIT_PERSON_SERIAL_NO = data.VISIT_PERSON_ATTA_LIST.map(i => {
        return i.serialNo
      }).join(',')

      this.loadStatus = 'process'
      this.$axios.postJson(
        postUrl,
        data,
        res => {
          if (res.statue === '0') {
            this.loadStatus = 'success'
            setTimeout(() => {
              this.$router.push({ path: 'visitDetail', query: { APPLY_NO: res.commonMap.applyNo || this.APPLY_NO, reload: true }})
            }, 1000)
            return
          }
          this.Toast(res.msg)
          this.loadStatus = 'none'
        },
        err => {
          this.Toast(err.msg || '请求错误')
          this.loadStatus = 'none'
        })
    }
  }
}
</script>
<style lang="scss">
</style>
