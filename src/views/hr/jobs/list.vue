<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx :cat-title="catTitle">
      <template slot="right">
        <!--        <span class="yh-add-more" @click="$router.push({path:'/jobsNew'})">新增</span>-->
        <span class="yh-add-more" @click="$router.push({path:'/jobsNew'})">
          <img
            src="@/assets/images/icon/add.png"
            alt="分类搜索"
            class="classify-search"
          >
        </span>
      </template>
    </headerx>
    <div class="comment-content no-comment">
      <!--搜获-->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div v-infinite-scroll="loadMore" infinite-scroll-disabled="pageInfo.isLoading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
          <form class="yh-search" action="" @submit.prevent="search">
            <input ref="searchInput" v-model="pageInfo.params.keyword" type="search" placeholder="搜索">
            <van-icon name="search" class="searIcon" :style="{backgroundImage:'url('+require('@/assets/images/icon/search-img.png')+')'}"/>
          </form>
          <div v-for="(item,index) in pageInfo.list" v-if="showBlank" :key="index" @click="$router.push({path:'/jobsDetail',query:{id:item.jobId}})">
            <div class="tar-lv2-son">
              <p class="tar-lv2-son-title tital1">{{ item.jobName }} - {{ item.depName }} <i class="van-icon van-icon-arrow van-cell__right-icon"/></p>
              <p class="tar-lv2-son-title">公司名称<span>{{ item.groupName }}</span></p>
              <span class="fl">招聘人数<span>{{ item.remandNum }}</span></span>
              <!--<i></i>-->
            <!-- <div class="box"><img :src="baseConfig.domain+'static/images/icon/workFlowTime.png'" ></div>-->
            </div>
          </div>
          <!--<blank v-if="!showBlank"></blank>-->
        </div>
      </van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length>5"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    blank: () => import('@/components/blank/index')
  },
  data() {
    return {
      isLoading: false,
      popupVisible: false,
      catTitle: '岗位需求',
      showBlank: true,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          keyword: ''
        },
        list: [],
        postType: 'postJson',
        postUrl: '/jobDemand/list'
      }

    }
  },
  created() {
    this.getList(true)
  },
  activated() {
    if (this.storage.get('refresh-jobs-list')) {
      this.getList(true)
      this.storage.remove('refresh-jobs-list')
    }
  },
  methods: {

    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        this.isLoading = false
        if (this.pageInfo.list.length > 0) {
          this.showBlank = true
        } else {
          this.showBlank = false
        }
      }, err => {
        this.isLoading = false
      })
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    }
  }
}
</script>
<style scoped lang="scss">
.classify-search {
  width: 39px;
}
.mail-search {
  background: #fff;
  border-bottom: 2px solid #ececec;
  padding: 18px 15px;
  overflow: hidden;
  height: 70px;
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
  .mail-search-son {
    padding: 20px 0px;
    margin-top: 10px;
    li {
      float: left;
      width: 200px;
      height: 100px;
      text-align: center;
      border-left: 2px solid #ececec;
      img {
        width: 70px;
        height: 70px;
        display: block;
        margin: 0 auto;
      }
      a {
        font-family: HiraginoSansGB-W3;
        color: rgba(0, 0, 0, 1);
        line-height: 75px;
        font-size: 30px;
      }
    }
    li:nth-child(1) {
      border-left: none;
    }
  }
}
.tar-lv2-son {
  position: relative;
  overflow: hidden;
  padding:20px 40px;
  /*padding-top: 40px;*/
  /*padding-bottom: 20px;*/
  // margin: 20px auto 19px auto;
  border-bottom: 18px solid #F8F8F8;
  background-color: #fff;
  .tital1{
    font-size:28px;
    color:#4C4C4C;
    margin-bottom:20px;
    position:relative!important;
  }
  p {
    text-align: left;
    font-size: 26px;
    /*color: rgba(68, 68, 68, 1);*/
    line-height: 45px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color:#9E9E9D;
    span{
      margin-left:44px;
      color:#4C4C4C;
      font-weight:400;
    }
    i{
      /*float:right;*/
      color:#4C4C4C;
      position: absolute!important;
      top:0;
      right:0;
    }
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
    font-size: 26px;
    color: #888888;
    /*margin: 25px 22px 0px 30px;*/
    margin-top:6px;
    span{
      margin-left:44px;
      color:#4C4C4C;
      font-weight:400;
    }
  }
  .box {
    width: 25px;
    height: 25px;
    /*background: rgba(183, 0, 7, 1);*/
    position: absolute;
    bottom: 60px;
    left: 30px;
  }
}
.mint-popup-right {
  height: 100%;
  width: 559px;
}
.menu-title {
  width:100%;
  font-size: 32px;
  text-align: left;
  margin: 20px 0 20px 20px;
}
.screen-list {
  overflow: hidden;
  border-radius: 8px;
  float: left;
  width: 160px;
  height: 56px;
  background-color: #f0f2f5;
  font-size: 24px;
  line-height: 56px;
  margin: 10px 0px 10px 20px;
  text-overflow : ellipsis
}
.screen-button {
  position: absolute;
  bottom: 0px;
  left: 0px;
  right: 0px;
  .screen-reset {
    color: #000;
  }
  .screen-go {
    color: #fff !important;
    background-color: #b70007;
  }
  button {
    font-size: 32px;
    border: none;
    float: left;
    width: 50%;
    height: 94px;
  }
}
.mint-popup {
  z-index: 1000000 !important;
}
.yh-search {
  overflow: visible!important;
  position: relative;
  padding:30px;
  margin-bottom: 0;
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
