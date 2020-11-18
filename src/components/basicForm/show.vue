<template>
  <div class="fd-form-detail">
    <van-row v-if="data">
      <van-col v-for="(item,index) in form.groups" :key="index" class="fd-list-item" span="24">
        {{ item }}
        <!-- <van-col v-if="item.element=='person'" span="24" class="personBox">
          <p class="top">
            <span>{{ item.label }}</span>
            <span>共 {{ item.options.length }} 人</span>
          </p>
          <ul class="user-list-content">
            <li v-for="sitem in item.options" :key="sitem.value" class="user-item">
              <div class="item-pic" >
                <img v-if="sitem.src" :src="sitem.src" alt="" srcset="">
                <span v-else>{{ sitem.label | formatName }}</span>
              </div>
              <span class="item-name">{{ sitem.label | formatName }}</span>
            </li>
          </ul>
        </van-col>
        <van-col v-if="item.element!=='person'" class="custleft" span="7">{{ item.label }}</van-col>
        <van-col v-if="item.element!=='person'" class="custright" span="17">
          <span v-if="item.element==='switch'">
            {{ data[item.name]?data[item.name]==='0'?'否':'是':'' }}
          </span>
          <span v-if="item.element==='text'">
            {{ data[item.name]?data[item.name]:'' }}
          </span>
          <span v-if="item.element==='html'">
            {{ data[item.name]?data[item.name]:'' }} {{ item.model }}
          </span>
          <span v-if="item.element==='select'">
            {{ getValue (item.options, 'value','label', data[item.name]) }}
          </span>
          <span v-if="item.element==='checker'">
            <fd-checker v-model="data[item.name]" :options="item.options" />
          </span>
        </van-col> -->
      </van-col>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'FormShow',
  components: {
    attachment: () => import('@/components/attachment/index'),
    fdChecker: () => import('@/components/checker/checker')
  },
  props: {
    form: {
      type: Object,
      default: () => {
        return {}
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      remindModeOptions: [{
        value: '00',
        label: '邮件'
      }, {
        value: '01',
        label: '短信'
      }]
    }
  },
  mounted() {
    console.log('data:', this.data)
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
    },
    /* 多选值查询 */
    getValues(list, keyName, valueName, valueList) {
      const resList = []
      if (list) {
        list.map(item => {
          valueList.map(subItem => {
            if (item[keyName] === subItem) {
              resList.push(item[valueName])
            }
          })
        })
      }
      return resList.join(',')
    }
  }
}
</script>

<style scoped lang="scss">
.fd-form-detail{
  .fd-list-item{
    padding: 30px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.user-list-content{
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  .user-item{
    display: flex;
    flex-direction: column;
    text-align: center;
    width:68px;
    height:68px;
    margin-left: 33px;
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
      height:33px;
      font-size:24px;
      font-weight:500;
      color:rgba(76,76,76,1);
      line-height:33px;
    }
  }
}
</style>
