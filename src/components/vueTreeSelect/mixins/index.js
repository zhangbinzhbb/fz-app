export default {
  data() {
    return {
      treeData: [],
      popupVisible: false
    }
  },
  created() {
    this.getOrgUserList()
  },
  methods: {
    getOrgUserList(name = '') {
      this.$axios.get(
        '/MyContactAction/getOrgUserList.do', {
          name: name
        },
        res => {
          this.treeData = res.dataContent
          const arr = JSON.parse(JSON.stringify(res.dataContent))
          this.storage.set('tree-data', arr)
        }
      )
    }
  }
}
