export default {
  data () {
    return {
      detail: {
        userName: '',
        userSex: '',
        birthday: '',
        telephone: '',
        idCard: '',
        graduateSchool: '',
        highestDegree: '',
        storageTime: '',
        resumeNum: '',
        major: '',
        resumeSource: '',
        jobId: '',
        unit: '',
        resumeRemak: '',
        resumeStatus: '',
        labelTables: ''
      },
      totalCountAll: null,
      schema: {
        groups: [
          {
            legend: '',
            fields: [
              {
                type: 'input',
                modelKey: 'userName',
                label: '姓名',
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'checker',
                modelKey: 'userSex',
                label: '性别',
                props: {
                  options: [
                    {
                      value: 1,
                      text: '男'
                    },
                    {
                      value: 2,
                      text: '女'
                    }
                  ],
                  type: 'radio'
                  // round: true
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'date',
                modelKey: 'birthday',
                label: '出生日期',
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
                }
              },
              {
                type: 'input',
                modelKey: 'telephone',
                label: '手机号',
                props: {
                  placeholder: '请输入整数'
                },
                rules: {
                  required: true
                }
              },
              {
                label: '身份证号',
                type: 'input',
                modelKey: 'idCard',
                props: {
                  placeholder: '请输入'
                }
              },
              {
                label: '毕业院校',
                type: 'input',
                modelKey: 'graduateSchool',
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'select',
                modelKey: 'highestDegree',
                label: '最高学历',
                props: {
                  isLink: true,
                  type: 'select',
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                label: '专业',
                type: 'input',
                modelKey: 'major',
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  required: true
                }
              },
              {
                label: '入库时间',
                type: 'input',
                modelKey: 'storageTime',
                props: {
                  readonly: true,
                  placeholder: '请输入'
                },
                isLink: false
              },
              {
                label: '简历编号',
                type: 'input',
                modelKey: 'resumeNum',
                props: {
                  readonly: true,
                  placeholder: '请输入'
                },
                rules: {
                },
                isLink: false
              },
              {
                type: 'select',
                modelKey: 'jobId',
                label: '推荐公司',
                props: {
                  options: [],
                  isLink: true,
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'select',
                modelKey: 'jobId',
                label: '岗位名称',
                props: {
                  options: [],
                  isLink: true,
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                type: 'select',
                modelKey: 'resumeSource',
                label: '简历来源',
                props: {
                  options: [],
                  isLink: true,
                  placeholder: '请选择'
                },
                rules: {
                  required: true
                }
              },
              {
                label: '来源单位',
                type: 'input',
                modelKey: 'unit',
                props: {
                  placeholder: '请输入'
                },
                rules: {
                  // required: true
                }
              },
              {
                label: '简历状态',
                type: 'select',
                modelKey: 'resumeStatus',
                props: {
                  options: [],
                  readonly: true,
                  disabled: true,
                  isLink: false
                },
                rules: {
                }
              },
              {
                label: '标签',
                type: 'addInput',
                modelKey: 'labelTables',
                rules: {
                },
                input: true
              },
              {
                label: '',
                type: 'textarea',
                props: {
                  title: '备注',
                  placeholder: '备注'
                },
                modelKey: 'resumeRemak',
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
  },
  watch: {
    // //  选择公司 或岗位 带出
    'detail.jobId' (oldval, newval) {
      this.schema.groups[0].fields[10].props.options.map(item => {
        if (item.value === this.detail.jobId) {
          this.$set(this.detail, 'jobId', item.value)
          this.$set(this.detail, 'groupId', item.value)
          this.$set(this.detail, 'groupName', item.label)
          this.$set(this.detail, 'jobName', item.label)
        }
      })
    }
  },
  methods: {
    addBeforeShow (callback) {
      // //入库时间 简历编号
      this.$axios.get('/resumeManagement/getResumeNumAndDate', {}, res => {
        this.$set(this.detail, 'storageTime', res.data.model.storageTime)
        this.$set(this.detail, 'resumeNum', res.data.model.resumeNum)
      })
      //  最高学历
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2604'
        },
        res => {
          const highestDegree = res.data.options.map(item => {
            return {
              value: item.value,
              label: item.label
            }
          })
          this.setDataInit(this.schema.groups, 'highestDegree', 'options', highestDegree, 'props')
        })
      //  简历来源
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2605'
        },
        res => {
          const resumeSource = res.data.options.map(item => {
            return {
              value: item.value,
              label: item.label
            }
          })
          this.setDataInit(this.schema.groups, 'resumeSource', 'options', resumeSource, 'props')
        })
      // 简历状态
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2601'
        },
        res => {
          const resumeStatus = res.data.options.map(item => {
            return {
              value: item.value,
              label: item.label
            }
          })
          this.setDataInit(this.schema.groups, 'resumeStatus', 'options', resumeStatus, 'props')
          this.$set(this.detail, 'resumeStatus', '1')
        })
      // 公司 和 岗位
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
      console.log(this.schema)
      // })
    },
    getDetail () {
      // 点击重置按钮   标签不会增加
      if (this.$route.query.id > 0) {
        this.$axios.get(
          '/resumeManagement/detail/' + this.$route.query.id,
          {},
          res => {
            // 标签
            // const setLabelTables = labelTables => {
            //   if (labelTables) {
            //     labelTables = labelTables.split(',')
            //     labelTables.map(option => {
            //       this.basicForm[this.basicForm.length - 2].options.push({
            //         label: option
            //       })
            //     })
            //   }
            // }
            // setLabelTables(res.data.model.labelTables)
            this.cmpData = JSON.parse(JSON.stringify(res.data.model))
            // this.detail = res.data.model
            const data = res.data.model
            // this.$set(this.detail, 'userSexName', res.data.model.userSex)
            const userName = data.userName
            const birthday = data.birthday
            const telephone = data.telephone
            const idCard = data.idCard
            const graduateSchool = data.graduateSchool
            const major = data.major
            const resumeRemak = data.resumeRemak
            const storageTime = data.storageTime
            const jobId = data.jobId
            const resumeId = data.resumeId
            const unit = data.unit
            const labelTables = data.labelTables
            this.$set(this.detail, 'userName', userName)
            this.$set(this.detail, 'birthday', birthday)
            this.$set(this.detail, 'telephone', telephone)
            this.$set(this.detail, 'idCard', idCard)
            this.$set(this.detail, 'graduateSchool', graduateSchool)
            this.$set(this.detail, 'major', major)
            this.$set(this.detail, 'resumeRemak', resumeRemak)
            this.$set(this.detail, 'storageTime', storageTime)
            this.$set(this.detail, 'jobId', jobId)
            this.$set(this.detail, 'resumeId', resumeId)
            this.$set(this.detail, 'unit', unit)
            this.$set(this.detail, 'labelTables', labelTables)

            // 性别
            if (data.userSex == '男') {
              this.$set(this.detail, 'userSex', 1)
            } else {
              this.$set(this.detail, 'userSex', 2)
            }
            // 最高学历
            this.$axios.get(
              '/commonTCode/getCodeByParentId.do',
              {
                parentId: '2604'
              },
              res => {
                res.data.options.map(item => {
                  if (item.label == data.highestDegree) {
                    this.$set(this.detail, 'highestDegree', item.value)
                    this.$set(this.cmpData, 'highestDegree', item.value)
                  }
                })
              })
            //  简历来源
            this.$axios.get(
              '/commonTCode/getCodeByParentId.do',
              {
                parentId: '2605'
              },
              res => {
                res.data.options.map(item => {
                  if (item.label == data.resumeSource) {
                    this.$set(this.detail, 'resumeSource', item.value)
                    this.$set(this.cmpData, 'resumeSource', item.value)
                  }
                })
              })
            // 简历状态
            this.$axios.get(
              '/commonTCode/getCodeByParentId.do',
              {
                parentId: '2601'
              },
              res => {
                res.data.options.map(item => {
                  if (item.label == data.resumeStatus) {
                    this.$set(this.detail, 'resumeStatus', item.value)
                    this.$set(this.cmpData, 'resumeStatus', item.value)
                  }
                })
              })
            // this.detail.resumeFile = res.data.resumeFile
            // this.detail.resumeId = this.$route.query.id
            this.detail.IS_FIRST = this.detail.IS_FIRST || 0
            console.log(this.detail)
          }
        )
        console.log(this.detail)
        console.log(this.schema)
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
