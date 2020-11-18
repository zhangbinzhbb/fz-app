export default {
  data() {
    return {
      detail: {
        ApplyDate: '',
        TrueName: '',
        ATTENDONDATE: '',

        LeaveTypeId: '',
        startDate: '',
        endDate: '',
        manageUsers: [],
        reason: '',
        remarks: ''
      },
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'input',
                modelKey: 'ApplyDate',
                label: '申请日期',
                isLink: false,
                props: {
                  placeholder: '请输入',
                  readonly: true
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'TrueName',
                label: '填表人',
                isLink: false,
                props: {
                  placeholder: '请输入',
                  readonly: true
                },
                rules: {}
              },
              {
                type: 'input',
                modelKey: 'ATTENDONDATE',
                label: '入职日期',
                isLink: false,
                props: {
                  placeholder: '请输入',
                  readonly: true
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
                modelKey: 'LeaveTypeId',
                label: '请假类别',
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
                type: 'date',
                modelKey: 'startDate',
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
                  // formatter: (type, value) => {
                  //   if (type === 'year') {
                  //     return `${value}`
                  //   } else if (type === 'month') {
                  //     return `${value}`
                  //   }
                  //   return value
                  // }
                  // format: 'YYYY-MM-DD'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'date',
                modelKey: 'endDate',
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
                type: 'tree',
                modelKey: 'manageUsers',
                label: '',
                props: {
                  label: '代理人',
                  numberTitle: '4/1000',
                  title: '添加人员'
                },
                rules: {},
                options: []
              },
              {
                type: 'input',
                modelKey: 'reason',
                label: '请假原因',
                isLink: false,
                props: {
                  placeholder: '请输入'

                },
                rules: {}
              },
              {
                type: 'textarea',
                modelKey: 'remarks',
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
          }
        ]
      }
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const userInfo = this.storage.get('yh-user') || null
      this.$axios.get(
        '/LeaveListAction/leaveList.do',
        {
          loginName: userInfo.loginName
        },
        res => {
          if (res.statue === '0') {
            const data = res.dataContent
            this.detail = data.PersonEntity
            this.detail.ApplyDate = data.ApplyDate
            this.detail.ATTENDONDATE = data.PersonEntity.ATTENDONDATE.split(' ')[0]
            this.detail.manageUsers = []
            this.detail.LeaveTypeId = ''
            this.detail.startDate = '' // this.detail.startDate + this.detail.startTime
            this.detail.endDate = '' // this.detail.endDate + this.detail.endTime
            this.detail.reason = ''
            this.detail.remarks = ''

            const ListItem = data.LeaveType.ArrayOfListItem.ListItem.map(i => {
              return {
                value: i.Value + '',
                label: i.Text
              }
            })
            this.setDataInit(this.schema.groups, 'LeaveTypeId', 'options', ListItem, 'props')
          }
        }
      )
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
