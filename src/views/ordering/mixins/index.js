export default {
  data() {
    return {
      model: {
        reportBy: '',
        deptName: '',
        orderTime: '',
        operationTime: ''
      },
      orderStatue: '',
      fields: [
        {
          type: 'input',
          modelKey: 'reportBy',
          label: '订餐人',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'deptName',
          label: '公司部门',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'orderTime',
          label: '订餐日期',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'operationTime',
          label: '操作时间',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: false
        },
        {
          type: 'input',
          modelKey: 'operationTime',
          label: '状态',
          isLink: false,
          props: {
            placeholder: '请输入',
            readonly: true
          },
          rules: {},
          hidden: false
        }
      ],
      orderId: this.$route.query.BIZKEY || '2020020813204'
    }
  },
  created() {
    this.getOrderInit()
  },
  watch: {},
  methods: {
    getOrderInit() {
      const URL = '/orderAction/init.do'
      const orderId = this.orderId
      this.$axios.get(URL, {
        orderId
      }, res => {
        const data = res.dataContent
        const orderBy = data.orderBy
        const companyName = data.companyName
        const deptName = data.deptName
        const company = `${companyName}-${deptName}`
        const orderDt = data.orderDateStr
        const operateDate = data.operateDate
        this.model.reportBy = orderBy
        this.model.deptName = company
        this.orderStatue = data.statue
        // 订餐日期
        this.model.orderTime = orderDt
        // 操作时间
        let dd1 = ''
        if (operateDate) {
          const operateDateArr = operateDate.split(' ')
          const operate_1 = operateDateArr[1]
          const operate_2 = operate_1.split(':')
          dd1 = `${operateDateArr[0]} ${operate_2[0]}:${operate_2[1]}`
        }
        this.model.operationTime = this.orderStatue === '0' ? this.getNowTime() : dd1
      })
    }
  }
}
