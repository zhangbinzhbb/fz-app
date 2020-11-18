<template>
  <div class="healthy-list has-comment">
    <headerx cat-title="我的健康">
      <!-- <template slot="right">
        <span class="yh-add-more">
          <i class="i-ellipsis" @click="moreToggle">...</i>
        </span>
      </template> -->
    </headerx>
    <more ref="more" :more-btns="moreBtns">
      <template>
        <div
          v-for="(item,key) in moreBtns"
          :key="key"
          class="item"
          @click="$router.push({path:item.url})"
        >
          <img :src="baseConfig.domain+item.imgSrc" alt>
          {{ item.name }}
        </div>
      </template>
    </more>
    <div class="comment-content no-comment">
      <div style="height:100%;">
        <div v-if="List.length" class="healthy-list-row">
          <div v-for="(item,index) in List" :key="index" class="healthy-list-row-item">
            <div class="row-1">
              <span @click="$router.push({ path: '/healthDetail' , query: { pkId:item.pkId }})">{{ item.createDt || '--' }}</span>
              <div class="tag">
                <span v-if="item.situation === '0'" class="c1">正常</span>
                <span v-if="item.situation === '1'" class="c1">异常</span>
                <span v-if="item.situation === '2'" class="c1">未提交</span>
                <span v-if="item.isPost === '0'" class="c2">公司办公</span>
                <span v-if="item.isPost === '1'" class="c2">隔离/在家办公</span>
                <span v-if="item.isPost === '2'" class="c2">未返苏</span>
                <span v-if="item.isPost === '3'" class="c2">请假</span>
                <span v-if="item.isPost === '4'" class="c2">周末/国假日</span>
              </div>
            </div>
            <div v-if="item.situation !== '2'" class="row-2">
              <span class="tag">操作时间：{{ item.reportDt }}</span>
            </div>
          </div>
        </div>
        <blank v-else/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    more: () => import('@/components/more/index')
  },
  data() {
    return {
      List: [],
      moreBtns: [
        {
          name: '统计',
          url: 'healthStatistics',
          imgSrc: 'static/images/icon14.png'
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    moreToggle() {
      this.$refs.more.showToggle()
    },
    getList() {
      // type字段个人历史记录传user，全部人员传all
      // 个人填报历史记录列表和全部人员列表公用一个接口
      // 返回值中 subDate 为全部人员中显示的截止时间
      const type = 'user'
      const URL = '/dailyHealthyAction/list.do'
      this.$axios.get(
        URL,
        {
          pageSize: 100,
          curPage: 1,
          type
        },
        res => {
          const data = res.dataContent.list
          this.List = data
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.healthy-list {
  .i-ellipsis {
    font-size: 44px;
  }
  .healthy-list-row-item{
    background-color: #fff;
    font-size: 34px;
    padding: 20px;
    &+.healthy-list-row-item{
      margin-top:20px;
    }
    .row-1{
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      font-size: 28px;
      .tag{
        span{
          height: 40px;
          line-height: 40px;
          font-size: 22px;
          font-weight: 400;
          padding: 0 10px;
          display: inline-block;
        }
        .c1{
          background:rgba(58,204,120,0.23);
          color:rgba(3,170,74,1);
        }
        .c2{
          background:rgba(248,187,57,0.23);
          color:rgba(232,158,0,1);
        }
      }
    }
    .row-2{
      display: flex;
      justify-content: flex-end;
      font-size: 22px;
    }
  }

}
</style>
