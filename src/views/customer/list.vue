<template>
  <div class="has-comment">
    <headerx cat-title="客户">
      <template slot="right">
        <span class="yh-add-more" @click="handleClick">
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
        >
          <form class="yh-search yh-mb-16" action @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.searchId"
              type="search"
              placeholder="搜索"
            >
            <van-icon name="search" class="searIcon" :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}"/>
          </form>
          <!-- tags -->
          <tags
            :list="selectList"
            :filter-list="filterList"
            key-code="LOC_NAME"
            @del-item="searchConfirm"
          />
          <div
            v-for="(item, index) in Datelist"
            :key="index"
            @click="
              $router.push({
                path: '/customerDetail',
                query: { PK_ID: item.PK_ID, CUST_TYPE: item.CUST_TYPE }
              })
            "
          >
            <van-row class="bottomborder">
              <i class="van-icon van-icon-arrow van-cell__right-icon"/>
              <van-col span="22">
                <p>{{ item.CUST_NAME }}</p>
                <p><span class="label">{{ item.orgName }}</span></p>
              </van-col>
            </van-row>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading && Datelist && Datelist.length == 0"/>
      <bottom v-if="!pageInfo.isLoading && isLoadAll && Datelist.length >5"/>
    </div>
    <search-filter
      ref="rightPopup"
      :filter-list="filterList"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>
<script>
import { filterArr } from '@/utils/common'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half'),
    'Tags': () => import('@/components/tags/index')
  },
  data() {
    return {
      isLoading: false,
      popupVisible: false,
      catTitle: '客户',
      Datelist: [],
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10
        },
        list: [],
        postUrl: '/CustomerViewAction/customerViewList.do'
      },
      filterList: [
        {
          name: '行业',
          subList: [],
          labelName: 'CODE_NAME',
          labelId: 'CODE_VALUE'
        },
        {
          name: '地域',
          subList: [],
          labelName: 'LOC_NAME',
          labelId: 'LOC_ID'
        },
        {
          name: '省份',
          subList: [],
          labelName: 'LOC_NAME',
          labelId: 'LOC_ID'
        },
        {
          name: '江苏',
          subList: [],
          labelName: 'LOC_NAME',
          labelId: 'LOC_ID'
        },
        {
          name: '苏州',
          subList: [],
          labelName: 'LOC_NAME',
          labelId: 'LOC_ID'
        }
      ],
      // tag-list-test
      selectList: []
      // deatillist: [],
      // deatillist1: []
    }
  },
  created() {
    this.getList()
    this.getFilterList()
  },
  methods: {
    getFilterList() {
      this.$axios.get(
        '/BaseCommonAction/getIndustryAndLocation.do',
        {},
        res => {
          this.filterList[0].subList = res.dataContent.industryList
          this.filterList[1].subList =
            res.dataContent.localtionList[0][this.filterList[1].name]
          this.filterList[2].subList =
            res.dataContent.localtionList[1][this.filterList[2].name]
          this.filterList[3].subList =
            res.dataContent.localtionList[2][this.filterList[3].name]
          this.filterList[4].subList =
            res.dataContent.localtionList[3][this.filterList[4].name]
        }
      )
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
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
        item.checkIds = getChecked(item.subList, item.labelId)
      })
      // tags-select-fiter
      this.selectList = Array.from(new Set(filterArr(this.filterList)))
      this.selectList.forEach(element => {
        element.label = element.CODE_NAME || element.LOC_NAME
        element.value = element.CODE_ID || element.LOC_ID
      })
      this.pageInfo.params.country = this.filterList[1].checkIds
      // console.log('country1', this.filterList[1].checkIds)
      this.pageInfo.params.industry = this.filterList[0].checkIds
      // console.log('country2', this.filterList[1].checkIds)
      // 将checkIds存放在arr
      let stringId = ''
      if (this.filterList[2].checkIds) {
        stringId = this.filterList[2].checkIds
      }
      if (this.filterList[3].checkIds) {
        stringId += ',' + this.filterList[3].checkIds
      }
      if (this.filterList[4].checkIds) {
        stringId += ',' + this.filterList[4].checkIds
      }

      const arrFilter = stringId.split(',')
      this.pageInfo.params.address = arrFilter.filter(item => item).join(',')

      this.getList(true)
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.country = ''
      this.pageInfo.params.address = ''
      this.pageInfo.params.industry = ''
      this.getList(true)
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
  /deep/ .screen-button button{
    width:278px!important;
  }
  .classify-search {
    width: 44px;
    /*margin-right:25px;*/
  }
  .yh-add-more-search {
    font-size: 30px;
  }
  .van-row {
    background: #fff;
    padding: 40px;
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
    p:nth-child(1) {
      font-size:28px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(76,76,76,1);
      line-height:45px;
    }
    p:nth-child(2) {
      font-size:28px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(158,158,157,1);
      line-height:40px;
      margin-top:10px;
      span.label{
        font-size:22px;
        font-weight:400;
        padding:3px 8px;
        line-height:40px;
        color: #03AA4A!important;
        background: rgba(58,204,120,0.23);
      }
    }
  }
  .bottomborder {
    border-bottom: 18px solid #F8F8F8;
    position: relative;
    i{
      position: absolute;
      top: 43px;
      right: 36px;
      font-size: 40px;
      color: rgba(76,76,76,0.5);
    }
  }
  .yh-search {
    overflow: visible!important;
    position: relative;
    padding:30px;
    margin-bottom: 0;
    background:#F8F8F8!important;
    input {
      text-align: left!important;
      padding-left: 86px;
      margin:0;
      height:68px;
      color:#9E9E9D;
      font-size:24px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
    }
    .searIcon {
      position: absolute;
      top: 45px;
      left: 49px;
      background-repeat: no-repeat;
      /*font-size: .426667rem;*/
      width: 40px;
      height: 40px;
      background-size: 100% 100%;
      &::before{
        content:""
      }
    }
  }
</style>
