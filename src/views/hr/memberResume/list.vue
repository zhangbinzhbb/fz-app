<template>
  <div class="has-comment">
    <!-- 分类筛选 -->
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
    <div class="comment-content no-comment">
      <!--提交按钮-->
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
              v-model="pageInfo.params.searchId"
              type="search"
              placeholder="公司/姓名/工作经历/职称/学历/学校/专业/婚育/证书/性别"
            >
            <van-icon :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="search" class="searIcon"/>
          </form>
          <!--tags-->
          <tags
            :list="selectList"
            :filter-list="filterList"
            key-code="NAME"
            @del-item="searchConfirm"
          />
          <div v-for="(item,index) in pageInfo.list" :key="index" style="background: #fff">
            <div class="tar-lv2-son tar-lv2-son-new van-row" >
              <div class="leftdismiss">
                <div class="pic" @click="avaClick(item)">
                  <img v-if="item.facePath && item.facePath!=''" :src="item.facePath" alt="">
                  <div v-else :style="{backgroundColor: item.color}" class="nameImg">{{ filterImg(item.trueName) }}</div>
                </div>
                <span class="name">{{ item.trueName }}</span>
              </div>
              <div class="rightdismiss" @click="toResume(item.personId)">
                <div class="company">
                  {{ item.fullDeptName || '--' }}
                </div>
                <div class="attendonDate" style="text-align:right;">
                  入职时间:<span>{{ item.attendonDate | filterDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length>5"/>
    </div>
    <search-filter
      ref="rightPopup"
      :flag-arr="flagArr"
      :filter-list="filterList"
      class="filter-list"
      page="mail"
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
    // more: () => import('@/components/more/index'),
    'search-filter': () => import('@/components/rightPopup/half'),
    Tags
  },
  filters: {
    filterDate(val) {
      if (val === '') {
        return '--'
      }
      const arr = val.replace(/-/g, '/')
      return arr
    }
  },
  data() {
    return {
      isLoading: false,
      flagArr: [],
      catTitle: '人员简历',
      isShow: false,
      isShow1: false,
      isShow2: false,
      showBlank: true,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 13,
          searchId: ''
        },
        list: [],
        // postType: 'postJson',
        postUrl: '/ehrCVAction/search.do'
      },
      filterList: [
        // {
        //   name: '性别',
        //   subList: [
        //     {
        //       NAME: '男',
        //       ID: '男'
        //     },
        //     {
        //       NAME: '女',
        //       ID: '女'
        //     }
        //   ],
        //   labelName: 'NAME',
        //   labelId: 'ID'
        // },
        {
          name: '公司',
          subList: [],
          labelName: 'NAME',
          labelId: 'ID'
        },
        {
          name: '部门',
          subList: [],
          labelName: 'NAME',
          labelId: 'ID'
        }
      ],
      selectList: []
    }
  },
  watch: {
    // '$route.name'(val) {
    //   (this.pageInfo = {
    //     params: {
    //       IS_PAGE: true,
    //       curPage: 1,
    //       pageSize: 13,
    //       searchId: ''
    //     },
    //     list: [],
    //     // postType: 'postJson',
    //     postUrl: '/ehrCVAction/search.do'
    //   })
    //   (this.selectList = [])
    //   this.pageInfo.params.ORGID = ''
    //   this.pageInfo.params.DEPTID = ''
    //   this.getList(true)
    // }
  },
  created() {
    this.getList(true)
    this.getFilterList()
    // console.log(this.pageInfo)
    this.searchConfirm()
  },
  activated() {
    if (this.storage.get('refresh-memberResume-list')) {
      this.getList(true)
      this.storage.get('refresh-memberResume-list')
      this.storage.remove('refresh-memberResume-list')
    }
  },
  methods: {
    avaClick(item) {
      XWalkFunction.startChatPrivate(item.employeeId)
    },
    toResume(id) {
      const page = '1'
      this.$router.push({
        path: '/dismissDetail',
        query: { id, page }
      })
    },
    filterImg: function(val) {
      if (val && val != '') {
        return val.substring(val.length - 1, val.length)
      }
    },
    handleClick() {
      this.$refs.rightPopup.showPopup()
    },
    getFilterList() {
      this.$axios.get('/MyContactAction/getOrgList.do', {}, res => {
        this.filterList[0].subList = res.dataContent
      })
    },
    searchConfirm(obj) {
      const getChecked = (list, keyWord) => {
        const arr = []
        list.map((item, index) => {
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
      // 新增条件
      if (obj !== undefined && obj.sindex === '0') {
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].sindex === 1) {
            this.selectList.splice(i, 1)
            i = i - 1
          }
        }
        this.flagArr = this.selectList
        this.$set(this.filterList[1], 'checkIds', '')
      }
      // this.pageInfo.params.gender = this.filterList[0].checkIds
      this.pageInfo.params.ORGID = this.filterList[0].checkIds
      this.pageInfo.params.DEPTID = this.filterList[1].checkIds
      this.getList(true)
    },
    searchReset() {
      this.selectList = []
      // this.pageInfo.params.ORGID = ''
      this.pageInfo.params.DEPTID = ''
      this.pageInfo.params.searchId = ''
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
      // (this.pageInfo = {
      //   params: {
      //     IS_PAGE: true,
      //     curPage: 1,
      //     pageSize: 13,
      //     searchId: ''
      //   },
      //   list: [],
      //   // postType: 'postJson',
      //   postUrl: '/ehrCVAction/search.do'
      // })
      this.getList(true)
    }
  }
}
</script>

<style scoped lang="scss">
  /deep/ .yh-header-x{
    z-index:200000000003!important;
  }
.classify-search {
  width: 44px;
  margin-top: 10px;
}
.labelsShow {
  text-align: left;
  background: #fff;
  border-bottom: 2px solid#dfdcdc;
  padding: 0 0 10px 8px;
  span {
    color: rgba(183, 0, 7, 1);
    border: 1px solid rgba(183, 0, 7, 1);
    font-size: 25px;
    padding: 10px;
    margin: 5px;
    display: inline-block;
    margin-right: 10px;
    /*font-weight: lighter;*/
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
  border-right: 2px solid#ccc;
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
.tar-lv2-son-new {
  display: flex;
  justify-content: space-between;
  padding:18px 40px 10px 40px!important;
  .leftdismiss {
    width:100px;
    margin-right:44px;
    padding-top:5px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .pic {
      width: 80px;
      height: 80px;
      img{
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      div{
        width:80px;
        height:80px;
        line-height: 80px;
        border-radius: 50%;
        text-align: center;
        font-size:30px;
        color:rgba(255,255,255,1);
      }
    }
    .name {
      margin-right: 0px;
      text-align: center;
      width: 100%;
      display: inline-block;
      vertical-align: top;
      margin-top: 10px;
      font-size: 24px;
      font-family: PingFangSC-Medium,PingFang SC;
      font-weight: 500;
      color: rgba(76,76,76,1);
      line-height: 33px;
    }
  }
  .rightdismiss {
    width: 90%;
    padding-top: 20px;
    padding-bottom: 10px;
    text-align:right;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .company{
      font-size:28px;
      padding-right:8px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(76,76,76,1);
    }
    .attendonDate {
      font-size:24px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(158,158,157,1);
      // line-height:33px;
      // padding-top: 34px;
      // margin-bottom:10px;
      span {
        margin-top: 0;
        margin-right: 0;
        padding:0 8px;
        font-size:24px;
      }
    }
    .deptName {
      font-size: 21px;
      color: #888888;
      /*margin-top: 10px;*/
      span{
        font-size:22px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(3,170,74,1);
        line-height:30px;
        padding:7px 12px;
        background:rgba(58,204,120,0.23);
        margin-right:14px;
        display: inline-block;
        margin-top:5px;
      }
      span:last-child{
        color:rgba(49,149,252,1);
        background:rgba(49,149,252,0.23);
      }
    }
  }
}
.tar-lv2-son {
  overflow: hidden;
  padding: 16px;
  background-color: #fff;
  border-bottom: 18px solid #f0f0f0;
  .tital1 {
    font-size: 33px;
    color: #000;
  }
  p {
    font-size: 26px;
    color: rgba(68, 68, 68, 1);
    // line-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    .position {
      font-size: 28px;
      color: #000;
    }
    .phone {
      font-size: 26px;
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
    // margin: 25px 22px 0px 0;
    // z-index: 50px;
  }
  #time {
    display: block;
    margin-top: 7px;
  }
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
