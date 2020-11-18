<template>
  <div class="project-common-list project-common-list-c">
    <div class="project-item">
      <div class="pro-top">
        <div class="pro-left">
          <div class="img-head">
            <img v-if="(typeof model.iconBlob)==='string'" :src="(typeof model.iconBlob)==='string'?'data:image/jpeg;base64,'+ encodeURI(model.iconBlob) :imgs" alt="">
            <img v-if="(typeof model.iconBlob)==='object'" :src="(typeof model.iconBlob)==='object' && model.imageurl!=='' ? model.imageurl :imgs" alt="">
          </div>
          <div class="pro-tags-left">
            <p>{{ model.enName }}</p>
            <div class="tags-l">
              <span v-if="model.memberName">{{ model.memberName }}</span>
              <span v-if="model.inveName || model.groupName">{{ model.inveName || model.groupName }}</span>
            </div>
          </div>
        </div>
        <div v-if="model.projStatusName" class="pro-right-tag">
          {{ model.projStatusName }}
        </div>
      </div>
      <ul class="pro-tags">
        <li>
          <span class="title">最新占比</span>
          <span class="number">{{ model.projStatus==='14'? '0': model.shareRatio }}</span>
        </li>
        <li>
          <span class="title">出资金额</span>
          <span v-if="model.allRequestMoney" class="number">￥{{ model.allRequestMoney | amountFilter }}万元</span>
        </li>
        <li>
          <span class="title">出资日期</span>
          <span class="number">{{ model.firstCZDtPC?model.firstCZDtPC:'--' }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    amountFilter(value) {
      if (!value) return
      const index = value.indexOf('万元')
      return value.substr(0, index)
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
  }
}
</script>

<style lang="scss">
.project-common-list-c{
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
          padding-left: 5px;
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
        padding: 4px 8px;
        height:39px;
        line-height: 39px;
      }
    }
    .pro-tags{
      padding: 38px 0 0 0;
      justify-content: space-between;
      display: flex;
      li{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &:nth-child(2){
          width:258px;
        }
        .title{
          font-size:26px;
          font-weight:500;
          color:rgba(158,158,157,1);
        }
        .number{
          padding-top: 10px;
          font-size:28px;
          font-weight:500;
          color:rgba(76,76,76,1);
        }
      }
    }
  }
  &+.project-common-list{
    margin-top: 18px;
  }
}
</style>
