<template>
  <div class="has-comment">
    <headerx cat-title="我发起的"/>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
          <form class="yh-search yh-mb-16" action @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyword"
              type="search"
              placeholder="搜索"
            >
            <van-icon :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="search" class="searIcon"/>
          </form>
          <tags
            :list="selectList"
            :filter-list="filterList"
            key-code="label"
            @del-item="searchConfirm"
          />
          <van-row class="bottomborder tags">
            <div
              v-for="(item ,index) in subList"
              :key="index">
              <van-col>
                <p :class="[item.checked? 'active1':'']" span="6" @click="selected(item, index)" >{{ item.label }}</p>
              </van-col>
            </div>
          </van-row>
          <div
            v-for="(item ,index) in Datelist"
            :key="index">
            <van-row class="bottomborder">
              <van-col span="24" class="con">
                <div :style="{backgroundImage:'url('+require('@/assets/images/code/meeting.png')+')'}" class="limit-name" @click="goDetail(item.activityId)">
                  <p>{{ item.activityTitle }}</p>
                  <van-button v-if="item.activityStatue === '进行中'" type="info" size="small" class="statusBtn but2">进行中</van-button>
                  <van-button v-else-if="item.activityStatue === '未开始'" type="info" size="small" class="statusBtn1 but2">未开始</van-button>
                  <van-button v-else type="info" size="small" class="statusBtn2 but2">已结束</van-button>
                </div>
                <van-row class="row">
                  <van-col span="17">
                    <p @click="goDetail(item.activityId)">活动时间<span>{{ item.startTimeApp }} ~ {{ item.endTimeApp }}</span></p>
                    <p @click="goDetail(item.activityId)">活动地点<span>{{ item.meetingLoc }}</span></p>
                    <p @click="goDetail(item.activityId)">签到类型<span>{{ item.dataResourceName }}</span></p>
                  </van-col>
                  <van-col span="6">
                    <div class="cal" @click="goPeople(item.activityId)">
                      <span class="acPeople">{{ item.trueSign }}</span>/<span class="allPeople">{{ item.shouldSign }}</span>
                      <span class="explain">实到/应到</span>
                    </div>
                  </van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&Datelist.length>3"/>
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
// import Tags from '@/components/tags'
import { filterArr } from '@/utils/common.js'
export default {
  components: {
    'search-filter': () => import('@/components/rightPopup/half')
    // Tags
  },
  data() {
    return {
      isLoading: false,
      Datelist: [],
      active: '-1',
      subList: [
        {
          label: '进行中',
          value: 1,
          checked: false
        },
        {
          label: '未开始',
          value: 2,
          checked: false
        },
        {
          label: '已结束',
          value: 3,
          checked: false
        }
      ],
      keyword: '',
      astatus: '',
      currPage: 1,
      pageInfo: {
        params: {
          currPage: 1,
          length: 10,
          keyword: '',
          astatus: ''
        },
        list: [],
        postType: 'get',
        postUrl: '/signActivity/getActivityList'
      },
      // tag-list-test
      selectList: []
    }
  },
  created() {
    this.getInfo(true)
  },
  methods: {
    selected(item, index) {
      item.checked = !item.checked
      this.subList.map((sub, key) => {
        if (key != index) {
          sub.checked = false
        }
      })
      if (item.checked) {
        // this.activeArr.push(item.value)
        this.pageInfo.params.astatus = item.value
      } else {
        this.pageInfo.params.astatus = ''
      }
      this.getInfo(true)
    },
    onRefresh() {
      // this.Toast('刷新成功')
      this.getInfo(true)
    },
    searchReset() {
      this.selectList = []
      this.pageInfo.params.astatus = ''
      this.getInfo(true)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getInfo(true)
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
      console.log(getChecked)

      this.filterList.map(item => {
        item.checkIds = getChecked(item.subList, item.labelId)
      })
      this.selectList = Array.from(new Set(filterArr(this.filterList)))
      this.pageInfo.params.astatus = this.filterList[0].checkIds
      this.getInfo(true)
      // this.pageInfo.params.DEPTID = this.filterList[1].checkIds
      // this.getList(true)
    },
    getInfo(isFirst) {
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
    getMyInitiationInfo(astatus, index) {
      this.active = index
      this.pageInfo.params.astatus = astatus
      // console.log(this.astatus)
      this.getInfo(true)
    },
    loadMore() {
      this.getInfo(false)
    },
    goDetail(id) {
      const activityId = id
      const type = '0'
      this.$router.push({
        path: '/meetingInfo',
        query: { activityId, type }
      })
    },
    goback() {
      window.history.back(-1)
    },
    goPeople(id) {
      const activityId = id
      this.$router.push({
        path: '/signInInfo',
        query: { activityId }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .yh-header-x{
    z-index:200000000003!important;
  }
  .row {
    padding: 0!important;
    .cal {
      border-left: rgba(239, 239, 240, 1) 4px solid;
      height: 140px;
      margin-top: 50px;
      width: 100%;
      font-size: 32px;
      padding-top: 10px;
      color: rgba(158, 158, 157, 1);
      /*padding-left:35px;*/
      text-align: center;
      .acPeople {
        color: rgba(182, 0, 5, 1);
        font-size: 60px;
        font-weight: bold;
      }
      .allPeople {
        color: rgba(76, 76, 76, 1);
        font-size: 32px;
        font-weight: bold;
      }
      .explain {
        color: rgba(158, 158, 157, 1);
        font-size: 28px;
        display: block;
        margin-top: 20px;
      }
    }
  }
  .classify-search {
    width: 44px;
    height:37px;
  }
  .limit-name {
    width: 80%;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
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
    .van-col--17{
      padding-right:14px;
    }
    .statusBtn {
      background: rgba(74, 144, 226, 0.08);
      border: rgba(74, 144, 226, 0.08);
      float: right;
      span {
        color: #4A90E2!important;
        margin-left: 0!important;
      }
    }
    .statusBtn1 {
      background: rgba(182, 0, 5, 0.08);
      border: rgba(182, 0, 5, 0.08);
      float: right;
      span {
        color: rgba(182, 0, 5, 1)!important;
        margin-left: 0!important;
      }
    }
    .statusBtn2 {
      background: rgba(134, 134, 134, 0.08);
      border: rgba(134, 134, 134, 0.08);
      float: right;
      span {
        color: rgba(134, 134, 134, 1)!important;
        margin-left: 0!important;
        /*font-size: 24px;*/
        line-height:0.5px;
      }
    }
    .con {
      position: relative;
      .limit-name {
        background-repeat: no-repeat;
        background-size: 38px;
        padding-left: 50px;
        font-size: 28px!important;
        margin-bottom: 20px;
        color: rgba(76, 76, 76, 1);
        font-weight: bolder;
        /*position: relative;*/
        width: 92%;
        p {
          width: 80%;
          font-size: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: rgba(68, 68, 68, 1);
          font-weight: 600;
          margin-left:6px;
          margin-right:15px;
        }
      }
      p {
        font-size: 26px;
        font-weight: normal;
        color: #9E9E9D;
        line-height: 44px;
        text-align: left;
        /*padding-right:34px;*/
        span {
          color: #4c4c4c;
          display: block;
          margin-bottom: 20px;
          font-size: 26px;
          font-weight:400;
        }
      }

      .but1 {
        position: absolute;
        top: 0;
        right: 100px;
        background: rgba(183, 0, 7, 0.1);
        padding: 5px 10px 5px 10px;
        float: right;
        margin-left: 15px;
        font-size: 20px;
        border-radius: 5px;
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
        line-height: 20px;
      }
      .but2 {
        position: absolute;
        top: 5px;
        right: 0px;
        min-width: auto;
        /*background: rgba(183, 0, 7, 0.1);*/
        padding:7px 12px;
        float: right;
        margin-left: 15px;
        font-size: 22px;
        border-radius: 5px;
        margin-top:-8px;
        height:45px;
        line-height: 30px;
      }
    }
  }
  .bottomborder {
    border-bottom: 18px solid #F8F8F8;
    padding:44px;
    .van-row{
      width:108%;
    }
  }
  .mint-popup-right {
    height: 100%;
    width: 559px;
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
  .tags{
    padding:16px 40px 18px 40px;
    p{
      /*width:118px;*/
      /*height:64px;*/
      font-size:26px;
      font-weight:400;
      color:rgba(51,51,51,1);
      text-align:center;
      padding:14px 33px;
      height: 64px;
      line-height: 32px;
      border:1px solid #E1E1E1;
      box-sizing: border-box;
      margin-right:16px;
      border-radius: 4px;
      font-weight: 400;
    }
    .active1{
      color:rgba(182,0,5,1);
      background:rgba(182,0,5,0.1);
      border:1px solid #B60005;
      font-weight: 500;

    }
  }
</style>
