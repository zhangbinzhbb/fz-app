<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle">
    </headerx>
    <div class="comment-content no-comment">
      <!--提交按钮-->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <form class="yh-search" action @submit.prevent="search">
            <input
              ref="searchInput"
              v-model="pageInfo.params.keyword"
              type="search"
              placeholder="公司/岗位/姓名/联系电话"
            >
            <van-icon name="search" class="searIcon" :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}"/>
          </form>
          <div
            v-for="(item, index) in pageInfo.list"
            :key="index"
            @click="
              $router.push({ path: '/applicationDetail', query: { id: item.bpiId, no:item.mobilePhoneNo, interviewDate:item.interviewDate  } })
            "
          >
            <div class="tar-lv2-son">
              <p class="tar-lv2-son-title tital1 picImg">
                <img v-if="item.filePath && item.filePath!=''" :src="item.filePath" alt="">
                <span v-else :style="{backgroundColor: item.color}" class="nameImg">{{ filterImg(item.name) }}</span>
                <span class="perName">{{ item.name }}</span>
              </p>
              <p class="tar-lv2-son-title tital1 jobName">
                <span class="status">{{ item.statusName }}</span>
<!--                <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume_job.png')+')'}">{{ item.companyName }}-{{ item.post }}</span>-->
<!--                <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume_tel.png')+')'}">{{ filterDate(item.interviewDate) }}|{{ item.mobilePhoneNo }}</span>-->
                <span >{{ item.companyName }}-{{ item.post }}</span>
                <span >{{ filterDate(item.interviewDate) }} | {{ item.mobilePhoneNo }}</span>
              </p>
<!--              <p class="tar-lv2-son-title tital1 jobName">-->
<!--                <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume_job.png')+')'}">{{ item.companyName }}-{{ item.post }}</span>-->
<!--                <span :style="{backgroundImage:'url('+require('@/assets/images/icon/resume_tel.png')+')'}">{{ item.mobilePhoneNo }}</span>-->
<!--              </p>-->
<!--              <p class="tar-lv2-son-title tital1 jobName">-->
<!--                <span class="graduate">面试时间：<span>{{ filterDate(item.interviewDate) }}</span></span>-->
<!--              </p>-->
            </div>
          </div>
          <!--<blank v-if="!showBlank"></blank>-->
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading && pageInfo.list && pageInfo.list.length == 0"/>
      <bottom v-if="!pageInfo.isLoading && isLoadAll && pageInfo.list.length >5"/>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      scrollNext: false,
      isLoading: false,
      catTitle: '应聘简历',
      showBlank: true,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          keyword: '',
          startTime: '',
          endTime: ''
          // resumeStatus: 1,

        },
        list: [],
        postType: 'postJson',
        postUrl: '/aiApplicantInfoAction/search.do'
      }
    }
  },
  created() {
    this.getList(true)
  },
  activated() {
    if (this.storage.get('refresh-Application-list')) {
      this.getList(true)
      this.storage.get('refresh-Application-list')
      this.storage.remove('refresh-Application-list')
    }
  },
  methods: {
    filterDate: function(val) {
      if (val) {
        return val.replace(/-/g, '/')
      }
    },
    filterImg: function(val){
      if (val && val != '') {
        return val.substring(val.length - 1, val.length)
      }
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          // console.log('++++++++++++++' + this.pageInfo.list)
          if (this.pageInfo.list.length > 0) {
            this.showBlank = true
          } else {
            this.showBlank = false
          }
        },
        err => {
          this.isLoading = false
        }
      )
    },
    loadMore() {
      console.log('this.pageInfo.params', this.pageInfo.params)
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    }
  }
}
</script>

<style scoped lang="scss">
  .right-icon{
    margin-right:25px!important;
    .classify-search-more {
      width: 44px;
      margin-right:25px;
    }
    .classify-search-add {
      width: 39px;
      margin-bottom:5px
    }
  }
.labelsShow {
  text-align: left;
  background: #fff;
  border-bottom: 2px solid#dfdcdc;
  padding: 0 0 10px 8px;
  span {
    color: rgba(183, 0, 7, 1);
    border: 1px solid rgba(183, 0, 7, 1);
    font-size: 25px;
    padding: 10px;
    margin: 5px;
    display: inline-block;
    margin-right: 10px;
    /*font-weight: lighter;*/
  }
}
.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
.titaltop {
  text-align: center;
  color: #000;
  font-size: 32px;
  padding: 26px;
  background: #fff;
}
.buttop {
  padding: 20px 0;
  text-align: center;
  font-size: 24px;
  background: #fff;
  .iconbut {
    transform: rotate(90deg);
    font-size: 22px;
    line-height: 24px;
    width: 50px;
  }
}
.butcon {
  border-left: 2px solid#ccc;
  border-right: 2px solid#ccc;
  box-sizing: border-box;
}
.butcontent {
  width: 94.5%;
  position: fixed;
  background: #fff;
  padding: 20px 18px 20px 18px;
  border-top: 2px solid#dfdcdc;
  border-bottom: 2px solid#dfdcdc;
  z-index: 100;
  .butbox {
    .but {
      font-size: 24px;
      padding: 7px 20px;
      border-radius: 10px;
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
      float: left;
      margin: 0 10px 25px 12px;
    }
  }
}
.tar-lv2-son {
  overflow: hidden;
  // padding: 34px;
  padding: 18px 40px 5px 40px;
  /*padding-bottom:30px;*/
  background-color: #fff;
  border-bottom: 18px solid #F8F8F8;
  display: flex;
  justify-content: space-between;
  .tital1 {
    font-size:28px;
    font-family:PingFangSC-Semibold,PingFang SC;
    font-weight:600;
    color:rgba(76,76,76,1);
    line-height:45px;
    /*padding-bottom:20px;*/
    position: relative;
    display: inline-block;
  }
  .tital1:first-child{
    /*height: 80px;*/
    width:30%;
    img{
      width:100px;
      height:100px;
      border-radius: 50%;
      margin-left:10px;
    }
    span{
      margin:0;
      display: inline-block;
    }
    span.nameImg{
      display: inline-block;
      width:100px;
      height:100px;
      border-radius: 50%;
      text-align: center;
      line-height: 100px;
      font-size:30px;
      color:#15191A;
      margin-left:5px;
    }
    span.perName{
      display: block;
      width:110px;
      font-size:26px;
      text-align: center;
      color:rgba(76,76,76,1)
    }
  }
  p {
    text-align: left;
    font-size: 26px;
    color: rgba(68, 68, 68, 1);
    line-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;

  }
  .jobName{
    width: 106%;
    text-align: right;
    margin-bottom:25px;
    span{
      font-size:26px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(76,76,76,1);
      background-size:29px 30px;
      background-repeat: no-repeat;
      padding-left:43px;
      line-height: 30px;
      margin:0px;
      display: block;
      margin-bottom:20px;
    }
    span.status{
      width:auto;
      display: inline-block;
      font-size:24px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(237,125,17,1);
      line-height:40px;
      padding:3px 8px;
      background:rgba(248,141,38,0.14);
    }

  }
  .jobName:last-child{
    padding-bottom: 0;
    margin-bottom: 0;
  }
  img {
    /*position: absolute;*/
    /*right: 22px;*/
    /*top: 36px;*/
    /*float: right;*/
    /*width: 128px;*/
    /*height: 115px;*/
    /*border-radius: 10px;*/
  }
  span {
    font-size: 21px;
    color: #888888;
    // margin: 25px 22px 0px 0;
    margin: 25px 0px 0px 0px;
    z-index: 50px;
    .box {
      width: 25px;
      height: 25px;
      /*background: rgba(183, 0, 7, 1);*/
      float: left;
      margin-right: 15px;
    }
  }
  #time {
    display: block;
    text-align: left;
    margin-top: 7px;
  }
}
  .yh-search {
    overflow: visible!important;
    position: relative;
    padding:30px;
    margin-bottom: 0;
    background: #F8F8F8;
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
</style>
