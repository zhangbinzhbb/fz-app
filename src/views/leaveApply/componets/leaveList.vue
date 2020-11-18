<template>
  <div>
    <div>
      <div class="date-search-box">
        <span class="datepicker-item" @click="openDatePicker('startDate')">
          {{ pageInfo.params.startDate }}
        </span>
        至
        <span class="datepicker-item" @click="openDatePicker('endDate')">
          {{ pageInfo.params.endDate }}
        </span>
        <van-icon name="search" @click="searchLeaveHistory" />
      </div>
      <div v-if="datePicker.show">
        <mt-datetime-picker ref="datePicker" v-model="datePicker.value" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" class="yh-datePicker" @confirm="dateConfirm" @cancel="dateCancel"/>
      </div>
      <div v-for="(item,index) in list" :key="index">
        <van-row class="dettop">
          <van-col span="12"/>
        </van-row>
        <van-row class="Detpadding">
          <van-col span="12">
            <van-col class="DetTital" span="10">假勤类别</van-col>
            <van-col class="Detcon" span="14">{{ item.AttendanceType }}</van-col>
          </van-col>
          <van-col span="12">
            <van-col class="DetTital" span="10">时数</van-col>
            <van-col class="Detcon" span="14">{{ item.Hours }}</van-col>
          </van-col>
        </van-row>
        <van-row class="Detpadding">
          <van-col span="12">
            <van-col class="DetTital" span="10">开始日期</van-col>
            <van-col class="Detcon" span="14">{{ item.STARTDATE }}</van-col>
          </van-col>
          <van-col span="12">
            <van-col class="DetTital" span="10">结束日期</van-col>
            <van-col class="Detcon" span="14">{{ item.ENDDATE }}</van-col>
          </van-col>
        </van-row>
        <van-row class="Detpadding">
          <van-col span="12">
            <van-col class="DetTital" span="10">开始时间</van-col>
            <van-col class="Detcon" span="14">{{ item.StartTime }}</van-col>
          </van-col>
          <van-col span="12">
            <van-col class="DetTital" span="10">结束时间</van-col>
            <van-col class="Detcon" span="14">{{ item.EndTime }}</van-col>
          </van-col>
        </van-row>
        <van-row class="Detpadding">
          <van-col span="12">
            <van-col class="DetTital" span="10">请假原因</van-col>
            <van-col class="Detcon" span="14"/>
          </van-col>
          <van-col span="12">
            <van-col class="DetTital" span="10" style="color:#000;">{{ item.Reason }}</van-col>
            <van-col class="Detcon" span="14"/>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datePicker: {
        show: false
      },
      pageInfo: {
        params: {
          IS_PAGE: true,
          curPage: 1,
          pageSize: 100,
          startDate: new Date().getFullYear() + '-01-01',
          endDate: new Date().getFullYear() + '-12-31',
          LeavePersonId: this.storage.get('yhLeavePersonId').LeavePersonId
        },
        list: [],
        postUrl: '/LeaveListAction/GetLeaveHistory.do'
      },
      list: []
    }
  },
  created() {
    this.getList(true)
  },
  methods: {
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        this.list = this.pageInfo.list.T_Json
      }, null)
    },
    loadMore() {
      this.$refs.newsList.loadMore()
    },
    openDatePicker(dateName) {
      this.datePicker.show = true
      this.datePicker.value = new Date(typeof this.pageInfo.params[dateName] === 'string' ? this.pageInfo.params[dateName].replace(/-/g, '/') : this.pageInfo.params[dateName])
      this.datePicker.dateName = dateName
      setTimeout(() => {
        this.$refs.datePicker.open()
      })
    },
    dateConfirm(val) {
      const dateName = this.datePicker.dateName
      this.pageInfo.params[dateName] = this.formatDateTime(val, 'yyyy-MM-dd')
      this.datePicker.show = false
    },
    dateCancel() {
      this.datePicker.show = false
    },
    searchLeaveHistory() {
      this.getList(true)
    }
  }
}
</script>
<style scoped lang="scss">
.date-search-box{
  padding-top: 20px;
  font-size: 32px;
  text-align: center;
  i{
    padding: 5px;
    position: relative;
    top: 6px;
  }
}
.dettop {
  margin: 0 20px;
  height: 50px;
  background: #a3baec;
  margin-top: 40px;
}
.Detpadding {
  margin: 0 20px;
  border-bottom: 2px solid#ccc;
}
.DetTital {
  padding: 20px 0 20px 10px;
  background: #fff;
  font-size: 26px;
  text-align: left;
  line-height: 50px;
  color: #737373;
}
.Detcon {
  padding: 20px 0;
  background: #fff;
  font-size: 26px;
  text-align: left;
  word-break: break-all;
  line-height: 50px;
  color: #000;
}
</style>
