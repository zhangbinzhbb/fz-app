<template>
  <div class="has-comment">
    <headerx cat-title="邮件往来">
      <template slot="right"/>
    </headerx>
    <div class="comment-content no-comment">
      <div class="comment-content no-comment yh-new-list">
        <van-pull-refresh v-model="isloading" @refresh="onRefresh">
          <div
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="pageInfo.isLoading"
            infinite-scroll-distance="10"
            infinite-scroll-immediate-check="false"
          >
            <div v-for="(item,index) in list" :key="index" class="email-item" @click="toDetail(item)">
              <h2>
                <span class="h-left">
                  <img src="@/assets/images/jibenxinxi@2x.png" alt="">
                  <span class="van-ellipsis van-ellipsis-w">{{ item.title }}</span>
                </span>
                <!-- <img class="h-right" src="@/assets/images/cc@2x.png" alt=""> -->
                <van-icon name="arrow" style="font-size: 14px;"/>
              </h2>
              <div class="email-item-inner">
                <div class="item">
                  <span class="label">发件人</span>
                  <span class="value">{{ item.senderEmail }}</span>
                </div>
                <div class="item">
                  <span class="label">收件人</span>
                  <span class="value">{{ item.addresseeEmail }}</span>
                </div>
                <div class="item">
                  <span class="label">时间</span>
                  <span class="value">{{ item.emailDate }}</span>
                </div>
                <div v-if="item.fileLists.length" class="file-con">
                  <attachment :data="item.fileLists"/>
                </div>
              </div>
              <div class="grey-item"/>
            </div>
          </div>
        </van-pull-refresh>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&list.length>5"/>
        <blank v-if="!pageInfo.isLoading&&pageInfo.list.length==0&&!isloading"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    attachment: () => import('@/components/attachment/index')
  },
  data() {
    return {
      isloading: true,
      funId: this.$route.query.id,
      pageInfo: {
        params: {
          IS_PAGE: true,
          pageSize: 10,
          currPage: 1,
          email: '' // pro_dji@oriza.com
        },
        postType: 'get',
        list: [],
        postUrl: 'mailExchage'
      },
      list: []
    }
  },
  created() {
    this.getDetail()
    // this.getList(true)
  },
  methods: {
    getDetail() {
      this.$axios.get(`/fundInfoDetail/${this.funId}`,
        null,
        res => {
          const email = res.data.model.email
          if (email) {
            this.pageInfo.params.email = email
            this.getList(true)
          } else {
            this.isloading = false
          }
        }
      )
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.list = res.list
          this.isloading = false
        }
      )
    },
    onRefresh() {
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    },
    toDetail(item) {
      this.$router.push({ path: '/projectEmailDetail', query: { id: item.mailId }})
    }
  }
}
</script>
<style scoped lang="scss">
.email-item{
  .grey-item{
    height: 10px;
    width: 100%;
    background-color: rgba(0,0,0,0.1);
  }
  background: white;
  font-size:32px;
  font-weight:600;
  color:rgba(76,76,76,1);
  h2{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px 26px;
    background:rgba(253,241,241,1);
    .h-left{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      display: flex;
      align-items: center;
      .van-ellipsis-w{
        width:580px;
        display: inline-block;
      }
      img{
        width: 22px;
        height: 22px;
        margin-right: 11px;
      }
    }
    .h-right{
      width: 15px;
      height: 30px;
    }
  }
  .email-item-inner{
    padding: 40px;
  }
  .item{
    font-size:26px;
    font-weight:400;
    color:rgba(76,76,76,1);
    line-height:200%;
    display: flex;
    .label{
      color:rgba(158,158,157,1);
      width: 120px;
    }
    .value{
      width: calc(100% - 120px);
    }
  }
  .blue{
    color: #4A90E2 !important;
  }
  .border{
    border-top: 2px solid #e8e8e8;
  }
  .file-con{
    border-top: 2px solid #e8e8e8;
    margin-top: 20px;
  }
}
</style>
