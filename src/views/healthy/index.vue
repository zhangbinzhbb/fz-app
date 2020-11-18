<template>
  <div ref="pages" class="pages">
    <div ref="table" class="content1">
      <!--首列固定-->
      <div class="left-content">
        <div class="table-head">
          <table class="full-table">
            <thead>
              <tr v-for="(header,index) in tableHeader" :key="index">
                <th v-for="(b,x) in header" v-show="x===0" :key="x">
                  <p>{{ b }}</p>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-left">
          <div ref="firstColLayer" class="table" data-_ref="firstColLayer">
            <table class="full-table">
              <tbody>
                <tr v-for="(row,index) in dataSheet" :key="index">
                  <td v-for="(c,y) in row" v-show="y===0" :key="y">
                    <p>{{ c }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div ref="right" class="right-content">
        <!--首行固定-->
        <div ref="firstRowLayer" class="table-head" data-_ref="firstRowLayer">
          <table>
            <thead>
              <tr v-for="(header,index) in tableHeader" :key="index">
                <th v-for="(b,n) in header" v-show="n!==0" :key="n">
                  <p v-html="b"/>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <!--正常表格内容(只有表格内容，没有表头和首列)-->
        <div
          ref="tableContainer"
          class="table"
          style="overflow:scroll"
          @scroll="tableDivScroll($event)"
        >
          <table>
            <tbody ref="tbody">
              <tr v-for="(row,index) in dataSheet" :key="index">
                <td v-for="(c,m) in row" v-show="m!==0" :key="m">
                  <p class="text" @click="$router.push('/allHealthList')">{{ c }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    dataSheet: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tableHeader: [
        [
          '单位',
          '到岗<br/>(实到/应到)',
          '健康<br/>(正常/异常)',
          '途径或往返',
          '接触',
          '其他返苏',
          '未返苏'
        ]
      ]
    }
  },
  created() {},
  mounted() {
    // 定一个生命周期钩子监听变动
    // let maxHeight = window.screen.height
    document.body.style.overflow = 'hidden'
    // this.$refs.right.style.width =
    //   "" + this.$refs.table.offsetWidth - 12 + "PX"; // 这里的减101是减去左侧div宽度
    // console.log(this.$refs.right.style.width);
  },
  methods: {
    tableDivScroll() {
      const $target = this.$refs.tableContainer
      // 首行固定
      this.$refs.firstRowLayer.scrollLeft = $target.scrollLeft
      // 首列固定
      this.$refs.firstColLayer.scrollTop = $target.scrollTop
    }
  }
}
</script>

<style scoped lang="scss">
/* 表格分为两部分，左边固定列和右边表格
左边固定列宽度为60PX；右边为70PX，右边因为要加边框 所以就是68+2PX（左右边框） */
table, table tr td, table tr th{
  border: 0;
}
.right-content{
  .text{
    font-size:26px;
    color:rgba(76,76,76,1);
  }
}
body {
  overflow: hidden;
}
table::-webkit-scrollbar {
  display: none;
}
thead,
tbody {
  overflow: hidden;
}
th,
td p {
  width: 168px;
  // height: 77px;
  // line-height: 77px;
  text-align: center;
  white-space: normal;
  display: inline-block;
  font-size:26px;
}
.pages {
  height: 100%;
  overflow: hidden;
}
.content1 {
  height: 450PX;
  overflow: hidden;
  margin: 5PX;
}
/* 固定列的宽度为60 左边*/
.left-content {
  width: 168px;
  float: left;
  text-align: center;
}
.left-content p {
  width: 168px;
  height: 77px;
  line-height: 77px;
  text-align: center;
  white-space: normal;
  display: inline-block;
}
/* 去掉表格的重复边框 */
.full-table {
  border: 0;
  border-collapse: collapse;
}
.table-body {
  width: 100%;
  overflow: auto;
}
.table {
  height: 450PX;
  overflow: auto;
}
/* 表头 */
.table-head {
  overflow: hidden;
  white-space: nowrap;
  border-bottom:1px solid rgba(196,196,196,1);
  padding-bottom: 10px;
}
</style>
