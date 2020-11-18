
const toast = function(title) {
  if (title) {
    vant.Toast(title)
  }
}
export default {
  verified: function(verifing) {
    let flag = false
    if (!verifing || verifing.length === 0) {
      return true
    }
    for (let i = 0; i < verifing.length; i++) {
      // debugger
      flag = this[verifing[i].name](verifing[i].content, verifing[i].tip)
      if (!flag) {
        break
      }
    }
    return flag
  },
  isEmpty: function(input, tip) {
    if (input === '' || input === null || input === undefined) {
      if (input === 0) {
        return true
      } else {
        toast(tip)
        return false
      }
    } else {
      return true
    }
  },
  // 日期或者时间的比较
  // input: 比较的时间  可以传一个时间,传多个时需要用;隔开
  // tip : 错误提示信息
  compareDate: function(input, tip) {
    // 将传入的时间以;拆分成一个数组
    const days = input.split(';')
    // 拆分后的第一项的长度===5的时候执行,表示传入的是时间  如18:00
    // 比较的时间为空或者为 null
    if ((days[0] == '' || days[0]=='null') && (days[1] == '' || days[1] == 'null')) {
      return true
    }
    if (days[0].length === 5) {
      // 在传入的每一项的前面添加日期
      days[0] = '2018/10/12 ' + days[0]
      days[1] = '2018/10/12 ' + days[1]
    }
    // 将每一项的日期格式如2018/10/12中的/替换成-
    days[0] = days[0].replace(/-/g, '/')
    days[1] = days[1].replace(/-/g, '/')
    // 将日期转换成时间戳,用来比较大小
    const d1 = new Date(days[0])
    let d2
    if (days.length >= 2) {
      d2 = new Date(days[1])
    } else {
      d2 = new Date()
    }
    console.error('compareDate', days, d1, d2)
    // 将d2-d1的值转换成整数,如果大于0  第二个时间大于第一个时间
    if (parseInt(d2 - d1) >= 0) {
      return true
    } else {
      toast(tip)
      return false
    }
  },
  isEmail: function(email, tip) {
    const reg = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$')
    if (!reg.test(email)) {
      toast(tip)
      return false
    } else {
      return true
    }
  },
  // 验证手机号
  mobile: function(phone, tip) {
    if (!phone || phone == '') {
      return true
    }
    var reg = `^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$`
    if (!phone || !phone.toString().match(reg)) {
      toast(tip)
      return false
    } else {
      return true
    }
  },
  appointMinLength: function(content, tip) {
    var con = content.split(';')
    if (con[0].length >= con[1]) {
      return true
    } else {
      toast(tip)
      return false
    }
  },
  appointMaxLength: function(content, tip) {
    var con = content.split(';')
    if (con[0].length <= con[1]) {
      return true
    } else {
      toast(tip)
      return false
    }
  },
  isLessThan: function(content, tip) {
    var con = content.split(';')
    if (parseInt(con[0]) <= parseInt(con[1])) {
      return true
    } else {
      toast(tip)
      return false
    }
  },
  // 判断内容是否一样
  isSame: function(content, tip) {
    var con = content.split(';')
    console.error('isSame', con[0], con[1], con[1] === con[0])
    if (con[1] === con[0]) {
      toast(tip)
      return true
    } else {
      return false
    }
  },
  // 6-20位数字与字母组合的密码
  password: function(content, tip) {
    var reg = new RegExp('^[a-zA-Z0-9]{6,20}$')
    if (reg.test(content)) {
      return true
    } else {
      toast(tip)
      return false
    }
  },
  isNum: function(num, tip) {
    var reg = new RegExp('^[0-9]*$')
    if (reg.test(num)) {
      return true
    } else {
      toast(tip)
      return false
    }
  },
  isIdCard: function(code, tip) {
    const IdentityCodeValid = code => {
      const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(code) === false) {
        toast(tip)
        return false
      } else {
        return true
      }
    }
    console.log('result', IdentityCodeValid(code))
    return IdentityCodeValid(code)
  },
  isName: (content, tip) => {
    if (!content || content == '') {
      return true
    }
    var reg = /^[\u4E00-\u9FA5A-Za-z\s]+(·[\u4E00-\u9FA5A-Za-z]+)*$/
    if (!reg.test(content)) {
      toast(tip)
      return false
    } else {
      return true
    }
  }
}
