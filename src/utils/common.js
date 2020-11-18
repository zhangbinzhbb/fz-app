function filterArr(arr) {
  const arr1 = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].checkIds) {
      for (let k = 0; k < arr[i].subList.length; k++) {
        if (arr[i].subList[k].isChecked) {
          arr[i].subList[k].sindex = i
          arr[i].subList[k].index = k
          arr1.push(arr[i].subList[k])
        }
      }
    }
  }
  return arr1
}

function getUrlKey(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
}

module.exports = {
  filterArr: filterArr,
  getUrlKey: getUrlKey
}
