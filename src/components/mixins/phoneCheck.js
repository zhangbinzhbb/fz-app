export default {
  data() {
    return {
      isiPhone5se: false,
      isiPhone6: false,
      isiPhonep: false,
      isiPhonex: false
    }
  },
  created() {
    if (/android/i.test(navigator.userAgent)) {
      console.log('this is Android')
      return
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
      console.log('this is iOS')
      const isIphone5 = () => {
        return (
          /iphone/gi.test(navigator.userAgent) &&
          (screen.height == 568 && screen.width == 320)
        )
      }
      const isIphone678 = () => {
        return (
          /iphone/gi.test(navigator.userAgent) &&
          (screen.height == 667 && screen.width == 375)
        )
      }
      const isIphonePlus = () => {
        return (
          /iphone/gi.test(navigator.userAgent) &&
          (screen.height == 736 && screen.width == 414)
        )
      }
      const isIphoneX = () => {
        return (
          /iphone/gi.test(navigator.userAgent) &&
          (screen.height == 812 && screen.width == 375)
        )
      }
      if (isIphone5()) {
        this.isiPhone5se = true
        document.body.style.paddingTop = '58px'
      } else if (isIphone678()) {
        this.isiPhone6 = true
        document.body.style.paddingTop = '74px'
      } else if (isIphonePlus()) {
        this.isiPhonep = true
        document.body.style.paddingTop = '84px'
      } else {
        this.isiPhonex = true
        document.body.style.paddingTop = '92px'
      }
    }
  },

  methods: {
  }
}
