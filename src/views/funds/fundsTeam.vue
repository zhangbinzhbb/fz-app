<template>
  <div class="">
    <headerx cat-title="管理团队">
      <template slot="right"/>
    </headerx>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="pageInfo.isLoading"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false"
        class="refresh-box"
      >
        <div v-for="(item,index) in list" :key="index">
          <div class="tar-lv2-son-new">
            <img :src="formatImgUrl(item.path)" class="head-img" alt="" @click="avaClick(item)">
            <div class="rightdismiss">
              <div class="top1">
                <div class="name">{{ item.userName || '--' }}</div>
                <div class="status">
                  {{ item.postName || '暂无' }}
                </div>
              </div>
              <span class="cont">
                {{ item.remark || '--' }}
              </span>
            </div>
          </div>
        </div>
        <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0" style="height: calc(100vh - 60px)"/>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length>5"/>
      </div>
    </van-pull-refresh>

    <loading-box v-model="isLoading"/>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      isLoading: true,
      funId: this.$route.query.id,
      pageInfo: {
        params: {
          IS_PAGE: true,
          currPage: 1,
          pageSize: 10,
          fundId: this.$route.query.id
        },
        list: [],
        postType: 'get',
        postUrl: 'fundManageTeam/bdTFundManageTeamList'
      },
      list: [],
      baseUrl: process.env.NODE_ENV === 'development' ? 'http://172.30.70.166:11808' : 'http://58.210.96.191:9081/imgserver'
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList(true)
  },
  mounted() {},
  methods: {
    formatImgUrl(path) {
      if (path) {
        if (process.env.NODE_ENV === 'development') {
          if (path.indexOf('oaweb') > -1) {
            return 'http://172.30.70.166:9090' + path
          } else {
            return 'http://172.30.70.166:11808/oa/faceImage/' + path
          }
        } else {
          if (path.indexOf('oaweb') > -1) {
            return 'http://172.29.109.11:9087' + path
          } else {
            return 'http://58.210.96.191:9081/imgserver/oa/faceImage/' + path
          }
        }
      }
      return require('@/assets/images/platform/iconIm.png')
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.list = res.list
          this.isLoading = false
        }
      )
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    avaClick(item) {
      XWalkFunction.startChatPrivate(item.createLoginName)
    }
  }
}
</script>
<style lang="scss" scoped>
.tar-lv2-son-new {
  display: flex;
  padding:40px 20px;
  background: #fff;
  justify-content: space-between;
  align-items: flex-start;
  margin: 18px 0;
  .head-img{
    width:90px;
    height:90px;
    border-radius: 50%;
  }
  .rightdismiss {
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: flex-start;
    width: calc(100vw - 140px);
    padding-left: 20px;
    .top1 {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name{
        font-size: 32px;
        font-weight: 800;
        color: #333333;
      }
      .status{
        font-size:22px;
        font-weight:400;
        line-height:30px;
        padding:7px 12px;
        margin-right:14px;
        color:rgba(49,149,252,1);
        background:rgba(49,149,252,0.23);
      }
    }
    .cont{
      font-size: 26px;
      line-height: 32px;
      // letter-spacing:2px;
      color: #4c4c4c;
      margin-top: 10px;
    }
  }
}
</style>
