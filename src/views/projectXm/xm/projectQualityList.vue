<template>
  <div class="project-quality-list">
    <div v-for="(item,index) in list" :key="index" class="email-item">
      <div class="item">
        <span class="label">投资阶段</span>
        <span class="value">{{ item.cusType }}</span>
      </div>
      <div class="item">
        <span class="label">评估结果</span>
        <span class="value">{{ item.cusLevel }}</span>
      </div>
      <div class="item">
        <span class="label">评估时间</span>
        <span class="value">{{ item.applyUserDate }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {}
  }
}
</script>
<style scoped lang="scss">
.project-quality-list{
  height: 100%;
}
.project-quality-list{
  .email-item{
    background: white;
    margin-top: 20px;
    font-size:32px;
    font-weight:600;
    color:rgba(76,76,76,1);
    line-height:45px;
    padding: 40px;
    line-height: 200%;
    .item{
      font-size:28px;
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
        text-align: right;
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
}
</style>
