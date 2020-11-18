export default {
  data () {
    return {
      topInfo: this.storage.get('yh-proj-qy'),
      detail: {
        uploadFiles: []
      },
      basicForm: [ {
        label: '关联名称',
        type: '',
        element: 'text',
        name: 'RELATE_NAME',
        nameId: 'RELATE_ID'
        // disabled: true
      }, {
        label: '标题',
        type: '',
        element: 'input',
        name: 'TITLE',
        maxlength: '25',
        placeholder: '输入标题，不超过25字',
        required: true
      }, {
        label: '问题内容',
        type: 'textarea',
        element: 'input',
        name: 'CONTENT',
        maxlength: '1000',
        placeholder: '输入问题内容，不超过1000字'
      }, {
        label: '问题建议',
        type: 'textarea',
        element: 'input',
        name: 'PROPOSAL',
        maxlength: '1000',
        placeholder: '输入建议内容，不超过1000字'
      }
      ]
    }
  },
  created () {
    this.getDetail()
    // this.fileFnSetting()
  },
  watch: {},
  methods: {
    addBeforeShow (callback) {
      //  项目管理（企业维度）进来
      if (this.$route.query.projObject) {
        let projObjectNameShow = this.topInfo.projObjectName != null ? this.topInfo.projObjectName : ''
        let inveNameShow = this.topInfo.inveName != null ? '---' + this.topInfo.inveName : ''
        this.detail.RELATE_NAME = projObjectNameShow + '' + inveNameShow
      }
      //
      //  项目管理（项目维度）进来
      if (this.$route.query.projName) {
        this.detail.RELATE_NAME = this.$route.query.projName
      }
      // 平台进来
      if (this.$route.query.platName) {
        this.detail.RELATE_NAME = this.$route.query.platName
      }
      //  基金进来
      if (this.$route.query.fundName) {
        this.detail.RELATE_NAME = this.$route.query.fundName
      }
      //  子基金进来
      if (this.$route.query.projObjectName) {
        this.detail.RELATE_NAME = this.$route.query.projObjectName
      }
      this.detail.RELATE_ID = '1'
      if (callback) {
        callback()
      }
    },
    beforeInit () {
      if (this.initData) {
        this.detail = JSON.parse(JSON.stringify(this.initData))
      } else {
        this.addBeforeShow()
        this.initData = JSON.parse(JSON.stringify(this.detail))
      }
    },
    getDetail () {
      if (this.$route.query.id > 0) {
        this.addBeforeShow(() => {
        })
      } else {
        this.beforeInit()
      }
    }
  }
}
