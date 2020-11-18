<template>
  <div>
    <div class="login-wrap">
      <img :src="baseConfig.domain+'static/images/logo.png'" class="login-logo">
      <div class="input-box">
        <img :src="baseConfig.domain+'static/images/user.png'">
        <div class="link-hr"/>
        <input v-model="userinfo.loginName" type="text" placeholder="请输入账户">
      </div>
      <div class="input-box">
        <img :src="baseConfig.domain+'static/images/password.png'">
        <div class="link-hr"/>
        <input v-model="userinfo.password" type="password" placeholder="请输入密码">
      </div>
      <div class="input-box">
        <input
          v-model="userinfo.verificationCode"
          class="input-verification"
          type="text"
          placeholder="请输入您的验证码"
        >
        <!-- <div class="git-verification" v-show="show" @click="getCode()">获取验证码</div> -->
        <div v-show="!show" class="git-verification git-verification-false">等待 {{ count }} s</div>
      </div>
      <a class="Send-out b fr" @click="test()">验证码将发送至您的手机和邮箱</a>
      <button class="login-go" @click="login">
        <a>登录</a>
      </button>
      <p class="login-bot">
        <a class="login-register">注册</a>
        <!-- <a  class="login-forget">忘记密码？</a>  -->
      </p>
      <mt-popup v-model="popupVisible" :modal="false" position="top" class="alart mint-popup-2">
        <p class>账号或密码错误</p>
      </mt-popup>
    </div>
    <router-view/>
  </div>
</template>

<script>
// 页面未用到
export default {
  data() {
    return {
      userinfo: {
        loginName: 'APPTest',
        password: 'Founder123',
        verification: ''
      },
      popupVisible: false,
      show: true,
      count: '',
      timer: null
    }
  },
  created() {},
  activated() {
    this.pageType = this.$router.query.type
  },
  methods: {
    // 登录操作
    login() {
      // 登录接口-不需要token,已经调用成功
      this.$axios.post('/loginAction/login.do', this.userinfo, res => {
        // eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiJBUFBUZXN0IiwiaWF0IjoxNTU5MTA3OTk2MDQ3fQ.hFRQI-D9Ytw1iZHyO64NrEGzmoG4nPqkaJ9ZXkbBmHQ

        // this.storage.set('yh-user', res)
        // this.storage.set('token', res.token)
        // this.storage.set('userId', res.userId)
        appcan.locStorage.val('yh-user', res)
        appcan.locStorage.val('userId', res.userId)
        appcan.locStorage.val('token', res.token)

        this.$router.push('/home')
        const str =
          '&os=2&version=01.00.0017&oem=iPhone&loginName=' +
          res.loginName +
          '&userId=' +
          res.userId +
          '&sv=ios8&netType=0&model=SM-G9009&latitude=&longitude='
        // appcan.locStorage.val('commonParams', str)
        this.storage.set('commonParams', str)
      })

      this.$axios.get(
        '/loginAction/loadTemplate.do',
        {
          updateTime: '2018-10-22 13:00:00',
          version: '01.00.0007',
          os: 1
        },
        // { headers: { token: this.storage.get('token') } },
        res => {
          // this.storage.set('yh-user', res)
          // this.$router.push('/home')
        },
        error => {
          // console.log(error)
        }
      )
    },

    test() {
      console.log('has')
    },
    // 倒计时
    getCode() {
      if (!this.timer) {
        this.count = 60
        this.show = false
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= this.count) {
            this.count--
          } else {
            this.show = true
            clearInterval(this.timer)
            this.timer = null
          }
        }, 1000)
      }
      // console.log(this, loginInfo)
    }
  }
}
</script>

<style scoped>
.login-wrap {
  text-align: center;
}
.login-logo {
  width: 260px;
  margin: 0 auto;
  margin-top: 110px;
  margin-bottom: 90px;
  display: block;
}
.input-box {
  width: 540px;
  height: 85px;
  margin: 30px auto;
  position: relative;
}
.input-box img {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 25px;
  left: 25px;
}
.link-hr {
  height: 106%;
  width: 2px;
  background-color: #ececec;
  position: absolute;
  left: 16%;
  top: 0px;
}
.input-box input {
  overflow: hidden;
  width: 80%;
  height: 100%;
  border: none;
  background-color: #fff;
  /* color:#C7C7CD; */
  padding-left: 20%;
  border-radius: 5px;
  font-size: 28px;
  letter-spacing: 2px;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #c7c7cd;
}
.input-verification {
  padding-left: 6% !important;
  overflow: hidden;
  width: 94% !important;
}
.login-go {
  width: 541px;
  height: 86px;
  background-color: #b11016;
  margin-top: 88px;
  font-size: 32px;
  color: #fff;
  border: none;
  border-radius: 5px;
}
.login-go a {
  color: #fff;
}
.login-bot {
  width: 540px;
  margin: 20px auto;
}
.login-forget {
  float: left;
  color: #b11016;
  font-size: 24px;
}
.login-register {
  float: left;
  color: #444;
  font-size: 24px;
}
.git-verification {
  width: 172px;
  height: 62px;
  background: rgba(177, 16, 22, 1);
  border-radius: 8px;
  position: absolute;
  top: 13px;
  right: 10px;
  font-size: 28px;
  color: rgba(255, 255, 255, 1);
  line-height: 62px;
}
.git-verification-false {
  background-color: #8d8d8d;
}
.Send-out {
  font-size: 24px;
  font-family: HiraginoSansGB-W3;
  color: #444;
  padding-right: 8%;
  margin-top: -13px;
}
.mint-popup-2 {
  width: 100%;
  height: 80px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}
.mint-popup-2 p {
  color: #fff;
  font-size: 32px;
  line-height: 80px;
}
.v-modal {
  opacity: 0 !important;
  background: #fff !important;
}
</style>
