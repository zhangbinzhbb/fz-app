<template>
  <div v-if="list.length" class="list-tags">
    <div class="slide-menus">
      <swiper ref="mySwiper" :options="swiperOption">
        <swiper-slide v-for="(item,index) in list" :key="index">
          <div
            v-if="item.value"
            class="va-tag"
            @click="delClick(item.sindex,item.index,index,item.value)"
          >
            <div v-if="keyCode=='LOC_NAME'" style="display: flex;">
              <span v-if="item[keyCode]==undefined">{{ item.CODE_NAME }}</span>
              <span v-else>{{ item[keyCode] }}</span>
              <van-icon name="close"/>
            </div>
            <div v-else style="display: flex;">
              <span>{{ item[keyCode] }}</span>
              <van-icon name="close"/>
            </div>
          </div>
          <div
            v-if="item.ID"
            class="va-tag"
            @click="delClick(item.sindex,item.index,index,item.ID)"
          >
            <div v-if="keyCode=='LOC_NAME'" style="display: flex;">
              <span v-if="item[keyCode]==undefined">{{ item.CODE_NAME }}</span>
              <span v-else>{{ item[keyCode] }}</span>
              <van-icon name="close"/>
            </div>
            <div v-else style="display: flex;">
              <span>{{ item[keyCode] }}</span>
              <van-icon name="close"/>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    filterList: {
      type: Array,
      default: () => {
        return []
      }
    },
    keyCode: {
      type: String
    }
  },
  data() {
    return {
      swiperOption: {
        // 滑动方向
        direction: 'horizontal',
        slidesPerView: 'auto'
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    delClick(odx, idx, index, id) {
      const obj = {
        sindex: odx,
        id: id
      }
      this.$set(
        this.filterList[odx].subList[idx],
        'isChecked',
        !this.filterList[odx].subList[idx].isChecked
      )
      this.list.splice(index, 1)
      // console.log('====obj===')
      // console.log(obj)
      this.$emit('del-item', obj)
    }
  }
}
</script>

<style lang="scss" scoped>
.list-tags {
  background-color: #fff;
  padding: 10px 10px;
  .slide-menus{
    padding:10px 0px;
    .swiper-container{
      margin-left: 0;
      margin-right: 0;
      width: 100%;
    }
  }
  .swiper-wrapper {
    .swiper-slide {
      display: flex;
      align-items: center;
      width: 150px;
      border: 1px solid #b70007;
      & + .swiper-slide {
        margin-left: 10px;
      }
      .va-tag {
        font-size: 20px;
        box-sizing: border-box;
        display: flex;
        height: 50px;
        line-height: 50px;
        i {
          line-height: 50px;
        }
        span {
          display: inline-block;
          width: 124px;
          height: 50px;
          line-height: 50px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          text-align: center;
          font-size: 22px;
        }
      }
    }
  }
}
</style>
