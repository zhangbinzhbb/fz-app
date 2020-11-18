<template>
  <div class="project-common-list project-common-list-x">
    <div class="project-item">
      <div class="pro-top">
        <div class="pro-left">
          <div class="img-head">
            <img v-if="(typeof model.iconBlob)==='string'" :src="(typeof model.iconBlob)==='string'?'data:image/jpeg;base64,'+ encodeURI(model.iconBlob) :imgs" alt="">
            <img v-if="(typeof model.iconBlob)==='object'" :src="(typeof model.iconBlob)==='object' && model.imageurl!=='' ? model.imageurl :imgs" alt="">
          </div>
          <div class="pro-tags-left">
            <p>{{ model.projName ? model.projName : '--' }}</p>
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
      <div class="column-list">
        <van-row class="column-flex-item">
          <van-col span="12">
            <div class="column-label">出资主体</div>
            <div class="column-value">{{ model.inveName ? model.inveName : '--' }}</div>
          </van-col>
          <van-col span="12">
            <div class="column-label">首次出资日期</div>
            <div class="column-value">{{ model.firstCZDtPC ? model.firstCZDtPC : '--' }}</div>
          </van-col>
        </van-row>
        <van-row class="column-flex-item">
          <van-col span="12">
            <div class="column-label">累计出资</div>
            <div class="column-value">￥{{ model.allRequestMoney | amountFilter }}万元</div>
          </van-col>
          <van-col span="12">
            <div class="column-label">投资占比</div>
            <div class="column-value">{{ model.perShareJC ? model.perShareJC : '--' }}</div>
          </van-col>
        </van-row>
      </div>
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
.project-common-list-x{
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
