<template>
  <div class=""> <!-- has-comment -->
    <headerx cat-title="基金管理" page-type="back" @closeBack="backFunc" >
      <template slot="right">
        <span v-if="loginInfo.allFund==='1'" class="yh-add-more" style="position:relative;top:-2px" @click="handleClick">
          <img
            src="@/assets/images/icon/filter.png"
            alt="分类搜索"
            class="classify-search"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
          class="refresh-box"
        >
          <form class="yh-search yh-mb-16" action @submit.prevent="search">
            <img src="@/assets/images/icon/search-img.png" class="search-img">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyWord"
              type="search"
              placeholder="搜索基金名称"
            >
          </form>
          <tags
            :filter-list="filterList"
            :list="selectList"
            key-code="columnName"
            @del-item="searchConfirm"
          />

          <div v-for="(item,index) in Datelist" :key="index" class="item" @click="toFund(item)">
            <div class="tit">
              <div class="name">
                <div class="img-head">
                  <img :src="item.imageurl || require('@/assets/images/fund/not_reg.png')" alt="logo">
                </div>
                {{ item.fundName }}
              </div>
            </div>
            <div class="plat">
              <!-- <span class="label">{{ item.platPropName }}</span> -->
              <p class="proname">{{ item.mcName }}</p>
              <div class="right">
                <div v-if="item.fundCode" class="num">{{ item.fundCode }}</div>
                <div class="status">{{ getProjectStatus(item.fundSts,'FUNDSTATUS') }}</div>
              </div>
            </div>
            <div class="colums">
              <span class="item">
                设立日期
                <a href="" class="btm">{{ item.setupDt ||'--' }}</a>
              </span>
              <span class="item">
                项目数
                <template v-if="item.projNum">
                  <p class="btm">{{ item.projNum }}个</p>
                </template>
                <template v-else><p>--</p></template>
              </span>
              <span class="item">
                认缴规模
                <template v-if="item.currentAmountDisplay">
                  <p class="btm">{{ item.currentAmountDisplay }}亿元</p>
                </template>
                <template v-else><p>--</p></template>
              </span>
            </div>
          </div>
          <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0&&!isLoading" style="height: calc(100vh - 130px)"/>
          <bottom v-if="!pageInfo.isLoading&&isLoadAll&&Datelist.length>3&&!isLoading"/>
        </div>
      </van-pull-refresh>

      <loading-box v-model="isLoading"/>
    </div>
    <search-filter
      ref="rightPopup"
      :column="true"
      :filter-list="filterList"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>
<script>
import { filterArr } from '@/utils/common.js'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half')
  },
  data() {
    return {
      isLoading: true,
      Datelist: [],
      filterList: [
        {
          name: '所属平台',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '基金性质',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        }

      ],
      pageInfo: {
        params: {
          keyWord: '',
          currPage: 1,
          length: 10,
          platProp: '',
          groupId: ''
        },
        list: [],
        postType: 'get',
        postUrl: '/fundInfoListByUserId'
      },
      selectList: [],
      loginInfo: {}
    }
  },
  watch: {
    $route(to, from) {
      if (from.name === 'home' && to.name === 'fundsList') {
        this.selectList = []
        this.Datelist = []
        this.pageInfo.params.platProp = ''
        this.pageInfo.params.groupId = ''
        this.pageInfo.params.keyWord = ''
        this.getLoginInfo()
      }
    }
  },
  created() {
    this.getLoginInfo()
  },
  mounted() {},
  methods: {
    getLoginInfo() {
      this.$axios.get('/getMyLoginInfo',
        {},
        {},
        res => {
          if (res.allFund === '1') {
            this.getFilterList()
            this.getList(true)
          } else if (res.manageFund === '1') {
            this.pageInfo.params.groupId = res.groupId
            this.getList(true)
          } else {
            this.isLoading = false
          }
          this.loginInfo = res
        })
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.$set(this, 'list', res.list)
          this.Datelist = res.list
        },
        () => {
          this.isLoading = false
        }
      )
    },
    getFilterList() {
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do?',
        { parentId: 204 },
        res => {
          this.filterList[1].subList = res.data.options
        }
      )
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do?',
        { parentId: 266 },
        res => {
          this.filterList[0].subList = res.data.options
        }
      )
    },
    searchConfirm() {
      const getChecked = (list, keyWord) => {
        const arr = []
        list.map(item => {
          if (item.isChecked) {
            arr.push(item[keyWord])
          }
        })
        return arr.join()
      }
      this.filterList.map(item => {
        item.checkIds = getChecked(item.subList, 'value')
      })

      // tags-select-fiter
      this.selectList = Array.from(new Set(filterArr(this.filterList)))
      this.pageInfo.params.platProp = this.filterList[1].checkIds
      this.pageInfo.params.groupId = this.filterList[0].checkIds
      this.getList(true)
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.platProp = ''
      this.pageInfo.params.groupId = ''
      this.getList(true)
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    toFund(item) {
      this.storage.set('fundDetail', item)
      this.$router.push({ path: '/fund', query: { id: item.fundId }})
    },
    backFunc() {
      this.$router.replace({ path: '/' })
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
// .yh-search{
//   position: relative;
//   input{
//   text-align: left;
//   margin: 30px 0;
//   line-height: 68px;
//   height: 68px;
//   }
// }
// .yh-search .search-img{
//   width: 40px;
//   position: absolute;
//   left: 50px;
//   top: 50%;
//   transform: translateY(-50%);
// }
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
    .num{
      width:42px;
      height:42px;
      background:rgba(253,241,241,1);
      display: inline-block;
      border-radius: 100%;
      text-align: center;
      font-size:32px;
      font-weight:bold;
      color:rgba(182,0,5,1);
      box-sizing: border-box;
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
