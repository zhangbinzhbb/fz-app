<template>
  <div class="">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="pageInfo.isLoading"
        infinite-scroll-distance="10"
        infinite-scroll-immediate-check="false"
        class="refresh-box"
      >
        <div class="fund">
          <div class="item-33">
            <template v-if="fundDetailProInvInfo.totalInvestCount&&fundDetailProInvInfo.totalInvestCount!='0'">
              {{ fundDetailProInvInfo.totalInvestCount }}
              <span>个</span>
            </template>
            <template v-else>--</template>
            <div class="label">累计决策<br>项目个数</div>
          </div>
          <div class="item-33">
            <template v-if="fundDetailProInvInfo.totalInvestAmount&&parseFloat(fundDetailProInvInfo.totalInvestAmount)!='0'">
              ¥{{ fundDetailProInvInfo.totalInvestAmount | formatAmount }}
              <span>亿元</span>
            </template>
            <template v-else>--</template>
            <div class="label">累计投资<br>金额</div>
          </div>
          <!-- <div class="item-33">
            <template v-if="fundDetailProInvInfo.thisYearInvestCount&&fundDetailProInvInfo.thisYearInvestCount!='0'">
              {{ fundDetailProInvInfo.thisYearInvestCount }}
              <span>个</span>
            </template>
            <template v-else>--</template>
            <div class="label">今年投资<br>基金个数</div>
          </div> -->
          <!-- <div class="item-33">
            <template v-if="fundDetailProInvInfo.thisYearInvestAmount&&parseFloat(fundDetailProInvInfo.thisYearInvestAmount)!='0'">
              ¥{{ fundDetailProInvInfo.thisYearInvestAmount | formatAmount }}
              <span>亿元</span>
            </template>
            <template v-else>--</template>
            <div class="label">今年出资<br>金额</div>
          </div> -->
          <div class="item-33">
            <template v-if="fundDetailProInvInfo.investingCount&&fundDetailProInvInfo.investingCount!='0'">
              {{ fundDetailProInvInfo.investingCount }}
              <span>个</span>
            </template>
            <template v-else>--</template>
            <div class="label">在投子基金<br>个数</div>
          </div>
        </div>
        <div v-for="(item,index) in invProjectStatusData" :key="index" class="item" @click="toChildfund(item)">
          <div class="tit">
            <p class="text">
              {{ item.projName }}
            </p>
            <div class="right_s">
              <div class="status">
                {{ item.projStatusName }}
              </div>
              <!-- <img class="h-right" src="@/assets/images/cc@2x.png" alt=""> -->
              <van-icon name="arrow" />
            </div>

          </div>
          <div class="plat">
            <span class="label">{{ item.platPropName }}</span>
            {{ item.mcName }}
          </div>
          <div class="colums">
            <span class="item">
              子基金规模
              <template v-if="item.subFundPlanAmountRmb">
                <p class="btm">￥{{ Number(item.subFundPlanAmountRmb).toFixed(2) }}万元</p>
              </template>
              <template v-else><p class="btm">--</p></template>
            </span>
            <span class="item">
              认缴规模
              <template v-if="item.currentAmountRmb">
                <p class="btm">￥{{ item.currentAmountRmb }}万元</p>
              </template>
              <template v-else><p class="btm">--</p></template>
            </span>
            <span class="item">
              认缴占比
              <template v-if="item.currentRatio">
                <p class="btm">{{ item.currentRatio }}%</p>
              </template>
              <template v-else><p class="btm">--</p></template>
            </span>
            <span class="item">
              协议日期
              <a href="" class="btm">{{ item.signDt ||'--' }}</a>
            </span>
          </div>
        </div>
        <div v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0" class="notlist">
          <img src="@/assets/images/icon/blank.png" alt="">
        </div>
        <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&invProjectStatusData.length>3"/>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  filters: {
    formatAmount(v) {
      return ((parseFloat(v)) / 10000).toFixed(2)
    }
  },
  props: {},
  data() {
    return {
      isLoading: false,
      funId: this.$route.query.id,
      fundDetailProInvInfo: {},
      invProjectStatusData: [],
      pageInfo: {
        params: {
          IS_PAGE: true,
          currPage: 1,
          pageSize: 10,
          searchId: null,
          columnIds: '',
          projType: '2',
          fundId: this.$route.query.id
        },
        list: [],
        postType: 'get',
        postUrl: 'fundInvestListByFundId'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getFundDetailProInvInfo()
    this.getList(true)
  },
  mounted() {},
  methods: {
    getFundDetailProInvInfo() {
      this.$axios.get(`fundInvestInfoDetail/${this.funId}`,
        { projType: 2 },
        res => {
          if (res.status === '0') {
            this.fundDetailProInvInfo = res.data.model
          }
        }
      )
    },
    getList(isFirst) {
      this.$axios.pageData(
        this,
        isFirst,
        res => {
          this.isLoading = false
          this.invProjectStatusData = res.list
        }
      )
    },
    loadMore() {
      this.getList(false)
    },
    onRefresh() {
      this.getList(true)
    },
    toChildfund(item) {
      this.$router.push({ path: '/subfund',
        query: {
          id: item.projId,
          projName: item.projName,
          subFundAmontDisplay: item.subFundPlanAmountRmb,
          currentAmountDisplay: item.currentAmountRmb
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.refresh-box{
  min-height: calc(100vh - 210px)
}
.fund{
  background: white;
  text-align: center;
  padding: 30px 0;
  margin-bottom: 20px;
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  .item-33{
    font-size:46px;
    font-weight:bold;
    color:rgba(248,141,38,1);
    line-height:67px;
    text-align: center;
    width: 30%;
    display: inline-block;
    margin: 10px 1.5%;

    span{
      font-size:26px;
    }
    .label{
      font-size:24px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:33px;
    }
  }
}
.item{
  background: white;
  margin-bottom: 20px;
  .tit{
    font-size:28px;
    font-weight:500;
    color:#4c4c4c;
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fdf1f1;
    .num{
      width:42px;
      height:42px;
      background:rgba(253,241,241,1);
      display: inline-block;
      border-radius: 100%;
      text-align: center;
      font-size:32px;
      font-weight:bold;
      color:rgba(182,0,5,1);
      box-sizing: border-box;
    }
    .text{
      width: 500px;
      display: flex;
      align-items: flex-start;
      font-size: 30px;
    }
    .right_s{
      display: flex;
      justify-content: flex-end;
      align-items: center;
      min-width: 240px;
      .status{
        text-align: center;
        font-size:24px;
        font-weight:400;
        color:rgba(237,125,17,1);
        line-height:33px;
        padding: 4px 10px;
        background:rgba(248,141,38,0.14);
        display:block;

      }
      .h-right{
        margin-left: 10px;
        width: 30px;
      }
    }
    .blue{
      color:#3195FC;
      background:rgba(74,144,226,.14);
    }
  }
  .plat{
    font-size:28px;
    font-weight:500;
    color:rgba(76,76,76,1);
    line-height:40px;
    padding: 0 40px;
    position: relative;
    top: 18px;
    .label{
      font-size:26px;
      font-weight:500;
      color:rgba(158,158,157,1);
      line-height:37px;
      display: block;
    }
  }
  .colums{
    font-size:26px;
    font-weight:500;
    color:rgba(158,158,157,1);
    line-height:37px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
    margin-top: 15px;
    .item{
      display: inline-block;
      vertical-align: top;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
      .btm{
        display: block;
        color: #4C4C4C;
        margin-top: 10px;
      }
    }
  }
}
.notlist{
  display: block;
  width: 100%;
  height: 680px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0;
  background: #fff;
  img{
    width: 300px;
  }
}
</style>
