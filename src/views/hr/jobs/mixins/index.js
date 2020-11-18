export default {
  data() {
    return {
      detail: {
        // userName: '',
        // workStatus: '',
        groupId: '',
        depId: '',
        jobName: '',
        remandNum: '',
        startTime: '',
        endTime: '',
        jobDesc: '',
        jobRequirement: ''
      },
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'select',
                modelKey: 'groupId',
                label: '公司名称',
                props: {
                  options: [],
                  isLink: true
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'select',
                modelKey: 'depId',
                label: '部门名称',
                props: {
                  options: [],
                  isLink: true
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'input',
                modelKey: 'jobName',
                label: '岗位名称',
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true,
                }
              },
              {
                type: 'input',
                modelKey: 'remandNum',
                label: '招聘人数',
                props: {
                  placeholder: '请输入整数'
                },
                rules: {
                  required: true,
                }
              },
              {
                label: '开始时间',
                type: 'date',
                modelKey: 'startTime',
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
                }
              },
              {
                label: '结束时间',
                type: 'date',
                modelKey: 'endTime',
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
                }
              },
              {
                label: '',
                type: 'textarea',
                props: {
                  title: '岗位描述',
                  placeholder: '请输入岗位描述'
                },
                modelKey: 'jobDesc',
                input: true
              },
              {
                label: '',
                type: 'textarea',
                props: {
                  title: '岗位要求',
                  placeholder: '请输入岗位要求'
                },
                modelKey: 'jobRequirement',
                input: true
              }
            ]
          }
        ]
      }
    }
  },
  created () {
    this.addBeforeShow()
    this.getDetail()
    // this.fileFnSetting()
  },
  watch: {
    //  选择企业后
    'detail.groupId'(val) {
      console.log('this.detail.groupId', this.detail.groupId)
      // 选择公司后选择下属部门
      this.schema.groups[0].fields[0].props.options.map((item, index) => {
        if (item.value === this.detail.groupId) {
          this.$axios.get(
            '/appGroup/queryDepartmentByOrgId',
            {
              fatherId: this.detail.groupId
            },
            res => {
              if (res.data.options.length > 0) {
                const depId = res.data.options.map(item => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })
                this.setDataInit(this.schema.groups, 'depId', 'options', depId, 'props')
              } else {
              }
            }
          )
        }
      })
    }
  },
  methods: {
    newCompanyList(oldList, newList) {
      oldList.map((item, index) => {
        newList.push(item)
        if (item.children.length > 0) {
          this.newCompanyList(item.children, newList)
        }
      })
      return newList
    },
    timeNow () {
      var date = new Date()
      var seperator1 = '-'
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate
      return currentdate
    },
    addBeforeShow() {
      this.$axios.get('/appGroup/showOrganization', {}, res => {
        const arr = []
        this.newCompanyList(res.data.treeData, arr)
        const groupId = arr.map(item => {
          return {
            value: item.id,
            label: item.label
          }
        })
        this.setDataInit(this.schema.groups, 'groupId', 'options', groupId, 'props')
      }
      )
    },
    getDetail() {
      if (this.$route.query.id > 0) {
        this.$axios.get(
          '/jobDemand/detail/' + this.$route.query.id,
          {},
          res => {
            this.detail = res.data.model
            this.cmpData = JSON.parse(JSON.stringify(res.data.model))
            this.$set(this.detail, 'groupId', res.data.model.groupId)
            // 根据公司获取 部门
            this.$axios.get(
              '/appGroup/queryDepartmentByOrgId',
              {
                fatherId: this.detail.groupId
              },
              res => {
                if (res.data.options.length > 0) {
                  const depId = res.data.options.map(item => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })
                  this.setDataInit(this.schema.groups, 'depId', 'options', depId, 'props')
                } else {
                }
              }
            )
            this.$set(this.detail, 'depId', res.data.model.depId)
            this.detail.jobStatus = this.detail.jobStatus = '招聘中' ? '1': '0'
            this.detail.depName = res.data.model.depName
            this.detail.jobName = res.data.model.jobName
            this.$set(this.detail, 'jobDesc', res.data.model.jobDesc)
            this.$set(this.detail, 'jobRequirement', res.data.model.jobRequirement)
            this.detail.updateDt = this.timeNow()
            this.detail.IS_FIRST = this.detail.IS_FIRST || 0
          },
          error => {
            // console.log('error')
          }
        )
      } else {
        this.addBeforeShow()
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
