<template>
  <div>
    <van-row v-for="(item,index) in list" :key="index" class="bordertop">
      <van-col span="4">
        <div class="av-con">
          <img
            v-if="item[params.avatorAttr]"
            :src="params.needUrl?basicConfig.downloadUrl+item[params.avatorAttr]:item[params.avatorAttr]"
            class="avator"
          >
          <span
            v-else
            :style="{background:item[params.colorAttr]}"
            class="avator"
          >{{ item[params.nameAttr].charAt(item[params.nameAttr].length-1) }}</span>
        </div>
      </van-col>
      <van-col span="18">
        <p>{{ item[params.nameAttr] }}</p>
        <p>{{ item.ORGNAME }} {{ item.DEPTNAME }}</p>
      </van-col>
      <van-col v-if="params.showRadio" span="2">
        <div class="v-checkbox">
          <van-checkbox v-model="item.isChecked" @change="selectToggle(item)"/>
        </div>
      </van-col>
      <slot name="right" class="right"/>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'Person',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    params: {
      type: Object,
      default: () => {
        return {
          avatorAttr: 'FILE_PATH', // 用户头像地址属性名
          needUrl: false, // 用户头像地址是否需要加前缀
          nameAttr: 'NAME', // 用户名称属性名
          colorAttr: 'COLOR', // 用户头像颜色属性名
          showRadio: false, // 是否需要选择按钮
          checkIdAttr: 'ID' // 选择按钮选择后接口需要传参属性名
        }
      }
    }
  },
  data() {
    return {
      checkedArray: []
    }
  },
  created() {
    // console.log(this.list)
    // console.log(this.params)
  },
  activated() {},
  methods: {
    selectToggle(person) {
      if (person.isChecked) {
        this.checkedArray.push(person[this.params.checkIdAttr])
      } else {
        this.checkedArray.map((item, index) => {
          if (item === person[this.params.checkIdAttr]) {
            this.checkedArray.splice(index, 1)
          }
        })
      }
      this.$emit('checked', this.checkedArray)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.mail-search {
  background: #fff;
  padding: 20px 15px 14px 15px;
  overflow: hidden;
  height: 70px;
  margin-bottom: 20px;
  .seachForm {
    input {
      width: 605px;
      height: 60px;
      display: block;
      border: none;
      text-align: center;
      font-size: 26px;
      background-color: #f5f5f5;
      border-radius: 12px;
    }
  }
}
.bordertop {
  border-bottom: 2px solid #F5F5F5;
  position: relative;
}
.van-row {
  background: #fff;
  padding: 20px;
  .av-con {
    width: 70px;
    height: 70px;
    margin-left: 10px;
  }
  .avator {
    width: 70px;
    height: 70px;
    border-radius: 100%;
    box-sizing: border-box;
    display: inline-block;
    font-size: 28px;
    text-align: center;
    line-height: 70px;
    color: white;
    object-fit: cover;
  }
  p:nth-child(1) {
    font-size: 29px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(68, 68, 68, 1);
    line-height: 32px;
    text-align: left;
  }
  p:nth-child(2) {
    font-size: 20px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    text-align: left;
    line-height: 40px;
  }
}
button {
  width: 573px;
  height: 91px;
  background: #b70007;
  margin-top: 135px;
  color: #fff;
  border-radius: 5px;
}
.right {
  position: absolute;
  right: 20px;
  top: 0;
}
</style>
