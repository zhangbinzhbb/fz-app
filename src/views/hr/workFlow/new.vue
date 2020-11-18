<template>
  <div class="DemandApproval">
    <fd-form
      :model="detail"
      :schema="schema"
      :is-btn="!id"
      :btn-edit="id"
      :title="catTitle"
      @submit="submit"
    />
    <loading-box v-model="showLoading"/>
  </div>
</template>
<script>
import mixins from './mixins/index'
export default {
  components: {
    fdForm: () => import('@/components/form/form')
  },
  mixins: [mixins],
  data() {
    return {
      catTitle: this.$route.query.id ? '招聘流程' : '新增流程',
      id: this.$route.query.id,
      showLoading: true
    }
  },
  watch: {},
  created() {
    this.Toast('需要上传附件，请到PC端操作')
  },
  methods: {
    submit(params) {
      params = this.setData(params)
      if (this.isLoading) {
        return
      }
      let postUrl = '/workSheet/add'
      if (this.$route.query.id) {
        postUrl = '/workSheet/update/' + this.$route.query.id
      }
      const verfing = [
        {
          name: 'appointMaxLength',
          content: params.workRemark + ';500',
          tip: '面试评价最大长度500'
        },
        {
          name: 'appointMaxLength',
          content: params.interviewer + ';25',
          tip: '面试官姓名最大长度25'
        }
      ]
      //   状态 岗位 面试结果都没变化时候，不允许提交
      const compareArr = [
        'workStatus',
        'jobId',
        'workResult',
        'workId',
        'resumeId',
        'userName',
        'workTime',
        'jobName',
        'groupName',
        'interviewer',
        'workRemark',
        'workFile'
      ]
      let result = true
      let workStatusResult = true
      let workResultResult = true
      let jobIdResult = true
      let workStatusChange = true
      //  编辑时 验证 三个状态是否更改过 面试状态 岗位 面试结果都没变化时候，不允许提交
      if (this.$route.query.id) {
        compareArr.map(item => {
          if (item === 'workStatus') {
            if (params['workStatus'] == this.cmpData[item]) {
              workStatusResult = false
            } else {
              workStatusResult = true
            }
            // 当初始状态在第二轮面试之前的状态
          }
          if (item === 'workResult') {
            if (params['workResult'] == this.cmpData[item]) {
              workResultResult = false
            } else {
              workResultResult = true
            }
          }
          if (item === 'jobId') {
            if (params['jobId'] == this.cmpData[item]) {
              jobIdResult = false
            } else {
              jobIdResult = true
            }
          }
          // 插入历史记录值
          // params[item + '2'] = this.cmpData[item]
        })
      } // end
      //  当另外两个未发生变化， status变化后 根据规定 修改当前状态

      if ((jobIdResult || workResultResult) === false) {
        // 编辑页面 有workStatus 如果初始值 小于等于3(第二轮面试前) 限制选择操作
        if (this.cmpData['workStatus'] <= 3) {
          if (
            params['workStatus'] - this.cmpData['workStatus'] > 1 ||
            params['workStatus'] - this.cmpData['workStatus'] < 1
          ) {
            workStatusChange = false
            this.Toast('按规定修改当前状态才能提交!', 2000)
          } else {
            //  其中一个发生变化， 当前状态没有规定
            workStatusChange = true
          }
        }
      }
      console.log('workStatusResult workResultResult jobIdResult', workStatusResult, workResultResult, jobIdResult)
      console.log((workStatusResult || workResultResult || jobIdResult))
      // 验证是否更改 当三个其中一个变化 为 true
      if ((workStatusResult || workResultResult || jobIdResult) === false) {
        this.Toast('按规定修改当前状态、当前岗位或面试结果才能提交!', 2000)
        result = false
      } else {
        result = true
      }
      // 更改groupName 和 jobName 形式
      let arrGroupName = ''
      // 处理groupName 和 jobName
      this.schema.groups[0].fields[2].props.options.map(item => {
        if (item.value === params.jobId) {
          // eslint-disable-next-line no-const-assign
          arrGroupName = item.label + ''
        }
      })
      params.groupName = arrGroupName.split('(')[0]
      params.jobName = arrGroupName.split('(')[1].substring(0, arrGroupName.split('(')[1].length - 1)
      console.log(params)
      if (!result || !workStatusChange) {
        // params.groupName =
        return
      }
      //  附件上传有点问题 先注释
      // this.fileFnSetParams(null, null, params)
      const update = () => {
        this.isLoading = true
        this.$axios.postJson(
          postUrl,
          params,
          res => {
            this.loadStatus = 'success'
            this.storage.set('refresh-workFlow-list', true)
            this.isLoading = false
            setTimeout(function() {
              this.loadStatus = 'none'
              window.history.back(-1)
            }, 1000)
          },
          error => {
            this.isLoading = false
          }
        )
      }
      if (this.verify.verified(verfing)) {
        console.log('params', params)
        console.log('detail', this.detail)
        if (params.workResult > 1) {
          params.workStatusNext = ''
        }
        params.workStatusNext = ''
        params.workTimeNext = ''
        params.workTimeNextEnd = ''
        params.interviewerNext = ['']
        params.outerInterviewerNext = ''
        update()
      }
    },
    setData(data) {
      const params = data

      return params
    }
  }
}
</script>
<style scoped lang="scss">
.approval-form {
  width: 573px;
  height: 91px;
  background: rgba(183, 0, 7, 1);
  border-radius: 5px 5px 5px 5px;
  color: white;
  font-size: 36px;
  margin-top: 20px;
}
</style>
