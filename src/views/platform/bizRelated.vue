// 缺接口
<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="关联企业"/>
    <div class="comment-content no-comment">
      <!-- part1 -->
      <div class="tabs-con-globle tabs-con">
        <span
          v-for="(item,index) in ['担任法人','对外投资','在外任职']"
          :class="{'active':selectTab==index}"
          :key="index"
          class="tab-item"
          @click="changeTab(index)"
        >{{ item }} 4</span>
      </div>
      <div class="des">黄艳共 <span class="red">21</span>家在外任职企业</div>
      <div class="company-list">
        <div v-for="(item,index) in [1,2,3,4]" :key="index" class="cmp-item">
          <div class="title">霍尔果斯苏新置业有限公司
            <div class="status">在业</div>
          </div>
          <div class="colums">
            <span class="item">
              法定代表人
              <a href="" class="btm blue" > entInfoDetail.operName </a>
            </span>
            <span class="item">注册资本
              <p class="btm"> entInfoDetail.registCapi </p>
            </span>
            <span class="item">成立日期
              <p class="btm"> entInfoDetail.startDate </p>
            </span>
          </div>
          <div class="bottom">
            【缺切图】
            <img src="" alt="">
            TA是董事长
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      selectTab: 0,
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 10,
          searchId: null
        },
        list: [1, 2, 3, 4],
        postUrl: ''
      }
    }
  },
  created() {},
  activated() {},
  methods: {
    changeTab(index) {
      this.selectTab = index
    }
  }
}
</script>
<style scoped lang="scss">
.tabs-con{
  background: white;
}
.company-list{
  font-size:28px;
  font-weight:500;
  color:rgba(76,76,76,1);
  line-height:40px;
  .cmp-item{
    margin-bottom: 20px;
    background: white;
  }
  .title{
    padding: 40px 40px 0 40px;
    .status{
      font-size:24px;
      font-weight:400;
      color:rgba(237,125,17,1);
      line-height:33px;
      background:rgba(248,141,38,0.14);
      display: inline-block;
      padding: 4px 8px;
      float: right;
    }
  }
  .bottom{
    border-top:2px solid #F0F0F0;
    padding: 0 40px;
    font-size:26px;
    font-weight:400;
    color:rgba(158,158,157,1);
    line-height:80px;
    margin-top: 30px;
  }
  .colums {
  font-size: 26px;
  font-weight: 500;
  color: rgba(158, 158, 157, 1);
  line-height: 37px;
  text-align: center;
  margin-top: 40px;
  .item {
    display: inline-block;
    width: 30%;
    position: relative;
    .btm {
      display: block;
      color: #4c4c4c;
      margin-top: 10px;
    }
    &:after {
      content: "|";
      position: absolute;
      top: 20px;
      right: 0;
      color: #d7d7d7;
    }
    &:last-child:after {
      content: none;
    }
    .blue{
      color:#4A90E2
    }
  }
}
}
.des{
  font-size:26px;
  font-weight:400;
  color:rgba(105,105,105,1);
  line-height:37px;
  padding: 0 40px;
  margin:20px 0;
  .red{
    color:#B60005
  }
}

</style>
