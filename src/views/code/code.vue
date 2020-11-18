<template>
  <div :style="{backgroundImage:'url('+require('@/assets/images/code/bg.png')+')'}" class="newsarticle has-comment ac-detail">
    <headerx :cat-title="catTitle"/>
    <div class="code-content" >
      <div :style="{backgroundImage:'url('+require('@/assets/images/code/codebg.png')+')'}" class="center">
        <p class="title">展示您的签到二维码到会务台进行扫描，才能签到成功</p>
        <img :src="url">
        <span class="time"><van-icon name="passed" />5s刷新</span>
      </div>
    </div>
    <div class="nav">
      <div class="item" @click="$router.push({path:'/myInitiation'})">
        <div class="left">
          <img src="@/assets/images/code/myIni.png" alt="" srcset="">
          <span>我发起的</span>
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="item" @click="$router.push({path:'/myJoin'})">
        <div class="left">
          <img src="@/assets/images/code/myJoin.png" alt="" srcset="">
          <span>我参与的</span>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
import configApi from '@/utils/constant'
export default {
  data() {
    return {
      flag: true,
      catTitle: '签到二维码',
      url: '',
      api: configApi.baseUrl,
      uid: this.storage.get('yh-user').userId,
      timer: '',
      sign: null
    }
  },
  watch: {
    '$route.name'(val) {
      if (val === 'signInCode') {
        this.flag = true
      } else {
        this.flag = false
      }
    },
    popupVisible(val) {}
  },
  created() {
    this.url = `${this.api}/fileAction/getUserQrcode.do?userId=${this.uid}`
  },
  mounted() {
    this.sign = this.storage.sessionGet('yh-sign') || {
      signId: '',
      isSign: ''
    }
    this.timer = setInterval(() => {
      if (this.flag) {
        const t = new Date().getTime()
        this.url = `${this.api}/fileAction/getUserQrcode.do?userId=${
          this.uid}&t=${t}`
        this.getResult()
      }
    }, 5000)
  },
  activated() {

  },
  destroyed() {
    this.flag = false
  },
  methods: {
    goback() {
      window.history.back(-1)
    },
    getResult() {
      this.$axios.get(
        '/signActivity/getUserIsSign',
        {
          userId: this.uid
        },
        res => {
          const signId = res.data.signId
          const isSign = res.data.isSign
          const signObj = {
            signId, isSign
          }
          if (isSign === '1') {
            if (this.sign.signId === signId) {
              return
            }
            this.storage.sessionSet('yh-sign', signObj)
            this.$router.push({
              path: '/signInResult',
              query: { item: res.data }
            })
            clearInterval(this.timer)
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .newsarticle {
    position: relative;
    background-size: cover;
    .code-content{
      padding: 49px 45px 61px 45px;
      box-sizing: border-box;
      .center{
        height: 668px;
        box-sizing: border-box;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background-size: 100% 100%;
        /*box-shadow: 0px 0px 15px 14px #f8eded;*/
        .title{
          font-size:24px;
          font-weight:500;
          color:rgba(110,95,96,1);
          line-height:33px;
          width:354px;
          text-align: center;
          position: relative;
          &::before{
            content: '';
            width:30px;
            height:2px;
            background:rgba(182,0,5,1);
            position: absolute;
            top:50%;
            left: -52px;
          }
          &::after{
            content: '';
            width:30px;
            height:2px;
            background:rgba(182,0,5,1);
            position: absolute;
            top:50%;
            right: -52px;
          }
        }
        img{
          width:322px;
          height:322px;
          padding-top: 40px;
          text-align: center;
        }
        .time{
          display: flex;
          align-items: center;
          .van-icon{
            padding-right: 15px;
            font-size: 24px;
          }
          font-size:22px;
          font-weight:400;
          color:rgba(182,0,5,1);
          line-height:30px;
          padding-top: 30px;
        }
      }
    }
    .nav{
      /*padding-top: 61px;*/
      padding-left: 40px;
      .item{
        img{
          width:36px;
          height:36px;
          padding-right: 16px;
        }
        .left{
          display: flex;
          align-items: center;
        }
        padding: 30px 40px 30px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        font-family: "苹方-简 中黑体";
        &+.item{
          border-top: 1px solid #E7E7E7;
        }
      }
    }
  }
</style>
