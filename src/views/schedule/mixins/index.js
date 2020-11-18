export default {
  data() {
    return {
      detail: {
        SCHEDULE_TITLE: '',
        START_TIME: '',
        END_TIME: '',
        LOCATION: '',
        MEETING_FOCUS_MODE: '0',
        ISANGET: '',
        AGENT_USER_NAME: '',
        AGENT_USER_ID: '',
        scheduleuserList: [],
        REMIND_FLAG: '',
        REMIND_TIME: '',
        PHONE_NUMS: '',
        SCHEDULE_CONTENT: '',
        agentUserId: '',
        agentUserName: '',
        IMPORTANCE_LEVEL: '',
        IMPORTANCE_LEVEL_s: '0',
        REMIND_SMS_ID: ''
      },
      options: {
        scrollToInvalidField: true,
        layout: 'standard' // classic fresh
      },
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'input',
                modelKey: 'SCHEDULE_TITLE',
                label: '日程标题',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'date',
                modelKey: 'START_TIME',
                label: '开始时间',
                props: {
                  isLink: true,
                  type: 'datetime',
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'date',
                modelKey: 'END_TIME',
                label: '结束时间',
                props: {
                  isLink: true,
                  type: 'datetime',
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'input',
                modelKey: 'LOCATION',
                label: '日程地点',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {}
              }
            ]
          },
          {
            legend: '',
            fields: [
              {
                type: 'select',
                modelKey: 'MEETING_FOCUS_MODE',
                label: '关注类型',
                props: {
                  options: [
                    {
                      value: '0',
                      label: '全员可见'
                    },
                    {
                      value: '1',
                      label: '本公司可见'
                    },
                    {
                      value: '2',
                      label: '仅自己可见'
                    }
                  ],
                  isLink: true
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'switch',
                modelKey: 'ISANGET',
                label: '是否代理',
                props: {},
                rules: {},
                events: {
                  'input': (...args) => {
                    const isShow = args[0] === '0'
                    this.setDataInit(this.schema.groups, 'AGENT_USER_ID', 'hidden', isShow)
                  }
                }
              },
              {
                type: 'select',
                modelKey: 'AGENT_USER_ID',
                label: '选择代理',
                props: {
                  options: [],
                  isLink: true
                },
                rules: {},
                hidden: true
              },
              {
                type: 'tree',
                modelKey: 'scheduleuserList',
                label: '',
                props: {
                  label: '同步他人',
                  numberTitle: '',
                  title: '添加人员'
                },
                rules: {},
                options: []
              },
              {
                type: 'checker',
                modelKey: 'IMPORTANCE_LEVEL_s',
                label: '重要性',
                props: {
                  options: [
                    {
                      value: '0',
                      text: '低'
                    },
                    {
                      value: '1',
                      text: '中'
                    },
                    {
                      value: '2',
                      text: '高'
                    }
                  ],
                  type: 'radio'
                },
                rules: {
                  required: true
                }
              }
            ]
          },
          {
            legend: '',
            fields: [
              {
                type: 'input',
                modelKey: 'PHONE_NUMS',
                label: '接收号码',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {}
              },
              {
                type: 'switch',
                modelKey: 'REMIND_FLAG',
                label: '手机提醒',
                props: {},
                rules: {}
              },
              {
                type: 'date',
                modelKey: 'REMIND_TIME',
                label: '提醒时间',
                props: {
                  isLink: true,
                  type: 'datetime',
                  placeholder: '请选择'
                },
                rules: {}
              },
              {
                type: 'textarea',
                modelKey: 'SCHEDULE_CONTENT',
                label: '',
                props: {
                  title: '日程内容',
                  placeholder: '请输入'
                },
                input: true,
                rules: {}
              }
            ]
          }
        ]
      },
      AGENT_USER_NAME_LIST: []
    }
  },
  created() {
    this.beforeInit()
    this.getDetail()
  },
  watch: {},
  methods: {
    beforeInit() {
      const URL = '/agendaAction/addAgendInfoBefShow.do'
      this.$axios.post(URL, {}, res => {
        const data = res.dataContent
        // 选择代理
        const agentUserList = data.agentUserList.map(item => {
          return {
            value: item.AGENT_ID + '',
            label: item.AGENT_NAME
          }
        })
        this.setDataInit(this.schema.groups, 'AGENT_USER_ID', 'options', agentUserList, 'props')
        this.AGENT_USER_NAME_LIST = agentUserList

        const startTime = data.startTime
        const endTime = data.endTime
        const mobilephone = data.mobilephone
        // 判断新增日程调取
        const id = this.$route.query.id
        if (!id) {
          this.detail.START_TIME = startTime
          this.detail.END_TIME = endTime
        }
        this.detail.PHONE_NUMS = mobilephone
        this.detail.REMIND_TIME = startTime
        this.initData = JSON.parse(JSON.stringify(this.detail))
      })
    },
    getDetail() {
      const URL = '/agendaAction/agendaDetail.do'
      const id = this.$route.query.id
      if (id) {
        this.$axios.post(URL, {
          AGENDA_ID: this.$route.query.id
        }, res => {
          // 默认初始化值
          const result = this.formatDateTime(new Date(), 'yyyy-MM-dd')
          const data = res.dataContent
          const SCHEDULE_TITLE = data.SCHEDULE_TITLE
          const START_TIME = data.START_TIME || result + ' ' + '09:15'
          const END_TIME = data.END_TIME || result + ' ' + '17:30'
          const LOCATION = data.LOCATION
          const ISANGET = data.ISANGET
          const MEETING_FOCUS_MODE = data.MEETING_FOCUS_MODE
          const scheduleuserList = data.scheduleuserList.map(item => {
            return {
              value: item.ID,
              label: item.NAME,
              src: item.FACE_PATH
            }
          })
          let isShow = true
          if (ISANGET === '1') {
            const USER_NAME = data.USER_NAME
            const USER_ID = data.USER_ID
            this.$set(this.detail, 'AGENT_USER_NAME', USER_NAME)
            this.$set(this.detail, 'AGENT_USER_ID', USER_ID)
            isShow = false
          }

          this.setDataInit(this.schema.groups, 'AGENT_USER_ID', 'hidden', isShow)
          const REMIND_FLAG = data.REMIND_FLAG === '手机提醒' ? '1' : '0'
          const REMIND_TIME = data.REMIND_TIME
          const PHONE_NUMS = data.PHONE_NUMS
          const SCHEDULE_CONTENT = data.SCHEDULE_CONTENT
          const IMPORTANCE_LEVEL = data.IMPORTANCE_LEVEL

          const IMPORTANCE_LEVEL_OPTIONS = [{
            value: '0',
            text: '低'
          }, {
            value: '1',
            text: '中'
          }, {
            value: '2',
            text: '高'
          }]
          let IMPORTANCE_LEVEL_s
          IMPORTANCE_LEVEL_OPTIONS.map(item => {
            if (item.text === IMPORTANCE_LEVEL) {
              IMPORTANCE_LEVEL_s = item.value
            }
          })
          this.$set(this.detail, 'IMPORTANCE_LEVEL_s', IMPORTANCE_LEVEL_s)
          this.$set(this.detail, 'SCHEDULE_TITLE', SCHEDULE_TITLE)
          this.$set(this.detail, 'START_TIME', START_TIME)
          this.$set(this.detail, 'END_TIME', END_TIME)
          this.$set(this.detail, 'LOCATION', LOCATION)
          this.$set(this.detail, 'ISANGET', ISANGET)
          this.$set(this.detail, 'MEETING_FOCUS_MODE', MEETING_FOCUS_MODE)
          this.$set(this.detail, 'scheduleuserList', scheduleuserList)
          this.$set(this.detail, 'REMIND_FLAG', REMIND_FLAG)
          this.$set(this.detail, 'REMIND_TIME', REMIND_TIME)
          this.$set(this.detail, 'PHONE_NUMS', PHONE_NUMS)
          this.$set(this.detail, 'SCHEDULE_CONTENT', SCHEDULE_CONTENT)
          this.$set(this.detail, 'IMPORTANCE_LEVEL', IMPORTANCE_LEVEL)
          this.setDataInit(this.schema.groups, 'scheduleuserList', 'options', scheduleuserList)
        })
      }
    },
    setDataInit(data, modelKey, modelValue, value, type) {
      data.map((groups, index) => {
        if (groups.fields.length) {
          groups.fields.map((fields, sindex) => {
            if (fields.modelKey === modelKey) {
              if (type) {
                this.$set(this.schema.groups[index].fields[sindex].props, modelValue, value)
              } else {
                this.$set(this.schema.groups[index].fields[sindex], modelValue, value)
              }
            }
          })
        }
      })
    }
  }
}
