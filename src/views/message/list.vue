<template>
  <div class="personal-center has-comment">
    <headerx cat-title="我的消息"/>
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
              v-model="pageInfo.params.searchId"
              type="search"
              placeholder="搜索"
            >
          </form>
          <div v-if="numb>0" class="clearCount" @click="readAll">
            <img src="@/assets/images/icon/msg_count1.png" alt="">
            未读消息过多，标为已读
            <img src="@/assets/images/icon/msg_count2.png" alt="">
          </div>
          <div v-for="(item,index) in DataList" :key="index" class="wrap" style="position:relative">
            <i v-if="item.STATUS==0 "/>
            <van-row v-if="item.newsettype==1" class="box1 meeting_msg" @click="toDetailAndRed(item, 1)">
              <van-col class="write1 box1_1" span="24">
                <van-col span="4">
                  <div class="myMessage_img">
                    <img src="@/assets/images/icon/message2.png">
                  </div>
                </van-col>
                <van-col span="20">
                  <p>{{ item.MSG_TITLE }}</p>
                </van-col>
              </van-col>
              <van-row class="box1_1 write1 van-col--24">
                <van-col span="24">
                  地点：
                  <span>{{ item.MSG_CONTEXT[0] }}</span>
                </van-col>
                <van-col span="24">
                  开始时间：
                  <span>{{ item.MSG_CONTEXT[1] }}</span>
                </van-col>
                <van-col span="24">
                  结束时间：
                  <span>{{ item.MSG_CONTEXT[2] }}</span>
                </van-col>
                <van-col span="24">
                  申请人：
                  <span>{{ item.MSG_CONTEXT[3] }}</span>
                </van-col>
                <van-col span="24">
                  与会人员：
                  <span>{{ item.MSG_CONTEXT[4] }}</span>
                </van-col>
              </van-row>
              <van-row class="box1_2">
                <van-col span="10" class="box1_2_left">
                  <span>{{ item.UPDATE_DT }}</span>
                </van-col>
                <van-col span="8" class="box1_2_right">
                  <span @click="toDetailAndRed(item, 1)">立即查看<i class="van-icon van-icon-arrow van-cell__right-icon"/></span>
                </van-col>
              </van-row>
            </van-row>
            <van-row v-if="item.newsettype!=1" class="box1 info-message" @click="toDetailAndRed(item, 0)">
              <van-row class="box1_1 write1" span="24">
                <van-col span="4">
                  <div class="myMessage_img">
                    <img src="@/assets/images/icon/message1.png">
                  </div>
                </van-col>
                <van-col span="20" class="title">
                  <p>{{ item.MSG_TITLE }}</p>
                  <p class="con1_2" span="24" v-html="item.MSG_CONTEXT"/>
                </van-col>
              </van-row>
              <van-col class="" span="24">
                <van-row class="box1_2">
                  <van-col span="16" class="box1_2_left">
                    <span>{{ item.UPDATE_DT||item.CREATE_DT }}</span>
                  </van-col>
                  <van-col span="8" class="box1_2_right">
                    <span
                      @click="toDetailAndRed(item, 0)"
                    >立即查看<i class="van-icon van-icon-arrow van-cell__right-icon"/></span>
                  </van-col>
                </van-row>
              </van-col>
            </van-row>
          </div>
          <!--<blank v-if="DataList.length==0"></blank>-->
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&DataList&&DataList.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&DataList.length>3"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      numb: 0,
      readStatus: [false],
      isLoading: false,
      DataList: [],
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10
        },
        list: [],
        postUrl: '/MyMessageAction/myMessageListAll.do'
      }
    }
  },
  created() {
    this.getmessageList(true)
    this.getMessageCount()
  },
  activated() {
    // this.getmessageList(true)
    if (this.storage.get('refresh-message-list')) {
      this.storage.remove('refresh-message-list')
      this.getmessageList(true)
    }
  },
  methods: {
    toDetailAndRed(item, type) {
      item.STATUS = 1
      this.$router.push({
        path: '/messageDetail',
        query: { id: item.MSG_ID, type: type }
      })
    },
    search() {
      this.$refs.searchInput.blur()
      this.getmessageList(true)
    },
    readAll(item, index) {
      this.$dialog
        .confirm({
          title: '标记已读',
          message: '确定要标记为全部已读吗?'
        })
        .then(index => {
          this.$axios.get('/MyMessageAction/messageMarkRead.do', {}, res => {
            this.Toast('设置成功！')
            this.getmessageList(true)
            this.getMessageCount()
          })
        })
        .catch(() => {
          // this.Toast('取消成功！')
        })
    },
    getmessageList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.$set(this, 'list', res.list)
          this.DataList = res.list
          this.DataList.forEach(function(item) {
            if (item.MSG_CONTEXT.indexOf('与会人员') > -1) {
              item.newsettype = 1
              const str = item.MSG_CONTEXT
              // 地点
              const strStartIndex = str.indexOf('地点：')
              const strEndIndex = str.indexOf('会议时间')
              const aa = str.substring(strStartIndex + 3, strEndIndex)
              // 开始时间
              const strStarttime = str.indexOf('会议时间：')
              const strEndtime = str.indexOf('至')
              const bb = str.substring(strStarttime + 5, strEndtime)
              // 结束时间
              const strStaEnd = str.indexOf('至')
              const strEnd = str.indexOf('申请人')
              const dd = str.substring(strStaEnd + 1, strEnd - 2)
              // 申请人
              const strStartpeople = str.indexOf('申请人')
              const strEndpeople = str.indexOf('与会人员')
              const ee = str.substring(strStartpeople + 4, strEndpeople)
              // 与会人员
              const strStartjoinpeople = str.indexOf('与会人员:')
              let ff = str.substring(strStartjoinpeople + 5, str.length - 1)
              ff = ff == ':' ? '' : ff

              const arr1 = aa.split(',')
              const arr2 = bb.split(',')
              const arr3 = dd.split(',')
              const arr4 = ee.split(',')
              const arr5 = ff
              const arr = arr1
                .concat(arr2)
                .concat(arr3)
                .concat(arr4)
                .concat(arr5)
              item.MSG_CONTEXT = arr
            }
          })
        },
        err => {
          this.isLoading = false
        }
      )
    },
    getMessageCount() {
      this.$axios.get('/EipCountAction/getCountStatistics.do', {}, res => {
        // this.userId2 = this.storage.get('yh-user')
        this.numb = res.dataContent.messageCount
      })
    },
    loadMore() {
      this.getmessageList(false)
    },
    onRefresh() {
      // this.Toast('刷新成功')
      this.getmessageList(true)
      this.getMessageCount()
    }
  }
}
</script>
<style scoped lang="scss">
  .clearCount{
    /*width:50%;*/
    margin:0 125px;
    font-size:28px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(76,76,76,1);
    line-height:40px;
    padding:18px 0px;
    text-align: center;
    background: #fff;
    margin-top:-20px;
    border-radius:8px;
    img{
      width:18px;
      height:20px;
      vertical-align: middle;
      margin:28px 30px 28px 14px;
    }
    img:first-child{
      width:26px;
      height:30px;
      margin:23px 14px 23px 40px;
    }
  }
  .already-read {
    width: 68px;
    margin-top: 10px;
  }
  /deep/ .van-pull-refresh__track{
    background-color:#F8F8F8 ;
  }
  .yh {
    padding: 20px;
    background: rgba(255, 255, 255, 1);
    input {
      width: 592px;
      height: 60px;
      background: rgba(245, 245, 245, 1);
      border-radius: 9px 9px 9px 9px;
      text-align: center;
      font-size: 27px;
      font-weight: 400;
    }
  }
  .wrap{
    padding:2.5px 30px;
    >i {
      width: 18px;
      height: 18px;
      background: rgba(183, 0, 7, 1);
      border-radius: 50%;
      position: absolute;
      top: 53px;
      left: 115px;
      z-index:999;
    }
  }
  .wrap:nth-of-type(1){
    padding-top:0px;
  }
  .box1 {
    /*width: 600px;*/
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    margin: 0 auto;
    /*margin-top: 20px;*/
    /*padding: 20px;*/
    box-sizing: border-box;
    .myMessage_img {
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        position: relative;
        top: 8px;
      }
    }
    p {
      font-size: 27px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(68, 68, 68, 1);
      line-height: 43px;
      text-align: left;
    }
    .write1 {
      padding-bottom: 10px;
      border-bottom: 2px solid rgba(233, 233, 233, 1);
      margin-bottom: 20px;
      .van-col--24{
        width:100% !important
      }
    }
    .box1_1 {
      font-size: 24px;
      text-align: left;
      color: #888888;
      line-height: 39px;
      margin: 25px 0px 20px 25px;
      p{
        font-size:28px;
        font-family:PingFangSC-Semibold,PingFang SC;
        font-weight:600;
        color:rgba(76,76,76,1);
        line-height:42px;
      }
      p:last-child{
        font-size:28px;
        font-weight:400;
        line-height:37px;
        margin-top:6px;
      }
      span {
        color: #444444;
      }
    }
    .con1_2 {
      margin-bottom: 15px;
    }
    .box1_2 {
      /*margin-top: 25px;*/
      padding-bottom: 24px;
      /*padding:0 45px 24px 30px;*/
      padding: 0px 20px 30px 20px;
      >div{
        height:25px;
        line-height: 25px;
      }
      .box1_2_left {
        float: left;
        text-align: left;
        font-size:24px;
        font-weight:400;
        color:rgba(153,153,152,1);
        line-height:33px;
      }
      .box1_2_right {
        float: right;
        text-align: right;
        font-size:26px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:37px;
        padding-right: 45px;
        /deep/ .van-cell__right-icon{
          width: 20px;
          height: 20px;
          border-radius: 50%;
          position: absolute;
          z-index:999;
          line-height: 40px;
        }
      }
    }
  }
  .van-col--24 {
    width: 92.5%;
  }
.meeting_msg{
  .box1_1{
    p:last-child{
      font-size:28px;
      font-family:PingFangSC-Semibold,PingFang SC;
      font-weight:600;
      color:rgba(76,76,76,1);
      line-height:42px;
    }
  }
}
.info-message{
  padding: 25px 0px 0px 25px;
  margin-top:28px;
  .box1_1{
    margin:0;
    width: 96%;
    margin-bottom:20px;
  }
  .van-col--24{
    width:100%
  }
}
  .yh-search{
    position: relative;
    background: #F8F8F8;
    padding:0 30px!important;
  }
  .yh-search input{
    text-align: left;
    margin: 40px 0px 40px 0px!important;
    // line-height: 68px;
    // height: 68px;
  }
  .yh-search .search-img{
    width: 40px;
    position: absolute;
    left: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
  /deep/ .van-dialog{
    border-radius: 0px!important;
  }
</style>
