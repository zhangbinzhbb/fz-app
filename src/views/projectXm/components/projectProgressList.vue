<template>
  <div class="project-common-list project-common-list-1">
    <div class="project-item" @click="toDetail(model)">
      <div class="pro-top">
        <div class="pro-left">
          <div class="img-head">
            <img v-if="(typeof model.iconBlob)==='string'" :src="(typeof model.iconBlob)==='string'?'data:image/jpeg;base64,'+ encodeURI(model.iconBlob) :imgs" alt="">
            <img v-if="(typeof model.iconBlob)==='object'" :src="(typeof model.iconBlob)==='object' && model.imageurl!=='' ? model.imageurl :imgs" alt="">
          </div>
          <div class="pro-tags-left">
            <p>{{ model.projName }}</p>
          </div>
        </div>
        <div v-if="model.projStatusName" class="pro-right-tag">
          {{ model.projStatusName }}
        </div>
      </div>
      <div class="column-list">
        <van-row
          v-if="model.projStatus === '3'
            || model.projStatus === '4'
            || model.projStatus === '15'
            || model.projStatus === '5'
            || model.projStatus === '6'
          "
          class="column-flex-item">
          <van-col span="12">
            <div v-if="model.projStatus === '3' || model.projStatus === '4'" class="column-label"> 立项时间</div>
            <div v-if="model.projStatus === '15' || model.projStatus === '5'" class="column-label"> 决策时间</div>
            <div v-if="model.projStatus === '6'" class="column-label"> 协议时间</div>

            <div v-if="model.projStatus === '3' || model.projStatus === '4'" class="column-value">{{ model.setupDt?model.setupDt:'--' }}</div>
            <div v-if="model.projStatus === '15' || model.projStatus === '5'" class="column-value">{{ model.decisionDt?model.decisionDt:'--' }}</div>
            <div v-if="model.projStatus === '6'" class="column-value">{{ model.signDt?model.signDt:'--' }}</div>
          </van-col>
          <van-col span="12">
            <div v-if="model.projStatus === '3' || model.projStatus === '4'" class="column-label"> 立项金额</div>
            <div v-if="model.projStatus === '15' || model.projStatus === '5'" class="column-label"> 决策金额</div>
            <div v-if="model.projStatus === '6'" class="column-label"> 协议金额</div>

            <div v-if="model.projStatus === '3' || model.projStatus === '4'" class="column-value">{{ model.rmbIntendedAmountLX | amountFilter }}</div>
            <div v-if="model.projStatus === '15' || model.projStatus === '5'" class="column-value">{{ model.rmbIntendedAmountJC | amountFilter }}</div>
            <div v-if="model.projStatus === '6'" class="column-value">{{ model.signAmountRmb | amountFilter }}</div>
          </van-col>
        </van-row>
        <van-row v-else class="column-flex-item">
          <van-col span="12">
            <div class="column-label">出资时间</div>
            <div class="column-value">{{ model.firstCZDtPC?model.firstCZDtPC:'--' }}</div>
          </van-col>
          <van-col span="12">
            <div class="column-label">出资金额</div>
            <div class="column-value">{{ model.allRequestMoney | amountFilter }}</div>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script>
//  立项/决策/协议 /出资时间（根据项目状态显示不同时间）
//  立项/决策/协议 /出资金额（根据项目状态显示不同金额）
export default {
  filters: {
    amountFilter(value) {
      if (!value) return '--'
      const index = value.indexOf('万元')
      const money = value.substr(0, index)
      const NUM = 0
      const result1 = money.length > 1 ? money : NUM
      const result = `￥${result1}万元`
      return result
    }
  },
  props: {
    field: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      imgs: require('@/assets/images/projectXm/logo.png'),
      model: this.field
    }
  },
  watch: {
    field: {
      handler(newValue, oldValue) {
        this.model = newValue
      },
      deep: true
    }
  },
  methods: {
    toDetail(item) {
      const dataObj = JSON.parse(JSON.stringify(item))
      this.storage.set('groupObj', dataObj)
      this.$router.push({ path: '/projectXmDetail' })
    }
  }
}
</script>

<style lang="scss" scoped>
.project-common-list-1{
  .project-item{
    background-color: #fff;
    padding: 49px 42px 40px;
    .pro-top{
      display: flex;
      justify-content: space-between;
      .pro-left{
        display: flex;
        .img-head{
          width: 75px;
          height: 58px;
          display: block;
          overflow: hidden;
          position: relative;
          img{
            position: absolute;
            display: block;
            max-width: 100%;
            max-height: 100%;
            top: 0px;
            left: 0px;
            right: 0px;
            bottom: 0px;
            margin: auto;
          }
        }
        .pro-tags-left{
          // padding-left: 5px;
          padding-top: 11px;
          p{
            font-size:28px;
            font-weight:500;
            color:rgba(76,76,76,1);
            width: 400px;
          }
          .tags-l{
            display: flex;
            padding-top: 10px;
            span{
              padding: 5px 8px;
              font-size:22px;
              font-weight:400;
              color:rgba(49,149,252,1);
              background:rgba(49,149,252,0.23);
              &:nth-child(2){
                color:rgba(3,170,74,1);
                background:rgba(58,204,120,0.23);
              }
              &+span{
                margin-left: 14px;
              }
            }
          }
        }
      }
      .pro-right-tag{
        background:rgba(248,141,38,0.14);
        font-size:24px;
        font-weight:400;
        color:rgba(237,125,17,1);
        padding: 8px;
        height:39px;
        line-height: 39px;
      }
    }
    .column-list{
      padding-top: 43px;
      .column-flex-item{
        &+.column-flex-item{
          padding-top: 45px;
        }
        .column-label{
          font-size:24px;
          font-weight:500;
          color:rgba(158,158,157,1);
        }
        .column-value{
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
          padding-top: 7px;
        }
      }
    }
  }
  &+.project-common-list{
    margin-top: 18px;
  }
}
</style>
