<template>
  <div>
    <form class="yh-search" action="" v-on:submit.prevent="search">
      <input ref="searchInput" type="search" placeholder="搜索" v-model.trim="pageInfo.params.keyword">
    </form>
    <van-radio-group v-model="company.checked" class="company-radio">
      <van-radio :name="item.resumeId+'_'+item.userName" v-for="(item,index) in pageInfo.list" :key="index">姓名：{{item.userName}}&nbsp;&nbsp;&nbsp; 手机号：{{item.telephone}}</van-radio>
    </van-radio-group>
    <blank v-if="!pageInfo.isLoading&&(!pageInfo.list||pageInfo.list.length==0)"></blank>
  </div>
</template>

<script>
export default {
  name: 'workflow',
  data () {
    return {
      pageInfo: {
        params: {
          IS_PAGE: true,
          currPage: 1,
          pageSize: 10,
          keyword: '',
          resumeStatus: '1'
        },
        list: [],
        postType: 'postJson',
        // postUrl: '/entBaseInfo/list'
        postUrl: '/resumeManagement/list'
      }
    }
  },
  props: {
    company: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created () {
    this.getList(true)
  },
  methods: {
    getList (isFirst) {
      this.$axios.pageData(this, isFirst, res => {
      })
    },
    search () {
      this.$refs.searchInput.blur()
      if (this.company.keyword != '') {
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
    .empty {
        font-size: 24px;
        color: #999;
        text-align: right;
        padding: 10px;
        padding-right: 20px;
        border-bottom: 2px solid #e8e8e8;
    }
</style>
