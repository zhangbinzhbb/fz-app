<template>
  <div id="Knowledge" class="has-comment">
    <headerx cat-title="客户信息"/>
    <div class="comment-content no-comment">
      <!-- 基本信息 -->
      <basic-form
        v-if="CUST_TYPE==3"
        ref="basicForm"
        :schema="basicForm1.org"
        :model="detail"
        class="basic-form"
      />
      <basic-form
        v-if="CUST_TYPE==1"
        ref="basicForm"
        :schema="basicForm1.company"
        :model="detail"
        class="basic-form"
      />
      <basic-form
        v-if="CUST_TYPE==2"
        ref="basicForm"
        :schema="basicForm1.person"
        :model="detail"
        class="basic-form"
      />
      <!-- 业务信息 -->
    </div>
  </div>
</template>
<script>
export default {
  components: {
    basicForm: () => import('@/components/basicForm/detail')
  },
  data() {
    return {
      detail: {
      },
      CUST_TYPE: this.$route.query.CUST_TYPE,
      basicForm1: {
        org: {
          groups: [
            {
              legend: '',
              fields: [
                {
                  type: 'input',
                  // modelKey: '',
                  label: '客户编号',
                  modelKey: 'YHKG_NO'
                },
                // {
                //   label: '客户类型',
                //   type: 'input',
                //   modelKey: 'SUB_TYPE_NAME',
                //   hidden: true
                // },
                {
                  label: '客户名称',
                  type: 'input',
                  modelKey: 'OC_NAME'
                },
                {
                  label: '机构属性',
                  type: 'input',
                  modelKey: 'SUB_TYPE_NAME'
                },
                {
                  label: '注册名称',
                  type: 'input',
                  modelKey: 'REG_NAME'
                },
                {
                  label: '注册地点',
                  type: 'input',
                  modelKey: 'REG_ADD'
                },
                {
                  label: '注册时间',
                  type: 'input',
                  modelKey: 'REG_DATE'
                },
                {
                  label: '注册资本',
                  type: 'input',
                  modelKey: 'REG_CAPITAL'
                },
                {
                  label: '投资阶段',
                  type: 'input',
                  modelKey: 'INVE_PHASE_NAME'
                }
              ]
            },
            {
              fields: [
                {
                  label: '联系人',
                  type: 'input',
                  modelKey: 'CONTACT'
                },
                {
                  label: '联系电话',
                  type: 'input',
                  modelKey: 'PHONE_NO'
                },
                {
                  label: '邮箱',
                  type: 'input',
                  modelKey: 'EMAIL'
                }
              ]
            }
          ]
        },
        company: {
          groups: [
            {
              legend: '',
              fields: [
                {
                  label: '客户编号',
                  type: 'input',
                  modelKey: 'YHKG_NO'
                },
                // {
                //   label: '客户类型',
                //   type: 'input',
                //   modelKey: 'SUB_TYPE_NAME',
                //   hidden: true
                // },
                {
                  label: '客户名称',
                  type: 'input',
                  modelKey: 'CH_NAME'
                },
                {
                  label: '企业英文',
                  type: 'input',
                  modelKey: 'EN_NAME'
                },
                {
                  label: '机构代码',
                  type: 'input',
                  modelKey: 'ORGN_CODE'
                },
                {
                  label: '公司类型',
                  type: 'input',
                  modelKey: 'ENTERPRISE_FORM'
                },
                {
                  label: '成立日期',
                  type: 'input',
                  modelKey: 'SETUP_DT'
                },
                {
                  label: '所属行业',
                  type: 'input',
                  modelKey: 'INDUSTRY'
                },
                {
                  label: '法定代表',
                  type: 'input',
                  modelKey: 'CONTROLLER'
                },
                {
                  label: '联系人',
                  type: 'input',
                  modelKey: 'CONTACT'
                },
                {
                  label: '联系电话',
                  type: 'input',
                  modelKey: 'CONTACT_TEL'
                },
                {
                  label: '主营业务',
                  type: 'input',
                  modelKey: 'BUSINESS'
                }
              ]
            }
          ]
        },
        person: {
          groups: [
            {
              legend: '',
              fields: [
                {
                  label: '客户编号',
                  type: 'input',
                  modelKey: 'YHKG_NO'
                },
                // {
                //   label: '客户类型',
                //   type: 'input',
                //   modelKey: 'SUB_TYPE_NAME',
                //   hidden: true
                // },
                {
                  label: '客户名称',
                  type: 'input',
                  modelKey: 'PC_NAME'
                },
                {
                  label: '性别',
                  type: 'input',
                  modelKey: 'GENDER'
                },
                {
                  label: '身份证号码',
                  type: 'input',
                  modelKey: 'ID_NO'
                },
                {
                  label: '国籍',
                  type: 'input',
                  modelKey: 'NATIONALITY'
                },
                {
                  label: '联系电话',
                  type: 'input',
                  modelKey: 'PHONE_NO'
                }
              ]
            }
          ]
        }
      }
    }
  },
  created() {
    this.getcustomerDetail(true)
  },
  methods: {
    getcustomerDetail() {
      // console.log(this)
      this.$axios.get(
        '/CustomerViewAction/customerViewDetail.do',
        {
          PK_ID: this.$route.query.PK_ID,
          loginName: this.$route.query.loginName,
          CUST_TYPE: this.CUST_TYPE
        },
        res => {
          // console.log(res.dataContent)
          this.detail = res.dataContent
          if (this.CUST_TYPE == 3) {
            this.basicForm1.org.groups[0].fields.map(item => {
              if (item.modelKey in res.dataContent) {
                this.$set(this.detail, item.modelKey, res.dataContent[item.modelKey])
              }
            })
          } else if(this.CUST_TYPE == 1){
            this.basicForm1.company.groups[0].fields.map(item => {
              if (item.modelKey in res.dataContent) {
                this.$set(this.detail, item.modelKey, res.dataContent[item.modelKey])
              }
            })
          } else if(this.CUST_TYPE == 2){
            this.basicForm1.person.groups[0].fields.map(item => {
              if (item.modelKey in res.dataContent) {
                this.$set(this.detail, item.modelKey, res.dataContent[item.modelKey])
              }
            })
          }
          if (this.detail.REG_CAPITAL) {
            this.detail.REG_CAPITAL =
              this.detail.REG_CAPITAL + this.detail.REG_CURRENCY_NAME
          }
        }
      )
    }
  }
}
</script>
<style scoped lang="scss">
  /deep/ .fd-form-detail .fd-detail-item .is-link-content{
    max-width: 60%;
  }
  /deep/ .van-row {
    background: #fff;
    margin-bottom: 20px;
    .van-col {
      font-size: 28px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      line-height: 60px;
      /*padding: 10px 10px 10px 10px;*/
      text-align: left;
      .custleft {
        padding:30px 40px!important;
        font-size:28px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(158,158,157,1);
        line-height:40px;
      }
      .custright {
        padding:30px 40px!important;
        font-size:28px;
        font-family:PingFangSC-Medium,PingFang SC;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:40px;
      }
    }

    .title {
      font-size: 31px;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: rgba(68, 68, 68, 1);
    }
    .border_top {
      border-bottom: 2px solid rgba(222, 222, 222, 1);
    }
    .border_top:nth-of-type(9){
      border-bottom: 18px solid #F8F8F8;
    }
  }
  .van-row {
    margin-bottom: 0;
  }
  .basic-form {
    margin-bottom: 20px;
  }
  /deep/.fd-form-detail .fd-detail-item .is-link-content{
    text-align: right;
  }
</style>
