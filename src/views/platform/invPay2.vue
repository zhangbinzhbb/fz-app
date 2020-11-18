<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="投资付款"/>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
        >
          <div v-for="(item,index) in pageInfo.list" :key="index" class="pay-list">
            <div class="header-content">
              <div class="header-left">
                <span class="lable" style="color:#4C4C4C">智瑞达科技</span>
                <span class="value" style="color:#9E9E9D">被投对象</span>
              </div>
              <div class="header-right">
                <span>审核中</span>
                <span>人民币</span>
              </div>
            </div>
            <div class="colums">
              <div class="colums-item">
                <span class="item-1" style="color:#9E9E9D">出资主体</span>
                <span class="btm" style="color:#4C4C4C">{{ item.investor || '--' }}</span>
              </div>
              <div class="colums-item">
                <span class="item-1" style="color:#9E9E9D">申请人</span>
                <span class="btm" style="color:#4C4C4C">{{ item.appUser || '--' }}</span>
              </div>
              <div class="colums-item">
                <span class="item-1" style="color:#9E9E9D">本期付款金额</span>
                <span class="btm" style="color:#4C4C4C">{{ item.payAmount || '--' }}元</span>
              </div>
              <div class="colums-item">
                <span class="item-1" style="color:#9E9E9D">付款时间</span>
                <span class="btm" style="color:#4C4C4C">{{ item.payDt || '--' }}</span>
              </div>
            </div>
            <div class="remark">
              <p style="color:#9E9E9D">备注</p>
              <div v-if="item.remark" style="color: #4c4c4c;">
                <div v-if="item.remark.length>66 && !item.isCheck" class="p">
                  {{ item.remark | contentFilter }}...<span class="expand-btn" @click="expandChange(item,index)">展开</span>
                </div>
                <div v-else class="p" style="color: #4c4c4c;">
                  {{ item.remark }} <span v-if="item.remark.length>66" class="expand-btn" @click="expandChange(item,index)">收起</span>
                </div>
              </div>
              <div v-else style="color: #4c4c4c;">
                --
              </div>
            </div>
          </div>
      </div></van-pull-refresh>
      <blank v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0"/>
      <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&pageInfo.list.length>2"/>
      <loading-box v-model="showLoading"/>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      pageInfo: {
        params: {
          IS_PAGE: true,
          currPage: 1,
          pageSize: 10,
          groupId: this.$route.query.groupId,
          pkId: this.$route.query.pkId
        },
        list: [],
        postType: 'get',
        postUrl: '/paymentRequestList'
      },
      isLoading: false,
      showLoading: true,
      isLoadingAll: false
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    expandChange(item, index) {
      const check = !item.isCheck
      this.$set(this.pageInfo.list[index], 'isCheck', check)
    },
    getList(isFirst) {
      this.showLoading = true
      this.$axios.pageData(this, isFirst, res => {
        this.isLoading = false
        this.showLoading = false
        this.isLoadingAll = res.isAll
      })
    },
    loadMore() {
      if (this.isLoadingAll) return
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    }
  }
}
</script>
<style scoped lang="scss">
.expand-btn{
  font-size:28px;
  font-weight:500;
  color:rgba(74,144,226,1);
}
.pay-list{
  background-color: #fff;
  padding: 44px 0 0;
  margin-bottom: 14px;
  .header-content{
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .header-left{
      display: flex;
      flex-direction: column;
      .lable{
        font-size:24px;
        font-weight:500;
        color:rgba(158,158,157,1);
      }
      .value{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        padding-top: 10px;
      }
    }
    .header-right{
      display: flex;
      flex-direction: column;
      span{
        height:39px;
        line-height: 39px;
        font-size:24px;
        font-weight:400;
        padding: 0 8px;
        &:nth-child(1){
          background:rgba(248,141,38,0.14);
          color:rgba(237,125,17,1);
        }
        &:nth-child(2){
          background:rgba(74,144,226,1);
          color:#fff;
          margin-top: 12px;
        }
      }
    }
  }
  .colums{
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px 30px;
    .colums-item{
      width:50%;
      text-align: left;
      display: flex;
      flex-direction: column;
      padding-top: 35px;
      .item-1{
        font-size:24px;
        font-weight:500;
        color:rgba(158,158,157,1);
      }
      .btm{
        font-size:28px;
        font-weight:500;
        color:rgba(76,76,76,1);
        padding-top: 14px;
      }
    }
  }
  .remark{
    padding: 30px 40px;
    font-size:28px;
    font-weight:500;
    color:#4c4c4c;
    line-height:40px;
    border-top: 2px solid #F0F0F0;
    .content{
      margin-top:10px;
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
    }
    .spread{
      font-size:28px;
      font-weight:500;
      color:rgba(74,144,226,1);
      line-height:40px;
      float: right;
    }
  }
}
</style>
