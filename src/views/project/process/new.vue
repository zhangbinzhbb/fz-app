<template>
  <div class="has-comment">
    <headerx :cat-title="catTitle"/>
    <basic-form
      ref="basicForm"
      :form="basicForm"
      :data="detail"
      @submit="submit"
      @reset="beforeInit"
    />
  </div>
</template>
<script>
import mixins from '../mixins/index_process'
export default {
  components: {
    basicForm: () => import('@/components/basicForm/index')
  },
  mixins: [mixins],
  data() {
    return {
      catTitle: '新建项目进展',
      popIsShow: false,
      isShow: false,
      isShow1: false,
      isShow2: false,
      filterList: [
        {
          name: '联系人',
          subList: [],
          labelName: 'name',
          labelId: 'id'
        }
      ]
    }
  },
  watch: {
    //  选择企业后
    'detail.projectObject'(val) {
      if (this.$route.query.projectObject) {
      } else {
        this.basicForm[0].options.map((item, index) => {
          if (item.projObject === this.detail.projectObject) {
            this.$set(this.detail, 'projectId', item.projId)
            this.$set(this.detail, 'inveId', item.inveId)
            this.$set(this.detail, 'inveName', item.inveName)
            this.$set(this.detail, 'projectObject', item.projObject)
            this.$set(this.detail, 'projectObjectName', item.projName)
            this.$set(this.detail, 'groupId', item.groupId)
            if (item.projStatus != null) {
              this.$set(this.detail, 'progressStatus', item.projStatus)
            } else {
              this.$set(this.detail, 'progressStatus', '')
            }
            // 选择公司后，通过公司id 来获取联系人
            this.$axios.get(
              '/projectProgress/getAllUser',
              {
                groupId: item.groupId
              },
              res => {
                this.filterList[0].subList = res.data.AppUserIdNameList
              }
            )
            this.$axios.get(
              '/projectProgress/getDealmarkByThreeId',
              {
                projectObject: item.projObject,
                inveId: item.inveId,
                groupId: item.groupId
              },
              res => {
                this.$set(this.detail, 'dealMark', res.data.dealMark)
              }
            )
          } else {
          }
        })
      }
    },
    //  当用户输入@后
    'detail.progressText'(newValue, oldValue) {
      //  判断用户输入的字符为@ 删除时触碰到@不触发 初始时没有length
      try {
        if (oldValue === undefined || newValue.length - oldValue.length >= 0) {
          // 当新值最后位为@ 或 九宫格输入法下 旧值最后一位为_（不然输入其他 旧值判定最后位为_ 调出）且新值最后位为@时候 调出
          if (
            newValue.charAt(newValue.length - 1) === '@' ||
            newValue === '@' ||
            (oldValue.charAt(oldValue.length - 1) === '_' &&
              newValue.charAt(newValue.length - 1) === '@')
          ) {
            if (this.detail.groupId > 0) {
              this.$refs.rightPopup.showPopup()
              // document.getElementsByTagName('textarea')[0].blur()
            } else {
              this.Toast('请先选择公司！')
            }
          }
        } else {
        }
      } catch (e) {
        // console.log(e)
      }
      this.$set(this.detail, 'progressHtml', this.detail.progressText)
    }
  },
  created() {
    this.getFilterList()
  },
  mounted() {
    // this.addEven()
  },
  methods: {
    getFilterList() {
      if (this.$route.query.projectObject) {
        this.$axios.get(
          '/projectProgress/getAllUser',
          {
            groupId: this.$route.query.groupId
          },
          res => {
            this.filterList[0].subList = res.data.AppUserIdNameList
          }
        )
      }
    },
    searchConfirm() {
      const getChecked = (list, keyWord) => {
        const arr = []
        list.map(item => {
          //  给选中的人 添加标识符
          if (item.isChecked) {
            arr.push('' + item[keyWord] + '')
          }
        })
        return arr.join()
      }
      this.filterList.map(item => {
        item.checkIds = getChecked(item.subList, item.labelId)
        item.checkName = getChecked(item.subList, item.labelName)
      })
      if (this.filterList[0].checkIds === '') {
      } else {
        this.detail.allUserIds += this.filterList[0].checkIds + ','
        this.detail.allUserNames += this.filterList[0].checkName + ','
      }
      // 将@后的人 填入进去
      this.$set(
        this.detail,
        'progressText',
        this.detail.progressText +
          this.filterList[0].checkName.replace(/,/g, '@')
      )
      document.getElementsByTagName('textarea')[0].focus()
    },
    searchReset() {},
    submit(params) {
      if (this.isLoading) {
        return
      }
      const ast = this.detail.progressText.split('@')
      const nameAst = []
      //  通过标识符 获取所有人名
      ast.map((item, index) => {
        if (item.indexOf('') === -1) {
        } else {
          nameAst.push(
            item.substring(item.indexOf('') + 1, item.lastIndexOf(''))
          )
        }
      })
      //  获取相应的id
      const idAst = []
      nameAst.map((item, index) => {
        this.filterList[0].subList.map((v, k) => {
          if (item === v.name) {
            idAst.push(v.id)
          }
        })
      })
      //  存 值
      this.detail.allUserNames = nameAst.join(',')
      this.detail.allUserIds = idAst.join(',')
      this.$set(
        this.detail,
        'progressText',
        this.emoji2Str(this.detail.progressText)
      )
      const postUrl = '/projectProgress/add'
      const update = () => {
        this.isLoading = true
        this.$axios.postJson(
          postUrl,
          params,
          res => {
            this.isLoading = false
            this.Toast('保存成功！')
            this.storage.set('refresh-progress-list', true)
            window.history.back(-1)
          },
          error => {
            this.isLoading = false
          }
        )
      }
      update()
    }
  }
}
</script>
<style lang="scss">
.scfj {
  height: 90px;
  width: 90px;
  border: 1px dashed #3699ff;
  background-color: #dcf8ff;
  margin: 70px auto 90px auto;
}
.approval-form {
  width: 556px;
  height: 97px;
  background: rgba(184, 0, 8, 1);
  border-radius: 8px;
  font-size: 34px;
  color: rgba(255, 255, 255, 1);
}
.goform {
  margin: 245px 0px 20px 0px;
}
.backform {
  margin: 0px 0px 50px 0px;
}
</style>
