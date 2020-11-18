<template>
  <div class="has-comment progress-html-comment">
    <headerx :cat-title="catTitle"/>
    <div class="comment-content no-comment">
      <fd-form :model="detail">
        <fd-form-group>
          <fd-form-item :field="fields[0]">
            <span class="field-first" @click="toSelect">{{ detail.companyLabel || '请选择项目' }}<van-icon name="arrow"/></span>
          </fd-form-item>
          <fd-form-item :field="fields[1]" class="progress-item-field">
            <div class="field-textarea">
              <p>项目进展</p>
              <van-cell-group>
                <van-field
                  v-model="detail.progressText"
                  rows="5"
                  type="textarea"
                  placeholder="请填写项目进展，可@联系人"
                />
              </van-cell-group>
            </div>
          </fd-form-item>
        </fd-form-group>
        <div class="fd-button-group"><button class="van-button van-button--default van-button--normal" @click="submit()"><span class="van-button__text">提交</span></button></div>
      </fd-form>
    </div>
    <right-popup ref="rightPopup" :cat-title="catTitle" @confirm="confirmHandler"/>
    <search-filter
      ref="rightPopupFilter"
      :filter-list="filterList"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>
<script>
import mixins from './mixins/index_process'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    fdFormGroup: () => import('@/components/form/form-group'),
    fdFormItem: () => import('@/components/form/form-item'),
    rightPopup: () => import('@/components/rightPopup/halfCompany'),
    searchFilter: () => import('@/components/rightPopup/half')
  },
  mixins: [mixins],
  data() {
    return {
      catTitle: '选择项目',
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
              // this.getData()
              this.$refs.rightPopupFilter.showPopup()
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
  methods: {
    toSelect() {
      this.$refs.rightPopup.showPopup()
    },
    confirmHandler(arr) {
      if (arr.length) {
        const item = arr[0]
        const projId = item.value
        const projName = item.label
        const inveId = item.inveId
        const inveName = item.inveName
        const projObject = item.projObject
        const projObjectName = item.projObjectName
        const groupId = item.groupId
        const projStatus = item.projStatus

        this.detail.companyValue = projId
        this.detail.companyLabel = projName
        this.$set(this.detail, 'projectId', projId)
        this.$set(this.detail, 'inveId', inveId)
        this.$set(this.detail, 'inveName', inveName)
        this.$set(this.detail, 'projectObject', projObject)
        this.$set(this.detail, 'projectObjectName', projObjectName)
        this.$set(this.detail, 'groupId', groupId)
        if (projStatus != null) {
          this.$set(this.detail, 'progressStatus', projStatus)
        } else {
          this.$set(this.detail, 'progressStatus', '')
        }
        this.getData(groupId, projObject, inveId)
      }
    },
    getData(groupId, projectObject, inveId) {
      // 选择公司后，通过公司id 来获取联系人
      this.$axios.get(
        '/projectProgress/getAllUser',
        {
          groupId
        },
        res => {
          this.filterList[0].subList = res.data.AppUserIdNameList
        }
      )
      this.$axios.get(
        '/projectProgress/getDealmarkByThreeId',
        {
          projectObject,
          inveId,
          groupId
        },
        res => {
          this.$set(this.detail, 'dealMark', res.data.dealMark)
        }
      )
    },
    searchConfirm() {
      const getChecked = (list, keyWord) => {
        const arr = []
        list.map(item => {
          //  给选中的人 添加标识符
          if (item.isChecked) {
            arr.push(item[keyWord] + ' ')
          }
        })
        return arr.join()
      }
      this.filterList.map(item => {
        item.checkIds = getChecked(item.subList, item.labelId)
        item.checkName = getChecked(item.subList, item.labelName)
      })
      if (this.filterList[0].checkIds === '') {
        console.log('1')
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
      console.log('this.detail.progressText:', this.detail.progressText)
      document.getElementsByTagName('textarea')[0].focus()
    },
    searchReset() {
    },
    submit() {
      if (this.isLoading) {
        return
      }
      if (!this.detail.projectId) {
        this.Toast('请选择项目')
        return
      }
      this.$set(this.detail, 'dist', 'my')
      this.$set(this.detail, 'status', '0')
      this.$set(this.detail, 'progressResource', '0')
      const ast = this.detail.progressText.split('@')
      console.log('ast', ast)
      const nameAst = []
      //  通过标识符 获取所有人名
      ast.map((item, index) => {
        if (item.indexOf(' ') === -1) {
        } else {
          nameAst.push(
            item.substring(item.indexOf('@') + 1, item.lastIndexOf(' '))
          )
        }
      })
      console.log('nameAst', nameAst)
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
        console.log('params', this.detail)
        this.isLoading = true
        this.$axios.postJson(
          postUrl,
          this.detail,
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
    // 匹配出人名
  }
}
</script>
<style lang="scss">
.progress-html-comment{
  .field-first{
    display: flex;
    align-items: center;
  }
  .progress-item-field .is-link-content{
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .field-textarea{
    width: 100%;
    p{
      padding-bottom: 10px;
    }
    .van-cell{
      border:2px solid rgba(240,240,240,1);
    }
  }
}
/*.yh-header-x{*/
/*  z-index:2020!important;*/
/*}*/
.v-modal{
  z-index:1989!important;
}
.mint-popup-right{
  z-index:1990!important;
}

</style>
