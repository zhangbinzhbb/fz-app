<template>
  <div class="personal-center has-comment">
    <headerx cat-title="流程代理设置">
      <template slot="right">
        <span class="yh-add-more" @click="$router.push({path:'/processSettingNew'})">
          <img src="@/assets/images/icon/add.png" alt="新增" class="new-add">
        </span>
      </template>
    </headerx>
    <div v-infinite-scroll="loadMore" class="comment-content no-comment" infinite-scroll-disabled="pageInfo.isLoading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false">
      <div class="process-settings">
        <div v-for="(item,index) in Datelist" :key="index" class="item">
          <div class="item-top">
            <em>{{ item.AUSERNAME.substring(item.AUSERNAME.length-2, item.AUSERNAME.length) }}</em>
            <span>{{ item.AUSERNAME }}</span>
          </div>
          <div class="item-bot">
            <p>代理流程：<span>{{ item.PROCESS_NAME }}</span></p>
            <p>代理时间：<span>{{ item.SDATE }} - {{ item.EDATE }}</span></p>
          </div>
          <span class="del-btn" @click="del(item.ID)">删除代理</span>
        </div>
      </div>
      <blank v-if="Datelist.length==0">暂无数据</blank>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10
        },
        list: [],
        postUrl: '/PersonalSettingAction/getFixflowAgentList.do'
      },
      Datelist: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        this.Datelist = res.list
      })
    },
    loadMore() {
      this.getList(false)
    },
    del(id) {
      const agendId = id
      const URL = '/PersonalSettingAction/delFixflowAgent.do'
      this.$dialog
        .confirm({
          title: '提示',
          message: '是否删除'
        })
        .then(() => {
          this.$axios.get(URL, {
            agendId
          }, res => {
            this.getList(true)
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>
<style scoped lang="scss">
  .new-add {
    width: 39px;
    margin-bottom:5px
  }
  .process-settings {
    .item{
      position: relative;
      .del-btn{
        position: absolute;
        right: 40px;
        top:60px;
        padding: 0 10px;
        height:48px;
        line-height: 48px;
        background:rgba(182,0,5,1);
        border-radius:4px;
        font-size:28px;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
      padding: 40px;
      background: #fff;
      margin-bottom: 18px;
      text-align: left;
      .item-top{
        line-height: 80px;
        margin-bottom: 18px;
        img{
          width: 80px;
          height: 80px;
          vertical-align: middle;
          margin-right: 20px;
        }
        em{
          display: inline-block;
          width: 80px;
          height: 80px;
          vertical-align: middle;
          margin-right: 10px;
          font-style: normal;
          line-height: 80px;
          text-align: center;
          background: #F88D26;
          font-size:24px;
          color: #fff;
          border-radius: 50%;
        }
        span{
          vertical-align: middle;
          display: inline-block;
          font-size:26px;
          color:rgba(76,76,76,1);
          font-weight:500;
        }
      }
      .item-bot{
        font-size:26px;
        color:rgba(158,158,157,1);
        line-height:45px;
        span{
          color:rgba(76,76,76,1);
          font-weight:500;
        }
      }
    }

  }
  button {
    width: 549px;
    height: 96px;
    background: rgba(183, 0, 7, 1);
    border-radius: 6px 6px 6px 6px;
    color: #fff;
    font-size: 39px;
    margin-top: 130px;
  }
</style>
