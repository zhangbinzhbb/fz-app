export default {
  data() {
    return {
      detail: {
        VISIT_TIME: '',
        ARRIVE_TIME: '',
        VISIT_PERSON_LIST: '',
        VISIT_COMPANY: '',
        VISIT_SOURCE: '0',
        VISIT_NUMBER: '1',

        VISIT_CONNECT_NAME: '',
        VISIT_CONNECT_MOBILE: '',
        VISIT_CAR: '',

        MEETING_FOCUS_MODE: '0',
        SERVICE_LIST: [],

        manageUsers: [],
        REMARK: '',

        VISIT_ATTA_LIST: [],
        VISIT_PERSON_ATTA_LIST: [],

        // 展厅相关信息
        EXHIBITION_START_TIME: '',
        EXHIBITION_END_TIME: '',
        EXHIBITION_ID: '',
        exhibitionPersons: [],
        VISIT_EXHIBITION_NUM: '1',
        VISITOR_IMPORTANT: '0',
        VISITOR_REMARK: '',
        VISITOR_ACCOMPANY_REMARK: '',
        VISIT_ARRANGE: '',
        VISIT_CONTENT: '',
        IS_EXPLAIN: '0',
        TIME_LENGTH: '',
        IS_WELCOMEWORD: '0',
        WELCOMEWORD: '',
        IS_PHOTOGRAPH: '0',
        IS_NEWS: '0',
        LED: '',

        // 会议室相关
        MEETING_START_TIME: '',
        MEETING_END_TIME: '',
        MEETING_ROOM_ID: '',
        meettingPersons: [],
        MEETING_SERVICE_LIST: [],
        // 会议室选择ppt/其他说明
        MEETING_PPT: '',
        MEETING_OTHER: ''

      },
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'date',
                modelKey: 'VISIT_TIME',
                label: '来访日期',
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
                modelKey: 'ARRIVE_TIME',
                label: '到达时间',
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
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'VISIT_PERSON_LIST',
                label: '来访人员',
                isLink: false,
                props: {
                  placeholder: '请输入'

                },
                rules: {
                  required: true
                }
              },
              {
                label: '',
                type: 'upload',
                modelKey: 'VISIT_PERSON_ATTA_LIST',
                element: 'other',
                props: {
                  placeholder: '来访人员附件',
                  multiple: true,
                  uploadUrl: '/fileAction/uploadOA.do'
                }

              },
              {
                type: 'input',
                modelKey: 'VISIT_COMPANY',
                label: '来访单位',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'select',
                modelKey: 'VISIT_SOURCE',
                label: '来源渠道',
                props: {
                  isLink: true,
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'checker',
                modelKey: 'VISIT_NUMBER',
                label: '来访人数',
                props: {
                  options: [
                    {
                      value: '1',
                      text: '1'
                    },
                    {
                      value: '2',
                      text: '2'
                    },
                    {
                      value: '3',
                      text: '3'
                    },
                    {
                      value: '4',
                      text: '4'
                    },
                    {
                      value: '5',
                      text: '5'
                    },
                    {
                      value: '6',
                      text: '6'
                    },
                    {
                      value: '7',
                      text: '7'
                    },
                    {
                      value: '8',
                      text: '8'
                    },
                    {
                      value: '9',
                      text: '9'
                    },
                    {
                      value: '10',
                      text: '10'
                    },
                    {
                      value: '10+',
                      text: '10+'
                    },
                    {
                      value: '15+',
                      text: '15+'
                    }
                  ],
                  type: 'radio',
                  round: true
                },
                rules: {},
                slot: 'VISIT_NUMBER'
              }
            ]
          },
          {
            legend: '',
            fields: [
              {
                type: 'input',
                modelKey: 'VISIT_CONNECT_NAME',
                label: '联络人',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'VISIT_CONNECT_MOBILE',
                label: '联络手机',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'VISIT_CAR',
                label: '车牌号',
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
                type: 'checker',
                modelKey: 'SERVICE_LIST',
                label: '服务类型',
                props: {
                  options: [],
                  type: 'checkbox',
                  max: null
                },
                slot: 'SERVICE_LIST_NAME'
              }
            ]
          },
          {
            legend: '',
            fields: [
              {
                type: 'tree',
                modelKey: 'manageUsers',
                label: '',
                props: {
                  label: '维护人',
                  numberTitle: '4/1000',
                  title: '添加人员'
                },
                rules: {},
                options: []
              },
              {
                type: 'textarea',
                modelKey: 'REMARK',
                label: '',
                isLink: false,
                props: {
                  title: '备注',
                  placeholder: '请输入备注'
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
                modelKey: 'VISIT_ATTA_LIST',
                element: 'other',
                props: {
                  placeholder: '附件',
                  multiple: true,
                  uploadUrl: '/fileAction/uploadOA.do'
                }

              }
            ]
          }
        ]
      },
      exhibition_form: [{
        legend: '展厅相关信息',
        fields: [
          {
            type: 'date',
            modelKey: 'EXHIBITION_START_TIME',
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
            modelKey: 'EXHIBITION_END_TIME',
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
          },
          {
            type: 'select',
            modelKey: 'EXHIBITION_ID',
            label: '选择展厅',
            props: {
              isLink: true,
              placeholder: '请选择',
              options: []
            },
            rules: {
              required: true
            }
          },
          {
            type: 'tree',
            modelKey: 'exhibitionPersons',
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
            type: 'checker',
            modelKey: 'VISIT_EXHIBITION_NUM',
            label: '参观人数',
            props: {
              options: [
                {
                  value: '1',
                  text: '1'
                },
                {
                  value: '2',
                  text: '2'
                },
                {
                  value: '3',
                  text: '3'
                },
                {
                  value: '4',
                  text: '4'
                },
                {
                  value: '5',
                  text: '5'
                },
                {
                  value: '6',
                  text: '6'
                },
                {
                  value: '7',
                  text: '7'
                },
                {
                  value: '8',
                  text: '8'
                },
                {
                  value: '9',
                  text: '9'
                },
                {
                  value: '10',
                  text: '10'
                },
                {
                  value: '10+',
                  text: '10+'
                },
                {
                  value: '15+',
                  text: '15+'
                }
              ],
              type: 'radio',
              round: true
            },
            rules: {
              required: true
            },
            slot: 'VISIT_EXHIBITION_NUM'
          },
          {
            type: 'checker',
            modelKey: 'VISITOR_IMPORTANT',
            label: '来宾重要性',
            props: {
              options: [
                { text: '普通来宾', value: '0' },
                { text: '重要来宾', value: '1' }
              ],
              type: 'radio',
              max: 1
            },
            slot: 'VISITOR_IMPORTANT',
            rules: {}
          },
          {
            type: 'textarea',
            modelKey: 'VISITOR_REMARK',
            label: '',
            isLink: false,
            props: {
              title: '人员说明',
              placeholder: '来访宾客参观的最高级别人员姓名和职务',
              required: true
            },
            rules: {
              required: true
            }
          },
          {
            type: 'textarea',
            modelKey: 'VISITOR_ACCOMPANY_REMARK',
            label: '',
            isLink: false,
            props: {
              title: '陪同人员',
              placeholder: '陪同宾客参观的最高级别人员姓名和职务',
              required: true
            },
            rules: {
              required: true
            }
          },
          {
            type: 'textarea',
            modelKey: 'VISIT_ARRANGE',
            label: '',
            isLink: false,
            props: {
              title: '行程安排',
              placeholder: '请输入行程安排'
            },
            rules: {}
          },
          {
            type: 'textarea',
            modelKey: 'VISIT_CONTENT',
            label: '',
            isLink: false,
            props: {
              title: '参观内容',
              placeholder: '请输入参观内容'
            },
            rules: {}
          },
          {
            type: 'switch',
            modelKey: 'IS_EXPLAIN',
            label: '是否讲解',
            props: {},
            rules: {}
          },
          {
            type: 'input',
            modelKey: 'TIME_LENGTH',
            label: '时长要求',
            isLink: false,
            props: {
              placeholder: '请输入'
            },
            rules: {}
          },
          {
            type: 'switch',
            modelKey: 'IS_WELCOMEWORD',
            label: '欢迎词',
            props: {},
            rules: {}
          },
          {
            type: 'textarea',
            modelKey: 'WELCOMEWORD',
            label: '',
            isLink: false,
            props: {
              title: '致辞内容',
              placeholder: '请输入致辞内容'
            },
            rules: {}
          },
          {
            type: 'switch',
            modelKey: 'IS_PHOTOGRAPH',
            label: '是否摄影',
            props: {},
            rules: {}
          },
          {
            type: 'switch',
            modelKey: 'IS_NEWS',
            label: '是否发稿',
            props: {},
            rules: {}
          },
          {
            type: 'textarea',
            modelKey: 'LED',
            label: '',
            isLink: false,
            props: {
              title: '其他要求',
              placeholder: '请输入其他要求'
            },
            rules: {}
          }
        ]
      }],
      meetingRoom_form: [{
        legend: '会议室相关信息',
        fields: [
          {
            type: 'date',
            modelKey: 'MEETING_START_TIME',
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
          },
          {
            type: 'select',
            modelKey: 'MEETING_ROOM_ID',
            label: '会议室',
            props: {
              isLink: true,
              placeholder: '请选择',
              options: []
            },
            rules: {
              required: true
            }
          },
          {
            type: 'tree',
            modelKey: 'meettingPersons',
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
            type: 'checker',
            modelKey: 'MEETING_SERVICE_LIST',
            label: '服务类型',
            props: {
              options: [],
              type: 'checkbox',
              max: null
            },
            slot: 'MEETING_SERVICE_LIST_NAME'
          },
          {
            type: 'input',
            modelKey: 'MEETING_PPT',
            label: 'ppt版本',
            isLink: false,
            props: {
              placeholder: '请输入'
            },
            rules: {},
            hidden: true
          },
          {
            type: 'input',
            modelKey: 'MEETING_OTHER',
            label: '其他说明',
            isLink: false,
            props: {
              placeholder: '请输入'
            },
            rules: {},
            hidden: true
          }
        ]
      }],
      required: {
        meetingRoom: false, // 服务类型是否选中展厅
        exhibition: false // 服务类型是否选中会议室
      },
      meetingRoomList: [], // 会议室列表
      exhibitionRoomeList: [] // 展厅列表
    }
  },
  watch: {
    'detail.SERVICE_LIST'(val) {
      this.required.meetingRoom = val && val.indexOf('0') > -1
      this.required.exhibition = val && val.indexOf('1') > -1
    },
    'required.meetingRoom'(v) {
      this.formToggle('meetingRoom')
    },
    'required.exhibition'(v) {
      this.formToggle('exhibition')
    },
    'detail.MEETING_SERVICE_LIST'(v) {
      if (!v) {
        return
      }
      const PPTRequired = v.indexOf('0') > -1
      const otherRequired = v.indexOf('7') > -1
      this.schema.groups.forEach(item => {
        item.fields.forEach(i => {
          if (i.modelKey === 'MEETING_PPT') {
            i.hidden = !PPTRequired
          }
          if (i.modelKey === 'MEETING_OTHER') {
            i.hidden = !otherRequired
          }
        })
      })
    },
    'detail.MEETING_ROOM_ID'(v) {
      // 会议室id找name
      const ac = this.meetingRoomList.filter(i => {
        return i.value === v
      })
      if (ac.length > 0) {
        this.detail.MEETING_ROOM_NAME = ac[0].label
      }
    },
    'detail.EXHIBITION_ID'(v) {
      // 展厅id找name
      const ac = this.exhibitionRoomeList.filter(i => {
        return i.value === v
      })
      if (ac.length > 0) {
        this.detail.EXHIBITION_NAME = ac[0].label
      }
    }
  },
  created() {
    this.addMeetingBefShow()
    if (this.$route.query.APPLY_NO) {
      this.getDetail()
    } else {
      // 维护人默认登录人
      const user = this.storage.get('yh-user')
      const selectPersonList = [{
        value: user.userId,
        label: user.name,
        src: user.facePath
      }]
      this.$set(this.detail, 'manageUsers', selectPersonList)
      this.setDataInit(this.schema.groups, 'manageUsers', 'options', selectPersonList)
    }
  },
  methods: {
    formToggle(formName) {
      const form = this[formName + '_form'][0]
      let index_rm
      this.schema.groups.map((item, idx) => {
        if (item.legend === form.legend) {
          index_rm = idx
        }
      })
      if (index_rm && !this.required[formName]) {
        this.schema.groups.splice(index_rm, 1)
      }
      if (!index_rm && this.required[formName]) {
        this.schema.groups.splice(this.schema.groups.length - 2, 0, this[formName + '_form'][0])
      }
    },
    getDetail() {
      const URL = '/ReceptionSheetAction/detail.do'
      this.$axios.post(URL, {
        applyNo: this.$route.query.APPLY_NO
      },
      res => {
        if (res.statue === '0') {
          const data = res.dataContent[0]
          this.detail = data
          // 服务类型
          this.detail.SERVICE_LIST = data.SERVICE_LIST ? data.SERVICE_LIST.split(',') : []

          // 维护人
          const selectPersonList = data.manageUsers.map(i => {
            return {
              value: i.MANAGER_ID,
              label: i.MANAGER_NAME,
              src: i.FILE_PATH
            }
          })
          this.$set(this.detail, 'manageUsers', selectPersonList)
          this.setDataInit(this.schema.groups, 'manageUsers', 'options', selectPersonList)

          // 附件
          const VISIT_ATTA_LIST = data.VISIT_ATTA_LIST.map(i => {
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
          this.$set(this.detail, 'VISIT_ATTA_LIST', VISIT_ATTA_LIST)

          // 来访人员附件
          const VISIT_PERSON_ATTA_LIST = data.VISIT_PERSON_ATTA_LIST.map(i => {
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
          this.$set(this.detail, 'VISIT_PERSON_ATTA_LIST', VISIT_PERSON_ATTA_LIST)

          // 展厅选择人
          const exhibitionPersons = data.exhibitionPersons.map(i => {
            return {
              value: i.PARTICIPANT,
              label: i.PARTICIPANT_NAME,
              src: i.FILE_PATH
            }
          })
          this.$set(this.detail, 'exhibitionPersons', exhibitionPersons)
          this.setDataInit(this.exhibition_form, 'exhibitionPersons', 'options', exhibitionPersons)

          // 会议室选人
          const meettingPersons = data.meettingPersons.map(i => {
            return {
              value: i.PARTICIPANT + '',
              label: i.PARTICIPANT_NAME,
              src: i.FILE_PATH
            }
          })
          this.$set(this.detail, 'meettingPersons', meettingPersons)
          this.setDataInit(this.meetingRoom_form, 'meettingPersons', 'options', meettingPersons)

          // 会议室服务类型
          this.detail.MEETING_SERVICE_LIST = data.MEETING_SERVICE_LIST ? data.MEETING_SERVICE_LIST.split(',') : []

          // 服务类型翻译
          const SERVICE_LIST_NAME = []
          if (data.SERVICE_LIST) {
            data.SERVICE_LIST.forEach(i => {
              data.SERVICE_LIST_ARR.forEach(j => {
                if (i === j.CODE_VALUE) {
                  SERVICE_LIST_NAME.push(j.CODE_NAME)
                }
              })
            })
            this.$set(this.detail, 'SERVICE_LIST_NAME', SERVICE_LIST_NAME.join(','))
          }

          // 会议相关 - 服务类型翻译
          //
          const MEETING_SERVICE_LIST = []

          if (data.MEETING_SERVICE_LIST) {
            data.MEETING_SERVICE_LIST.forEach(i => {
              data.MEETTING_SERVICE_LIST_ARR.forEach(j => {
                if (i === j.CODE_VALUE) {
                  MEETING_SERVICE_LIST.push(j.CODE_NAME)
                }
              })
            })
            this.$set(this.detail, 'MEETING_SERVICE_LIST_NAME', MEETING_SERVICE_LIST.join(','))
          }
        }
      })
    },
    addMeetingBefShow() {
      this.$axios.post('/applyVisitAction/addBeforeShow.do', null, res => {
        const data = res.dataContent
        // 来源渠道
        const sourceList = data.sourceList.map(i => {
          return {
            value: i.CODE_VALUE,
            label: i.CODE_NAME
          }
        })
        this.setDataInit(this.schema.groups, 'VISIT_SOURCE', 'options', sourceList, 'props')

        // 服务类型
        const serviceList = data.visitServiceList.map(i => {
          return {
            value: i.CODE_VALUE,
            text: i.CODE_NAME
          }
        })
        this.setDataInit(this.schema.groups, 'SERVICE_LIST', 'options', serviceList, 'props')
        this.setDataInit(this.schema.groups, 'SERVICE_LIST', 'max', serviceList.length + 1, 'props')

        // 展厅相关信息-选择展厅
        this.exhibition_form[0].fields.map((i, index) => {
          if (i.modelKey === 'EXHIBITION_ID') {
            this.exhibition_form[0].fields[index].props.options = data.exhibition.map(i => {
              return {
                value: i.ID + '',
                label: i.NAME
              }
            })
          }
        })
        this.exhibitionRoomeList = data.exhibition.map(i => {
          return {
            value: i.ID + '',
            label: i.NAME
          }
        })

        // 会议室-选择会议室
        const meetingRoomList = data.meetingRoomList.map(i => {
          return {
            value: i.ID + '',
            label: i.NAME
          }
        })
        this.setDataInit(this.meetingRoom_form, 'MEETING_ROOM_ID', 'options', meetingRoomList, 'props')
        this.meetingRoomList = meetingRoomList

        // 会议室-提供服务 MEETING_SERVICE_LIST
        const meetingServiceList = data.meetingServiceList.map(i => {
          return {
            value: i.CODE_VALUE + '',
            text: i.CODE_NAME
          }
        })
        this.setDataInit(this.meetingRoom_form, 'MEETING_SERVICE_LIST', 'options', meetingServiceList, 'props')
        this.setDataInit(this.meetingRoom_form, 'MEETING_SERVICE_LIST', 'max', meetingServiceList.length + 1, 'props')
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
