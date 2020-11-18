<template>
  <div class="bg-grey">
    <div v-for="(item,odx) in form" :key="odx" class="normal-item">
      <div class="title" @click="showToggle(odx)">
        {{item.title}}
        <!-- <span class="right">详情</span> -->
      </div>
      <div class="con" v-if="detail[item.objName]">
        <div v-show="!item.hidden">
          <div
            v-for="(listItem,i) in (item.type=='list'?detail[item.objName]:[1])"
            :key="i"
            :class="{'has-border':item.type=='list'&&detail[item.objName].length>1&&i!=detail[item.objName].length-1}"
          >
            <div v-for="(subItem,idx) in item.list" :key="idx" class="item">
              <span class="label">{{subItem.label}}:</span>
              <span
                class="value"
                :class="{'link':subItem.type=='link'}"
                v-if="subItem.type!='attachment'&&subItem.type!='more'"
                @click="goDetail(listItem,item,subItem)"
              >
                {{(detail[item.objName][subItem.name]||listItem[subItem.name]||'--')}}
                <span
                  class="active-money"
                  v-if="subItem.filter=='money'&&(detail[item.objName][subItem.name]||listItem[subItem.name])"
                >{{(detail[item.objName][subItem.name]||listItem[subItem.name])|formatMoney}}</span>
              </span>
              <attachment
                :data="detail[item.objName][subItem.name]||listItem[subItem.name]"
                v-if="(detail[item.objName][subItem.name]||listItem[subItem.name])&&subItem.type=='attachment'"
                :params="attachmentParams"
              ></attachment>
              <span v-if="subItem.type=='more'" class="value">
                <span
                  v-show="!subItem.isShowAll"
                >{{isToggleAll(subItem,detail[item.objName][subItem.name]||listItem[subItem.name])}}</span>
                <span
                  v-show="subItem.isShowAll"
                >{{detail[item.objName][subItem.name]||listItem[subItem.name]}}</span>
                <span
                  class="active-money"
                  @click="toggleAll(idx,odx,subItem.isShowAll)"
                  v-if="detail[item.objName][subItem.name]&&detail[item.objName][subItem.name].length>50||listItem[subItem.name]&&listItem[subItem.name].length>50"
                >{{subItem.isShowAll?'<<<':'>>>'}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="bl"
        v-if="item.type=='list'&&(!detail[item.objName]||detail[item.objName].length==0)||((item.title=='主要人员'||item.title=='立项信息'||item.title=='投资决策')&&JSON.stringify(detail[item.objName])=='{}')"
      >没有找到任何数据</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyInformation',
  components: {
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
      // eslint-disable-next-line no-undef
      type: String, Number,
      default: () => {
        return 1
      }
    }
  },
  data () {
    return {
      attachmentParams: { iconHidden: true, sizeUnitHidden: true }
    }
  },
  created () {},
  activated () {},
  methods: {
    toggleAll (idx, odx, status) {
      this.$set(this.form[odx].list[idx], 'isShowAll', !status)
    },
    showToggle (formName, index) {
      formName = formName || 'basicForm'
      this.$set(this[formName][index], 'hidden', !this[formName][index].hidden)
    },
    goDetail (listItem, item, subItem) {
      if (subItem.type === 'link') {
        let params = { path: subItem.linkUrl, query: {} }
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
</style>
