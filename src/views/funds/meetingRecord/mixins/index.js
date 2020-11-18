export default {
  data() {
    return {
      detail: {
        MEETING_ID: '',
        MEETING_TITLE: '',
        MEETING_DATE: '',
        MEETING_ROOM: '',
        MEETING_ROOM_NAME: '',
        MEETING_BEGIN_TIME: '',
        MEETING_END_TIME: '',

        PROJECT_OBJECT_NAME: '', // 被投企业名称
        OBJECT_ID: '',

        REF_OA_MEETING: '', // 关联OA会议

        MEETING_FOCUS_MODE: '0', // 日程权限
        meetingUserList: [],
        MEETING_PERSON: '',
        MEETING_CONTENT: '',

        ATTACHMENT_LIST: [], // 附件

        IS_FIRST: '0',
        MEETING_TYPE: '',
        MEETING_METHOD: ''

      },
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'popupRadio', // 'select',
                modelKey: 'OBJECT_ID',
                label: '被投企业',
                isLink: false,
                props: {
                  title: '被投企业',
                  placeholder: '请选择',
                  readonly: true,
                  options: []
                },
                rules: {}
              },
              {
                type: 'popupRadio',
                modelKey: 'REF_OA_MEETING',
                label: 'OA会议',
                isLink: true,
                props: {
                  title: 'OA会议',
                  placeholder: '请选择',
                  options: []
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'MEETING_TITLE',
                label: '会议主题',
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
                modelKey: 'MEETING_DATE',
                label: '会议日期',
                props: {
                  isLink: true,
                  type: 'date',
                  placeholder: '请选择',
                  formatter: (type, value) => {
                    if (type === 'year') {
                      return `${value}`
                    } else if (type === 'month') {
                      return `${value}`
                    }
                    return value
                  },
                  format: 'YYYY-MM-DD'
                },
                rules: {
                  required: true
                }
              },

              {
                type: 'date',
                modelKey: 'MEETING_BEGIN_TIME',
                label: '开始时间',
                props: {
                  isLink: true,
                  type: 'time',
                  placeholder: '请选择',
                  format: 'hh:mm',
                  filter: (type, options) => {
                    if (type === 'hour') {
                      return options.slice(8, 21)
                    }
                    if (type === 'minute') {
                      return options.filter(option => option % 5 === 0)
                    }
                    return options
                  }
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'date',
                modelKey: 'MEETING_END_TIME',
                label: '结束时间',
                props: {
                  isLink: true,
                  type: 'time',
                  placeholder: '请选择',
                  format: 'hh:mm',
                  filter: (type, options) => {
                    if (type === 'hour') {
                      return options.slice(8, 21)
                    }
                    if (type === 'minute') {
                      return options.filter(option => option % 5 === 0)
                    }
                    return options
                  }
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
                type: 'tree',
                modelKey: 'meetingUserList',
                label: '',
                props: {
                  label: '我方人员',
                  numberTitle: '4/1000',
                  title: '添加人员'
                },
                rules: {},
                options: []
              },
              {
                type: 'textarea',
                modelKey: 'MEETING_PERSON',
                label: '',
                isLink: false,
                props: {
                  title: '外部人员'
                },
                rules: {}
              },
              {
                type: 'select',
                modelKey: 'MEETING_FOCUS_MODE',
                label: '日程权限',
                props: {
                  options: [
                    {
                      value: '0',
                      label: '全员可见'
                    }, {
                      value: '1',
                      label: '参与人的本公司可见'
                    }, {
                      value: '2',
                      label: '参与人可见'
                    }
                  ],
                  isLink: true
                },
                rules: {}
              },
              {
                type: 'textarea',
                modelKey: 'MEETING_CONTENT',
                label: '',
                isLink: false,
                props: {
                  title: '会议内容'
                },
                input: true,
                rules: {}
              }
            ]
          },
          {
            legend: '',
            fields: [
              {
                label: '',
                type: 'upload',
                modelKey: 'ATTACHMENT_LIST',
                element: 'other',
                props: {
                  placeholder: '附件',
                  multiple: true,
                  uploadUrl: '/fileAction/uploadEI.do'
                }

              }
            ]
          }
        ]
      },
      meeting_form: [
        {
          legend: '',
          fields: [
            {
              type: 'select',
              modelKey: 'MEETING_ROOM',
              label: '会议地点',
              isLink: true,
              props: {
                placeholder: '请选择'
              },
              rules: {
                required: true
              }
            },
            {
              type: 'input',
              modelKey: 'MEETING_ROOM_NAME',
              label: '会议地点',
              isLink: false,
              props: {
                placeholder: '请输入'
              },
              rules: {
                required: true
              }
            }
          ]
        }
      ],
      company_form: [
        {
          legend: '',
          fields: [
            {
              type: 'switch',
              modelKey: 'IS_FIRST',
              label: '是否初次拜访',
              props: {},
              rules: {}
            },
            {
              type: 'select',
              modelKey: 'MEETING_TYPE',
              label: '会议类型',
              isLink: true,
              props: {
                placeholder: '请选择'
              },
              rules: {
                required: true
              }
            },
            {
              type: 'select',
              modelKey: 'MEETING_METHOD',
              label: '会议方式',
              isLink: true,
              props: {
                placeholder: '请选择'
              },
              rules: {
                required: true
              }
            }
          ]
        }
      ],
      meetingList: [],
      roomList: []
    }
  },
  created() {
    this.addMeetingBefShow()
    if (this.$route.query.MEETING_ID) {
      this.getDetail()
    } else {
      const data = this.storage.get('meetingRecordDraft')
      if (data !== undefined && data !== null && data !== '') {
        this.detail = data
      }
      this.schema.groups[0].fields.push(this.meeting_form[0].fields[1])
    }
  },
  watch: {
    'detail.REF_OA_MEETING'(v) {
      this.delMeeting()
      if (v) {
        this.schema.groups[0].fields.push(this.meeting_form[0].fields[0])

        // 选择OA会议填表单
        const activeRoom = this.meetingList.filter(i => {
          return i.ID === v
        })
        if (activeRoom.length > 0) {
          const data = activeRoom[0]
          this.detail.MEETING_DATE = data.MEETING_DATE
          this.detail.MEETING_BEGIN_TIME = data.START_TIME
          this.detail.MEETING_END_TIME = data.END_TIME
          this.detail.MEETING_TITLE = data.NAME
          this.detail.MEETING_ROOM = data.MEETING_ROOM_ID

          if (data.EXECUTOR) {
            const value = data.EXECUTOR.split(',')
            const label = data.EXECUTOR_NAME.split(',')
            const src = data.FILE_PATH.split(',')
            const list = []
            for (let i = 0; i < value.length; i++) {
              list[i] = { value: value[i], label: label[i], src: src[i] }
            }
            this.$set(this.detail, 'meetingUserList', list)
          }
        }
      } else {
        this.schema.groups[0].fields.push(this.meeting_form[0].fields[1])
      }
    },
    'detail.OBJECT_ID'(v) {
      this.delCompany(v)
      if (v) {
        this.schema.groups[0].fields = this.schema.groups[0].fields.concat(this.company_form[0].fields)
      }
    },
    'detail.MEETING_ROOM'(v) {
      if (v) {
        const ls = this.roomList.filter(i => {
          return i.value === v.toString()
        })
        if (ls.length > 0) {
          this.detail.MEETING_ROOM_NAME = ls[0].label
        }
      }
    }
  },
  methods: {
    delMeeting() {
      this.schema.groups[0].fields.forEach((item, index) => {
        if (item.modelKey === 'MEETING_ROOM' || item.modelKey === 'MEETING_ROOM_NAME') {
          this.schema.groups[0].fields.splice(index, 1)
        }
      })
    },
    delCompany(v) {
      this.schema.groups[0].fields.forEach((item, index) => {
        if (item.modelKey === 'IS_FIRST' || item.modelKey === 'MEETING_TYPE' || item.modelKey === 'MEETING_METHOD') {
          this.schema.groups[0].fields.splice(index, 1)
        }
      })
    },
    addMeetingBefShow() {
      const data = this.storage.get('mettingRecordBefShow')
      if (data) {
        this.setMeetingBefShow(data)
      } else {
        this.$axios.postJson('/meetingRecordAction/addBeforeShow.do',
          {},
          res => {
            this.storage.set('mettingRecordBefShow', res.dataContent)
            this.setMeetingBefShow(res.dataContent)
          })
      }
    },
    setMeetingBefShow(data) {
      // 被投企业
      const projList = data.projList.map(item => {
        return {
          value: item.ENTERPRISE_ID + '',
          label: item.CH_NAME
        }
      })
      this.projList = projList
      this.setDataInit(this.schema.groups, 'OBJECT_ID', 'options', projList, 'props')

      // OA会议
      const meetingList = data.meetingList.map(item => {
        return {
          value: item.ID + '',
          label: item.NAME
        }
      })
      this.setDataInit(this.schema.groups, 'REF_OA_MEETING', 'options', meetingList, 'props')
      this.meetingList = data.meetingList

      // 会议地点
      const roomList = data.meetingRoomList.map(item => {
        return {
          value: item.ID + '',
          label: item.NAME
        }
      })
      this.setDataInit(this.meeting_form, 'MEETING_ROOM', 'options', roomList, 'props')
      this.roomList = roomList

      // 会议类型
      const metting_type = data.meetingTypeList.map(item => {
        return {
          value: item.CODE_VALUE + '',
          label: item.CODE_NAME
        }
      })
      this.setDataInit(this.company_form, 'MEETING_TYPE', 'options', metting_type, 'props')

      // 会议方式
      const metting_methods = data.meetingMethodList.map(item => {
        return {
          value: item.CODE_VALUE + '',
          label: item.CODE_NAME
        }
      })
      this.setDataInit(this.company_form, 'MEETING_METHOD', 'options', metting_methods, 'props')
    },
    getDetail() {
      const URL = '/meetingRecordAction/detail.do'
      this.$axios.postJson(URL, {
        MEETING_ID: this.$route.query.MEETING_ID
      },
      res => {
        if (res.statue === '0') {
          const data = res.dataContent
          this.$set(this.detail, 'MEETING_ID', this.$route.query.MEETING_ID)
          this.$set(this.detail, 'ATTACHMENT', data.ATTACHMENT)
          this.$set(this.detail, 'PROJECT_OBJECT_NAME', data.PROJECT_OBJECT_NAME)
          this.$set(this.detail, 'OBJECT_ID', data.OBJECT_ID)
          this.$set(this.detail, 'REF_OA_MEETING', data.REF_OA_MEETING)
          this.$set(this.detail, 'MEETING_FOCUS_MODE', data.MEETING_FOCUS_MODE)
          this.$set(this.detail, 'MEETING_PERSON', data.MEETING_PERSON)
          this.$set(this.detail, 'MEETING_CONTENT', data.MEETING_CONTENT)
          const ATTACHMENT_LIST = data.ATTACHMENT_LIST.map(i => {
            return {
              fileName: i.FILE_NAME,
              fileOldName: i.FILE_OLD_NAME,
              filePath: i.FILE_PATH,
              fileSize: i.FILE_SIZE,
              fileType: i.FILE_TYPE,
              serialNo: i.SERIAL_NO,
              id: i.FILE_ID
            }
          })

          setTimeout(() => { // 防止编辑时页面初始化企业变更值被覆盖
            this.$set(this.detail, 'ATTACHMENT_LIST', ATTACHMENT_LIST)
            this.$set(this.detail, 'MEETING_DATE', data.MEETING_DATE)
            this.$set(this.detail, 'MEETING_BEGIN_TIME', data.MEETING_BEGIN_TIME)
            this.$set(this.detail, 'MEETING_END_TIME', data.MEETING_END_TIME)
            this.$set(this.detail, 'MEETING_TITLE', data.MEETING_TITLE)
            this.$set(this.detail, 'MEETING_ROOM', data.MEETING_ROOM)
            this.$set(this.detail, 'MEETING_ROOM_NAME', data.MEETING_ROOM_NAME)
            const selectPersonList = data.selectPersonList.map(item => {
              return {
                value: item.executor + '',
                label: item.executorName,
                src: item.filePath
              }
            })
            this.$set(this.detail, 'meetingUserList', selectPersonList)
            this.setDataInit(this.schema.groups, 'meetingUserList', 'options', selectPersonList)
          }, 1000)

          // 以下页面不需要 编辑需要提交
          this.$set(this.detail, 'GROUP_ID', data.GROUP_ID)
          this.$set(this.detail, 'IS_FIRST', data.IS_FIRST ? data.IS_FIRST : '0')
          this.$set(this.detail, 'EXECUTOR_ID', data.EXECUTOR_ID)
          this.$set(this.detail, 'EXECUTOR_NAME', data.EXECUTOR_NAME)
          this.$set(this.detail, 'MEETING_METHOD', data.MEETING_METHOD)
          this.$set(this.detail, 'MEETING_METHOD_NAME', data.MEETING_METHOD_NAME)
          this.$set(this.detail, 'MEETING_TYPE', data.MEETING_TYPE)
          this.$set(this.detail, 'MEETING_TYPE_NAME', data.MEETING_TYPE_NAME)
          this.$set(this.detail, 'OBJECT_ID', data.OBJECT_ID)
          this.$set(this.detail, 'projList', data.projList)
        }
      })
    },
    setDataInit(data, modelKey, modelValue, value, type) {
      data.map((groups, index) => {
        if (groups.fields.length) {
          groups.fields.map((fields, sindex) => {
            if (fields.modelKey === modelKey) {
              if (type) {
                this.$set(data[index].fields[sindex].props, modelValue, value)
              } else {
                this.$set(data[index].fields[sindex], modelValue, value)
              }
            }
          })
        }
      })
    }
  }
}
