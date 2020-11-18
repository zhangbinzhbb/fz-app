<template>
  <div class="mail-con has-comment">
    <headerx cat-title="签到信息"/>
    <div id="mail" class="mail comment-content no-comment">
      <div class="header1">
        <div class="header-tx">
          <avator :data="userInfo" :params="avatorParams" class="ava"/>
          <p class="name">{{ Detail.username }}</p>
        </div>
      </div>
      <!--头部信息end-->
      <!--底部信息-->
      <div class="mail-email">
        <van-row>
          <van-col span="6" class="title">手机</van-col>
          <van-col span="18" class="cont">{{ Detail.mobilephone }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div class="mail-email">
        <van-row>
          <van-col span="6" class="title">公司</van-col>
          <van-col span="18" class="cont">{{ Detail.groupName }}</van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="link-hr"/>
      <div class="mail-email">
        <van-row>
          <van-col span="6" class="title">签到时间</van-col>
          <van-col span="18" class="cont">{{ Detail.signTimeStr }} </van-col>
        </van-row>
      </div>
      <div class="clear"/>
      <div class="signInInfo">
        <img src="@/assets/images/code/signSuccess.png">
        <p>签到成功！</p>
      </div>
      <!--<div class="signInInfo">-->
      <!--<img src="/static/images/signIn/signInError.png">-->
      <!--<p class="p">未签到</p>-->
      <!--</div>-->
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
      catTitle: '签到结果',
      Detail: {},
      userInfo: {},
      avatorParams: {
        avatorAttr: 'facePath', // 用户头像地址属性名
        needUrl: false, // 用户头像地址是否需要加前缀
        nameAttr: 'NAME', // 用户名称属性名
        colorAttr: 'COLOR' // 用户头像颜色属性名
      }
    }
  },
  mounted() {
    this.Detail = this.$route.query.item
    this.getList()
  },
  created() {
  },
  methods: {
    goback() {
      window.history.back(-1)
    },
    getList() {
      this.$axios.get('/UserInfoAction/getUserInfo.do?', {}, res => {
        this.userInfo = res.dataContent
        this.userInfo.facePath =
          this.userInfo.facePath ||
          '@/assets/images/icon/work1.png'
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .mail-con {
    width: 100%;
    height: 100%;
  }
  .mail {
    height: 100%;
  }
  .mail-con .mail .header1 .item_resume {
    display: none;
  }
  .header1 {
    background: #fff;
    border-bottom: 2px solid #e5e5e5;
    text-align: center;
    padding-top: 30px;
    /*padding-bottom: 30px;*/
    margin-bottom: 18px;
    .header-tx {
      width: 100%;
      /*height: 80px;*/
      margin-bottom: 20px;
      display: inline-block;
      .ava {
        width: 80px;
        height: 80px;
        margin-left: 30px;
        float: left;
      }
    }
    .name {
      font-size: 34px;
      color: rgba(38, 38, 38, 1);
      float: left;
      line-height: 80px;
      margin-left: 20px;
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
    background: #fff;
    text-align: left;
    padding:30px 40px!important;
    font-size: 28px;
    .title{
      color: rgba(106, 106, 106, 1);
      font-weight:400;
      line-height:40px;
    }
    .cont{
      color: rgba(76, 76, 76, 1);
      text-align: right;
      font-weight:500;
    }
  }
  .link-hr {
    /*margin-top: 18px;*/
    width: 100%;
    height: 2px;
    background: rgba(229, 229, 229, 1);
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
  .header1 ul li:nth-child(1) img {
    width: 60px;
    height: 55px;
  }
  .header1 ul li:nth-child(2) img {
    width: 45px;
    height: 55px;
  }
  .header1 ul li:nth-child(3) img {
    width: 60px;
    height: 55px;
  }
  .header1 ul li:nth-child(4) img {
    width: 60px;
    height: 55px;
  }
  .mint-tabbar {
    display: none !important;
  }
  .signInInfo {
    margin-top: 104px;
    text-align: center;
    img {
      width: 300px;
      height: 300px;
      margin: 0 auto;
    }
    p {
      width:180px;
      height:50px;
      font-size:36px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(80,190,166,1);
      line-height:50px;
      margin-left:293px;
      margin-top:40px
    }
    .p{
      color: #B60005;
    }
  }
</style>
