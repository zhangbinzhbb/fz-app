<template>
  <div id="Knowledge" class="newsarticle has-comment">
    <headerx cat-title="人员结构"/>
    <div class="comment-content no-comment">
      <div class="sub-title">
        <img src="@/assets/images/platform/xingbie@2x.png">
        性别分析
      </div>
      <div v-if="genderList.length" class="chart-con">
        <ve-ring
          :data="chartData"
          :settings="chartSettings"
          :colors="sexColors"
          class="sex-ring"
          height="6.5rem"
        />
        <ul v-if="0" class="list">
          <li v-for="(item,index) in genderList" :key="index">
            <span :style="{'background':item.SEXY==='男'?'#67C6DD':''}" class="dot"/>
            <div class="c-name">
              <p class="t-name">{{ item.NAME }}</p>
              <p class="t-name van-ellipsis">{{ item.DEP || '--' }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="empty-blank">
        <img src="@/assets/images/icon/blank.png" alt="">
      </div>
      <div class="sub-title">
        <img src="@/assets/images/platform/xueli@2x.png">
        学历分析
      </div>
      <div v-if="educationList.length" class="chart-con">
        <ve-ring
          :data="chartData1"
          :settings="chartSettings"
          :colors="sexColors1"
          class="sex-ring"
          height="6.5rem"
        />
        <ul v-if="0" class="list">
          <li v-for="(item,index) in educationList" :key="index">
            <span :style="{'background':item.SEXY==='男'?'#67C6DD':''}" class="dot"/>
            <div class="c-name">
              <p class="t-name">{{ item.NAME }}</p>
              <p class="t-name van-ellipsis">{{ item.DEP || '--' }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else class="empty-blank">
        <img src="@/assets/images/icon/blank.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      sexColors: ['#FA8E69', '#A0E5F0'],
      sexColors1: ['#FA8E69', '#FDA244', '#FDC06C', '#F6F49D', '#DBEC7C'],
      chartSettings: {
        radius: [25, 75],
        offsetY: 138,
        label: {
          show: true,
          formatter: '{b}-{c}人\n{d}%',
          color: '#000'
        },
        labelLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      chartData: {
        columns: ['性别', '人数'],
        rows: []
      },
      chartData1: {
        columns: ['文凭', '人数'],
        rows: []
      },
      genderList: [],
      educationList: [],
      groupId: this.$route.query.groupId
    }
  },
  created() {
    this.getGenderList()
    this.getDducationList()
  },
  methods: {
    getGenderList() {
      const URL = '/groupStaticAction/genderStatic.do'
      const groupId = this.groupId || '4'
      this.$axios.get(
        URL,
        {
          groupId
        },
        res => {
          const data = res.dataContent
          const arr = []
          data.map(item => {
            arr.push({
              '性别': item.sexy,
              '人数': item.sum
            })
          })
          let arr1 = []
          arr1 = data[0].list
          if (data.length > 1) {
            arr1 = data[0].list.concat(data[1].list)
          }
          this.genderList = arr1
          this.$set(this.chartData, 'rows', arr)
        }
      )
    },
    getDducationList() {
      const URL = '/groupStaticAction/eduStatic.do'
      const groupId = this.groupId || '4'
      this.$axios.get(
        URL,
        {
          groupId
        },
        res => {
          const data = res.dataContent
          const arr = []
          const arr1 = []
          data.map(item => {
            arr.push({
              '文凭': item.sexy,
              '人数': item.sum
            })
            item.list.map(ls => {
              arr1.push(ls)
            })
          })
          this.educationList = arr1
          this.$set(this.chartData1, 'rows', arr)
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
.empty-blank{
  width: 100%;
  text-align: center;
  height: 40%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  img{
    width: 303px;
  }
}
.sub-title {
  display: block;
  width: 100%;
  font-size: 28px;
  background-color: #FDF1F1;
  padding: 0px 40px;
  overflow: hidden;
  box-sizing: border-box;
  line-height: 88px;
    img{
      width: 25px;
      height: 22px;
      vertical-align: middle;
    }
    span{
      vertical-align: middle;
    }
}
.chart-con{
  background: white;
  padding-top: 60px;
  padding-bottom:20px;
  margin-bottom: 20px;
  .list{
    width:670px;
    margin: 20px auto;
    border: 2px solid #D6D6D6;
    padding:10px 0 20px 0;
    display: flex;
    flex-wrap: wrap;
    li{
      font-size:28px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:40px;
      width: 167.5px;
      margin-top: 10px;
      display:flex;
      box-sizing: border-box;
      padding: 0 10px;
      .t-name{
        text-align: left;
      }
      .dot{
        width:10px;
        height:10px;
        border-radius: 100%;
        background: #FA8E69;
        margin-top: 10px;
      }
      div{
        font-size:24px;
        font-weight:400;
        color:rgba(106,106,106,1);
        line-height:33px;
      }
    }
  }
}
</style>
