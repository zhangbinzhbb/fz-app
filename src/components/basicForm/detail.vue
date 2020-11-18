<template>
  <div ref="form" class="fd-form-detail" >
    <div v-for="(group, index) in groups" :key="index" class="fd-detail-group">
      <p v-if="group.legend" class="fd-detail-group-legend">{{ group.legend }}</p>
      <div class="fd-detail-group-content">
        <div v-for="(field, index) in group.fields" :key="index">
          <div v-if="!field.modelHidden" :class="[{'flex-column' : field.type==='textarea'}, {'no-file': field.type==='upload'&&model[field.modelKey].length<=0}]" class="fd-detail-item border-bottom-1px">
            <template v-if="field.type!=='tree'">
              <slot name="label">
                <div v-show="field.label || field.props.title" class="fd-detail-label"><span>{{ field.label || field.props.title }}</span></div>
              </slot>
              <div class="is-link-content">
                <slot v-if="field.slot" :name="field.slot"/>
                <span v-if="(field.type==='input' || field.type==='date')&& !field.slot"> {{ model[field.modelKey]?model[field.modelKey]:'--' }}</span>
                <span v-if="field.type==='select' || field.type==='popupRadio'">
                  {{ getValue (field.props.options, 'value','label', model[field.modelKey]) }}
                </span>
                <span v-if="field.type==='switch'">
                  {{ model[field.modelKey] ==='0' || model[field.modelKey]==='' ?'否':'是' }}
                </span>
                <div v-if="field.type==='checker'&& !field.slot">
                  <fd-checker
                    v-model="model[field.modelKey]"
                    :options="field.props.options"
                    :type="field.props.type === 'radio'?'radio':'checkbox'" />
                    <!-- {{ getValue (field.props.options, 'value','text', model[field.modelKey]) }} -->
                </div>
                <div v-if="field.type==='upload'">
                  <p v-for="(item, index) in model[field.modelKey]" :key="index" class="upload-item" @click="$emit('viewFile', item)">
                    <img :src="require('@/assets/images/file/comment-'+ (item.fileType || item.FILE_TYPE )+'.png')" alt="">
                    <span>{{ item.fileOldName || item.FILE_OLD_NAME }}</span>
                  </p>
                </div>
                <div v-if="field.type==='addInput'">
                  <div v-if="model[field.modelKey]!='' && model[field.modelKey]" class="addInput">
                    <li v-for="(item,mIndex) in model[field.modelKey].split(',')" :key="mIndex">
                      {{ item }}
                    </li>
                  </div>
                  <div v-else>--</div>
                </div>
              </div>
              <div v-if="field.type==='textarea'" class="textArea">{{ model[field.modelKey]?model[field.modelKey]:'--' }}</div>
            </template>
            <template v-else>
              <div class="fd-person-content">
                <p class="top">
                  <span>{{ field.props.label }}</span>
                  <span>共 {{ field.options.length }} 人</span>
                </p>
                <ul v-if="field.options.length" class="user-list-content">
                  <li v-for="sitem in field.options" :key="sitem.value" class="user-item">
                    <div class="item-pic" >
                      <img v-if="sitem.src" :src="sitem.src" alt="" srcset="">
                      <span v-else>{{ sitem.label | formatName }}</span>
                    </div>
                    <span class="item-name van-ellipsis">{{ sitem.label }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const COMPONENT_NAME = 'fd-detail'
export default {
  name: COMPONENT_NAME,
  components: {
    fdChecker: () => import('@/components/checker/checker')
  },
  props: {
    model: {
      type: Object,
      default() {
        /* istanbul ignore next */
        return {}
      }
    },
    schema: {
      type: Object,
      default() {
        /* istanbul ignore next */
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    groups() {
      const schema = this.schema
      const groups = schema.groups || []
      if (schema.fields) {
        groups.unshift({
          fields: schema.fields
        })
      }
      return groups
    }
  },
  watch: {
    iconShow(item, index) {
      if (item.type === 'workFlow') {
        this.rightPopupOpen(item, index)
        return
      }
    }
  },
  beforeCreate() {
    this.form = this
    this.fields = []
  },
  mounted() {},
  beforeDestroy() {
    this.form = null
  },
  methods: {
    /* 单选值查询 */
    getValue(list, keyName, valueName, value) {
      let resStr = ''
      if (list) {
        list.map(item => {
          if (item[keyName] === String(value)) {
            resStr = item[valueName]
          }
        })
      }
      return resStr
    }

  }
}
</script>

<style lang="scss">
 @import "../../common/styles/variable.scss";
  @import "../../common/styles/mixin.scss";
.fd-form-detail{
  position: relative;
  font-size:28px;
  line-height: 1.429;
  color:rgba(158,158,157,1);
  .fd-detail-group{
    overflow: hidden;
    margin-bottom: 17px;
    background-color: #F8F8F8;
    .fd-detail-group-legend{
      padding: 0 40px 17px 40px;
      font-size: $fontsize-large-xxx;
      color: $form-group-legend-color;
      background-color: $form-group-legend-bgc;
    }
  }
  .fd-detail-item{
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 30px 40px;
    background-color: #fff;
    font-size:28px;
    &+.fd-detail-item{
      border-top: 1px solid #F0F0F0;
    }
    &.flex-column{
      flex-flow: column nowrap;
      align-items: flex-start;
    }
    &.no-file{
      padding: 0;
      border: none;
    }
    .fd-detail-label{
      font-size:28px;
      font-weight:500;
      color:rgba(158,158,157,1);
      word-wrap: break-word;
      word-break: break-word;
      min-width: 120px;
      max-width: 250px;
    }
    .is-link-content{
      font-weight:500;
      color:rgba(76,76,76,1);
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .fd-checker{
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      .upload-item{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        overflow-x: hidden;
        margin: 10px 0;
        img{
          width: 42px;
          height: 50px;
          margin-right: 10px;
        }
        span{
          display: block;
          width: 600px;
          // white-space: nowrap;
          // text-overflow: ellipsis;
          // overflow: hidden;
          text-align: left;
        }
      }
    }
    .textArea{
      font-weight:500;
      color:rgba(76,76,76,1);
    }
  }
}
.fd-person-content{
  width: 100%;
  .top{
    display: flex;
    justify-content: space-between;
  }
  .user-list-content{
    display: flex;
    justify-content: flex-start;
    flex-flow: row wrap;
    padding-top: 20px;
    margin-left: -20px;
    .user-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90px;
      margin:20px 10px 20px 0px;
      &:nth-child(7n){
        margin-right: 0;
      }
      .item-pic{
        width:68px;
        height:68px;
        background:rgba(255,255,255,1);
        border-radius:50%;
        box-shadow: 2px 2px 8px #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        img{
          width:60px;
          height:60px;
          border-radius:30px;
        }
        span{
          width:60px;
          height:60px;
          background:rgba(248,181,38,1);
          border-radius:47px;
          font-size:20px;
          font-weight:500;
          color:rgba(255,255,255,1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      .item-name{
        width: 80px;
        text-align: center;
        height:33px;
        font-size:24px;
        font-weight:500;
        color:rgba(76,76,76,1);
        line-height:33px;
        padding-top: 10px;
      }
    }
  }
}

</style>
