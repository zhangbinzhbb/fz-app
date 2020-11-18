<template>
  <div
    :class="{'van-pull-refresh-demo':list.length===0}"
    class="newsarticle has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <span class="yh-add-more" @click="readAll">
          全部已读
        </span>
      </template>
    </headerx>
    <div
      v-infinite-scroll="loadMore"
      class="comment-content no-comment"
      infinite-scroll-disabled="pageInfo.isLoading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false"
      style="height:100%"
    >
      <van-pull-refresh
        v-model="isLoading"
        @refresh="onRefresh">
        <news-list ref="newsList" page="list" @refreshcb="refreshcb" @get-list="getList"/>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'news-list': () => import('./componets/newsList')
  },
  data() {
    return {
      catTitle: '信息资讯',
      isLoading: false,
      list: []
    }
  },
  created() {},
  methods: {
    loadMore() {
      this.$refs.newsList.loadMore()
    },
    onRefresh() {
      this.$refs.newsList.onRefresh()
    },
    refreshcb() {
      this.isLoading = false
    },
    readAll() {
      this.$axios.get(
        '/InformationAction/informationAllRead.do?',
        {},
        res => {
          this.Toast('设置成功')
          this.$refs.newsList.getInformationList(true)
        }
      )
    },
    getList(arr) {
      this.list = arr
    }
  }
}
</script>

<style scoped lang="scss">
.already-read {
  width: 68px;
  margin-top: 10px;
}
</style>
<style lang="scss">
.van-pull-refresh-demo{
  .van-pull-refresh{
    height: calc(100vh - 115px);
  }
  .van-pull-refresh__track {
    height: calc(100vh - 115px);
  }
}
</style>
