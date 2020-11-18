<template>
  <div class="healthy-list has-comment">
    <headerx cat-title="健康上报明细"/>
    <div class="comment-content no-comment">
      <div v-if="List.length" class="table-content">
        <h2 class="deadline-t">数据截至{{ subDate }}</h2>
        <table class="fd-yh-table " cellspacing="0" border="2">
          <tr class="header">
            <th v-for="(item,index) in tableHeader" :key="index">{{ item }}</th>
          </tr>
          <tr
            v-for="(td,key) in List"
            :key="key"
          >
            <td @click="$router.push({ path: '/healthDetail', query: { pkId: td.pkId }})">{{ td.reportBy || '--' }}</td>
            <td>{{ td.isPost?td.isPost==='1'?'是':'否':'--' }}</td>
            <td>{{ td.situation?td.situation==='0'?'正常':'异常':'--' }}</td>
            <td>{{ td.isSuzhou?td.isSuzhou ==='1'?'是':'否': '--' }}</td>
            <td>{{ td.measures || '--' }}</td>
          </tr>
        </table>
      </div>
      <blank v-else/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeader: [
        '姓名', '到岗', '健康状态', '在苏', '已采取措施'
      ],
      List: [],
      subDate: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      // type字段个人历史记录传user，全部人员传all
      // 个人填报历史记录列表和全部人员列表公用一个接口
      // 返回值中 subDate 为全部人员中显示的截止时间
      const type = 'all'
      const URL = '/dailyHealthyAction/list.do'
      this.$axios.get(
        URL,
        {
          pageSize: 100,
          curPage: 1,
          type
        },
        res => {
          this.subDate = res.dataContent.subDate
          this.List = res.dataContent.list
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.healthy-list{
  .comment-content{
    background: #fff;
  }
  .table-content{
    padding: 10px 20px;
  }
  .deadline-t{
    font-size: 34px;
    padding-bottom: 10px;
    text-align: right;
  }
}
</style>
