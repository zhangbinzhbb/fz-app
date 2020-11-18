<template>
  <div class="healthy has-comment">
    <headerx cat-title="每日健康上报" page-type="back" @closeBack="closeBackHanler"/>
    <div class="comment-content no-comment">
      <div>
        <fd-form :model="model">
          <fd-form-group>
            <fd-form-item :field="fields[0]">
              <span class="field-first">{{ model.reportBy }}</span>
            </fd-form-item>
            <fd-form-item :field="fields[1]"/>
            <fd-form-item :field="fields[2]"/>
            <fd-form-item :field="fields[3]" class="fields-3"/>
            <fd-form-item :field="fields[4]"/>
            <fd-form-item :field="fields[5]" class="fields-5">
              <div class="fields-content">
                <h2>今天上班情况<span style="color:#b60005">*</span></h2>
                <div class="radio-group-5" >
                  <van-radio-group v-model="model.isPost" checked-color="#B60005">
                    <van-radio v-for="(item,index) in isPostList" :name="item.value" :key="index">{{ item.label }}</van-radio>
                  </van-radio-group>
                </div>
              </div>
            </fd-form-item>
            <fd-form-item :field="fields[6]"/>
            <fd-form-item v-if="fields[7]" :field="fields[7]" class="fields-7"/>
            <fd-form-item v-if="fields[8]" :field="fields[8]" class="fields-textarea"/>
            <fd-form-item v-if="fields[9]" :field="fields[9]"/>
            <fd-form-item v-if="fields[10]" :field="fields[10]">
              <div class="fields-10">
                <h2>同住家人健康状况<span style="color:#b60005">*</span></h2>
                <div class="radio-group" >
                  <van-radio-group v-model="model.check1" checked-color="#B60005">
                    <van-radio name="0">单独居住</van-radio>
                    <van-radio name="1">同住家人一切正常，无任何健康异常</van-radio>
                    <van-radio name="2">同住家人有健康异常情况</van-radio>
                  </van-radio-group>
                </div>
              </div>
            </fd-form-item>
            <fd-form-item v-if="fields[11]" :field="fields[11]" class="fields-textarea"/>
          </fd-form-group>
          <fd-form-group class="form-item-label-w">
            <div v-if="model.isSuzhou === '1'" class="fields-desc">
              <h2>过去2周内，是否途径、往返以下疫情重点地区，如有请选择并填写具体日期、行程（车次等）及相关人员信息<span style="color:#b60005">*</span> </h2>
              <div class="checkbox-group">
                <div v-for="(item,index) in checkboxList" :key="index" class="checkbox-item">
                  <div class="checkbox-left" @click="checkboxHandle(item,index)">
                    <span v-if="!item.active" class="box"/>
                    <span v-else class="box1">
                      <van-icon name="success" />
                    </span>
                    <span class="name">{{ item.label }}</span>
                  </div>
                  <div v-if="item.active" class="input-right">
                    <van-field v-model="model[item.modelKey2]" placeholder="请填写具体信息等" />
                  </div>
                </div>
              </div>
            </div>
            <fd-form-item v-if="fields[12]" :field="fields[12]"/>
            <fd-form-item v-if="fields[13]" :field="fields[13]" class="fields-textarea1"/>
            <fd-form-item v-if="fields[14]" :field="fields[14]"/>
            <fd-form-item v-if="fields[15]" :field="fields[15]" class="fields-textarea1"/>
            <fd-form-item v-if="fields[16]" :field="fields[16]"/>
            <fd-form-item v-if="fields[17]" :field="fields[17]" class="fields-textarea1"/>
            <fd-form-item v-if="fields[18]" :field="fields[18]"/>
            <fd-form-item v-if="fields[19]" :field="fields[19]" class="fields-textarea1"/>
            <h2 v-if="model.isSuzhou === '1'" class="tips-title">以下问题只有上述疫情重点地区人员填写</h2>
          </fd-form-group>
          <fd-form-group>
            <fd-form-item v-if="fields[20]" :field="fields[20]"/>
            <fd-form-item v-if="fields[21]" :field="fields[21]"/>
            <fd-form-item v-if="fields[22]" :field="fields[22]"/>
            <fd-form-item v-if="fields[23]" :field="fields[23]"/>
            <!-- <fd-form-item v-if="fields[24]" :field="fields[24]"/> -->
          </fd-form-group>
          <div v-if="model.isSubmit==='N'" class="pro-button-box">
            <span @click="submit">提交</span>
          </div>
        </fd-form>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from './mixins/index'
import { getUrlKey } from '@/utils/common.js'
export default {
  components: {
    fdForm: () => import('@/components/form/form'),
    fdFormGroup: () => import('@/components/form/form-group'),
    fdFormItem: () => import('@/components/form/form-item')
  },
  mixins: [mixins],
  data() {
    return {}
  },
  methods: {
    checkboxHandle(item, index) {
      item.active = !item.active
      const checkboxList = this.checkboxList
      checkboxList.map(checkItem => {
        if (item.modelKey1 === checkItem.modelKey1) {
          if (item.active) {
            this.model[checkItem.modelKey1] = '1'
          } else {
            this.model[checkItem.modelKey1] = '0'
            this.model[checkItem.modelKey2] = ''
          }
        }
      })
      this.$set(this.checkboxList[index], 'active', item.active)
    },
    closeBackHanler() {
      const windowType = getUrlKey('windowType')
      if (windowType) {
        window.close()
        return
      }
      this.$router.push({ path: '/process' })
    },
    submit() {
      const model = this.model
      const postUrl = '/dailyHealthyAction/save.do'
      const formVerify = (data, basicForm) => {
        let result = true
        basicForm.map(fieldComponent => {
          const modelKey = fieldComponent.modelKey
          const rules = fieldComponent.rules
          const hidden = fieldComponent.hidden
          if (typeof rules === 'object' && rules.required && !hidden) {
            if ((data[modelKey] === null || data[modelKey] === undefined || data[modelKey] === '')) {
              console.log('data-modelKey:', modelKey)
              this.Toast('请输入必填项')
              result = false
            }
          }
        })
        return result
      }
      const result = formVerify(model, this.fields)

      if (this.model.situation === 2) {
        this.Toast('请输入必填项')
        return
      }

      const formVerify1 = (data, basicForm) => {
        let result = true
        basicForm.map(item => {
          const modelKey = item.modelKey1
          const modelKey2 = item.modelKey2
          if (data[modelKey] === '1') {
            if ((data[modelKey2] === null || data[modelKey2] === undefined || data[modelKey2] === '')) {
              console.log('data-modelKey:', modelKey)
              this.Toast('请输入必填项')
              result = false
            }
          }
        })
        return result
      }
      const resultCheck = formVerify1(model, this.checkboxList)

      const isPost = model.isPost
      const isSuzhou = model.isSuzhou
      const inSuzhou = model.inSuzhou
      const arriveDtStr = model.arriveDtStr
      const situation = model.situation
      const symptom = model.symptom
      const measures = model.measures
      const address = model.address
      const street = model.street
      const isReport = model.isReport
      const isComfirm = model.isComfirm
      const remark = model.remark
      const company = model.company
      const department = model.department
      const reportDtStr = model.reportDtStr
      const leaveCity = model.leaveCity

      const check1 = model.check1
      const check2 = model.check2
      const check3 = model.check3
      const check4 = model.check4

      const check5 = model.check5
      const check6 = model.check6
      const check7 = model.check7
      const check8 = model.check8
      const check9 = model.check9
      const check10 = model.check10
      const check11 = model.check11
      const check12 = model.check12
      const check13 = model.check13
      const check14 = model.check14
      const check15 = model.check15

      const content1 = model.content1
      const content2 = model.content2
      const content3 = model.content3
      const content4 = model.content4
      const content5 = model.content5
      const content6 = model.content6
      const content7 = model.content7
      const content8 = model.content8
      const content9 = model.content9
      const content10 = model.content10
      const content11 = model.content11
      const content12 = model.content12
      const content13 = model.content13
      const content14 = model.content14
      const content15 = model.content15

      const data = {
        isPost, isSuzhou, inSuzhou, arriveDtStr, situation, symptom, measures,
        address, street, isReport, isComfirm, remark, company, department,
        reportDtStr, leaveCity,
        check1, check2, check3, check4, check5, check6, check7, check8, check9, check10, check11, check12, check13, check14, check15,
        content1, content2, content3, content4, content5, content6, content7, content8, content9, content10, content11, content12, content13, content14, content15
      }

      const params = data
      const update = () => {
        this.$axios.postJson(
          postUrl,
          params,
          res => {
            if (res.statue === '0') {
              const windowType = getUrlKey('windowType')
              if (windowType) {
                window.close()
                return
              }
              this.$router.push({ path: '/process' })
            }
          },
          error => {
            this.Toast(`${error.msg}`)
          }
        )
      }
      if (result && resultCheck) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '确定进行提交操作'
        }).then(() => {
          update()
        }).catch(() => {
          // on cancel
        })
      }
    }
  }
}
</script>

<style lang="scss">
.healthy{
  .tips-title{
     font-size: 28px;
     padding: 14px 0 0 40px;
     color: rgba(182,0,5,1);
  }
  .fields-10{
    h2{
      font-weight: 500;
      color: #9e9e9d;
      font-size: 28px;
    }
    .radio-group{
      .van-radio{
        padding-top: 14px;
      }
      .van-radio__label{
        color:rgba(76,76,76,1);
      }
    }
  }
  .fields-desc{
    background-color: #fff;
    border-bottom: 1px solid #F0F0F0;
    padding: 30px 40px;
    h2{
      font-weight: 500;
      color: #9e9e9d;
      font-size: 28px;
    }
  }
  .checkbox-group{
    .checkbox-item{
      display: flex;
      flex-direction: column;
      padding-top: 20px;
      .checkbox-left{
        display: flex;
        align-items: center;
        .box{
          border: 1px solid #ccc;
          width: 40px;
          height: 40px;
        }
        .box1{
          border: 1px solid #ccc;
          width: 40px;
          height: 40px;
          color: #fff;
          background-color: #B60005;
          border-color: #B60005;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .name{
          padding-left: 14px;
        }
      }
      .input-right{
        // width: 78%;
        // .van-cell{
        //   padding-top: 0;
        //   padding-bottom: 0;
        // }
      }
    }
  }
  .fields-3{
    .is-link-content{
      width: 100%;
    }
  }
  .fields-5{
    .fields-content{
      h2{
        font-weight: 500;
        color: #9e9e9d;
        font-size: 28px;
      }
      .radio-group-5{
        .van-radio{
          padding-top: 14px;
        }
      }
    }
  }
  .fields-7{
    .fd-form-label{
      max-width: 400px;
    }
  }
  .fields-18{
    .is-link-content{
      width: 65%;
    }
  }
  .fields-textarea{
    padding-bottom: 0!important;
    .is-link-content{
      width: 100%;
    }
  }
  .fields-textarea1{
    // padding-bottom: 0!important;
    .is-link-content{
      width: 100%;
    }
  }
  .form-item-label-w{
    .fd-form-label {
        max-width: 480px!important;
    }
  }
  .pro-button-box{
    display: flex;
    flex-direction: column;
    padding: 30px 40px;
    span{
      height:76px;
      line-height: 76px;
      text-align: center;
      background:rgba(182,0,5,1);
      border-radius:4px;
      font-size:28px;
      font-weight:500;
      color:rgba(255,255,255,1);
      &+span{
        margin-top: 20px;
      }
    }
  }
}
</style>
