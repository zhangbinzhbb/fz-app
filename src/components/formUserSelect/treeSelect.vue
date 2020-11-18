<template>
  <div class="fd-form-tree">
    <p class="fd-form-tree-title">
      <span class="label">{{ label }}</span>
      <span class="number">共{{ userList.length }}人</span>
    </p>
    <div class="fd-users-content">
      <ul v-if="userList.length" class="fd-user-list-content">
        <li v-for="(item, index) in userList" :key="item.value" class="user-item" @click="delChange(index)">
          <div class="item-pic">
            <img v-if="item.src" :src="item.src" alt="" srcset="">
            <span v-else>{{ item.label | formatName }}</span>
            <img src="@/assets//images/org-delet.png" class="icon-del">
          </div>
          <span class="item-name van-ellipsis">{{ item.label }}</span>
        </li>
      </ul>
      <!-- v-if="userList.length===0 && !readonly" -->
      <!-- <van-icon v-if="userList.length && !readonly" name="arrow" class="fd-add-arrow" @click="rightPopupOpen"/> -->
      <span class="fd-add-btn" @click="rightPopupOpen">+</span>
    </div>
    <vueTreeSelect ref="rightPopupTreeSelect" :default-array="userList" :cat-title="title" class="fd-tree-select" @select-change="selectChange"/>
  </div>
</template>

<script type="text/ecmascript-6">
const COMPONENT_NAME = 'fd-tree'
const EVENT_INPUT = 'input'

export default {
  name: COMPONENT_NAME,
  components: {
    vueTreeSelect: () => import('@/components/vueTreeSelect/index')
  },
  props: {
    value: [String, Number, Array],
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    title: String,
    label: String,
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      userList: []
    }
  },
  computed: {},
  watch: {
    value: {
      handler: function(newVal, oldVal) {
        this.userList = newVal
      },
      deep: true
    }
  },
  created() {
    this.userList = this.value
  },
  methods: {
    rightPopupOpen() {
      if (this.disabled) {
        return
      }
      this.$refs.rightPopupTreeSelect.showPopup()
    },
    selectChange(arr) {
      this.userList = arr
      this.$emit(EVENT_INPUT, arr)
    },
    delChange(index) {
      this.userList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.fd-form-tree{
  background-color: #fff;
  .fd-tree-select{
    background:rgba(245,245,245,1);
  }
  .fd-form-tree-title{
    display: flex;
    justify-content: space-between;
    .label{
      font-size:28px;
      font-weight:500;
      color:rgba(158,158,157,1);
    }
    .number{
      font-size:24px;
      font-weight:500;
      color:rgba(76,76,76,1);
    }
  }
  .fd-users-content{
    padding-top: 23px;
    .fd-add-btn{
      float: right;
      display: inline-block;
      margin-top: 24px;
      width:68px;
      height:68px;
      background:rgba(239,239,240,1);
      font-size: 28px;
      line-height: 68px;
      border-radius: 34px;
      text-align: center;
      color:rgba(188,195,210,1);
    }
    .fd-add-arrow{
      font-size: 28px;
      margin-left: 30px;
      margin-top: 10px;
    }
  }
  .fd-user-list-content{
    float: left;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 90%;
    margin-left: -20px;
    .user-item{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 90px;
      margin:20px 10px 20px 0px;
      &:nth-child(6n){
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
        position: relative;
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
        .icon-del{
          width: 34px;
          height: 34px;
          position: absolute;
          top:-5px;
          right:-5px;
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
