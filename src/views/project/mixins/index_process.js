export default {
  data() {
    return {
      detail: {
        companyValue: '',
        companyLabel: '',
        progressText: ''
      },
      fields: [
        {
          modelKey: 'companyValue',
          label: '选择项目',
          rules: {
            required: true
          }
        },
        {
          modelKey: 'progressText',
          label: '',
          rules: {
            required: true
          }
        }
      ]
    }
  },
  created() {},
  watch: {
  },
  methods: {}
}
