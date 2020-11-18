<template>
  <div class="mail has-comment" id="mail">
    <headerx :catTitle="catTitle"></headerx>
    <div class="comment-content no-comment">
      <div class="tabs-group" v-for="(item, odx) in dataContent" :key="odx">
<!--        <div class="title">{{ item.typeName }}</div>-->
        <div class="tabs">
          <div
            class="col-25"
            v-for="(tab, idx) in item.info"
            :key="idx"
            @click="turnToUrl(item, tab)"
          >
            <img :src="tab.applicationIcon" alt>
            <!-- <img :src="baseConfig.domain+'static/images/jhl.png'" alt=""> -->
            <div>{{ tab.applicationName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      catTitle: '',
      dataContent: []
    }
  },
  created () {
    this.getIcons()
  },
  methods: {
    getIcons () {
      this.$axios.get(
        '/BaseCommonAction/myMenuList.do',
        { fatherId: this.$route.query.id },
        res => {
          // console.log(res)
          this.catTitle = res.dataHeader.NAME
          this.dataContent = res.dataContent
        }
      )
    },
    turnToUrl (item, tab) {
      //  人员简历
      if (tab.applicationId === '30725') {
        this.$router.push('memberResumeList')
        return
      }
      // 离职员工
      if (tab.applicationId === '30724') {
        this.$router.push('dismissList')
        return
      }
      //  岗位需求
      if (tab.applicationId === '30726') {
        this.$router.push('jobsList')
        return
      }
      // 简历管理
      if (tab.applicationId === '30727') {
        this.$router.push('resumeList')
        return
      }
      // 招聘流程
      if (tab.applicationId === '30728') {
        this.$router.push('workFlowList')
        return
      }
      // 应聘资料
      if (tab.applicationId === '30729') {
        this.$router.push('applicationList')
        return
      }
      let cmd, template, params
      cmd = tab.cmd
      template = tab.appTemplate
      params = tab.cmd

      appcan.locStorage.val('templateParams', params)
      appcan.locStorage.val('template_cmd', cmd)
      // // appcan.locStorage.val('fromPageName', thisPageName)
      // // appcan.locStorage.val('fromPageType', fromPageType)
      appcan.locStorage.val('thisPageName', template)
      // this.storage.set('templateParams', params)
      // this.storage.set('template_cmd', cmd)
      // this.storage.set('fromPageName', thisPageName)
      // this.storage.set('fromPageType', fromPageType)
      // this.storage.set('thisPageName', template)

      // appcan.window.open(cmd, `./template/${template}.html`, 0, 4)

      // 区分安卓和IOS的webview打开方式不一样
      var os = appcan.locStorage.val('os')
      // eslint-disable-next-line eqeqeq
      if (os == '2') {
        window.open(`${template}.html`)
      } else {
        window.open(appcan.locStorage.val('publicFileName') + `template/${template}.html`)
      }

    }
  }
}
</script>
<style scoped lang="scss">
  /*@import '../../../assets/sass/setting.scss';*/
  .tabs-group {
    background: white;
    /*width: 92%;*/
    /*border-radius: 30px;*/
    /*margin: 40px auto;*/
    padding-top:41px;
    /*padding-bottom:40px;*/
    .title {
      border-bottom: 2px solid #ebebeb;
      height: 86px;
      font-size: 30px;
      text-align: left;
      font-family: MicrosoftYaHei-Bold;
      padding-left: 30px;
      color: rgba(68, 68, 68, 1);
      line-height: 90px;
      font-weight: bold;
    }
    .tabs {
      text-align: left;
      .col-25 {
        width: 25%;
        display: inline-block;
        text-align: center;
        padding-bottom: 46px;
        img {
          width: 46px;
          height: 51px;
          margin-top: 5px;
        }
        div {
          /*font-size: 26px !important;*/
          font-size:22px!important;
          font-weight:400;
          line-height:30px;
          margin-top:8px;
          position: relative;
          font-size: 29px!important;
          color: #404040;
        }
      }
    }
  }
</style>
