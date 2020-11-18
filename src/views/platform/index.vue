<template>
  <div class="">
    <headerx cat-title="平台管理"/>
    <div class="comment-content no-comment" style="height:100%;">
      <div style="height:100%;">
        <form class="yh-search yh-mb-16" action @submit.prevent="search">
          <img src="@/assets/images/icon/search-img.png" class="search-img">
          <input
            ref="searchInput"
            v-model="pageInfo.params.keyword"
            type="search"
            placeholder="搜索"
          >
        </form>
        <div
          v-for="(item,index) in pageInfo.list"
          :key="index"
          class="item"
          @click="$router.push({path:'platform',query:{entId:item.entId,pkId:item.pkId,groupId:item.platCode,platName:item.platShortName}})">
          <div class="tit">
            <div class="name">
              <div class="img-head">
                <img src="@/assets/images/platform/plat-logo.png">
              </div>
              {{ item.platShortName || '--' }}
            </div>
            <div v-if="item.platType " class="tags">
              <span>{{ item.platType }}</span>
            </div>
          </div>
          <div class="colums">
            <span class="item">
              法定代表人
              <a href="" class="btm" style="color: #4c4c4c;">{{ item.operName ||'--' }}</a>
            </span>
            <span class="item">
              设立日期
              <template v-if="item.stepDate">
                <p class="btm">{{ item.stepDate }}</p>
              </template>
              <template v-else><p style="color: #4c4c4c;">--</p></template>
            </span>
            <span class="item">
              认缴资本
              <template v-if="item.registCapi">
                <p class="btm">￥{{ item.registCapi | amountFilter }}万元</p>
              </template>
              <template v-else><p style="color: #4c4c4c;">--</p></template>
            </span>
          </div>
        </div>
        <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  filters: {
    amountFilter(value) {
      if (!value) return
      const index = value.indexOf('万')
      const n = value.substr(0, index)
      const result = n
      return result
    }
  },
  data() {
    return {
      isLoading: false,
      pageInfo: {
        params: {
          curPage: 1,
          pageSize: 100,
          length: 1000,
          keyword: '',
          endTime: '',
          platType: '',
          startTime: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/platformInfo/list'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {})
    },
    search() {
      this.getList(true)
    }
  }
}
</script>
<style>
.tab-box{
  width: 260px !important;
}
.tabs-content .tab-box:nth-child(3n+3) {
  margin-right: 30px !important;
}
</style>

<style scoped lang="scss">
.refresh-box{
  min-height: calc(100vh - 120px)
}
.yh-search{
  background: #f5f5f5 !important;
}
.classify-search {
  width: 44px;
}
.limit-name {
  width: 80%;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item{
  background: white;
  margin-bottom: 20px;
  padding-bottom: 10px;
  .tit{
    font-size:30px;
    font-weight:800;
    color:rgba(76,76,76,1);
    padding: 40px 40px 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      max-width: 720px;
      .img-head{
        width: 75px;
        height: 58px;
        display: block;
        overflow: hidden;
        position: relative;
        // border: 1px solid #000;
        img{
          position: absolute;
          display: block;
          max-width: 100%;
          max-height: 100%;
          top: 0px;
          left: 0px;
          right: 0px;
          bottom: 0px;
          margin: auto;
        }
      }
    }
    .tags{
      span{
        color:rgba(237,125,17,1);
        background:rgba(248,141,38,0.14);
        font-weight:400;
        padding: 4px 10px;
        font-size: 28px;
      }
    }
  }
  .plat{
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    padding: 0 40px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: 20px;
    .right{
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      font-size:24px;
      font-weight:400;
      min-width: 260px;
      div{
        padding: 4px 10px;
        font-size: 28px;
      }
      .num{
        color: #3195fc;
        background: rgba(49,149,252,.23);

      }
      .status{
        color:rgba(237,125,17,1);
        background:rgba(248,141,38,0.14);
        margin-left: 10px;
      }
    }

    .label{
      font-size:26px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:37px;
      display: block;
    }
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
      width: 30%;
      position: relative;
      vertical-align: top;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
        font-size:28px;
        padding: 0 10px;
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
}
.bottomborder {
  border-bottom: 2px solid rgba(222, 222, 222, 1);
}
.mint-popup-right {
  height: 100%;
  width: 559px;
}
</style>
