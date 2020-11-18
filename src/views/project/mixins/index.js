export default {
  data() {
    return {
      detail: {},
      basicForm: [
        {
          label: '企业名称',
          type: 'company',
          element: 'select',
          name: 'projObjectName',
          nameId: 'projObject',
          optionLabelName: 'name',
          optionIdName: 'enterpriseId',
          options: [],
          placeholder: '',
          // disabled: true,
          required: true
        },
        {
          label: '项目名称',
          type: '',
          element: 'input',
          name: 'projName',
          required: true
        },
        {
          label: '储备类型',
          type: '',
          element: 'select',
          placeholder: '',
          nameId: 'reserveType',
          name: 'reserveTypeName',
          optionIdName: 'value',
          optionLabelName: 'label',
          options: [],
          required: true
        },
        {
          label: '项目经理',
          type: '',
          element: 'text',
          name: 'userName',
          nameId: 'userId'
          // disabled: true,
          // required: true
        },
        {
          label: '错误',
          type: 'errorTips',
          element: 'other',
          hidden: 'true'
        }
      ]
    }
  },
  created() {
    this.getDetail()
    this.getUserName()
  },
  watch: {
    'detail.projObject'(val) {
      this.basicForm[0].options.map((item, index) => {
        if (item.enterpriseId === this.detail.projObject) {
          this.$set(this.detail, 'projObject', item.enterpriseId)
          this.$set(this.detail, 'projObjectName', item.name)
        }
      })
    }
  },
  methods: {
    getUserName() {
      //  获取当前用户名
      this.$axios.get(
        '/UserInfoAction/getUserInfo.do',
        {},
        res => {
          this.basicForm.map((item, index) => {
            if (item.name === 'userName') {
              this.$set(this.detail, 'userName', res.dataContent.NAME)
              this.$set(this.detail, 'userId', res.dataContent.ID)
            }
          })
          if (
            res.dataContent.DEPTID === 1002 ||
            res.dataContent.DEPTID === 1005
          ) {
            this.$set(this.detail, 'deptId', res.dataContent.DEPTID)
          } else {
            this.$set(this.detail, 'orgId', res.dataContent.ORGID)
          }
          console.log(this.detail)
        },
        error => {}
      )
    },
    search() {
      this.getList(true)
    },
    addBeforeShow(callback) {
      if (callback) {
        callback()
      }
    },
    beforeInit() {
      if (this.initData) {
        this.detail = JSON.parse(JSON.stringify(this.initData))
      } else {
        //  获取储备类型
        this.$axios.get(
          '/commonTCode/getCodeByParentId.do',
          {
            parentId: '6010'
          },
          res => {
            this.basicForm.map((item, index) => {
              if (item.name === 'reserveTypeName') {
                this.basicForm[index].options = res.data.options
              }
            })
          }
        )
        this.initData = JSON.parse(JSON.stringify(this.detail))
      }
    },
    getDetail() {
      if (this.$route.query.id > 0) {
        this.addBeforeShow(() => {})
      } else {
        this.beforeInit()
        this.getUserName()
      }
    }
  }
}
