<template>
  <div class="">
    <headerx cat-title="认缴信息"/>
    <div class="comment-content no-comment">
      <div class="record-inner">
        <div v-for="(item,index) in panymentlist" :key="index" class="record-item">
          <div class="title">
            <p>{{ item.label }}</p>
            <p>
              {{ item.updateInfo }}
              <van-icon :name="item.open?'arrow-up':'arrow-down'" class="arrow-icon" @click="item.open=!item.open"/>
            </p>
          </div>
          <div v-show="item.open" class="record-item-inner">
            <div v-if="item.roundList" class="card">
              <div v-for="(sitem, sindex) in item.roundList" :key="sindex" class="card-block">
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">投资人名称</van-col>
                  <van-col span="16" class="card-value">{{ sitem.investorName || '--' }}</van-col>
                </van-row>
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">类型</van-col>
                  <van-col span="16" class="card-value">{{ sitem.investorType || '--' }}</van-col>
                </van-row>
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">投资角色</van-col>
                  <van-col span="16" class="card-value">{{ sitem.inveRole || '--' }}</van-col>
                </van-row>
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">股比</van-col>
                  <van-col span="16" class="card-value">
                    <template v-if="sitem.gb">{{ sitem.gb }}%</template>
                    <template v-else>--</template>
                  </van-col>
                </van-row>
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">认缴金额</van-col>
                  <van-col span="16" class="card-value">
                    <template v-if="sitem.rmbInveAmount">￥{{ sitem.rmbInveAmount | formatMoney }}万元</template>
                    <template v-else>--</template>
                  </van-col>
                </van-row>
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">已出资金额</van-col>
                  <van-col span="16" class="card-value">
                    <template v-if="sitem.rmbTotalFinancial">￥{{ sitem.rmbTotalFinancial | formatMoney }}万元</template>
                    <template v-else>--</template>
                  </van-col>
                </van-row>
                <van-row class="card-block-sub">
                  <van-col span="8" class="card-label">联系人</van-col>
                  <van-col span="16" class="card-value">{{ sitem.contact || '--' }}</van-col>
                </van-row>
              </div>
            </div>
          </div>
        </div>
        <blank v-if="panymentlist.length===0 && !showLoading" style="height: calc(100vh - 60px)"/>
        <loading-box v-model="showLoading"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  filters: {
    formatMoney(v) {
      if (v) {
        return (Number(v) / 10000).toFixed(2)
      }
      return v
    }
  },
  props: {},
  data() {
    return {
      panymentlist: [],
      showLoading: true
    }
  },
  computed: {},
  watch: {

  },
  created() {
    this.getFundRounds()
  },
  mounted() {},
  methods: {
    getFundRounds() {
      this.$axios.get(
        `/getFundRounds`,
        {
          fundId: this.$route.query.id
        },
        res => {
          this.panymentlist = this.sortarr(res)
          this.panymentlist.forEach((item, index) => {
            this.getPaymentList(item.value, index)
          })
          this.showLoading = false
        },
        res => {
          this.panymentlist = this.sortarr(res)
          this.panymentlist.forEach((item, index) => {
            this.getPaymentList(item.value, index)
          })
          this.showLoading = false
        })
    },
    getPaymentList(value, index) {
      this.showLoading = true
      this.$axios.get(
        '/fundShareInfoListByFundId',
        {
          length: 1000,
          currPage: 1,
          fundId: this.$route.query.id,
          round: value
        },
        res => {
          this.showLoading = false
          this.$set(this.panymentlist[index], 'roundList', res.data)
          if (index === 0) {
            this.$set(this.panymentlist[index], 'open', true)
          } else {
            this.$set(this.panymentlist[index], 'open', false)
          }
        }
      )
      this.$axios.get('/getLastShareInfo',
        {
          fundId: this.$route.query.id,
          round: value
        },
        res => {
          this.$set(this.panymentlist[index], 'updateInfo', `更新时间: ${res.updateDt}  更新人: ${res.updateBy}`)
        },
        res => {
          this.$set(this.panymentlist[index], 'updateInfo', `更新时间: ${res.updateDt}  更新人: ${res.updateBy}`)
        }
      )
    },
    sortarr(arr) {
      for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          /**
           * 比较第j位和j+1的initial值
           * 如果j位的initial值比j+1位的initial值大，那么他们的位置发生交换
           * 如果j位的initial值比j+1位的initial值小，那么位置不变
           */
          if (arr[j].value < arr[j + 1].value) {
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    }
  }
}
</script>
<style lang="scss" scoped>
.comment-content{
  height: 100%;
  .record-inner{
    height: 100%;
    .record-item{
      .title{
        height:88px;
        background:rgba(253,241,241,1);
        font-size:28px;
        font-weight:600;
        color:rgba(76,76,76,1);
        padding:0 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        p:first-child{
          width: 100px;
        }
        p:last-child{
          color: #e43c3c;
          display: flex;
          align-items: center;
          .arrow-icon{
            padding: 20px;
            padding-right: 0;
            color:rgba(76,76,76,1);
          }
        }
      }
      .record-item-inner{
        padding: 0px 40px;
        background-color: #fff;
      }
      .card{
        .card-block{
          padding: 18px 0;
          border-bottom: 2px solid #cccccc;
          .card-block-sub{
            font-size:28px;
            padding: 10px 0;
            .card-label{
              color:rgba(158,158,157,1);
            }
            .card-value{
              color:rgba(76,76,76,1);
              text-align: right;
            }
          }
        }
        .card-block:last-child{
          border: none;
        }
      }
    }
  }
}
</style>
