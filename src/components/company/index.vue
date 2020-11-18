<template>
  <div>
    <form class="yh-search" action="" @submit.prevent="search">
      <input ref="searchInput" :placeholder="searchTips" v-model.trim="company.keyword" type="search">
    </form>
    <van-radio-group v-model="company.checked" class="company-radio">
      <van-radio v-for="(item,index) in pageInfo.list" :name="(item.enterpriseId||item.projObject)+'_'+(item.name||item.projName)" :key="index">{{ item.name||item.projName }}</van-radio>
    </van-radio-group>
    <blank v-if="!pageInfo.isLoading&&(!pageInfo.list||pageInfo.list.length==0)"/>
  </div>
</template>

<script>
export default {
  name: 'Company',
  props: {
    company: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      searchTips: '搜索注册企业名称或输入未注册企业名称',
      pageInfo: {
        params: {
          IS_PAGE: true,
          currPage: 1,
          pageSize: 100,
          keyword: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/entBaseInfo/list'
        // postUrl: '/resumeManagement/list'
      }
    }
  },
  created() {
    this.pageInfo.postType = 'get'
    this.pageInfo.postUrl = '/projectProgress/selectProject'
    this.searchTips = '搜索项目名称或输入项目名称'
    this.getList(true)
  },
  methods: {
    getList(isFirst) {
      this.pageInfo.params.keyword = this.company.keyword
      this.company.checked = null
      this.$axios.pageData(this, isFirst, res => {
      })
    },
    search() {
      this.$refs.searchInput.blur()
      if (this.company.keyword !== '') {
        this.getList(true)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style lang="scss">
.company-radio {
  text-align: left;
  .van-radio{
  border-bottom: 2px solid #e8e8e8;
    padding: 10px 20px;
  }
  .van-radio__input{
    font-size: 36px;
  }
 .van-icon-checked{
   color: #b70007;
 }
  .van-radio__label {
    font-size: 28px;
    color: #333;
    width: 90%;
    // background: yellow;
    line-height: 120%;
    padding-left: 10px;
  }
}
</style>
