<template>
  <div id="Knowledge" class="has-comment">
    <headerx :cat-title="pageType=='focus'?'关注':'取消关注'">
      <template slot="right">
        <span class="yh-add-more" @click="focus()">保存</span>
      </template>
    </headerx>
    <div
      v-infinite-scroll="loadMore"
      class="comment-content no-comment"
      infinite-scroll-disabled="pageInfo.isLoading"
      infinite-scroll-distance="10"
      infinite-scroll-immediate-check="false">
      <form class="yh-search" action="" @submit.prevent="search">
        <img src="@/assets/images/icon/search-img.png" class="search-img">
        <input ref="searchInput" v-model="pageInfo.params.searchId" type="search" placeholder="搜索">
      </form>
      <!--搜获-->
      <person-list :list="pageInfo.list" :params="pageType=='focus'?personFocus:personCancelFocus" @checked="checked"/>
    </div>
    <loading-box v-model="globalLoading" type="2"/>
  </div>
</template>
<script>
export default {
  components: {
    'person-list': () => import('@/components/person/follow')
  },
  data() {
    return {
      pageType: this.$route.query.pageType,
      personFocus: {
        avatorAttr: 'FILE_PATH',
        needUrl: false,
        nameAttr: 'NAME',
        colorAttr: 'COLOR',
        showRadio: true,
        checkIdAttr: 'ID'
      },
      personCancelFocus: {
        avatorAttr: 'FILE_PATH',
        needUrl: false,
        nameAttr: 'USERNAME',
        colorAttr: 'COLOR',
        showRadio: true,
        checkIdAttr: 'ATTENTION_ID'
      },
      checkedArray: [],
      pageInfo: {
        params: {
          curPage: 1,
          pageSize: 15,
          AgendaConcern: 0
        },
        list: [],
        postUrl: '/MyContactAction/myContactList.do'
      }
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    checked(val) {
      this.checkedArray = val
    },
    getList(isFirst) {
      if (this.pageType !== 'focus') {
        this.pageInfo.postUrl = '/agendaAction/removeAttentionBefShow.do'
      }
      this.$axios.pageData(this, isFirst, res => {
        if (this.pageType === 'focus') {
          this.pageInfo.list.map(item => {
            for (const i in this.checkedArray) {
              if (item.ID === this.checkedArray[i]) {
                item.isChecked = true
              }
              continue
            }
          })
        }
      })
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    focus() {
      const isFocus = this.pageType === 'focus'
      this.focusUpdate(isFocus, () => {
        this.storage.set('refresh-schedule-list', true)
        if (this.pageType !== 'focus') {
          this.getList(true)
        } else {
          window.history.back(-1)
        }
      })
    },
    loadMore() {
      this.getList(false)
    }
  }
}
</script>
<style scoped lang="scss">
#Knowledge {
  background: #fff;
}
/* 搜索框 */
.yh-search{
  position: relative;
}
.yh-search input{
  text-align: left;
  /*margin:0;*/
  // line-height: 68px;
  // height: 68px;
  color: #9E9E9D;
  font-size: 24px;
}
.yh-search .search-img{
  width: 40px;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
