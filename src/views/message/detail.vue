<template>
  <div class="personal-center has-comment">
    <headerx cat-title="我的消息"/>
    <div class="comment-content no-comment">
      <van-row class="box1">
        <van-col class="write1" span="24">
          <van-col span="2">
            <div class="myMessage_img1" >
              <img v-if="type==0" src="@/assets/images/icon/message1.png">
              <img v-if="type==1" src="@/assets/images/icon/message2.png">
            </div>
          </van-col>
          <van-col span="22">
            <p>{{ detail.MSG_TITLE }}</p>
          </van-col>
          <van-col span="24" class="time">
            <div>{{ formatTime(detail.CREATE_DT) }}</div>
          </van-col>
        </van-col>
        <div v-if="detail.MSG_CONTEXT&&detail.MSG_CONTEXT.indexOf('与会人员') > -1">
          <van-row class="box1_1">
            <van-col span="2">
              <div class="myMessage_img">
                <img src="@/assets/images/message/myMess1.png">
              </div>
            </van-col>
            <van-col span="22">
              地点：
              <span>{{ detail.MSG_CONTEXT1 }}</span>
            </van-col>
            <van-col span="2">
              <div class="myMessage_img">
                <img src="@/assets/images/message/myMess2.png">
              </div>
            </van-col>
            <van-col span="22">
              开始时间：
              <span>{{ detail.MSG_CONTEXT2 }}</span>
            </van-col>
            <van-col span="2">
              <div class="myMessage_img">
                <img src="@/assets/images/message/myMess3.png">
              </div>
            </van-col>
            <van-col span="22">
              结束时间：
              <span>{{ detail.MSG_CONTEXT3 }}</span>
            </van-col>
            <van-col span="2">
              <div class="myMessage_img">
                <img src="@/assets/images/message/myMess4.png">
              </div>
            </van-col>
            <van-col span="22">
              申请人：
              <span>{{ detail.MSG_CONTEXT4 }}</span>
            </van-col>
            <van-col span="2">
              <div class="myMessage_img">
                <img src="@/assets/images/message/myMess5.png">
              </div>
            </van-col>
            <van-col span="22">
              与会人员：
              <span>{{ detail.MSG_CONTEXT5 }}</span>
            </van-col>
          </van-row>
        </div>
        <div v-else>
          <van-row class="box1_1">
            <van-col span="22">
              <div v-html="detail.MSG_CONTEXT"/>
            </van-col>
          </van-row>
        </div>
      </van-row>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      detail: {},
      searchId: '',
      type: this.$route.query.type || '0'
    }
  },
  created() {
    this.getmessageDetail(true)
    this.clearReffer()
  },
  methods: {
    getmessageDetail() {
      this.$axios.get(
        '/MyMessageAction/myMessageDetail.do',
        { MSG_ID: this.$route.query.id, IS_PAGE: true },
        res => {
          this.detail = res.dataContent
          const str = res.dataContent.MSG_CONTEXT
          // 地点
          const strStartIndex = str.indexOf('地点：')
          const strEndIndex = str.indexOf('会议时间')
          const aa = str.substring(strStartIndex + 3, strEndIndex - 5)

          // 开始时间
          const strStarttime = str.indexOf('会议时间：')
          const strEndtime = str.indexOf('至')
          const bb = str.substring(strStarttime + 5, strEndtime)

          // 结束时间
          const strStaEnd = str.indexOf('至')
          const strEnd = str.indexOf('申请人')
          const cc = str.substring(strStaEnd + 1, strEnd - 5)

          // 申请人
          const strStartApply = str.indexOf('申请人:')
          const strEndApply = str.indexOf('与会人员')
          const dd = str.substring(strStartApply + 4, strEndApply - 6)

          // 与会人员
          const strStartjoinpeople = str.indexOf('与会人员:')
          let ee = str.substring(strStartjoinpeople + 5, str.length - 1)
          ee = ee == ':' ? '' : ee
          const arr1 = aa.split(',')
          const arr2 = bb.split(',')
          const arr3 = cc.split(',')
          const arr4 = dd.split(',')
          const arr5 = ee
          this.detail.brr = arr1
            .concat(arr2)
            .concat(arr3)
            .concat(arr4)
            .concat(arr5)
          // res.dataContent.MSG_CONTEXT = arr
          this.detail.MSG_CONTEXT1 = res.dataContent.brr[0]
          this.detail.MSG_CONTEXT2 = res.dataContent.brr[1]
          this.detail.MSG_CONTEXT3 = res.dataContent.brr[2]
          this.detail.MSG_CONTEXT4 = res.dataContent.brr[3]
          this.detail.MSG_CONTEXT5 = res.dataContent.brr[4]
          console.log(this.detail)
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
  .box1 {
    /*width: 600px;*/
    background: rgba(255, 255, 255, 1);
    border-radius: 5px;
    margin: 0 auto;
    padding: 40px;
    .myMessage_img {
      width: 42px;
      height: 42px;
      img {
        width: 100%;
        vertical-align: top;
      }
    }
    .myMessage_img1 {
      width: 70px;
      height: 70px;
      img {
        width: 100%;
        vertical-align: top;
      }
    }
    p {
      font-size: 30px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      color: rgba(68, 68, 68, 1);
      line-height: 43px;
      text-align: left;
      padding-left: 40px;
    }
    .time {
      color: #888888;
      font-size: 24px;
      text-align: left;
      margin-top: 25px;
    }
    .write1 {
      padding-bottom: 20px;
      border-bottom: 2px solid rgba(233, 233, 233, 1);
      margin-bottom: 20px;
    }
    .box1_1 {
      font-size: 29px;
      text-align: left;
      color: #888888;
      line-height: 150%;
      margin-bottom: 0px;
      span {
        color: #444444;
      }
    }
  }
</style>
