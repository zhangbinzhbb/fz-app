<template>
  <div class="mail-con has-comment">
    <headerx :cat-title="catTitle"/>
    <div id="mail" class="mail comment-content no-comment">
      <div class="mail-email">
        <van-row>
          <van-col span="5" class="title">标题</van-col>
          <van-col span="19" class="cont">{{ Detail.activityTitle }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div class="mail-email">
        <van-row>
          <van-col span="5" class="title">活动时间</van-col>
          <van-col span="19" class="cont">{{ Detail.startTimeApp }} ~ {{ Detail.endTimeApp }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div class="mail-email">
        <van-row>
          <van-col span="5" class="title">活动地点</van-col>
          <van-col span="19" class="cont">{{ Detail.meetingLoc }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div class="mail-email">
        <van-row>
          <van-col span="5" class="title">嘉宾</van-col>
          <van-col span="19" class="cont">{{ Detail.guestName }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div class="mail-email">
        <van-row>
          <van-col span="5" class="title">签到范围</van-col>
          <van-col span="19" class="cont">{{ Detail.signStartTimeApp }} ~ {{ Detail.endTimeApp }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div v-if="type==='1'" class="mail-email">
        <van-row>
          <van-col span="5" class="title">签到时间</van-col>
          <van-col span="19" class="cont">{{ signTime || '--' }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <!--底部信息end-->
    </div>
  </div>
</template>
<script>
export default {
  components: {
    avator: () => import('@/components/avator/index')
  },
  data() {
    return {
      catTitle: '会议详情',
      Detail: {},
      activityId: this.$route.query.activityId || '',
      signTime: this.$route.query.signTime || '',
      type: this.$route.query.type || '',
      sign: '',
      sign1: ''
    }
  },
  created() {
    this.getInfo(this.activityId)
  },
  methods: {
    goback() {
      window.history.back(-1)
    },
    getInfo(id) {
      this.$axios.get(
        '/signActivity/activityDetail',
        {
          activityId: id
        },
        res => {
          this.Detail = res.data.model
          const aa = this.Detail.startTime.replace(
            /-/g,
            '/'
          ) /* new Date()时IE只能识别2018/01/12，不能识别2018-01-12 */
          const bb = this.Detail.endTime.replace(
            /-/g,
            '/'
          )
          const now = new Date(aa)
          const time = now.getTime() - 1000 * 60 * 30
          const date = new Date(time)
          const year = date.getFullYear()
          const month = date.getMonth() + 1
          const day = date.getDate()
          const hour = date.getHours()
          const minute = date.getMinutes()
          this.sign = year + '.' + this.formatTen(month) + '.' + this.formatTen(day) + ' ' + this.formatTen(hour) + ':' + this.formatTen(minute)
        }
      )
    },
    formatTen(num) {
      return num > 9 ? (num + '') : ('0' + num)
    }
  }
}
</script>
<style scoped lang="scss">
  .mail-con {
    width: 100%;
    background-color: #fff;
    height: 100%;
  }
  .mail {
    background-color: #f5f5f5;
    height: 100%;
  }
  .mail-email{
    background: #fff;
    padding:30px 40px!important;
  }
  .mail-con .mail .header .item_resume {
    display: none;
  }
  .header {
    background: rgba(245, 245, 245, 1);
    border-bottom: 2px solid #e5e5e5;
    text-align: center;
    padding-top: 30px;
    padding-bottom: 30px;
    .header-tx {
      width: 150px;
      height: 150px;
      margin-bottom: 30px;
      display: inline-block;
    }
    .name {
      font-size: 34px;
      color: #000;
    }
    .sub-des {
      font-size: 28px;
      color: rgba(49, 48, 48, 1);
      margin: 20px;
    }
    .item {
      display: inline-block;
      margin: 0 20px;
      img {
        width: 40px;
        height: 40px;
      }
      .img_j_l {
        width: 50px;
        height: 50px;
      }
      p {
        font-size: 28px;
        color: #333;
      }
    }
  }
  .mail-tel {
    .mail-tel-l {
      width: 50%;
      float: left;
      p {
        color: #b70007;
        font-size: 28px;
        text-align: left;
        margin: 20px 0px 0px 29px;
        letter-spacing: 2px;
      }
      span {
        display: block;
        font-size: 26px;
        color: #000;
        text-align: left;
        margin: 10px 0px 10px 29px;
        letter-spacing: 1px;
      }
    }
    .mail-tel-r {
      width: 50%;
      float: left;
      p {
        color: #b70007;
        font-size: 28px;
        text-align: left;
        margin: 20px 0px 0px 30px;
        letter-spacing: 2px;
      }
      span {
        display: block;
        font-size: 26px;
        color: #000;
        text-align: left;
        margin: 10px 0px 10px 30px;
        letter-spacing: 1px;
      }
    }
  }
  .mail-email {
    text-align: left;
    padding: 30px 0 10px 0;
    font-size: 28px;
    .title{
      color: rgba(106, 106, 106, 1);
      /*padding-left: 20px;*/
      font-size: 28px;
      font-weight: 400;
    }
    .cont{
      font-size:28px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(76,76,76,1);
    }
  }
  .link-hr {
    /*margin-top: 18px;*/
    width: 100%;
    height: 2px;
    background-color:#F5F5F5;
  }
  .mail-import {
    width: 556px;
    height: 94px;
    background: rgba(184, 0, 8, 1);
    border-radius: 8px;
    border-radius: 6px;
    border: none;
    font-size: 34px;
    font-family: HiraginoSansGB-W3;
    color: #fff !important;
    line-height: 94px;
    margin-top: 65px;
    span {
      color: #fff;
    }
  }
  .header ul li:nth-child(1) img {
    width: 60px;
    height: 55px;
  }
  .header ul li:nth-child(2) img {
    width: 45px;
    height: 55px;
  }
  .header ul li:nth-child(3) img {
    width: 60px;
    height: 55px;
  }
  .header ul li:nth-child(4) img {
    width: 60px;
    height: 55px;
  }
  .mint-tabbar {
    display: none !important;
  }
</style>
