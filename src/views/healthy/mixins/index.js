export default {
  data() {
    return {
      model: {
        reportBy: '',
        reportDtStr: '',
        situation: '',
        symptom: '',
        measures: '',
        isPost: '',
        isSuzhou: '1',
        inSuzhou: '',
        leaveDtStr: '',
        leaveCity: '',
        arriveDtStr: '',
        check1: '',
        content1: '',
        check2: '',
        content2: '',
        check3: '',
        content3: '',
        check4: '',
        content4: '',
        check5: '',
        content5: '',
        check6: '',
        content6: '',
        check7: '',
        content7: '',
        check8: '',
        content8: '',
        check9: '',
        content9: '',
        check10: '',
        content10: '',
        check11: '',
        content11: '',
        check12: '',
        content12: '',
        check13: '',
        content13: '',
        check14: '',
        content14: '',
        check15: '',
        content15: '',
        address: '',
        street: '',
        isReport: '',
        isComfirm: '',
        remark: ''
      },
      fields: [
        {
          type: 'input',
          modelKey: 'reportBy',
          label: '填报人',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: true
        },
        {
          type: 'input',
          modelKey: 'reportDtStr',
          label: '填报日期',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: true
        },
        {
          type: 'checker',
          modelKey: 'situation',
          label: '健康状态',
          props: {
            options: [{
              value: 0,
              text: '正常'
            }, {
              value: 1,
              text: '异常'
            }],
            type: 'radio'
          },
          events: {
            'input': (...args) => {
              const str = args[0]
              const isShow = str === 0
              this.model.symptom = str === 0 ? '' : this.model.symptom
              this.setDataInit(this.fields, 'symptom', 'hidden', isShow)
            }
          },
          rules: {
            required: true
          },
          hidden: true
        },
        {
          type: 'input',
          modelKey: 'symptom',
          label: '',
          isLink: false,
          props: {
            placeholder: '请填写具体症状'
          },
          rules: {
            required: true
          },
          hidden: true
        },
        {
          type: 'input',
          modelKey: 'measures',
          label: '已采取措施',
          isLink: false,
          props: {
            placeholder: '请输入'
          },
          rules: {},
          hidden: true
        },
        {
          type: 'switch',
          modelKey: 'isPost',
          label: '',
          props: {},
          rules: {
            required: true
          },
          hidden: true
        },
        {
          type: 'switch',
          modelKey: 'isSuzhou',
          label: '办公地是否在苏州',
          props: {},
          rules: {
            required: true
          },
          hidden: true
        },
        {
          type: 'switch',
          modelKey: 'inSuzhou',
          label: '1月24日至今是否离开过苏州',
          props: {},
          events: {
            'input': (...args) => {
              const str = args[0]
              const isShow = str === '0'
              this.model.leaveCity = str === '0' ? '' : this.model.leaveCity
              this.setDataInit(this.fields, 'leaveCity', 'hidden', isShow)
              this.setDataInit(this.fields, 'arriveDtStr', 'hidden', isShow)
            }
          },
          rules: {
            required: true
          },
          hidden: true
        },
        {
          type: 'input',
          modelKey: 'leaveCity',
          label: '',
          isLink: false,
          props: {
            placeholder: '请填写最近离开苏州时间、去往城市',
            type: 'textarea',
            autosize: true
          },
          rules: {
            required: true
          },
          hidden: true
        },
        {
          type: 'date',
          modelKey: 'arriveDtStr',
          label: '(预计)到达苏州日期',
          props: {
            isLink: true,
            type: 'date',
            placeholder: '请选择日期',
            format: 'YYYY-MM-DD'
          },
          rules: {
            required: true
          },
          hidden: false
        },

        {
          type: '',
          modelKey: 'check1',
          label: '',
          props: {},
          rules: {
            required: true
          },
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'content1',
          label: '',
          isLink: false,
          props: {
            placeholder: '请详细填写健康状况',
            type: 'textarea',
            autosize: true
          },
          rules: {
            required: true
          },
          hidden: true
        },

        {
          type: 'switch',
          modelKey: 'check15',
          label: '过去2周内，是否接触上述疫情重点地区相关人员',
          props: {},
          events: {
            'input': (...args) => {
              const str = args[0]
              const isShow = str === '0'
              this.model.content15 = str === '0' ? '' : this.model.content15
              this.setDataInit(this.fields, 'content15', 'hidden', isShow)
            }
          },
          rules: {
            required: true
          },
          hidden: false
        }, {
          type: 'input',
          modelKey: 'content15',
          label: '',
          isLink: false,
          props: {
            placeholder: '请填写具体接触日期、地点及相关人员等'
          },
          rules: {
            required: true
          },
          hidden: true
        },

        {
          type: 'switch',
          modelKey: 'check2',
          label: '是否从上述疫情重点地区以外地区返苏',
          props: {},
          events: {
            'input': (...args) => {
              const str = args[0]
              const isShow = str === '0'
              this.model.content2 = str === '0' ? '' : this.model.content2
              this.setDataInit(this.fields, 'content2', 'hidden', isShow)
            }
          },
          rules: {
            required: true
          },
          hidden: false
        }, {
          type: 'input',
          modelKey: 'content2',
          label: '',
          isLink: false,
          props: {
            placeholder: '请填写在外地停留日期、行程及相关人员等'
          },
          rules: {
            required: true
          },
          hidden: true
        },

        {
          type: 'switch',
          modelKey: 'check3',
          label: '是否与疑似或确诊病例人员接触',
          props: {},
          events: {
            'input': (...args) => {
              const str = args[0]
              const isShow = str === '0'
              this.model.content3 = str === '0' ? '' : this.model.content3
              this.setDataInit(this.fields, 'content3', 'hidden', isShow)
            }
          },
          rules: {
            required: true
          },
          hidden: false
        }, {
          type: 'input',
          modelKey: 'content3',
          label: '',
          isLink: false,
          props: {
            placeholder: '请填写具体接触日期、地点及相关人员等'
          },
          rules: {
            required: true
          },
          hidden: true
        },

        {
          type: 'switch',
          modelKey: 'check4',
          label: '是否仍在上述疫情重点地区未返苏',
          props: {},
          events: {
            'input': (...args) => {
              const str = args[0]
              const isShow = str === '0'
              this.model.content4 = str === '0' ? '' : this.model.content4
              this.setDataInit(this.fields, 'content4', 'hidden', isShow)
            }
          },
          rules: {
            required: true
          },
          hidden: false
        }, {
          type: 'input',
          modelKey: 'content4',
          label: '',
          isLink: false,
          props: {
            placeholder: '请填写预计返苏时间'
          },
          rules: {
            required: true
          },
          hidden: true
        },

        {
          type: 'input',
          modelKey: 'address',
          label: '苏州家庭住址',
          isLink: false,
          props: {
            placeholder: '请填写（具体到房号）及联系电话'
          },
          input: true,
          rules: {},
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'street',
          label: '所属街道（社工委）社区',
          isLink: false,
          props: {
            placeholder: '**街道（社工委）**社区'
          },
          input: true,
          rules: {},
          hidden: false
        },

        {
          type: 'switch',
          modelKey: 'isReport',
          label: '是否已向社区报备',
          props: {},
          rules: {},
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'isComfirm',
          label: '解除观察是否经社区确认',
          isLink: false,
          props: {
            placeholder: '如未解除填写“未解除”'
          },
          input: true,
          rules: {},
          hidden: false
        }
      ],
      isPostList: [
        {
          label: '公司办公',
          value: '0'
        },
        {
          label: '隔离/在家办公',
          value: '1'
        },
        {
          label: '未返苏',
          value: '2'
        },
        {
          label: '请假',
          value: '3'
        },
        {
          label: '周末/国假日',
          value: '4'
        }
      ],
      checkboxList: [
        {
          label: '湖北全省',
          modelKey1: 'check5',
          modelKey2: 'content5',
          active: false
        },
        {
          label: '浙江温州',
          modelKey1: 'check6',
          modelKey2: 'content6',
          active: false
        },
        {
          label: '浙江台州',
          modelKey1: 'check7',
          modelKey2: 'content7',
          active: false
        },
        {
          label: '浙江杭州',
          modelKey1: 'check8',
          modelKey2: 'content8',
          active: false
        },
        {
          label: '浙江宁波',
          modelKey1: 'check9',
          modelKey2: 'content9',
          active: false
        },
        {
          label: '河南信阳',
          modelKey1: 'check10',
          modelKey2: 'content10',
          active: false
        },
        {
          label: '河南驻马店',
          modelKey1: 'check11',
          modelKey2: 'content11',
          active: false
        },
        {
          label: '安徽合肥',
          modelKey1: 'check12',
          modelKey2: 'content12',
          active: false
        },
        {
          label: '安徽阜阳',
          modelKey1: 'check13',
          modelKey2: 'content13',
          active: false
        },
        {
          label: '江西南昌',
          modelKey1: 'check14',
          modelKey2: 'content14',
          active: false
        }
      ],
      pkId: this.$route.query.pkId || ''
    }
  },
  created() {
    this.getDetail()
  },
  watch: {
    'model.isSuzhou'(value) {
      this.isSuzhouInit()
    },
    'model.check1'(value) {
      if (value === '2') {
        this.setDataInit(this.fields, 'content1', 'hidden', false)
        return
      }
      this.model.content1 = ''
      this.setDataInit(this.fields, 'content1', 'hidden', true)
    }
  },
  methods: {
    setDataInit(data, modelKey, modelValue, value, type) {
      if (data.length) {
        data.map((fields, index) => {
          if (fields.modelKey === modelKey) {
            if (type) {
              // this.$set(this.schema.groups[index].fields[sindex].props, modelValue, value)
            } else {
              this.$set(this.fields[index], modelValue, value)
            }
          }
        })
      }
    },
    isSuzhouInit() {
      const isSuzhou = this.model.isSuzhou
      const situation = this.model.situation
      const inSuzhou = this.model.inSuzhou

      const check1 = this.model.check1
      const check2 = this.model.check2
      const check3 = this.model.check3
      const check4 = this.model.check4
      const check15 = this.model.check15

      const s = 'reportBy/reportDtStr/situation/symptom/measures/isPost/isSuzhou'
      this.fields.map((item, index) => {
        if (isSuzhou === '0') {
          if (s.indexOf(item.modelKey) > -1) {
            item.hidden = false
          } else {
            item.hidden = true
          }
        }
        if (isSuzhou === '1') {
          item.hidden = false
        }

        if (situation && situation === 1) {
          this.setDataInit(this.fields, 'symptom', 'hidden', false)
        } else {
          this.setDataInit(this.fields, 'symptom', 'hidden', true)
        }
        // if (!situation || situation === '0' || situation === '2') {
        //   this.setDataInit(this.fields, 'symptom', 'hidden', true)
        // }
        if (!inSuzhou || inSuzhou === '0') {
          this.setDataInit(this.fields, 'leaveCity', 'hidden', true)
          this.setDataInit(this.fields, 'arriveDtStr', 'hidden', true)
        }

        if (!check1 || check1 !== '2') {
          this.setDataInit(this.fields, 'content1', 'hidden', true)
        }
        if (!check2 || check2 === '0') {
          this.setDataInit(this.fields, 'content2', 'hidden', true)
        }
        if (!check3 || check3 === '0') {
          this.setDataInit(this.fields, 'content3', 'hidden', true)
        }
        if (!check4 || check4 === '0') {
          this.setDataInit(this.fields, 'content4', 'hidden', true)
        }
        if (!check15 || check15 === '0') {
          this.setDataInit(this.fields, 'content15', 'hidden', true)
        }
      })
    },
    getDetail() {
      // 202002071225
      const userId = this.storage.get('yh-user').userId
      const pkId = this.pkId
      // const pkId = ''
      // 注：如果pkId为空，代表新增，查询上一天数据，如果pkId不为空，代表查看某数据详情
      const URL = '/dailyHealthyAction/detail.do'
      this.$axios.get(URL, {
        userId,
        pkId
      }, res => {
        const data = res.dataContent
        this.model = data
        // isSuzhou-办公地是否在苏州
        const isSuzhou = data.isSuzhou
        const situation = Number(data.situation)
        this.model.situation = situation

        if (!isSuzhou) {
          this.model.isSuzhou = '1'
        }

        const arriveDt = data.arriveDt
        let arriveDtArr = []
        if (arriveDt) {
          arriveDtArr = arriveDt.split(' ')
        }
        this.model.arriveDtStr = arriveDt ? arriveDtArr[0] : arriveDt

        const inSuzhou = data.inSuzhou
        if (!inSuzhou) {
          this.model.inSuzhou = '0'
        }

        const check2 = data.check2
        const check3 = data.check3
        const check4 = data.check4
        const check15 = data.check15
        if (!check2) {
          this.model.check2 = '0'
        }
        if (!check3) {
          this.model.check3 = '0'
        }
        if (!check4) {
          this.model.check4 = '0'
        }
        if (!check15) {
          this.model.check15 = '0'
        }

        const checkboxList = this.checkboxList

        this.checkboxList.map(item => {
          this.setDataCheck(checkboxList, item.modelKey1, data[item.modelKey1])
        })

        const isReport = data.isReport
        if (!isReport) {
          this.model.isReport = '0'
        }

        const reportBy_deptName_companyName = `${data.reportBy}/${data.companyName}-${data.deptName}`
        this.model.reportBy = reportBy_deptName_companyName
        // 填报日期
        const reportDtStr = this.getNowTime()
        this.model.reportDtStr = reportDtStr
        this.isSuzhouInit()
      })
    },
    setDataCheck(data, modelKey, modelValue) {
      data.map((item, index) => {
        if (item.modelKey1 === modelKey && modelValue) {
          const active = modelValue === '1'
          this.$set(this.checkboxList[index], 'active', active)
        }
      })
    },
    setDataInit1(data, modelKey, modelValue, value, type) {
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
