export default {
  data() {
    return {
      model: {
        projObject: '',
        projObjectName: '',
        projName: '',
        reserveType: '',
        reserveTypeName: '',
        userId: '',
        userName: ''
      },
      fields: [
        {
          type: 'select',
          modelKey: 'projObject',
          label: '企业名称',
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
          modelKey: 'projName',
          label: '项目名称',
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
          modelKey: 'reserveType',
          label: '储备类型',
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
          modelKey: 'userName',
          label: '项目经理',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {
            required: true
          }
        }
      ]
    }
  },
  created() {
    this.beforeInit()
  },
  methods: {
    getUserName() {
      //  获取当前用户名
      this.$axios.get(
        '/UserInfoAction/getUserInfo.do', {},
        res => {
          console.log('r:', res)
          const data = res.dataContent
          const NAME = data.NAME
          const ID = data.ID
          const DEPTID = data.DEPTID
          const ORGID = data.ORGID

          this.$set(this.model, 'userName', NAME)
          this.$set(this.model, 'userId', ID)

          if (DEPTID === 1002 || DEPTID === 1005) {
            this.$set(this.model, 'deptId', DEPTID)
          } else {
            this.$set(this.model, 'orgId', ORGID)
          }
        },
        error => {}
      )
    },
    beforeInit() {
      //  获取储备类型
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do', {
          parentId: '6010'
        },
        res => {
          const options = res.data.options
          this.$set(this.fields[2].props, 'options', options)
        }
      )
      this.getUserName()
    }
  }
}
