<template>
  <div class="newsarticle has-comment">
    <headerx :cat-title="catTitle">
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
    <div class="comment-content no-comment yh-new-list">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <form class="yh-search" action @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyWords"
              type="search"
              placeholder="搜索"
            >
            <van-icon :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="search" class="searIcon"/>
          </form>
          <tags
            :filter-list="filterList"
            :list="selectList"
            key-code="columnName"
            @del-item="searchConfirm"
          />
          <div
            v-for="(item,index) in list"
            :key="index"
            class="tar-lv2-item"
            @click="item.viewCount++;$router.push({path:'/knowledgeDetail',query:{id:item.knowledgeId}})"
          >
            <div class="tar-lv2-son">
              <p class="tar-lv2-son-title" v-html="item.knowledgeTitle"/>
              <span class="fl">{{ item.releaseBy }} <span> {{ item.releaseDt.replace(/-/g, ".") }} </span></span>
              <div class="fr">
                <div class="lf">
                  <img src="@/assets/images/news/view1.png">
                  <span>{{ item.viewCount }}</span>
                </div>
                <div :style="{backgroundImage:'url('+require('@/assets/images/news/msg2.png')+')'}" class="rightmiss">
                  <span>{{ item.commentCount }} </span>
                </div>
              </div>
              <i v-if="item.viewCount==0" />
            </div>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!==0"/>
    </div>
    <search-filter
      ref="rightPopup"
      :filter-list="filterList"
      class="filter-list"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>
import { filterArr } from '@/utils/common.js'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half'),
    'Tags': () => import('@/components/tags/index')
  },
  data() {
    return {
      isLoading: false,
      popupVisible: false,
      catTitle: '知识分享',
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          searchId: null,
          columnIds: ''
        },
        list: [],
        postUrl: '/knowledgeInfoAction/classSearch.do'
      },
      list: [],
      filterList: [
        {
          name: '全部',
          subList: [],
          labelName: 'columnName',
          labelId: 'columnId'
        },
        {
          name: '法律政策',
          subList: [],
          labelName: 'columnName',
          labelId: 'columnId'
        },
        {
          name: '行政报告',
          subList: [],
          labelName: 'columnName',
          labelId: 'columnId'
        }
      ],
      // tag-list-test
      selectList: [],
      showLoading: true,
      isLoadingAll: false
    }
  },
  created() {
    this.getList(true)
    this.getFilterList()
  },
  activated() {
    if (this.storage.get('refresh-ki-list')) {
      this.storage.remove('refresh-ki-list')
      this.getList(true)
    }
  },
  mounted() {},
  methods: {
    getFilterList() {
      this.$axios.get('/knowledgeClassAction/getKnowledgeClass.do', {}, res => {
        this.filterList[0].subList = res.dataContent[0].classList
        this.filterList[1].subList = res.dataContent[1].classList
        this.filterList[2].subList = res.dataContent[2].classList
      })
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
    },
    searchConfirm() {
      this.pageInfo.params.columnIds = ''
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
      // console.log(this.selectList)
      this.selectList.forEach(element => {
        element.label = element.columnName
        element.value = element.columnId
      })
      this.pageInfo.params.columnIds = this.filterList[0].checkIds
      if (this.filterList[1].checkIds) {
        this.pageInfo.params.columnIds += ',' + this.filterList[1].checkIds
      }

      if (this.filterList[2].checkIds) {
        this.pageInfo.params.columnIds += ',' + this.filterList[2].checkIds
      }
      this.getList(true)
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.columnIds = ''
      this.getList(true)
    },
    close: function() {
      this.popupVisible = false
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.showLoading = false
          this.isLoadingAll = res.isAll
          this.$set(this, 'list', res.list)
        }
      )
    },
    loadMore() {
      if (this.isLoadingAll) return
      this.getList(false)
    },
    onRefresh() {
      // this.Toast('刷新成功')
      this.getList(true)
    }
  }
}
</script>
<style lang="scss">
  .classify-search {
      width: 44px;
      margin-top: 10px;
  }
  .tar-lv2-item{
    padding: 40px;
    padding-left:25px;
    background-color: #fff;
    margin: 0 0 18px 0;
    .tar-lv2-son {
      padding: 0;
      margin: 0;
      padding-left:15px;
      .tar-lv2-son-title{
        font-size: 28px;
        line-height: 45px;
        margin:0 0 10px 0;
        color: #4C4C4C;
        font-weight: bold;
      }
      img {
        position: absolute;
        right: 0;
        top: 0;
        width: 128px;
        height: 115px;
        border-radius: 10px;
        object-fit: cover;
      }
      span {
        font-size: 26px;
        span{
          margin-left:13px;
        }
      }
      i {
        width: 10px;
        height: 10px;
        background: rgba(183, 0, 7, 1);
        border-radius: 50%;
        position: absolute;
        top: 6px !important;
        left: 0px !important;
      }
    }
  }
  /*.fr {*/
  /*  padding-right:15px;*/
  /*  color: #BCC3D2!important;*/
  /*  img {*/
  /*    width: 30px!important;*/
  /*    height: 20px!important;*/
  /*    position: relative!important;*/
  /*    top: 2px!important;*/
  /*    right: 0!important;*/
  /*    float: none!important;*/
  /*    margin-right:1px;*/
  /*    &:nth-of-type(2){*/
  /*      margin-left: 10px;*/
  /*      width: 26px!important;*/
  /*      height: 18px!important;*/
  /*    }*/
  /*  }*/
  /*}*/
  .fr {
    /*<!--margin-top: -40px;-->*/
    position: absolute;
    bottom: 0px;
    right: 0;
    div.lf{
      display: inline-block;
      font-size: 24px;
      color: #BCC3D2;
      span{
        display: inline-block;
        color: #bcc3d2;
        margin-top: -1px;
        display: inline-block;
        margin-bottom: 4px;
      }
    }
    img {
      width: 33px!important;
      height: 22px!important;
      position: relative!important;
      top: 0px!important;
      right: 0!important;
      float: none!important;
      vertical-align:text-top;
      margin-top: 8px;
      margin-right:0!important;
      display: inline-block;
      &:nth-of-type(2){
        margin-left: 42px;
      }
    }
    .rightmiss{
      /*img{*/
      /*width: 36px!important;*/
      /*height: 30px!important;*/
      display: inline-block;
      background-repeat: no-repeat;
      background-size: 28px 20px;
      padding-left: 30px;
      /*padding-top: 14px;*/
      font-size: 0px;
      /*vertical-align: bottom;*/
      line-height: 18px;
      margin-bottom: 2px;
      >span{
        margin-left:5px;
        color: #bcc3d2!important;
        /*padding-top: 3px;*/
        display: inline-block;
        /*line-height: 26px;*/
      }
      /*}*/
    }
  }
  .mint-popup-right {
    height: 100%;
    width: 559px;
  }
  .menu-title {
    width: 100%;
    font-size: 32px;
    text-align: left;
    margin: 20px 0 20px 20px;
  }
  .screen-list {
    overflow: hidden;
    border-radius: 8px;
    float: left;
    width: 160px;
    height: 56px;
    background-color: #f0f2f5;
    font-size: 24px;
    line-height: 56px;
    margin: 10px 0px 10px 20px;
    text-overflow: ellipsis;
  }
  .screen-button {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    .screen-reset {
      color: #000;
    }
    .screen-go {
      color: #fff !important;
      background-color: #b70007;
    }
    button {
      font-size: 32px;
      border: none;
      float: left;
      width: 50%;
      height: 94px;
    }
  }
  .mint-popup {
    z-index: 1000000 !important;
  }
  .list-tags {
    background-color: #fff;
    .slide-menus {
      display: flex;
      flex-wrap: wrap;
      padding: 10px 10px;

      .content {
        display: flex;
        flex-wrap: wrap;

        li {
          display: flex;
          align-items: center;
        }
      }
    }
    .swiper-wrapper {
      .swiper-slide {
        display: flex;
        align-items: center;
        width: 100px;
        height: 65px;
        line-height: 65px;
      }
    }
  }
  /* 搜索框 */
  .yh-search {
    overflow: visible !important;
    position: relative;
    padding: 30px;
    margin-bottom: 0;
    background:#F8F8F8!important;
    input {
      text-align: left !important;
      padding-left: 86px;
      margin: 0;
      height: 68px;
    }

    .searIcon {
      position: absolute;
      top: 42px;
      left: 49px;
      background-repeat: no-repeat;
      font-size: .426667rem;
      width: 45.5px;
      height: 45.5px;
      background-size: 100% 100%;

      &::before {
        content: ""
      }
    }
  }
  .yh-search .search-img{
    width: 40px;
    position: absolute;
    left: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  .filter-content{
    .tit{
      color: #333333;
      font-weight: bold;
    }
    .box{
      span{
        height:72px;
        border-radius:4px;
        border:1px solid #e1e1e1;
        padding:16px 40px ;
        width: auto !important;
        font-size: 28px !important;
        color: #333333;
        background: #fff !important;
      }
    }
  }
</style>
