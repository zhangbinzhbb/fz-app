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
    <loading :load-type="loadStatus" />
  </div>
</template>
<script>
import mixins from './mixins/index'

export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    loading: () => import('@/components/loading/index')
  },
  mixins: [mixins],
  data () {
    return {
      catTitle: this.$route.query.id ? '简历编辑' : '新增简历',
      id: this.$route.query.id,
      loadStatus: 'none'
    }
  },
  created () {
    this.Toast('需要上传附件，请到PC端操作')
    // this.Toast.loading({
    //   type: 'html',
    //   message: '需要上传附件，请到PC端操作',
    //   duration: 2000
    // })
  },
  methods: {
    submit (params) {
      console.log(params)
      // const compareArrayValue = arr => {
      //   let result = true
      //   const compare = property => {
      //     return function (obj1, obj2) {
      //       var value1 = obj1[property]
      //       var value2 = obj2[property]
      //       return value1 - value2 // 升序
      //     }
      //   }
      //   let nary = arr.sort(compare('label'))
      //   for (let i = 0; i < nary.length - 1; i++) {
      //     if (nary[i].label === nary[i + 1].label) {
      //       result = false
      //     }
      //   }
      //   return result
      // }
      //
      // if (this.isLoading) {
      //   return
      // }
      // if (
      //   !compareArrayValue(this.basicForm[this.basicForm.length - 2].options)
      // ) {
      //   this.Toast('标签内容不能相同')
      //   return
      // }
      let postUrl = '/resumeManagement/add'
      if (this.$route.query.id) {
        postUrl = '/resumeManagement/update/' + this.$route.query.id
      }
      const verfing = [
        {
          name: 'appointMaxLength',
          content: params.userName + ';25',
          tip: '姓名最大长度25'
        },
        {
          name: 'appointMaxLength',
          content: params.graduateSchool + ';500',
          tip: '毕业院校最大长度500'
        },
        {
          name: 'appointMaxLength',
          content: params.major + ';25',
          tip: '专业最大长度25'
        },
        {
          name: 'appointMaxLength',
          content: params.unit + ';25',
          tip: '来源单位最大长度25'
        },
        {
          name: 'appointMaxLength',
          content: params.resumeRemak + ';500',
          tip: '备注最大长度500'
        }
      ]
      const isName = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/
      const isIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      const mobile = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/
      if (!isName.test(this.detail.userName)) {
        this.Toast('请输入合法的姓名')
        return
      }
      if (!mobile.test(this.detail.telephone)) {
        this.Toast('请输入正确的手机号')
        return
      }
      let result1 = true
      if (this.detail.idCard && this.detail.idCard != '') {
        if (!isIdCard.test(this.detail.idCard)) {
          this.Toast('请输入正确的身份证号')
          result1 = false
        } else {
          result1 = true
        }
      } else {
        result1 = true
      }
      if (!result1) {
        return
      }
      const update = () => {
        this.isLoading = true
        this.$axios.postJson(postUrl, params, res => {
          this.loadStatus = 'success'
          this.storage.set('refresh-resume-list', true)
          this.isLoading = false
          setTimeout(function() {
            this.loadStatus = 'none'
            window.history.back(-1)
          }, 1000)
        })
      }
      // 判断是否存在
      const isExit = () => {
        if (this.$route.query.id) {
          if (
            this.detail.userName != this.cmpData.userName ||
            this.detail.telephone != this.cmpData.telephone
          ) {
            this.$axios.get(
              '/resumeManagement/isExit',
              {
                userName: this.detail.userName,
                telephone: this.detail.telephone
              },
              res => {
                update()
              },
              error => {
                this.Toast('该姓名和手机号已存在！')
              }
            )
          } else {
            update()
          }
        } else {
          this.$axios.get(
            '/resumeManagement/isExit',
            {
              userName: this.detail.userName,
              telephone: this.detail.telephone
            },
            res => {
              update()
            },
            error => {
              this.Toast('该姓名和手机号已存在！')
            }
          )
        }
      }
      if (this.verify.verified(verfing)) {
        // const labelTablesArr = []
        // this.basicForm[this.basicForm.length - 2].options.map(option => {
        //   if (option.label && option.label != '') {
        //     labelTablesArr.push(option.label)
        //   }
        // })
        // params.labelTables = labelTablesArr.join(',')
        console.log(params)
        isExit()
      }
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
  input[disabled='disabled'] {
    color: red;
  }
</style>
