<template>
  <div class="project-progress-list">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <progress-list v-for="(item,index) in pageInfo.list" :key="index" :field="item"/>
    </div>
    <loading-box v-model="showLoading"/>
  </div>
</template>

<script>

export default {
  components: {
    'progress-list': () => import('../components/projectProgressList')
  },
  data() {
    return {
      pageInfo: {
        params: {
          currPage: 1,
          pageSize: 1000,
          groupId: '',
          inveId: '',
          keyword: '',
          myOrAll: 'all',
          projDateStatus: '',
          projStatus: '',
          projObject: '',
          projStartTime: '',
          projEndTime: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/projectPC/listViewIdMy'
      },
      catTitle: '项目列表',
      showLoading: true
    }
  },
  created() {
    this.model = this.storage.get('businessObj') || {}
    const name = this.model.enName ? this.model.enName : this.model.projObjectName
    this.catTitle = name

    const projectObject = this.model.projObject
    const inveId = this.model.inveId
    const groupId = this.model.groupId

    this.pageInfo.params.groupId = groupId
    this.pageInfo.params.inveId = inveId
    this.pageInfo.params.projObject = projectObject

    this.getList(true)
  },
  methods: {
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.showLoading = false
        }
      )
    }
  }
}
</script>

