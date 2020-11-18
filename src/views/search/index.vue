<template>
  <div :class="{'grey':!showHistory}" class="search-page has-comment">
    <headerx page-type="search">
      <template slot="title">
        <form action @submit.prevent="getSearch">
          <input
            ref="searchInput"
            v-model.trim="searchId"
            type="search"
            class="top-search"
            placeholder="搜索输入关键字"
          >
        </form>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <!--搜索历史-->
      <div v-if="showHistory" class="Search-history">
        <dl>
          <dt>搜索历史</dt>
          <dd v-for="(item,index) in searchHistory" :key="index" @click="searchId=item;getSearch()">
            <span>{{ item }}</span>
          </dd>
          <div v-if="searchHistory.length" class="yh-small-btn">
            <button class="search-go" @click="clearHistory()">
              <p>
                <img src="@/assets/images/icon/trash.png" alt>清空历史搜索
              </p>
            </button>
          </div>
        </dl>
      </div>
      <!-- 搜索结果 -->
      <div v-if="!showHistory&&(list.projList.length||list.otherList.length)" class="searchlist">
        <List :list="list"/>
      </div>
      <blank v-if="!showHistory&&list.otherList.length===0&&list.projList.length===0"/>
    </div>
  </div>
</template>

<script>
import List from './list'
export default {
  components: {
    List
  },
  data() {
    return {
      showHistory: true,
      searchId: '',
      list: {}, // 返回数据
      searchHistory: this.getHistory()
    }
  },
  created() {},
  mounted() {
    this.$refs['searchInput'].focus()
    // this.$refs['input'].value = ''
  },
  methods: {
    getSearch() {
      this.$refs.searchInput.blur()
      if (this.searchId === '') {
        this.showHistory = true
        return
      }
      this.$axios.get(
        '/indexAction/search.do',
        { searchId: this.searchId },
        res => {
          this.list = res.dataContent
          // console.log(this.list)
          this.showHistory = false
          let isNewHistory = true
          // 判断搜索历史是否添加，遍历历史搜索，没有相关的搜索记录，并且搜索关键词不为空
          if (this.searchId && this.searchId !== '') {
            this.searchHistory.map(item => {
              if (item === this.searchId) {
                isNewHistory = false
              }
            })
          }
          if (isNewHistory) {
            this.searchHistory.push(this.searchId)
            this.storage.set('yh-seach-history', this.searchHistory)
          }
        }
      )
    },
    clearHistory() {
      this.searchHistory = []
      this.storage.remove('yh-seach-history')
    },
    getHistory() {
      return this.storage.get('yh-seach-history') || []
    }
  }
}
</script>

<style scoped lang="scss">
.search-page {
  background: white;
}
.grey {
  background: none;
}
.mint-searchbar-core {
  text-align: center;
}
.isNoData {
  img {
    width: 180px;
    padding-top: 50%;
  }
}
.Search-history {
  dl {
    height: 948px;
    text-align: left;
    color: #232326;
    background-color: #fff;
    dt {
      font-size: 28px;
      font-weight: bold;
      padding-left: 30px;
      padding: 25px 30px;
      border-bottom: 2px solid #f0f0f0;
    }
    dd {
      font-size: 26px;
      border-bottom: 2px solid #f0f0f0;
      padding-left: 30px;
      padding: 20px 30px;
    }
    .search-go {
      width: 500px;
      height: 75px;
      border: 2px solid #909295;
      border-radius: 50px;
      margin: 0 auto;
      display: block;
      background-color: #fff;
      margin-top: 50px;
      position: relative;
      p {
        height: 80px;
        line-height: 75px;
        padding-left: 70px;
        color: #686868;
        font-size: 28px;
        img {
          width: 35px;
          position: absolute;
          top: 20px;
          left: 145px;
          right: 0;
          bottom: 0;
        }
      }
    }
  }
}
.top-search {
  width: 600px;
  height: 55px;
  margin-top: 16px;
  margin-right: 0px;
  position: absolute;
  top: 0;
  right: 60px;
  border-radius: 30px;
  padding-left: 20px;
  box-sizing: border-box;
  color: #333;
  font-size: 26px;
  line-height: normal;
}
.titletop {
  background-color: #fff;
  width: 90%;
  margin: 15px auto;
  border-bottom: 2px solid #dfdfdf;
  padding: 25px 15px;
  p {
    width: 100%;
    font-size: 26px;
    text-align: left;
    color: #222222;
    margin-bottom: 20px;
    word-wrap: break-word;
  }
  span {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(136, 136, 136, 1);
    display: block;
    text-align: left;
    word-wrap: break-word;
  }
}
.searchlist {
  margin-top: 30px;
  .search-list {
    h2 {
      font-size: 36px;
    }
  }
}
</style>
