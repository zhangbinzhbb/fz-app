<template>
  <div class="has-comment">
    <headerx cat-title="基金业绩"/>
    <div class="comment-content no-comment">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="pageInfo.isLoading"
          infinite-scroll-distance="10"
          infinite-scroll-immediate-check="false"
          class="refresh-box"
        >
          <div class="sub-title">
            <div class="tit-r">
              <img src="@/assets/images/fund/icon4@2x.png">
              基金业绩（元禾）
            </div>
            <van-icon :name="article.part1?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part1')"/>
          </div>
          <div v-if="article.part1" class="fund">
            <div v-if="activeDt" class="end-date" >
              <div @click="checkDt">
                {{ activeDt }}
                <van-icon name="arrow-down" />
              </div>
            </div>
            <div class="col">
              <div class="item-33">
                <template v-if="NumData.totalVal">
                  {{ NumData.totalVal }}
                  <span/>
                </template>
                <template v-else>--</template>
                <div class="label">在投项目估值</div>
              </div>
              <div class="item-33">
                <template v-if="NumData.totalOut">
                  {{ NumData.totalOut }}
                  <span/>
                </template>
                <template v-else>--</template>
                <div class="label">累计投资成本</div>
              </div>
              <div class="item-33">
                <template v-if="NumData.totalIn">
                  {{ NumData.totalIn }}
                  <span/>
                </template>
                <template v-else>--</template>
                <div class="label">累计回收金额</div>
              </div>
            </div>
            <div class="col">
              <div class="item-33">
                <template v-if="NumData.irr">
                  {{ NumData.irr }}%
                </template>
                <template v-else>--</template>
                <div class="label">IRR</div>
              </div>
              <div class="item-33">
                {{ NumData.dpi || '--' }}
                <div class="label">DPI</div>
              </div>
              <div class="item-33">
                {{ NumData.tvpi || '--' }}
                <div class="label">TVPI</div>
              </div>
            </div>
            <p class="unit">(￥万元)</p>
          </div>
          <div class="sub-title">
            <div class="tit-r">
              <img src="@/assets/images/fund/icon5@2x.png">
              元禾控股对基金的现金流
            </div>
            <van-icon :name="article.part2?'arrow-up':'arrow-down'" class="arrow-icon" @click="toggle('part2')"/>
          </div>
          <div v-if="article.part2">
            <div v-for="(item,index) in list" :key="index" class="item">
              <!-- <div class="name">{{ item.companyName }}
                <div class="right tabs-con-globle">
                  <span class="active">LP现金流</span>
                  <span>投项目现金流</span>
                </div>
              </div> -->
              <div class="colums-item">
                <div class="col-50">
                  <span class="label">发生日期</span>
                  {{ item.bizDate }}
                </div>
                <div class="col-50">
                  <span class="label">类型</span>
                  {{ item.financeType }}
                </div>
                <div class="col-50">
                  <span class="label">金额</span>
                  {{ item.amt | money }}{{ item.currencyName }}
                </div>
                <div class="col-50">
                  <span class="label">折算人民币</span>
                  {{ (item.actuallocamt/10000).toFixed(2) }}万元
                </div>
                <div v-if="item.remark" class="border">
                  <span class="label">说明</span>
                  {{ item.remark }}
                <!-- <span class="blue">展开</span> -->
                </div>
              </div>
            </div>
            <div v-if="!pageInfo.isLoading&&pageInfo.list&&pageInfo.list.length==0&&!isLoading" class="notlist">
              <img src="@/assets/images/icon/blank.png" alt="">
            </div>
            <bottom v-if="!pageInfo.isLoading&&isLoadAll&&pageInfo.list.length!=0&&list.length>3"/>
            <loading-box v-model="isLoading"/>
          </div>
        </div>
      </van-pull-refresh>
    </div>
    <fd-select ref="select" v-model="activeDt" :options="numList" value-key="valuDt" @change="dtChange" />
  </div>
</template>
<script>
export default {
  components: {
    'fd-select': () => import('@/components/select/select')
  },
  filters: {
    formatNum(v) {
      if (Number(v)) {
        return (Number(v) / 10000).toFixed(2)
      }
      return v
    },
    money(value) {
      if (!value) return
      value = value.toString()
      return value.replace(/^(-?)(\d+)((\.\d+)?)$/, (s, s1, s2, s3) => {
        const rex = /\d{1,3}(?=(\d{3})+$)/g
        const result = s1 + s2.replace(rex, '$&,') + s3
        return result
      })
    }
  },
  data() {
    return {
      isLoading: true,
      funId: this.$route.query.id,
      numList: [],
      NumData: {},
      activeDt: '',
      pageInfo: {
        params: {
          IS_PAGE: true,
          fundId: this.$route.query.id,
          currPage: 1,
          pageSize: 10,
          companyNumber: 0,
          customerNum: ''
        },
        postType: 'get',
        list: [],
        postUrl: '/ledgerMagAppFundList' // '/ledgerMagAppList'
      },
      list: [],
      article: {
        part1: true,
        part2: true
      }
    }
  },
  watch: {
    activeDt(v) {
      this.NumData = this.numList.filter(i => {
        return i.valuDt === v
      })[0]
    }
  },
  created() {
    this.getNumDatail()
    this.getLedger()
  },
  methods: {
    getNumDatail() {
      this.$axios.get(`/bdTFundValuationList`,
        { fundId: this.funId,
          length: 10,
          currPage: 1 },
        res => {
          this.numList = res.data
          if (res.data[0]) {
            this.activeDt = res.data[0].valuDt || ''
            this.isLoading = false
          }
        })
    },
    getLedger() {
      this.$axios.get(`/fundInfoDetail/${this.funId}`,
        null,
        res => {
          if (res.status === '0') {
            //  拿enteId
            this.pageInfo.params.customerNum = res.data.model.enteId
            this.getList(true)
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
          this.isLoading = false
        }
      )
    },
    checkDt() {
      this.$refs.select.showPicker()
    },
    dtChange(e) {
      this.activeDt = e.valuDt
    },
    onRefresh() {
      this.search()
    },
    loadMore() {
      this.getList(false)
    },
    search() {
      this.getList(true)
    },
    toggle(part) {
      this.article[part] = !this.article[part]
    }
  }
}
</script>
<style scoped lang="scss">

.sub-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 28px;
  background-color: #FDF1F1;
  padding: 0px 40px;
  overflow: hidden;
  box-sizing: border-box;
  .tit-r{
    display: flex;
    justify-items: flex-start;
    align-items: center;
    img{
      width: 30px;
      vertical-align: middle;
      margin-right: 10px;
    }
    span{
      vertical-align: middle;
    }
  }

  .arrow-icon{
    float:right;
    padding: 20px;
    padding-right: 0;
    margin-top: 10px;
  }
}
.fund {
  background: white;
  text-align: center;
  margin-bottom: 20px;
  .end-date {
    font-weight: 500;
    color: rgba(158, 158, 157, 1);
    line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    &>div{
       font-size: 28px;
       display:flex;
       align-items:center;
       padding: 20px 40px;
    }
  }
  .col{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 20px;
    .item-33 {
      font-size: 46px;
      font-weight: bold;
      color: rgba(248, 141, 38, 1);
      line-height: 67px;
      text-align: center;
      width: 33.33%;
      position:relative;
      &:nth-child(1),&:nth-child(2){
        &:after{
          content: '';
          width: 2px;
          height: 60px;
          background: #d7d7d7;
          position: absolute;
          right: 0;
          top: 20px;
        }
      }

      span {
        font-size: 26px;
      }
      .label {
        font-size: 24px;
        font-weight: 500;
        color: rgba(158, 158, 157, 1);
        line-height: 33px;
      }
    }
  }
  .unit{
    display:flex;
    justify-content: flex-end;
    font-size: 24px;
    color: rgba(248, 141, 38, 1);
    padding-bottom: 20px;
    padding-right: 40px;
  }
}
.item {
  background: white;
  padding: 40px;
  border-top: 2px solid #e8e8e8;
  .name {
    font-size: 28px;
    font-weight: 600;
    color: rgba(76, 76, 76, 1);
    line-height: 40px;
    position: relative;
    .right {
      position: absolute;
      right: 0;
      top: 0;
      span {
        padding: 0;
      }
      .active {
        &::after {
          top: 0.52rem;
        }
      }
    }
  }
  .colums-item {
    font-size: 28px;
    font-weight: 500;
    color: rgba(76, 76, 76, 1);
    line-height: 40px;
    .label {
      font-size: 24px;
      font-weight: 500;
      color: rgba(158, 158, 157, 1);
      line-height: 48px;
      display: block;
    }
    .blue {
      font-size: 28px;
      font-weight: 500;
      color: rgba(74, 144, 226, 1);
      line-height: 40px;
    }
    .col-50 {
      width: 49%;
      display: inline-block;
      padding: 10px 0;
    }
    .border {
      padding: 20px 0;
      .label {
        font-size: 28px;
      }
    }
  }
}
.notlist{
  display: block;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 180px 0;
  background: #fff;
  img{
    width: 300px;
  }
}
</style>
