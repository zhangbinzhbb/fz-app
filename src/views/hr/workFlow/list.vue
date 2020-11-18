<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <!--        <span class="yh-add-more" @click="$router.push({path:'/jobsNew'})">新增</span>-->
        <span class="yh-add-more" @click="openSearchMore">
          <img
            src="@/assets/images/icon/filter.png"
            alt="分类搜索"
            class="classify-search-more"
          >
        </span>
        <span class="yh-add-more" @click="$router.push({path:'/workFlowNew'})">
          <img
            src="@/assets/images/icon/add.png"
            alt="分类搜索"
            class="classify-search-add"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <!--提交按钮-->
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <form class="yh-search" action="" @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyword"
              type="search"
              placeholder="输入姓名/当前岗位/当前公司/面试官"
            >
            <van-icon name="search" class="searIcon" :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}"/>
          </form>
          <!-- tags -->
          <tags
            :list="selectList"
            :filter-list="filterList"
            key-code="label"
            @del-item="searchConfirm"
          />
          <div
            v-for="(item, index) in pageInfo.list"
            v-if="showBlank"
            :key="index"
            @click="isCanClick(item)"
          >
            <div class="tar-lv2-son">
              <p class="tar-lv2-son-title tital1">
                {{ item.userName | filterValue }}
                <span class="position">{{ item.jobName | filterValue }}</span>
                <span class="workStatus">{{ item.workStatus | filterValue }}</span>
              </p>
              <p class="tar-lv2-son-title title2">推荐公司
                <span>{{ item.groupName | filterValue }}</span>
              </p>
              <p class="tar-lv2-son-title title2">
                面试官
                <span>{{ item.interviewer | filterValue }}</span>
              </p>
              <p id="" class="tar-lv2-son-title title2">
                更新时间
                <span>{{ item.workTime | filterDate }}</span>
              </p>
              <p id="" class="tar-lv2-son-title title2">
                结果
                <span>{{ item.workResult | filterValue }}</span>
              </p>
            </div>
          </div>
          <!--<blank v-if="!showBlank"></blank>-->
        </div>
      </van-pull-refresh>
      <blank
        v-if="!pageInfo.isLoading && pageInfo.list && pageInfo.list.length == 0"
      />
      <bottom
        v-if="!pageInfo.isLoading && isLoadAll && pageInfo.list.length > 3"
      />
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
import Tags from '@/components/tags'
import { filterArr } from '@/utils/common.js'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half'),
    Tags
  },
  filters: {
    filterDate(val) {
      if (val!='null' && val === '') {
        return
      }
      // const arr = val.replace(/-/g, '/')
      return val.replace(/-/g, '/')
    },
    filterValue: function(val) {
      if (val) {
        return val
      } else {
        return '--'
      }
    }
  },
  data() {
    return {
      isLoading: false,
      catTitle: '招聘流程',
      isShow: false,
      isShow1: false,
      showBlank: true,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          keyword: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/workSheet/list'
      },
      filterList: [
        {
          name: '当前状态',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        },
        {
          name: '面试结果',
          subList: [],
          labelName: 'label',
          labelId: 'value'
        }
      ],
      selectList: []
    }
  },
  created() {
    this.getList(true)
    this.getFilterList()
  },
  activated () {
    if (this.storage.get('refresh-workFlow-list')) {
      this.getList(true)
      this.storage.remove('refresh-workFlow-list')
    }
  },
  methods: {
    isCanClick(item) {
      if (item.workResult === '不通过') {
        this.Toast('该人选未通过，不可编辑')
      } else {
        this.$router.push({ path: '/workFlowDetail', query: { id: item.workId }})
      }
    },
    showToggle() {
      this.isShow = !this.isShow
      if (this.isShow === true) {
        this.isShow1 = false
        this.isShow2 = false
      }
    },
    showToggle1() {
      this.isShow1 = !this.isShow1
      if (this.isShow1 === true) {
        this.isShow = false
        this.isShow2 = false
      }
    },
    getFilterList() {
      // 当前状态
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2601'
        },
        res => {
          this.filterList[0].subList = res.data.options
        }
      )
      //    面试结果
      this.$axios.get(
        '/commonTCode/getCodeByParentId.do',
        {
          parentId: '2602'
        },
        res => {
          this.filterList[1].subList = res.data.options
        }
      )
    },
    openSearchMore() {
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

      this.pageInfo.params.workStatus = this.filterList[0].checkIds
      this.pageInfo.params.workResult = this.filterList[1].checkIds
      this.getList(true)
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.workStatus = ''
      this.pageInfo.params.workResult = ''
      this.getList(true)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          if (this.pageInfo.list.length > 0) {
            this.showBlank = true
          } else {
            this.showBlank = false
          }
        },
        err => {
          this.isLoading = false
        }
      )
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    }
  }
}
</script>

<style scoped lang="scss">
  .right-icon{
    margin-right:25px!important;
    .classify-search-more {
      width: 44px;
      margin-right:25px;
    }
    .classify-search-add {
      width: 39px;
      margin-bottom:5px
    }
  }

.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
.titaltop {
  text-align: center;
  color: #000;
  font-size: 32px;
  padding: 26px;
  background: #fff;
}
.buttop {
  padding: 20px 0;
  text-align: center;
  font-size: 24px;
  background: #fff;
  .iconbut {
    transform: rotate(90deg);
    font-size: 22px;
    line-height: 24px;
    width: 50px;
  }
}
.butcon {
  border-left: 2px solid#ccc;
  box-sizing: border-box;
}
.butcontent {
  width: 94.5%;
  position: fixed;
  background: #fff;
  padding: 20px 18px 20px 18px;
  border-top: 2px solid#dfdcdc;
  border-bottom: 2px solid#dfdcdc;
  z-index: 100px;
  .butbox {
    .but {
      font-size: 24px;
      padding: 7px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
      float: left;
      margin: 0 10px 25px 12px;
    }
  }
}
.tar-lv2-son {
  overflow: hidden;
  padding:20px 40px;
  padding-bottom:-5px;
  background-color: #fff;
  border-bottom: 18px solid #F8F8F8;
  .tital1 {
    width:100%;
    font-size: 28px;
    color: #4C4C4C;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    margin-bottom: 35px;
    .position{
      font-size:26px;
      font-weight:400;
      color:rgba(76,76,76,1);
      margin:0px;
      margin-left:2px;
    }
    .workStatus{
      float:right;
      /*width:136px;*/
      /*height:39px;*/
      background:rgba(248,141,38,0.14);
      font-size:24px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(237,125,17,1);
      /*line-height:33px;*/
      margin:0px;
      text-align: center;
      margin-top:3px;
      padding:3px 8px;
    }
    span{
      display: inline-block;
    }
  }
  p {
    width:48%;
    text-align: left;
    font-size: 26px;
    color: rgba(68, 68, 68, 1);
    line-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    display: inline-block;
    span{
      display: block;
    }
  }
  .title2{
    font-size:24px!important;
    font-family:PingFangSC-Medium,PingFang SC;
    font-weight:500;
    color:rgba(158,158,157,1) !important;
    line-height:33px;
    height:80px;
    margin-bottom:25px;
    span{
      font-size:28px!important;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:600;
      color:#4C4C4C;
      line-height:40px;
      margin-top:7px
    }
  }
  img {
    /*position: absolute;*/
    /*right: 22px;*/
    /*top: 36px;*/
    /*float: right;*/
    /*width: 128px;*/
    /*height: 115px;*/
    /*border-radius: 10px;*/
  }
  span {
    font-size: 21px;
    color: #888888;
    margin: 20px 20px 0px 0;
    z-index: 50;
    .box {
      width: 25px;
      height: 25px;
      /*background: rgba(183, 0, 7, 1);*/
      float: left;
      margin-right: 15px;
      img {
      }
    }
  }
  #time {
    display: block;
    text-align: left;
    margin-top: 7px;
  }
}
.tar-lv2-son .title2:nth-of-type(4),
.tar-lv2-son .title2:nth-of-type(5){
  margin-bottom:0px;
}
  .yh-search {
    overflow: visible!important;
    position: relative;
    padding:30px;
    margin-bottom: 0;
    input {
      text-align: left!important;
      padding-left: 86px;
      margin:0;
      height:68px;
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
      &::before{
        content:""
      }
    }
  }
</style>
