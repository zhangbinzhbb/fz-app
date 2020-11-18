<template>
  <div class="avatar-con">
    <img
      v-if="data[params.avatorAttr]
        &&data[params.avatorAttr]!='/oaweb/style/member.jpg'
      &&data[params.avatorAttr]!='/oaweb/style/member2.jpg'"
      :src="params.needUrl?basicConfig.downloadUrl+data[params.avatorAttr]:data[params.avatorAttr]"
      class="avator">
    <span v-else :style="{background:data[params.colorAttr]||'#e8e8e8'}" class="avator">
      {{ firstFlag?(data[params.nameAttr]?data[params.nameAttr].charAt(0):''):(data[params.nameAttr]?data[params.nameAttr].charAt(data[params.nameAttr].length-1):'') }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Avator',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    params: {
      type: Object,
      default: () => {
        return {
          avatorAttr: 'FILE_PATH', // 用户头像地址属性名
          needUrl: false, // 用户头像地址是否需要加前缀
          nameAttr: 'NAME', // 用户名称属性名
          colorAttr: 'COLOR' // 用户头像颜色属性名
          // imgWidth: 70 // 用户头像颜色属性名
        }
      }
    },
    firstFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checkedArray: []
    }
  },
  created() {},
  activated() {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.avatar-con {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  span {
    display:flex;/*Flex布局*/
    display: -webkit-flex; /* Safari */
    align-items:center;/*指定垂直居中*/
    padding-left: calc(50% - 14px);
  }
}
.avator {
  width: 100%;
  height: 100%;
  border-radius: 100%;
  box-sizing: border-box;
  display: inline-block;
  font-size: 28px;
  text-align: center;
  line-height: 70px;
  color: white;
  object-fit: cover;
}
</style>
