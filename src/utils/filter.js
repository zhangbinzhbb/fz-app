/*
 * @Author: Gary
 * @Date: 2017-11-07 09:29:09
 * @Last Modified by: yuxiaojing
 * @Last Modified time: 2018-02-22 14:28:55
 * 过滤器
 */

// 日期时间
const date = (date, index1, index2) => {
  // 1970-01-01 08:00:00
  const end = index1 || 10
  const start = index2 || 0
  if (date) {
    return date.slice(start, end)
  } else {
    return ''
  }
}

// 货币
const currency = money => {
  const res = +money
  if (res.isNaN()) {
    return Math.floor(res * 100) / 100
  } else {
    return money
  }
}

// 货币格式化，每隔三位加一个逗号
const money = value => {
  if (!value) return
  value = value.toString()
  return value.replace(/^(-?)(\d+)((\.\d+)?)$/, (s, s1, s2, s3) => {
    const rex = /\d{1,3}(?=(\d{3})+$)/g
    const result = s1 + s2.replace(rex, '$&,') + s3
    return result
  })
}

// 人数
const count = num => {
  num = +num
  if (num > 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else {
    return num
  }
}

const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  // eslint-disable-next-line camelcase
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

const formatTime = (time, option) => {
  console.log('time', time)
  // time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

const formatMoney = str => {
  if (!str) {
    return str
  }

  if ((typeof str) === 'number') {
    str = str + ''
  }

  str = str.replace('.00', '')
  str = str.replace(/[^0-9]/gi, '')
  if (str == 0) {
    return null
  }
  let vv
  let result = str
  const money = str
  if (money >= 10 && money < 10000) {
    vv = Math.pow(10, 4) // 保留2位小数，四舍五入
    result = Math.round((money / 10000) * vv) / vv + '万'
  }
  if (money >= 10000 && money < 99999999) {
    vv = Math.pow(10, 2) // 保留2位小数，四舍五入
    result = Math.round((money / 10000) * vv) / vv + '万'
  }
  if (money >= 100000000) {
    vv = Math.pow(10, 2) // 保留2位小数，四舍五入
    result = Math.round((money / 100000000) * vv) / vv + '亿'
  } else if (money < 10) {
  }
  return result
}

const formatMoneyArr = (str, type) => {
  str = str || '0'
  str = str.replace('.00', '')
  if (str.lastIndexOf('.') != -1) {
    str = str.substring(0, str.lastIndexOf('.'))
  }
  str = str.replace(/[^0-9]/gi, '')
  let vv
  let result = str
  let unit = '元'
  const money = str
  if (money >= 10 && money < 10000) {
    vv = Math.pow(10, 4) // 保留2位小数，四舍五入
    result = Math.round((money / 10000) * vv) / vv
    unit = '万' + unit
  }
  if (money >= 10000 && money < 99999999) {
    vv = Math.pow(10, 2) // 保留2位小数，四舍五入
    result = Math.round((money / 10000) * vv) / vv
    unit = '万' + unit
  }
  if (money >= 100000000) {
    vv = Math.pow(10, 2) // 保留2位小数，四舍五入
    result = Math.round((money / 100000000) * vv) / vv
    unit = '亿' + unit
  } else if (money < 10) {
  }
  if (type === 'unit') {
    return unit
  } else {
    return result
  }
}

const formatName = value => {
  if (!value) return
  return value.substring(value.length - 1, value.length)
}

// 2019-03-12 转化成 2019:03:12
const formatTimeDivide = value => {
  if (!value) return
  const time = value.replace(/-/g, '.')
  return time
}

// 2019-03-12 转化成 星期
const toWeekName = date => {
  var newDate = new Date(date.replace(/-/g, '/'))
  var weekday = new Array(7)
  weekday[0] = '星期日'
  weekday[1] = '星期一'
  weekday[2] = '星期二'
  weekday[3] = '星期三'
  weekday[4] = '星期四'
  weekday[5] = '星期五'
  weekday[6] = '星期六'
  return weekday[newDate.getDay()]
}

const getDayDiff = (date1) => { // 获得天数
  // date1：开始日期，date2结束日期
  var a1 = Date.parse(new Date(date1))
  var a2 = Date.parse(new Date())
  const diff = a2 - a1
  const count = 1000 * 60 * 60 * 24
  const day = Math.floor(diff / count) // 核心：时间戳相减，然后除以天数
  return day
}

const contentFilter = (content) => {
  if (!content) return
  const title = content.length > 66 ? content.substring(0, 66) : content
  return title
}

export {
  date,
  currency,
  count,
  money,
  formatTime,
  parseTime,
  formatMoney,
  formatMoneyArr,
  formatName,
  formatTimeDivide,
  toWeekName,
  getDayDiff,
  contentFilter
}
