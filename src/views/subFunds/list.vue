<template>
  <div id="Knowledge" class="has-comment">
    <headerx cat-title="子基金管理"/>
    <!--搜获-->
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <form class="yh-search yh-mb-16" action @submit.prevent="search">
            <img src="@/assets/images/icon/search-img.png" class="search-img">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyWord"
              type="search"
              placeholder="搜索"
            >
          </form>
          <div
            v-for="(item ,index) in pageInfo.list"
            :key="index"
            @click="$router.push({path:'/subfund',query:{id:item.projId, projName: item.projObjectName, subFundAmontDisplay: item.subFundAmontDisplay, currentAmountDisplay: item.currentAmountDisplay}})"
          >
            <van-row class="bottomborder">
              <van-col span="24" class="con">
                <p class="h1">{{ item.projObjectName | filterValue }}</p>
                <div class="colums">
                  <span class="item">
                    出资主体
                    <p class="btm">{{ item.inveName!=null?item.inveName:'--' }}</p>
                  </span>
                  <span class="item">
                    子基金规模
                    <p class="btm">{{ filterMoneyY(item.subFundAmontDisplay) || '--' }} 亿元</p>
                  </span>
                  <span class="item">
                    认缴金额
                    <p class="btm">{{ filterMoneyY(item.currentAmountDisplay) || '--' }} 亿元</p>
                  </span>
                </div>
                <!-- <p>出资主体：{{ item.inveName!=null?item.inveName:'--' }}</p>
                <p>子基金规模：{{ item.subFundAmontDisplay }} 认缴金额：{{ item.currentAmountDisplay }}</p> -->
                <div class="rightmiss">
                  <div v-if="item.mangerModel" class="but1">{{ item.mangerModel.memberName || '' }}</div>
                  <div class="but2">{{ item.projStatusName || '' }}</div>
                </div>

              </van-col>
            </van-row>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length>5"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  filters: {
    filterValue(val) {
      if (val) {
        return val
      } else {
        return '--'
      }
    },
    filterMoney(val) {
      if (val) {
        return val.replace('人民币', '-￥').split('-').reverse().join(' ') || val.replace('美元', '-$').split('-').reverse().join(' ')
      } else {
        return '--'
      }
    }
  },
  data() {
    return {
      isLoading: false,
      popupVisible: false,
      catTitle: '子基金管理',
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          length: 10
        },
        list: [],
        postUrl: '/getSubFundList',
        postType: 'get'
      }
    }
  },
  created() {
    this.getList()
  },
  activated() {
    if (this.storage.get('refresh-subFunds-list')) {
      this.getList(true)
      this.storage.remove('refresh-subFunds-list')
    }
  },
  methods: {
    // 换算为亿
    filterMoneyY(value) {
      const k = 100000000
      let rmAndA = '￥'
      if (value.indexOf('人民币') != -1) {
        rmAndA = '￥'
      } else if (value.indexOf('美元') != -1) {
        rmAndA = '$'
      }
      if (value.indexOf('万元') != -1) {
        const value1 = parseFloat(value) * 10000
        if(value1 == 0){
          value = 0
        }else{
          value = ((value1 / k).toFixed(2))
        }
      } else if (value.indexOf('亿元') != -1) {
        const value2 = parseFloat(value)
        value = ((value2).toFixed(2))
      }
      return rmAndA + value
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.$set(this, 'list', res.list)
          this.isLoading = false
        },
        err => {
          this.isLoading = false
        }
      )
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      // this.Toast('刷新成功')
      this.getList(true)
    }
  }
}
</script>
<style scoped lang="scss">
.mail-search {
  background: #fff;
  padding: 20px 15px 14px 15px;
  overflow: hidden;
  height: 70px;
  margin-bottom: 20px;
  .seachForm {
    input {
      width: 605px;
      height: 60px;
      display: block;
      border: none;
      text-align: center;
      font-size: 26px;
      background-color: #f5f5f5;
      border-radius: 12px;
    }
  }
}
.van-row {
  background: #fff;
  padding: 20px;
  .Head {
    width: 72px;
    height: 72px;
    border-radius: 20%;
    img {
      width: 100%;
    }
    span {
      display: inline-block;
      width: 100%;
      height: 100%;
      font-size: 26px;
      color: white;
      text-align: center;
      line-height: 74px;
      border-radius: 100%;
    }
  }
  .con {
    position: relative;
    .h1 {
      font-size: 28px;
      font-weight: 500;
      color: #4c4c4c;
      width:60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .rightmiss{
      position: absolute;
      right: 0px;
      top: 0px;
      .but1 {
        font-size:22px;
        font-weight:400;
        line-height:30px;
        display: inline-block;
        padding: 4px 8px;
        color:#3195FC;
        background:rgba(49,149,252,0.23);
        vertical-align: top;
      }
      .but2 {
        font-size:22px;
        font-weight:400;
        line-height:30px;
        display: inline-block;
        padding: 4px 8px;
        color:#ed7d11;
        background:rgba(248,141,38,.14);
        vertical-align: top;
      }
    }

  }
}
.bottomborder {
  padding: 30px 40px;
  margin-bottom: 20px;
  /*position: relative;*/
}
  .colums{
    font-size:26px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:37px;
    text-align: center;
    margin-top: 40px;
    .item{
      display: inline-block;
      width: 32%;
      position: relative;
      vertical-align: top;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
      }
      &:after{
        content:'|';
        position: absolute;
        top: 20px;
        right: 0;
        color: #D7D7D7;
      }
      &:last-child:after{
        content: none;
      }
    }
  }
</style>
