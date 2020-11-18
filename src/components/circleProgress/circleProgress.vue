<template>
  <div class="circle-progress-container">
    <svg
      version="1.1"
      class="circle-progress"
      viewbox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg">
      <circle
        :stroke="bgBarColor"
        :stroke-width="barWidth + '%'"
        :r="circleRadius + '%'"
        class="progress-bg"
        cx="50%"
        cy="50%"
      />
      <circle
        :stroke="barColor"
        :stroke-linecap="barRound ? 'round' : ''"
        :stroke-width="barWidth + '%'"
        :r="circleRadius + '%'"
        :stroke-dasharray="len + '%'"
        :stroke-dashoffset="progress + '%'"
        class="progress-bar"
        cx="50%"
        cy="50%"
      />
    </svg>
    <div class="progress-text-panel">
      <slot>
        <p class="progress-number">{{ animatedProgress }}%</p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    duration: {
      type: Number,
      default: 500
    },
    barWidth: {
      type: [Number, String],
      default: 14
    },
    barColor: {
      type: String,
      default: '#f69626'
    },
    bgBarColor: {
      type: String,
      default: '#f1f1f6'
    },
    barRound: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      len: 0,
      tweenedProgress: 0,
      firstLoad: true
    }
  },
  computed: {
    circleRadius() {
      return (100 - +this.barWidth) / 2
    },
    progress() {
      return (1 - this.animatedProgress / 100) * this.len
    },
    animatedProgress() {
      return this.tweenedProgress.toFixed(0)
    }
  },
  watch: {
    value(newVal) {
      if (!this.firstLoad) {
        this.tween(+newVal)
      }
    }
  },
  created() {
    this.len = Math.PI * 2 * this.circleRadius
  },
  mounted() {
    if (this.firstLoad) {
      this.tween(+this.value)
      this.firstLoad = false
    }
  },
  methods: {
    tween(value) {
      TweenLite.to(this.$data, +this.duration / 1000, { tweenedProgress: value })
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-progress-container {
  width: auto;
  height: 100%;
  position: relative;
  .progress-text-panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .progress-number {
      margin: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f69626;
      font-size: 32px;
      font-weight: bold;
    }
  }
}
.circle-progress {
  box-sizing: border-box;
  .progress-bar {
    fill: none;
    box-sizing: border-box;
  }
  .progress-bg {
    fill: none;
    box-sizing: border-box;
  }
}
</style>
