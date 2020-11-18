<template>
  <div class="bg-grey">
    <div class="normal-item" >
      <div v-for="(formItem, odx) in form" class="title">
        <div class="sub-title">
          <img v-if="odx===0" src="@/assets/images/icons/icon7@2x.png">
          <img v-if="odx===1" src="@/assets/images/icons/icon9@2x.png">
          <img v-if="odx===2" src="@/assets/images/icons/icon1@2x.png">
          {{ formItem.title }}
          <van-icon
            :name="article[odx]?'arrow-up':'arrow-down'"
            class="arrow-icon"
            @click="toggle(odx)"
          />
        </div>
        <div v-if="detail[formItem.objName] && article[''+odx] && !formItem.isDecision" :class="form[odx].objName" class="con">
          <div>
            <div
              v-for="(listItem,i) in (form[odx].type=='list'?detail[form[odx].objName]:[1])"
              :key="i"
              :class="{'has-border':form[odx].type=='list'&&detail[form[odx].objName].length>1&&i!=detail[form[odx].objName].length-1}"
            >
              <div v-for="(subItem,idx) in form[odx].list" :key="idx" class="item">
                <span class="label">{{ subItem.label }}</span>
                <span
                  v-if="subItem.type!='attachment'&&subItem.type!='more'"
                  :class="{'link':subItem.type=='link'}"
                  class="value"
                >
                  {{ (detail[form[odx].objName][subItem.name]||listItem[subItem.name]||'--') }}
                  <span
                    v-if="subItem.filter=='money'&&(detail[form[odx].objName][subItem.name]||listItem[subItem.name])"
                    class="active-money"
                  >{{ (detail[form[odx].objName][subItem.name]||listItem[subItem.name])| formatMoney }}</span>
                </span>
                <attachment
                  v-if="(detail[form[odx].objName][subItem.name]||listItem[subItem.name])&&subItem.type=='attachment'"
                  :data="detail[form[odx].objName][subItem.name]||listItem[subItem.name]"
                  :params="attachmentParams"
                />
                <span v-if="!(detail[form[odx].objName][subItem.name]||listItem[subItem.name])&&subItem.type=='attachment'">--</span>
                <span v-if="subItem.type=='more'" class="value">
                  <span
                    v-show="!subItem.isShowAll"
                  >{{ isToggleAll(subItem,detail[form[odx].objName][subItem.name]||listItem[subItem.name]) || '--' }}
                    <span
                      v-if="detail[form[odx].objName][subItem.name]&&detail[form[odx].objName][subItem.name].length>50||listItem[subItem.name]&&listItem[subItem.name].length>50"
                      class="active-money active-text"
                      @click="toggleAll(idx,odx,subItem.isShowAll)"
                    >{{ subItem.isShowAll?'':'展开' }}</span>
                  </span>
                  <span
                    v-show="subItem.isShowAll"
                  >{{ detail[form[odx].objName][subItem.name]||listItem[subItem.name] }}
                    <span
                      v-if="detail[form[odx].objName][subItem.name]&&detail[form[odx].objName][subItem.name].length>50||listItem[subItem.name]&&listItem[subItem.name].length>50"
                      class="active-money active-text"
                      @click="toggleAll(idx,odx,subItem.isShowAll)"
                    >{{ subItem.isShowAll?'收起':'' }}</span>
                  </span>
                  <!--                <span-->
                  <!--                  v-if="detail[form.objName][subItem.name]&&detail[form.objName][subItem.name].length>50||listItem[subItem.name]&&listItem[subItem.name].length>50"-->
                  <!--                  class="active-money"-->
                  <!--                  @click="toggleAll(idx,odx,subItem.isShowAll)"-->
                  <!--                >{{ subItem.isShowAll?'收起':'展开' }}</span>-->
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="article[''+odx] && formItem.isDecision">
          <step-vertical v-if="formItem.isDecision=='y'" :step-list="detail['projAppFixflowTaskList']"/>
          <step-vertical v-if="formItem.isDecision=='n'" :step-list="detail['projDecisionFixflowTaskList']"/>
        </div>
        <div
          v-if="form[odx].type=='list'&&(!detail[form[odx].objName]||detail[form[odx].objName].length==0)||((form[odx].title=='主要人员'||form[odx].title=='立项信息'||form[odx].title=='投资决策')&&JSON.stringify(detail[form[odx].objName])=='{}')"
          class="bl"
        >    <blank/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyInformation',
  components: {
    'step-vertical': () => import('@/views/projectXm/xm/projectStepVertical'),
    attachment: () => import('@/components/attachment/index')
  },
  props: {
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    form: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: Array,
      default: () => {
        return '1'
      }
    }
  },
  data() {
    return {
      article: {
        0: true,
        1: true,
        2: true,
        3: true,
        4: true
      },
      attachmentParams: { iconHidden: true, sizeUnitHidden: true }
    }
  },
  created() {},
  activated() {},
  methods: {
    toggle(odx) {
      this.article['' + odx] = !this.article['' + odx]
    },
    toggleAll(idx, odx, status) {
      console.log(idx, odx, status)
      console.log(this.form[odx])
      this.form[odx].list[idx].isShowAll = !status
      // this.$set(this.form[odx].list[idx], 'isShowAll', !status)
    },
    showToggle(formName, index) {
      formName = formName || 'basicForm'
      this.$set(this[formName][index], 'hidden', !this[formName][index].hidden)
    },
    goDetail(listItem, item, subItem) {
      if (subItem.type === 'link') {
        const params = { path: subItem.linkUrl, query: {}}
        params.query[subItem.linkParams] =
          this.detail[item.objName][subItem.name] ||
          listItem[subItem.linkParams]
        if (subItem.linkMultiple && listItem.projTypeName === '投基金') {
          params.path = 'subFoudsDetail'
          params.query.id = listItem.projId
        }
        this.$router.push(params)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.link {
  color: #008af5 !important;
}
.sub-title {
  display: block;
  width: 100%;
  font-size: 28px;
  background-color: #fdf1f1;
  padding: 0px 40px;
  overflow: hidden;
  box-sizing: border-box;
  line-height: 88px;
  img {
    width: 22px;
    vertical-align: middle;
  }
  span {
    vertical-align: middle;
  }
  .arrow-icon {
    float: right;
    margin-top: 30px;
  }
}
</style>
