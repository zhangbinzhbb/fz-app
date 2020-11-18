<template>
  <div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="pageInfo.isLoading" infinite-scroll-distance="10" infinite-scroll-immediate-check="false" style="background:#F5F5F5">
      <form class="yh-search" action="" @submit.prevent="search">
        <img :src="baseConfig.domain+'static/images/icon/search-img.png'" class="search-img">
        <input ref="searchInput" v-model="pageInfo.params.searchId" type="search" placeholder="搜索">
      </form>
      <div class="classify">
        <p>按组织架构<van-icon name="arrow" /></p>
        <p>按人员姓名<van-icon name="arrow" /></p>
      </div>
      <van-row v-for="(item,index) in pageInfo.list" :key="index" class="bordertop">
        <van-col span="4">
          <div class="av-con">
            <img v-if="item[params.avatorAttr]" :src="params.needUrl?basicConfig.downloadUrl+item[params.avatorAttr]:item[params.avatorAttr]" class="avator">
            <span v-else :style="{background:item[params.colorAttr]}" class="avator">
              {{ item[params.nameAttr].charAt(item[params.nameAttr].length-1) }}
            </span>
          </div>
        </van-col>
        <van-col span="18">
          <p>{{ item[params.nameAttr] }}</p>
          <!-- <p>{{item.ORGNAME}} {{item.DEPTNAME}}</p> -->
        </van-col>
        <van-col v-if="params.showRadio" span="2">
          <div class="v-checkbox">
            <van-checkbox v-model="item.isChecked" @change="selectToggle(item)"/>
          </div>
        </van-col>
        <slot name="right" class="right"/>
      </van-row>
    </div>

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
    checkedArray: {
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
      pageInfo: {
        params: {
          curPage: 1,
          pageSize: 15
        },
        list: [],
        postUrl: '/MyContactAction/myContactList.do'
      }
    }
  },
  created() {
    this.getList(true)
  },
  activated() {},
  methods: {
    selectToggle(person) {
      if (person.isChecked) {
        this.checkedArray.push(person)
      } else {
        this.checkedArray.map((item, index) => {
          if (
            item[this.params.checkIdAttr] === person[this.params.checkIdAttr]
          ) {
            this.checkedArray.splice(index, 1)
          }
        })
      }
    },
    setListChecked(checkedArray) {
      this.pageInfo.list.map((item, index) => {
        let checked = false
        const list = checkedArray || this.checkedArray
        for (const i in list) {
          if (item.ID === Number(list[i].ID)) {
            checked = true
            this.$set(this.pageInfo.list[index], 'isChecked', true)
          }
          continue
        }
        if (!checked) {
          this.$set(this.pageInfo.list[index], 'isChecked', false)
        }
      })
    },
    getList(isFirst) {
      this.$axios.pageData(this, isFirst, res => {
        this.setListChecked()
      })
    },
    search() {
      this.$refs.searchInput.blur()
      this.getList(true)
    },
    loadMore() {
      this.getList(false)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- lang="scss" 表示使用sass 语法 -->
<style scoped lang="scss">
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
    // line-height: 32px;
    text-align: left;
    line-height: 70px;
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
.classify{
  background: #fff;
  margin-bottom: 18px;
}
.classify p{
  line-height: 100px;
  text-align: left;
  padding-left: 40px;
  border-bottom: 1px solid #f5f5f5;
  font-size: 28px;
  position: relative;
}
.classify p:nth-of-type(2){
  border-bottom: 0;
}
.classify p .van-icon{
  line-height: 100px;
  position: absolute;
  right: 40px;
}
.yh-search{
  position: relative;
  background: #fff;
}
// .yh-search input{
//   text-align: left;
//   margin: 30px 0;
//   line-height: 68px;
//   height: 68px;
// }
.yh-search .search-img{
  width: 40px;
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
