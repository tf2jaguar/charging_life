/**
 * 日期格式化
 */
const formatDate = function (date, fmt) {
  if (!date) return ''
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  fmt = fmt || 'yyyy-MM-dd HH:mm'
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'h+': date.getHours() % 12 || 12,
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

/**
 * 时间友好显示
 */
const formatRelativeDate = function (date) {
  if (!date) return ''
  if (!(date instanceof Date)) date = new Date(date)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = today - target

  if (diff === 0) return '今天'
  if (diff === 86400000) return '昨天'
  if (diff > 0 && diff <= 6 * 86400000) {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return '周' + days[date.getDay()]
  }
  return formatDate(date, 'M月d日')
}

/**
 * 计算充电时长（分钟）
 */
const calcDuration = function (startTime, endTime) {
  if (!startTime || !endTime) return 0
  const diff = new Date(endTime) - new Date(startTime)
  return Math.max(0, Math.round(diff / 60000))
}

/**
 * 格式化时长
 */
const formatDuration = function (minutes) {
  if (!minutes || minutes <= 0) return '--'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return h + '小时' + m + '分钟'
  if (h > 0) return h + '小时'
  return m + '分钟'
}

/**
 * 计算单价
 */
const calcUnitPrice = function (cost, kwh) {
  if (!cost || !kwh || kwh === 0) return 0
  return cost / kwh
}

/**
 * 计算平均功率
 */
const calcAvgPower = function (kwh, durationMinutes) {
  if (!kwh || !durationMinutes || durationMinutes === 0) return 0
  return kwh / (durationMinutes / 60)
}

/**
 * 计算充电损耗
 */
const calcChargeLoss = function (batteryCapacity, startSOC, endSOC, chargeKwh) {
  if (!batteryCapacity || !chargeKwh || chargeKwh === 0) return 0
  const socDelta = (endSOC - startSOC) / 100
  const expectedKwh = batteryCapacity * socDelta
  return ((expectedKwh - chargeKwh) / expectedKwh) * 100
}

/**
 * 计算百公里电耗
 */
const calcPerHundredKwh = function (chargeKwh, currentMileage, previousMileage) {
  const delta = currentMileage - previousMileage
  if (!chargeKwh || !delta || delta <= 0) return 0
  return (chargeKwh / delta) * 100
}

/**
 * 保留小数
 */
const toFixed = function (num, digits) {
  digits = digits || 2
  if (typeof num !== 'number' || isNaN(num)) return '0.' + '0'.repeat(digits)
  return num.toFixed(digits)
}

/**
 * 问候语
 */
const getGreeting = function () {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

module.exports = {
  formatDate: formatDate,
  formatRelativeDate: formatRelativeDate,
  calcDuration: calcDuration,
  formatDuration: formatDuration,
  calcUnitPrice: calcUnitPrice,
  calcAvgPower: calcAvgPower,
  calcChargeLoss: calcChargeLoss,
  calcPerHundredKwh: calcPerHundredKwh,
  toFixed: toFixed,
  getGreeting: getGreeting,
}
