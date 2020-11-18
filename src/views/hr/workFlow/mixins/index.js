export default {
  data () {
    return {
      detail: {
        // userName: '',
        // workStatus: '',
        resumeId: '',
        workStatus: '',
        // groupName: '',
        jobId: '',
        // workResult: '',
        workResult: '',
        workTime: '',
        interviewer: '',
        workRemark: ''
      },
      resumeListTrue: false,
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'select',
                modelKey: 'resumeId',
                label: '姓名',
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
                modelKey: 'workStatus',
                label: '当前状态',
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
                modelKey: 'jobId',
                label: '当前公司',
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
                modelKey: 'jobId',
                label: '当前岗位',
                props: {
                  options: [],
                  isLink: true
                },
                rules: {
                  required: true
                }
              },
              {
                label: '面试结果',
                type: 'select',
                modelKey: 'workResult',
                props: {
                  options: [],
                  isLink: true
                },
                rules: {
                  required: true
                }
              },
              {
                label: '时间',
                type: 'date',
                modelKey: 'workTime',
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
                label: '面试官',
                type: 'input',
                modelKey: 'interviewer',
                props: {
                  placeholder: '请输入'
                },
                input: true
              },
              {
                label: '',
                type: 'textarea',
                modelKey: 'workRemark',
                props: {
                  title: '面试评价',
                  placeholder: '请输入面试评价'
                },
                input: true
              }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.addBeforeShow()
    // this.getDetail()
  },
  watch: {
    // //  选择公司后
    'detail.jobId' (oldval, newval) {
      this.schema.groups[0].fields[2].props.options.map(item => {
        if (item.value === this.detail.jobId) {
          this.$set(this.detail, 'jobId', item.value)
          this.$set(this.detail, 'groupName', item.label)
          this.$set(this.detail, 'jobName', item.label)
        }
      })
    },
    // // 选择岗位后
    // 'detail.jobName' (val) {
    //   this.schema.groups[0].fields[3].props.options.map(item => {
    //     if (item.value === this.detail.jobId) {
    //       this.$set(this.detail, 'groupName', item.value)
    //       this.$set(this.detail, 'jobName', item.value)
    //     }
    //   })
    // },
    // // 选择姓名后
    'detail.resumeId' (val) {
      this.schema.groups[0].fields[0].props.options.map(item => {
        if (item.value === this.detail.resumeId) {
          this.$set(this.detail, 'resumeId', item.value)
          this.$set(this.detail, 'userName', item.label)
        }
      })
    }
  },
  methods: {
    addBeforeShow() {
      this.showLoading = true
      // 姓名 从简历表中拿取
      this.$axios.postJson(
        '/resumeManagement/list',
        {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 100,
          // resumeStatus: 1,
          keyword: ''
        },
        res => {
          const resumeList = res.data.map(item => {
            return {
              value: item.resumeId,
              label: item.userName
            }
          })
          this.setDataInit(this.schema.groups, 'resumeId', 'options', resumeList, 'props')
          this.showLoading = false
          this.resumeListTrue = true
          // 面试状态
          this.$axios.get(
            '/commonTCode/getCodeByParentId.do',
            {
              parentId: '2601'
              // keyword: ''
            },
            res => {
              res.data.options.splice(0, 1)
              const workStatus = res.data.options.map(item => {
                return {
                  value: item.value,
                  label: item.label
                }
              })
              this.setDataInit(this.schema.groups, 'workStatus', 'options', workStatus, 'props')
            }
          )
          // 当前公司
          this.$axios.postJson(
            '/jobDemand/list',
            {
              IS_PAGE: true,
              curPage: 1,
              pageSize: 1000000,
              jobStatus: 1
              // keyword: ''
            },
            res => {
              const jobId = res.data.map(item => {
                return {
                  value: item.jobId,
                  label: item.groupName + '(' + item.jobName + ')'
                }
              })
              this.setDataInit(this.schema.groups, 'jobId', 'options', jobId, 'props')
            }
          )
          // 当前岗位
          this.$axios.postJson(
            '/jobDemand/list',
            {
              IS_PAGE: true,
              curPage: 1,
              pageSize: 1000000,
              jobStatus: 1
              // keyword: ''
            },
            res => {
              const jobId = res.data.map(item => {
                return {
                  value: item.jobId,
                  label: item.groupName + '(' + item.jobName + ')'
                }
              })
              this.setDataInit(this.schema.groups, 'jobId', 'options', jobId, 'props')
            }
          )
          // 面试结果
          this.$axios.get(
            '/commonTCode/getCodeByParentId.do',
            {
              parentId: '2602'
              // keyword: ''
            },
            res => {
              const workResult = res.data.options.map(item => {
                return {
                  label: item.label,
                  value: item.value
                }
              })
              this.setDataInit(this.schema.groups, 'workResult', 'options', workResult, 'props')
            }
          )
          console.log(this.resumeListTrue && this.$route.query.id)
          if (this.resumeListTrue && this.$route.query.id) {
            console.log(this.resumeListTrue && this.$route.query.id)
            this.getDetail()
          }else{

          }
        }
      )
    },
    getDetail() {
      if (this.$route.query.id > 0) {
        // this.addBeforeShow()
        this.$axios.get(
          '/workSheet/detail/' + this.$route.query.id,
          {},
          res => {
            // 初始赋值 给cmpData 与 更改后 作比较
            console.log(res)
            // 初始值赋给cmpData  用于更新更改做比较
            this.cmpData = JSON.parse(JSON.stringify(res.data.model))
            const data = res.data.model
            // 面试状态
            this.$axios.get(
              '/commonTCode/getCodeByParentId.do',
              {
                parentId: '2601'
                // keyword: ''
              },
              res => {
                res.data.options.splice(0, 1)
                const workStatus = res.data.options.map(item => {
                  if (item.label == data.workStatus) {
                    this.$set(this.detail, 'workStatus', item.value)
                    this.$set(this.cmpData, 'workStatus', item.value)
                  }
                  return {
                    value: item.value,
                    label: item.label
                  }
                })
                this.setDataInit(this.schema.groups, 'workStatus', 'options', workStatus, 'props')
                // 面试结果
                this.$axios.get(
                  '/commonTCode/getCodeByParentId.do',
                  {
                    parentId: '2602'
                    // keyword: ''
                  },
                  res => {
                    const workResult = res.data.options.map(item => {
                      if (item.label == data.workResult) {
                        this.$set(this.detail, 'workResult', item.value)
                        this.$set(this.cmpData, 'workResult', item.value)
                      }
                      return {
                        label: item.label,
                        value: item.value
                      }
                    })
                    this.setDataInit(this.schema.groups, 'workResult', 'options', workResult, 'props')
                  }
                )
              }
            )
            const resumeId = data.resumeId
            const jobId = data.jobId
            const userName = data.userName
            const workTime = data.workTime
            const interviewer = data.interviewer
            const workRemark = data.workRemark
            const workId = data.workId
            this.$set(this.detail, 'userName', userName)
            this.$set(this.detail, 'resumeId', resumeId)
            // this.$set(this.detail, 'jobName', jobId)
            this.$set(this.detail, 'jobId', jobId)
            // this.$set(this.detail, 'groupName', jobId)
            this.$set(this.detail, 'workTime', workTime)
            this.$set(this.detail, 'interviewer', interviewer)
            this.$set(this.detail, 'workRemark', workRemark)
            this.$set(this.detail, 'workId', workId)
            if (this.resumeListTrue) {
              this.showLoading = false
            }
          }
        )
        // eslint-disable-next-line no-empty
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
