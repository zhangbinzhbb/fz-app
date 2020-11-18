<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <div class="personDetail">
        <!--简历编号信息-->
        <div class="person-wraper personInfo">
          <div class="personInfo-header">
            <div class="personInfo-header-l person-img" @click="toChat(list.employeeid)">
              <img v-if="list.facePath && list.facePath!=''" :src="list.facePath" alt="">
              <div v-else :style="{backgroundColor: list.color}" class="nameImg">{{ filterImg(list.trueName) }}</div>
            </div>
            <div class="personInfo-header-r">
              <p><span class="bigColor">{{ list.trueName || '--' }}</span></p>
              <p>{{ list.gender || '--' }} | {{ filterSmallDate(list.birthday) || '--' }} | {{ list.homePlace || '--' }} | {{ list.marriage }}{{ list.reProduction }}</p>
              <p>{{ list.politicalFace?list.politicalFace:'群众' }} | {{ list.education || '--' }} | 司龄{{ list.attendonYear || '--' }} 年</p>
            </div>
          </div>
          <div class="personInfo-header-b">
            <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume-phone.png')+')'}" class="resumeBg resumePhonperson-wrapere"><a :href="'tel:'+ list.cellPhone" style="color:#566165">{{ list.cellPhone || '--' }}</a></span>
            <span class="resumeBg resumeEmail">
              <img src="@/assets/images/icon/resume-email.png" alt="">
              <a :href="'mailto:'+list.companyEmail">{{ list.companyEmail || '--' }}</a>
            </span>
          </div>
          <div class="person-zyname">
            <p v-if="list.zyList.length>0" style="margin-bottom:0;display:flex;align-items: center;"><span v-for="(item, index) in list.zyList" :key="index">{{ item.ZYNAME }}</span></p>
            <p v-if="list.itechList.length>0" style="margin-bottom:0;display:flex;align-items: center;"><span v-for="(item, index) in list.itechList" :key="index">{{ item.ITTECH }}</span></p>
          </div>
        </div>
        <!--教育背景-->
        <van-row v-if="list.cvEducationList.length>0" class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">教育背景</van-col>
          <van-row >
            <van-col v-for="(item, index) in list.cvEducationList" :key="index" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child"><span> {{ filterDate(item.beginDate) || '--' }} - {{ filterDate(item.endDate) || '--' }} </span> <span class="title title worktitle"> {{ item.eduOrg || '--' }}</span> </p>
              <p>
                <span>{{ item.educationLevel || '--' }}</span>
                <span v-if="('高中，初中').indexOf(item.educationLevel)===-1">{{ item.specialty || '--' }}</span>
                {{ item.notes || '--' }}
              </p>
            </van-col>
          </van-row>

        </van-row>
        <!--工作经历-->
        <van-row v-if="list.cvWorkExpList.length>0" class="person-wraper edcInfo">
          <van-col span="24" class="title bf-6">工作经历</van-col>
          <van-row >
            <van-col v-for="(item, index) in list.cvWorkExpList" :key="index" span="24">
              <van-icon :style="{backgroundImage:'url('+require('@/assets/images/schedule/red-dian.png')+')'}" class="cicon"/>
              <p class="first-child"> <span> {{ filterDate(item.beginDate) || '--' }} - {{ filterDate(item.endDate) || '--' }} </span><span class="title worktitle"> {{ item.workedorg || '--' }}</span> </p>
              <p><span class="mr">{{ item.responsibility || '--' }}</span></p>
            </van-col>
          </van-row>
        </van-row>
        <!--社会关系-->
        <van-row v-if="list.cvFamilyList.length>0" class="person-wraper edcInfo socInfo">
          <van-col span="24" class="title bf-6">社会关系</van-col>
          <van-row >
            <van-col v-for="(item, index) in list.cvFamilyList" :key="index" span="24">
              <p class="first-child">{{ item.relation || '--' }} | {{ item.name || '--' }} | {{ item.postCode | filterDate }}</p>
              <p v-if="item.job || item.address">{{ item.job || '--' }} | {{ item.address || '--' }}</p>
            </van-col>
          </van-row>
        </van-row>
        <!--联系信息-->
        <div v-if="list.showUrgency==='Y'" class="person-wraper edcInfo socInfo contacts-info">
          <h2 class="title bf-6">联系信息</h2>
          <p><span class="label">现住址</span><span class="value">{{ list.contactAddress || '--' }}</span></p>
          <p><span class="label">紧急联系人</span><span class="value">{{ list.urgencyperson || '--' }}</span></p>
          <p><span class="label">关系</span><span class="value">{{ list.urgencyrelation || '--' }}</span></p>
          <p><span class="label">联系方式</span><span class="value">{{ list.urgencyphone || '--' }}</span></p>
        </div>
        <!--紧急联系人-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    filterDate(val) {
      if (val) {
        return val.replace(/-/g, '/')
      } else {
        return '--'
      }
    }
  },
  data() {
    return {
      catTitle: '人员信息',
      page: this.$route.query.page,
      list: []
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    toChat(id) {
      if (this.page === '1') {
        XWalkFunction.startChatPrivate(id)
      }
    },
    filterImg: function(val) {
      if (val && val != '') {
        return val.substring(val.length - 1, val.length)
      }
    },
    filterSmallDate: function(val) {
      if (val) {
        return val.replace(/-/g, '/')
      } else {
        return '至今'
      }
    },
    filterDate: function(val) {
      if (val) {
        return val.substring(0, val.length - 3).replace(/-/g, '/')
      } else {
        return '至今'
      }
    },
    getDetail() {
      this.$axios.get(
        '/ehrCVAction/getCVDetail.do',
        { personId: this.$route.query.id },
        res => {
          this.list = res.dataContent
          console.log(this.list)
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.comment-content{
  background-color:#fff;
}
.personDetail{
  font-size:26px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(86,97,101,1);
  line-height:28px;
  .top5{
    padding-top:10px;
  }
  .person-wraper{
    margin:0 40px;
    padding:40px 0;
    padding-bottom:20px;
  }
  .personInfo{
    border-bottom: 2px solid rgba(240,240,240,1);
    .personInfo-header{
      display: flex;
      justify-content: space-between;
    }
    .personInfo-header-b{
      padding-top: 10px;
    }
    .person-img{
      width:160px;
      height:160px;
      margin-top:-10px;
      img{
        width:160px;
        height:160px;
        border-radius: 50%;
      }
      div{
        width:160px;
        height:160px;
        border-radius: 50%;
        text-align: center;
        line-height: 160px;
        font-size:34px;
        color:#15191A

      }
    }
    .person-info{
      margin-bottom:10px;
      p:first-child{
        font-size:26px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(21,25,26,1);
        span.bigColor{
          margin-right:24px;
        }
      }

    }
    p{
      margin-bottom:20px;
    }
    .resumeBg{
      background-repeat: no-repeat;
      background-size:19px 20px;
      padding-left:29px;
      background-position-y: center;
    }
    .resumeBg.resumePhone{
      background-size:15px 20px;
    }
    .resumeBg.resumeEmail{
      img{
        width: 19px;
        height: 20px;
      }
      a{
        color: rgb(86, 97, 101);
        padding-left: 6px;
      }
      margin-left:59px;
    }
  }
  .person-zyname{
    font-size:22px;
    margin-top:10px;
    display: flex;
    span{
      padding:5px 8px;
      margin-right:14px;
      margin-bottom:14px;
      display: inline-block;
      text-align: center;
      font-weight: 400;
    }
    span:nth-of-type(3n+1){
      color:#03AA4A;
      background-color:rgba(58,204,120,0.23);
    }
    span:nth-of-type(3n+2){
      color:#E89E00;
      background-color:rgba(248,187,57,0.23);
    }
    span:nth-of-type(3n+3){
      color:#3195FC;
      background-color:rgba(49,149,252,0.23);
    }
  }
  .edcInfo{
    border-bottom: 2px solid rgba(240,240,240,1);
    .van-row{
      .van-col{
        padding-bottom:20px;
        position: relative;
        border-left:2px solid #e5e5e5;
        .cicon{
          width:38px;
          height:38px;
          background-size:100% 100%;
          position: absolute;
          top:-10px;
          left:-19px
        }
        p{
          padding-bottom:10px;
          padding-left:28px;

        }
        p.first-child{
          display: flex;
          justify-content: space-between;
          margin-top:-10px;
          span{
            font-size:28px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(76,76,76,1);
            line-height:40px;
          }
          .worktitle{
            width:56%;
            text-align: right;
          }
        }
        p:last-child{
          font-size:24px;
          font-family:PingFangSC-Regular,PingFang SC;
          font-weight:500;
          color:rgba(153,153,152,1);
          line-height:44px;
          text-align: right;
          span{
            padding-right: 18px;
          }
          .mr{
            padding-right:0!important;
          }
        }
      }
      .van-col:first-child{
        margin-top:30px;
      }
      .van-col:last-child{
        padding-bottom:0;
        p:last-child{
          margin-bottom:0;
        }
      }
    }
  }
  .edcInfo:last-child{
    border-bottom: none;
  }
  .socInfo{
    .van-col{
      /*border-left: none;*/
      p.first-child{
        font-size:26px!important;
        font-family: PingFangSC-Regular,PingFang SC;
        font-weight: 400;
        color: #4c4c4c!important;
      }

    }
    .van-col:not(:first-child){
      padding-top:20px;
      border-top:1px solid #f0f0f0;
    }
  }
  .bigColor{
    font-size:30px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:500;
    color:rgba(21,25,26,1);
    line-height:42px;
  }
  .title{
    font-size:28px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:40px;
    width:60%;
  }
  .bf-6{
    border-left:6px solid #B60005;
    font-size: 28px;
    padding-left:20px;
    line-height: inherit!important;
  }
  .contacts-info{
    p{
      padding-top: 14px;
      font-size:26px;
      font-weight:500;
      color:rgba(153,153,152,1);
      display: flex;
      justify-content: space-between;
      .label{
        font-size:26px;
        font-weight:500;
        color:rgba(76,76,76,1);
        width: 148px;
      }
    }
  }
}
</style>
