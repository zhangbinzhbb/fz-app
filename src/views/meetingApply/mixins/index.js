export default {
  data() {
    return {
      detail: {
        loginName: '',
        meetingName: '',
        meetingNumber: '',
        meetingStartTime: '',
        meetingEndTime: '',
        meetingRoom: '',
        meetingRoomId: '',
        remindModeList: [],
        serviceModelList: [],
        seatsStaff: '',
        meetingFocusMode: '',
        meetingUserList: [],
        remark: ''
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
                modelKey: 'loginName',
                label: '申请人',
                isLink: false,
                props: {
                  placeholder: '请输入',
                  readonly: true
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'meetingName',
                label: '会议名称',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'checker',
                modelKey: 'meetingNumber',
                label: '参会人数',
                props: {
                  options: [
                    {
                      value: 1,
                      text: '1'
                    },
                    {
                      value: 2,
                      text: '2'
                    },
                    {
                      value: 3,
                      text: '3'
                    },
                    {
                      value: 4,
                      text: '4'
                    },
                    {
                      value: 5,
                      text: '5'
                    },
                    {
                      value: 6,
                      text: '6'
                    },
                    {
                      value: 7,
                      text: '7'
                    },
                    {
                      value: 8,
                      text: '8'
                    },
                    {
                      value: 9,
                      text: '9'
                    },
                    {
                      value: 10,
                      text: '10'
                    }
                  ],
                  type: 'radio',
                  round: true
                },
                rules: {
                  required: true
                },
                slot: 'meetingNumber'
              },
              {
                type: 'date',
                modelKey: 'meetingStartTime',
                label: '开始时间',
                props: {
                  isLink: true,
                  type: 'datetime',
                  placeholder: '请选择',
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
                modelKey: 'meetingEndTime',
                label: '结束时间',
                props: {
                  isLink: true,
                  type: 'datetime',
                  placeholder: '请选择',
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
                modelKey: 'meetingRoomId',
                label: '会议室',
                props: {
                  options: [],
                  isLink: true
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
                type: 'checker',
                modelKey: 'remindModeList',
                label: '提醒方式',
                props: {
                  options: [],
                  type: 'checkbox',
                  max: null
                },
                rules: {}
              },
              {
                type: 'checker',
                modelKey: 'serviceModelList',
                label: '提供服务',
                props: {
                  options: [],
                  type: 'checkbox',
                  max: null
                },
                events: {
                  'input': (...args) => {
                    const str = args.join(',')
                    const isShow = str.includes('4')
                    this.setDataInit(this.schema.groups, 'seatsStaff', 'hidden', !isShow)
                    const rules = {
                      required: isShow
                    }
                    this.setDataInit(this.schema.groups, 'seatsStaff', 'rules', rules)
                  }
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'seatsStaff',
                label: '席位人员',
                isLink: false,
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: false
                },
                hidden: true
              },
              {
                type: 'select',
                modelKey: 'meetingFocusMode',
                label: '关注日程',
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
                  label: '与会人员',
                  numberTitle: '4/1000',
                  title: '添加人员'
                },
                rules: {},
                options: []
              },
              {
                type: 'textarea',
                modelKey: 'remark',
                label: '',
                props: {
                  title: '备注'
                },
                input: true,
                rules: {}
              }
            ]
          }
        ]
      },
      meetingList: []
    }
  },
  created() {
    this.addMeetingBefShow()
    this.getDetail()
  },
  watch: {},
  methods: {
    addMeetingBefShow() {
      this.$axios.post('/MyApplyMeetingAction/addMeetingBefShow.do', null, res => {
        const data = res.dataContent
        // 新增-编辑
        // 会议室
        const meetingList = data.meetingRoom.map(item => {
          return {
            value: item.ID + '',
            label: item.NAME
          }
        })
        this.meetingList = meetingList
        this.setDataInit(this.schema.groups, 'meetingRoomId', 'options', meetingList, 'props')
        // 提醒方式
        const remindList = data.REMIND_MODE.map(item => {
          return {
            value: item.CODE_VALUE,
            text: item.CODE_NAME
          }
        })
        this.setDataInit(this.schema.groups, 'remindModeList', 'options', remindList, 'props')
        this.setDataInit(this.schema.groups, 'remindModeList', 'max', remindList.length + 1, 'props')
        // 提供服务
        const serviceModelList = data.SERVICE_LIST.map(item => {
          return {
            value: item.CODE_VALUE,
            text: item.CODE_NAME
          }
        })
        this.setDataInit(this.schema.groups, 'serviceModelList', 'options', serviceModelList, 'props')
        this.setDataInit(this.schema.groups, 'serviceModelList', 'max', serviceModelList.length + 1, 'props')
      })
    },
    getDetail() {
      const URL = '/MyApplyMeetingAction/detail.do'
      this.$axios.post(URL, {
        applyNo: this.$route.query.APPLY_NO
      }, res => {
        const data = res.dataContent
        const userName = this.storage.get('yh-user').name
        const meetingName = data.meetingName
        const seatsStaff = data.seatsStaff
        const meetingNumber = data.meetingNumber
        // 默认初始化值
        const result = this.formatDateTime(new Date(), 'yyyy-MM-dd')

        const t1_arr = data.meetingStartTime ? data.meetingStartTime.split(':') : []
        const t_1 = t1_arr.length ? `${t1_arr[0]}:${t1_arr[1]}` : ''
        const t1_arr1 = data.meetingEndTime ? data.meetingEndTime.split(':') : []
        const t_2 = t1_arr1.length ? `${t1_arr1[0]}:${t1_arr1[1]}` : ''

        const meetingStartTime = t_1 || result + ' ' + '08:00'
        const meetingEndTime = t_2 || result + ' ' + '17:00'

        const meetingRoomId = data.meetingRoomId
        const meetingFocusMode = data.meetingFocusMode ? data.meetingFocusMode : '0'
        const remark = data.remark
        const remindModeList = data.remindMode.split(',') // ['00','01']
        const selectPersonList = data.selectPersonList.map(item => {
          return {
            value: item.participant + '',
            label: item.participantName,
            src: item.facePath
          }
        })
        const serviceList = data.serviceList.split(',')

        this.$set(this.detail, 'loginName', userName)
        this.$set(this.detail, 'meetingName', meetingName)
        this.$set(this.detail, 'seatsStaff', seatsStaff)
        this.$set(this.detail, 'meetingNumber', meetingNumber)
        this.$set(this.detail, 'meetingStartTime', meetingStartTime)
        this.$set(this.detail, 'meetingEndTime', meetingEndTime)
        this.$set(this.detail, 'meetingRoomId', meetingRoomId)
        this.$set(this.detail, 'remindModeList', remindModeList)
        this.$set(this.detail, 'serviceModelList', serviceList)
        this.$set(this.detail, 'meetingUserList', selectPersonList)
        this.$set(this.detail, 'meetingFocusMode', meetingFocusMode)
        this.$set(this.detail, 'remark', remark)
        this.setDataInit(this.schema.groups, 'meetingUserList', 'options', selectPersonList)
      })
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
