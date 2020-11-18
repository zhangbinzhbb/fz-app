<template>
  <div>
    <div v-show="data.show" class="folder">
      <span class="checked" @click.stop="checkToggle()">
        {{ data.nodeIndex }}
      </span>
      <span @click="subNodeToggle()">
        <img v-if="!data.fileType" src="@/assets/images/file/comment-Shape.png" alt="">
        <img v-if="data.fileType" :src="'@/assets/images/file/comment-'+data.fileType+'.png'" alt=""> {{ data.itemName||data.attaFileName }}
      </span>
    </div>
    <template v-if="data.childrenList">
      <tree-node v-for="(item, i) in data.childrenList" v-show="item.show" :key="i" :data="item" :id="id" :type="type"/>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TreeNode',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: [String, Number],
      default: null
    },
    id: {
      type: [String, Number],
      default: null
    }
  },
  data: function() {
    return {
    }
  },
  created() {},
  methods: {
    subNodeToggle() {
      const childrenList = this.data.childrenList
      if (childrenList.length) {
        const status = childrenList[0].show || false
        childrenList.map((node, index) => {
          this.$set(this.data.childrenList[index], 'show', !status)
        })
      }
      this.getFileList(this.data)
    },
    checkToggle() {
      this.$set(this.data, 'checked', !this.data.checked)
      // this.data.checked = !!this.data.checked
    },
    getFileList(item) {
      this.$axios.get(
        '/fileList',
        {
          length: 100,
          currPage: 1,
          nodeId: item.itemId,
          fundId: this.id,
          itemType: this.type
        },
        res => {
          const list = res.data
          const len = this.data.childrenList.length
          if (list.length) {
            list.map((file, i) => {
              if (file.fileType !== 'dic') {
                file.show = true
                file.nodeIndex = this.data.nodeIndex + '-' + (len + i + 1)
                this.$set(this.data.childrenList, len + i, file)
                // this.data.childrenList.push(file)
              }
            })
          }
          // this.data.childrenList = this.data.childrenList.concat(res.data)
          console.log('getFileList', this.data, res.data)
        }
      )
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
.folder {
  color: #333;
  font-size: 26px;
  text-align: left;
  padding-left: 20px;
  padding-right: 20px;
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 50px;
  box-sizing: border-box;
  position: relative;
  .checked {
    color: white;
    span{
      display: inline-block;
      width: 30px;
      height: 30px;
      border: 2px solid #e8e8e8;
      color: #333;
      position: relative;
      top:-5px;
      font-size: 20px;
      text-align: center;
      line-height: 28px;
    }
    // display: inline-block;
    // width: 50px;
    // height: 50px;
    // position: absolute;
    // left: 0;
    // top: 0;
  }
  img {
    width: 40px;
    height: 40px;
    position: relative;
    top: 10px;
  }
}
</style>
