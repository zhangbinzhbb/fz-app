<template>
  <div class="has-comment progress-html-reply">
    <headerx cat-title="进展回复"/>
    <div class="comment-content no-comment">
      <fd-form :model="detail">
        <fd-form-group>
          <fd-form-item :field="fields[0]">
            <div>
              <span>企业名称：{{ name || '--' }}</span>
            </div>
          </fd-form-item>
          <fd-form-item :field="fields[0]" class="progress-item-field">
            <div class="field-textarea">
              <!-- <p>项目进展</p> -->
              <van-cell-group>
                <van-field
                  v-model="detail.progressText"
                  rows="5"
                  type="textarea"
                  placeholder="@联系人"
                />
              </van-cell-group>
            </div>
          </fd-form-item>
        </fd-form-group>
        <div class="fd-button-group">
          <button class="van-button van-button--default van-button--normal" @click="submit">
            <span class="van-button__text">发布</span>
          </button>
        </div>
      </fd-form>
    </div>
    <search-filter
      ref="rightPopupFilter"
      :filter-list="filterList"
      @confirm="searchConfirm"
      @reset="searchReset"
    />
  </div>
</template>

<script>
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    fdFormGroup: () => import('@/components/form/form-group'),
    fdFormItem: () => import('@/components/form/form-item'),
    searchFilter: () => import('@/components/rightPopup/half')
  },
  data() {
    return {
      detail: {
        progressText: ''
      },
      fields: [
        {
          modelKey: 'progressText',
          label: '',
          rules: {
            required: true
          }
        }
      ],
      filterList: [
        {
          name: '联系人',
          subList: [],
          labelName: 'name',
          labelId: 'id'
        }
      ],
      progressId: this.$route.query.progressId || '',
      status: this.$route.query.status || '',
      name: this.$route.query.name || ''
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
            this.$refs.rightPopupFilter.showPopup()
            // if (this.detail.groupId > 0) {
            //   this.$refs.rightPopupFilter.showPopup()
            // }
          }
        }
      } catch (e) {
        // console.log(e)
      }
      // this.$set(this.detail, 'progressHtml', this.detail.progressText)
    }
  },
  created() {
    const groupId = '19'
    const projObject = '54201'
    const inveId = null
    this.getData(groupId, projObject, inveId)
  },
  methods: {
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
      console.log('this.detail', this.detail)
    },
    searchReset() {},
    submit() {
      if (this.isLoading) {
        return
      }
      if (!this.detail.progressText) {
        this.Toast('请输入')
        return
      }
      const ast = this.detail.progressText.split('@')
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
      //  获取相应的id
      const idAst = []
      nameAst.map((item, index) => {
        this.filterList[0].subList.map((v, k) => {
          if (item === v.name) {
            idAst.push(v.id)
          }
        })
      })

      this.$set(
        this.detail,
        'progressText',
        this.emoji2Str(this.detail.progressText)
      )

      // progressId-14735 // 外部
      // commentHtml
      // status - 0 // 外部
      // commentSource - 1
      // allUserIds
      // allUserNames
      // dealMark
      // dist
      // projStatus
      const progressId = this.progressId
      const commentHtml = this.emoji2Str(this.detail.progressText)
      const status = this.status
      const commentSource = '1'
      const allUserIds = idAst.join(',')
      const allUserNames = nameAst.join(',')
      const dealMark = this.detail.dealMark
      const dist = 'my'
      const projStatus = '0'
      const postUrl = '/progressComment/add'

      const params = {
        progressId,
        commentHtml,
        status,
        commentSource,
        allUserIds,
        allUserNames,
        dealMark,
        dist,
        projStatus
      }
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
.progress-html-reply {
  .progress-item-field .is-link-content {
    width: 100%;
    align-items: flex-start;
    justify-content: flex-start;
  }
  .field-textarea {
    width: 100%;
    p {
      padding-bottom: 10px;
    }
    .van-cell {
      border: 2px solid rgba(240, 240, 240, 1);
    }
  }
}
</style>
