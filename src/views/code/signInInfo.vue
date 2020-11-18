<template>
  <div id="signInfo" class="has-comment">
    <headerx cat-title="签到信息"/>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false">
          <form class="yh-search" action @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyword"
              type="search"
              placeholder="搜索姓名/手机号"
            >
            <van-icon :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}" name="search" class="searIcon"/>
          </form>
          <div class="tabtab">
            <div id="p" :class="{'active1':active==0}" @click="handleClickTab(0)">{{ already }}
              <div id="underl" :class="{'active2':active==0}"/>
            </div>
            <div id="p1" :class="{'active1':active==1}" @click="handleClickTab(1)">{{ notYet }}
              <div id="underl1" :class="{'active2':active==1}"/>
            </div>
          </div>
          <div v-if="active === '0' ||active === 0">
            <div v-for="item of Datelist" :key="item.index" class="infoContent">
              <van-row>
                <van-col span="4">
                  <img v-if="item.facePath" :src="path + item.facePath" class="ava">
                </van-col>
                <van-col span="12" class="nameInfo">
                  <span>{{ item.userName }}</span>
                  <p>{{ item.groupName }}</p>
                </van-col>
                <van-col span="8" class="data">
                  <span>{{ item.signDate }}</span>
                  <p>{{ item.signTi }}</p>
                </van-col>
              </van-row>
            </div>
          </div>
          <div v-else-if="active === '1' || active === 1">
            <div v-for="item in Datelist" :key="item.index" class="infoContent">
              <van-row>
                <van-col span="4">
                  <img v-if="item.facePath" :src="path + item.facePath" class="ava">
                </van-col>
                <van-col span="12" class="nameInfo">
                  <span>{{ item.userName }}</span>
                  <p>{{ item.groupName }}</p>
                </van-col>
                <van-col span="8" class="data">
                  <a :href="'tel:'+item.userPhone" class="item">
                    <img src="@/assets/images/icon/telephone.png" class="phone">
                  </a>
                </van-col>
              </van-row>
            </div>
          </div>

          <!--<van-tabs v-model="active" active-color="#b60005" style="padding-top: 50px;">-->
          <!--<van-tab :title="already">-->
          <!--</van-tab>-->
          <!--<van-tab :title="notYet">-->
          <!--</van-tab>-->
          <!--</van-tabs>-->
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&Datelist.length!=0"/>
    </div>
  </div>
</template>
<script>
// import Tags from '@/components/tags'
// import { filterArr } from '@/utils/common.js'
export default {
  components: {
    // 'search-filter': () => import('@/components/rightPopup/half'),
    avator: () => import('@/components/avator/index')
    // Tags
  },
  data() {
    return {
      path: '',
      active: '0',
      notYet: '',
      already: '',
      isLoading: false,
      Datelist: [],
      detail: [],
      selectList: [],
      isSign: 1,
      currPage: 1,
      keyword: '',
      pageInfo: {
        params: {
          currPage: 1,
          length: 10,
          keyword: '',
          isSign: 1,
          activityId: ''
        },
        list: [],
        postType: 'get',
        postUrl: '/signPerson/getActivitySignList'
      }
    }
  },
  created() {
    this.pageInfo.params.activityId = this.$route.query.activityId
    // this.path = 'http://58.211.245.60:9080/imgserver/oa/faceImage/'
    this.path = 'http://58.210.96.191:9080/imgserver/oa/faceImage/'
    this.getInfo(true)
    this.getN()
  },
  methods: {
    goback() {
      window.history.back(-1)
    },
    getN() {
      this.$axios.get(
        '/signPerson/getActivitySignList',
        {
          activityId: this.pageInfo.params.activityId,
          isSign: 1,
          currPage: this.pageInfo.params.currPage,
          keyword: this.pageInfo.params.keyword
        },
        res => {
          this.already = '已签到(' + res.totalCount + ')'
          // this.Datelist = res.data
        }
      )
      this.$axios.get(
        '/signPerson/getActivitySignList',
        {
          activityId: this.pageInfo.params.activityId,
          isSign: 0,
          currPage: this.pageInfo.params.currPage,
          keyword: this.pageInfo.params.keyword
        },
        res => {
          this.notYet = '未签到(' + res.totalCount + ')'
        }
      )
    },
    handleClickTab(tab) {
      this.active = tab
      if (this.active === 0) {
        this.pageInfo.params.isSign = 1
      } else {
        this.pageInfo.params.isSign = 0
      }
      this.getInfo(true)
    },
    loadMore() {
      this.getInfo(false)
    },
    onRefresh() {
      // this.Toast('刷新成功')
      this.getInfo(true)
    },
    search() {
      this.$refs.searchInput.blur()
      this.getInfo(true)
    },
    getInfo(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.$set(this, 'list', res.list)
          this.Datelist = res.list
          this.Datelist.forEach(function(element) {
            if (element.signTime) {
              element.signDate = element.signTime.split(' ')[0]
              element.signTi = element.signTime.split(' ')[1]
            }
          })
          console.log(this.Datelist)
        },
        err => {
          this.isLoading = false
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
  .has-comment{
    background: #f5f5f5;
  }
  .yh-search {
    border:0!important;
    margin-bottom: 10px!important;
    background: #fff;
    input {
      text-align: left!important;
      padding-left: 86px;
      height:68px;
      font-size: 24px;
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
  .row {
    padding: 0!important;
    .cal {
      border-left: rgba(239, 239, 240, 1) 4px solid;
      height: 140px;
      margin-top: 50px;
      width: 100%;
      padding-top: 10px;
      color: rgba(158, 158, 157, 1);
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
    width: 68px;
    margin-top: 10px;
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
      }
    }
    .con {
      position: relative;
      .limit-name {
        /*background: url("./static/images/signIn/meeting.png") no-repeat;*/
        background-size: 38px;
        padding-left: 50px;
        font-size: 28px;
        color: rgba(68, 68, 68, 1);
        margin-bottom: 20px;
        width: 90%;
      }
      p {
        font-size: 24px;
        font-weight: normal;
        color: #9E9E9D;
        line-height: 44px;
        text-align: left;
        span {
          color: #4c4c4c;
          display: block;
          margin-bottom: 15px;
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
        top: 0;
        right: 0;
        background: rgba(183, 0, 7, 0.1);
        padding: 5px 15px 5px 15px;
        float: right;
        margin-left: 15px;
        font-size: 20px;
        border-radius: 5px;
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
  .infoContent {
    /*border-bottom: 2px solid #e5e5e5;*/
    &::after{
      content:"";
      border-bottom: 2px solid #F5F5F5;
      width: 80%;
      /* height: 20px; */
      display: inline-block;
      position: absolute;
      left: 20%;
    }
    .van-row{
      padding-right:39px;
      padding-left:40px;
    }
    .ava {
      width: 80px;
      height: 80px;
      margin-right: 20px;
      border-radius: 50%;
    }
    .nameInfo {
      text-align: left;
      span {
        font-size: 32px;
        vertical-align: top;
        line-height: 60px;
        font-weight:400;
        color:rgba(38,38,38,1);
      }
      p{
        font-size: 24px;
        margin-top: -10px;
        font-weight:400;
        color:rgba(106,106,106,1);
      }
    }
    .data {
      text-align: right;
      /*margin-top: 4px;*/
      span {
        font-size: 28px;
        vertical-align: top;
        line-height: 60px;
        font-weight:500;
        color:rgba(76,76,76,1);
      }
      p{
        font-size: 28px;
        margin-top: -10px;
        font-weight:500;
        color:rgba(76,76,76,1);
      }
    }
  }
  .phone{
    width: 42px;
    position: relative;
    top: 50%;
    margin-top: 20px;
  }
  .yh-search {
    margin-bottom: 0!important;
  }
  .tabtab {
    height: 100px;
    background: #fff;
    margin-bottom: 20px;
    #p {
      font-size: 24px;
      color: rgba(76, 76, 76, 0.5);
      padding-top: 40px;
      padding-bottom: 40px;
      padding-left: 7%;
      padding-right: 3%;
      width: 40%;
      float: left;
      text-align: right;
      position: relative;
    }
    #p1 {
      font-size: 24px;
      color: rgba(76, 76, 76, 0.5);
      padding-top: 40px;
      padding-left: 3%;
      padding-right: 7%;
      width: 40%;
      float: left;
      text-align: left;
      position: relative;
    }
    .active1 {
      color: #B60005!important;
    }
    #underl {
      height: 3px;
      width: 48px;
      background: #fff;
      margin-top: 10px;
      margin-left: 72%;
    }
    #underl1 {
      height: 3px;
      width: 48px;
      background: #fff;
      margin-top: 10px;
      margin-left: 7%;
    }
    .active2 {
      background: #B60005!important;
    }
  }
</style>
