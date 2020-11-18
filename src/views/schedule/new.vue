<template>
  <div class="schedule-new">
    <fd-form
      :model="detail"
      :schema="schema"
      :options="options"
      :is-btn="!APPLY_NO"
      :btn-edit="APPLY_NO"
      :btn-del="APPLY_NO"
      :title="APPLY_NO ? '日程': '添加日程'"
      @submit="submitHandler"
      @delete="deleteHandler"
    />
    <loading :load-type="loadStatus" @hide="loadStatus='none'" />
    <van-popup v-model="show">
      <div class= "van-popup-content">
        <div class="main">
          <p class="tip-title">是否删除自己的日程？</p>
          <van-checkbox v-model="checked" class="checkbox-title">同时删除抄送人的日程</van-checkbox>
        </div>
        <div class="footer">
          <span v-for="item in navBtn" :key="item.id" @click="deleletSelect(item)">{{ item.name }}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import mixins from './mixins/index'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    loading: () => import('@/components/loading')
  },
  mixins: [mixins],
  data() {
    return {
      APPLY_NO: this.$route.query.id,
      show: false,
      checked: false,
      navBtn: [
        {
          id: '0',
          name: '取消'
        },
        {
          id: '1',
          name: '删除'
        }
      ],
      loadStatus: 'none'
    }
  },
  watch: {},
  created() {},
  methods: {
    deleteHandler() {
      this.show = true
    },
    deleletSelect(item) {
      this.onClickConfirm(item.id)
    },
    onClickConfirm(id) {
      const url = 'agendaAction/deleteSchedule.do'
      const scheduleId = this.$route.query.id
      let data = null

      let flag = true

      if (id === '1' && !this.checked) {
        data = {
          scheduleId: scheduleId
        }
      }

      if (id === '1' && this.checked) {
        data = {
          scheduleId: scheduleId,
          synDel: 'Y'
        }
      }

      if (id === '0') {
        flag = false
      }

      if (!flag) {
        this.show = false
        return
      }

      this.$axios.get(
        url,
        data,
        res => {
          this.Toast('删除成功！')
          this.storage.set('refresh-schedule-list', true)
          this.$router.push({
            path: '/mySchedule'
          })
        }
      )
    },
    submitHandler(params) {
      params = this.setData(params)
      let postUrl = '/agendaAction/addAgendInfo.do'
      if (this.$route.query.id > 0) {
        postUrl = '/agendaAction/updateSchedule.do'
        params.scheduleId = this.APPLY_NO
      }

      const verifing = [
        {
          name: 'appointMaxLength',
          content: params.SCHEDULE_TITLE + ';100',
          tip: '日程标题长度最大为100'
        },
        {
          name: 'compareDate',
          content: params.START_TIME + ';' + params.END_TIME,
          tip: '结束时间不能早于开始时间'
        },
        {
          name: 'appointMaxLength',
          content: params.LOCATION + ';100',
          tip: '日程地点长度最大为100'
        },
        {
          name: 'appointMaxLength',
          content: params.SCHEDULE_CONTENT + ';1500',
          tip: '日程内容长度最大为1500'
        }
      ]

      const update = () => {
        this.isLoading = true
        this.$axios.post(
          postUrl,
          params,
          res => {
            if (res.statue === '0') {
              this.loadStatus = 'success'
              const id = res.commonMap.pkId
              if (this.APPLY_NO) {
                this.$router.push({ path: '/scheduleDetail', query: { id }})
                return
              }
              this.$router.push({ path: '/mySchedule' })
              return
            }
            this.Toast(res.msg)
            this.loadStatus = 'none'
          },
          error => {
            this.Toast(`${error.msg}`)
            this.loadStatus = 'none'
          }
        )
      }

      if (this.verify.verified(verifing)) {
        if (params.AGENT_USER_ID === '' && params.ISANGET === '1') {
          this.Toast('请选择代理人')
          return
        }
        this.loadStatus = 'process'
        update()
      }
    },
    setData(data) {
      const params = JSON.parse(JSON.stringify(data))
      const arr = []
      const arrName = []

      data.scheduleuserList.map(item => {
        arr.push(item.value)
        arrName.push(item.label)
      })
      params.SCHEDULEUSER_IDS = arr.join(',')
      params.SCHEDULEUSER_NAMES = arrName.join(',')
      params.submitType = { 'isTrusted': true }
      const ISANGET = data.ISANGET

      this.AGENT_USER_NAME_LIST.forEach(item => {
        if (item.value === data.AGENT_USER_ID) {
          params.agentUserName = item.label
          params.AGENT_USER_NAME = item.label
        }
      })
      params.agentUserId = data.AGENT_USER_ID
      params.IMPORTANCE_LEVEL = data.IMPORTANCE_LEVEL_s

      if (ISANGET === '0') {
        params.agentUserId = ''
        params.agentUserName = ''
      }

      delete params.scheduleuserList
      delete params.IMPORTANCE_LEVEL_s
      return params
    }
  }
}
</script>

<style lang="scss">
.van-popup-content{
  width:600px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .main{
    padding: 70px 0 50px;
    border-bottom: 1px solid rgba(240,240,240,1);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .tip-title{
      font-size:34px;
      font-weight:500;
      color:rgba(51,51,51,1);
    }
    .checkbox-title{
      padding-top: 10px;
      .van-checkbox__label {
        font-size:28px;
        font-weight:400;
        color:rgba(158,158,157,1);
      }
      .van-checkbox__icon .van-icon {
        width:26px;
        height:26px;
        position: absolute;
        left: 133px;
        top: 125px;
        border-radius: 0;
      }
    }
  }
  .footer{
    display: flex;
    span{
      flex: 1;
      padding:22px 0 24px;
      text-align: center;
      color:rgba(76,76,76,1);
      font-size:30px;
      font-weight:500;
      &+span{
        border-left: 1px solid rgba(240,240,240,1);
      }
      &:not(:first-child){
        color:rgba(182,0,5,1);
      }
    }
  }
}
</style>

