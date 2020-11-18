<template>
  <div>
    <div v-for="(item,index) in list" :key="index" class="yh-list-item" @click="goDetail(item)">
      <div class="tit">
        <div class="title yh-common-title">
          {{ item[setting.title.name] }}
          <van-icon v-if="rightArrow" name="arrow" class="arrow" />
        </div>
        <div v-if="item[setting.form[1].date]" class="tit-right-arrow">
          <slot :item="item" :index="index" name="tit-right-arrow"/>
        </div>
      </div>
      <div v-for="(row,idx) in setting.form" :key="idx" class="item">
        <!-- <img :src="baseConfig.domain+row.img" alt=""> -->
        <span class="label">{{ row.label }}</span>
        <span v-if="row.date" class="value-content">{{ item[row.date]+' '+item[row.name] }}</span>
        <span v-else class="value-content">{{ item[row.name]? item[row.name]:'--' }}</span>
      </div>
      <div>
        <slot :item="item" :index="index" name="tit-right"/>
      </div>
    </div>
    <!-- <blank v-if="list.length==0"/> -->
  </div>
</template>

<script>
export default {
  name: 'ListItem',
  components: {
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    rightArrow: {
      type: Boolean,
      default: false
    },
    setting: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  created() {},
  methods: {
    goDetail(item) {
      // console.log(item)
      this.$emit('to', item)
    }
  }
}
</script>

<style scoped lang="scss">
.yh-list-item {
  color: #333;
  text-align: left;
  padding: 30px 40px;
  box-sizing: border-box;
  background: white;
  width: 100%;
  margin: 18px 0;
  border-radius: 5px;
  .tit {
    position: relative;
    font-size: 28px;
    line-height: 45px;
    margin:0 0 10px 0;
    color: #4C4C4C;
    font-weight: bold;
    .title{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      word-break: break-all;
      .arrow{
        line-height: 45px;
      }

    }
    .right {
      float: right;
    }
    .tit-right-arrow{
      display: inline;
      position: absolute;
      right: -15px;
      top: 5px;
      .van-icon-arrow{
        font-size: 31px;
        color: #CCC;
      }
    }
  }
  .item {
    font-size: 26px;
    line-height: 40px;
    margin-bottom: 6px;
    display: flex;
    word-break: break-all;
    .label {
      font-size: 25px;
      color: #9e9e9d;
      width: 130px;
      display: inline-block;
    }
    .value-content{
      width: calc(100% - 130px);
    }
    img {
      width: 28px;
      height: 28px;
      vertical-align: middle;
      position: relative;
      top: -2px;
    }
  }
}
</style>
