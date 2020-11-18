<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="管理基金"/>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div v-for="(item,index) in pageInfo.list" :key="index" class="fund-item" @click="toFundRouter(item)">
            <div class="tit">{{ item.fundName }}</div>
            <van-icon name="arrow" class="a-arrow-right"/>
            <div class="colums">
              <span class="item">目标规模(亿元)
                <p class="btm"><span v-if="item.planAmountDisplay">￥</span>{{ item.planAmountDisplay || '--' }}</p>
              </span>
              <span class="item">认缴规模(亿元)
                <p class="btm"><span v-if="item.currentAmountDisplay">￥</span>{{ item.currentAmountDisplay || '--' }}</p>
              </span>
              <span class="item">实缴规模(亿元)
                <p class="btm"><span v-if="item.raiseAmountDisplay">￥</span>{{ item.raiseAmountDisplay || '--' }}</p>
              </span>
              <span class="item">实缴比例
                <p class="btm">{{ item.raiseCurrent || '--' }}</p>
              </span>
              <span class="item">项目个数
                <p class="btm">{{ item.projNum || '--' }}</p>
              </span>
              <span class="item">投资金额(万元)
                <p class="btm"><span v-if="item.investAmount">￥</span>{{ item.investAmount | investAmountFilters }}</p>
              </span>
            </div>
          </div>
      </div></van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&pageInfo.list.length>3"/>
      <loading-box v-model="showLoading"/>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    investAmountFilters(value) {
      if (!value) {
        return '--'
      }
      const str = value.split(' ')
      return str[0]
    }
  },
  data() {
    return {
      pageInfo: {
        params: {
          length: 10,
          pageSize: 10,
          currPage: 1,
          groupId: this.$route.query.groupId,
          pkId: this.$route.query.pkId
        },
        list: [],
        postType: 'get',
        postUrl: '/fundInfoList' // 管理基金'
      },
      isLoading: false,
      showLoading: true,
      isLoadingAll: false
    }
  },
  created() {
    this.getList(true)
  },
  activated() {},
  methods: {
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(this, isFirst, res => {
        this.isLoading = false
        this.showLoading = false
        this.isLoadingAll = res.isAll
      })
    },
    loadMore() {
      if (this.isLoadingAll) return
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    toFundRouter(item) {
      this.$axios.get('/fundInfoListByUserId', {
        fundId: item.fundId,
        keyWord: '',
        currPage: 1,
        length: 10
      }, res => {
        this.storage.set('fundDetail', res.data[0])
        this.$router.push({ path: '/fund', query: { id: item.fundId }})
      })
    }
  }
}
</script>
<style scoped lang="scss">
.fund-item {
  background: white;
  margin-bottom: 20px;
  .tit {
    width: 640px;
    margin: 0 auto;
    display: inline-block;
    font-size: 28px;
    font-weight: 600;
    color: rgba(78, 78, 78, 1);
    line-height: 40px;
    padding-left: 40px;
    box-sizing: border-box;
    padding-top: 30px;
  }
  .a-arrow-right {
    float: right;
    font-size: 31px;
    color: rgba(76, 76, 76, 0.5);
    margin-top: 40px;
    margin-right: 40px;
  }
}
.colums {
  text-align: center;
  margin-top: 30px;
  .item {
    display: inline-block;
    width: calc(50% - 50px);
    position: relative;
    font-size: 24px;
    font-weight: 500;
    color: rgba(158, 158, 157, 1);
    line-height: 33px;
    text-align: left;
    margin-bottom: 30px;
    vertical-align: top;
    .btm {
      display: block;
      color: #4c4c4c;
      margin-top: 10px;
      font-size: 28px;
      font-weight: 500;
      color: rgba(76, 76, 76, 1);
      line-height: 40px;
    }
  }
}
</style>
