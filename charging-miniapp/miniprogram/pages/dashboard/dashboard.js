const { callCloud } = require('../../utils/cloud')
const { getGreeting, formatRelativeDate, formatDate, formatDuration, toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    greeting: '',
    nickName: '未登录',
    defaultVehicle: null,
    lastChargeKwh: '',
    lastChargeTimeText: '',
    overview: {
      count: { value: 0, change: 0, direction: 'same' },
      kwh: { value: 0, change: 0, direction: 'same' },
      cost: { value: 0, change: 0, direction: 'same' },
      avgPrice: { value: 0, change: 0, direction: 'same' },
      duration: { value: 0, change: 0, direction: 'same' },
      perHundredKwh: { value: 0, change: 0, direction: 'same' },
      perHundredCost: { value: 0, change: 0, direction: 'same' },
      costDisplay: '-',
      avgPriceDisplay: '-',
      durationDisplay: '-',
      perHundredKwhDisplay: '-',
      perHundredCostDisplay: '-',
      countChangeText: '',
      kwhChangeText: '',
      costChangeText: '',
      avgPriceChangeText: '',
      durationChangeText: '',
      perHundredKwhChangeText: '',
      perHundredCostChangeText: '',
    },
    recentRecords: [],
    calendarDays: [],
    calendarKwh: {},
    calendarCount: 0,
    calendarTotalKwh: 0,
    loading: true,
    statusBarHeight: 0,
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    this.loadData()
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight })
  },

  async loadData() {
    this.setData({ loading: true, greeting: getGreeting() })

    if (!auth.isLoggedIn()) {
      this.setData({
        loading: false,
        nickName: '未登录',
        defaultVehicle: null,
        lastChargeKwh: '',
        lastChargeTimeText: '',
        overview: {
          count: { value: 0, change: 0, direction: 'same' },
          kwh: { value: 0, change: 0, direction: 'same' },
          cost: { value: 0, change: 0, direction: 'same' },
          avgPrice: { value: 0, change: 0, direction: 'same' },
          duration: { value: 0, change: 0, direction: 'same' },
          perHundredKwh: { value: 0, change: 0, direction: 'same' },
          perHundredCost: { value: 0, change: 0, direction: 'same' },
          costDisplay: '-',
          avgPriceDisplay: '-',
          durationDisplay: '-',
          perHundredKwhDisplay: '-',
          perHundredCostDisplay: '-',
          countChangeText: '',
          kwhChangeText: '',
          costChangeText: '',
          avgPriceChangeText: '',
          durationChangeText: '',
          perHundredKwhChangeText: '',
          perHundredCostChangeText: '',
        },
        recentRecords: [],
        calendarDays: [],
        calendarKwh: {},
        calendarCount: 0,
        calendarTotalKwh: 0,
      })
      return
    }

    try {
      await auth.ensureLogin()
      const userInfo = auth.getUserInfo()
      if (userInfo && userInfo.nickName) {
        this.setData({ nickName: userInfo.nickName })
      }

      const [vehicles, overviewRes, recentRes, calendarRes] = await Promise.all([
        callCloud('vehicle', { action: 'list' }),
        callCloud('stats', { action: 'overview', period: 'month' }),
        callCloud('stats', { action: 'recentRecords', limit: 2 }),
        callCloud('stats', { action: 'calendar' }),
      ])

      const defaultVehicle = (vehicles || []).find(v => v.isDefault) || (vehicles && vehicles[0]) || null
      const lastRecord = (recentRes && recentRes[0]) || null
      const lastChargeKwh = lastRecord ? toFixed(lastRecord.chargeKwh, 1) : ''
      const lastChargeTimeText = lastRecord ? formatRelativeDate(lastRecord.startTime) : ''

      // 格式化概览数据
      if (overviewRes) {
        const hasData = overviewRes.count && overviewRes.count.value > 0
        overviewRes.costDisplay = hasData ? toFixed(overviewRes.cost.value) : '-'
        overviewRes.avgPriceDisplay = hasData ? toFixed(overviewRes.avgPrice.value) : '-'
        overviewRes.durationDisplay = hasData && overviewRes.duration.value ? toFixed(overviewRes.duration.value / 60, 1) : '-'
        overviewRes.perHundredKwhDisplay = hasData ? toFixed(overviewRes.perHundredKwh.value, 1) : '-'
        overviewRes.perHundredCostDisplay = hasData ? toFixed(overviewRes.perHundredCost.value) : '-'

        // 预计算环比文本
        function fmtChange(field, invertArrow) {
          const v = field || {}
          const val = v.value
          const chg = v.change
          const dir = v.direction
          if (!val || val <= 0 || dir === 'same' || chg === undefined || chg === 0) return ''
          const absChg = Math.abs(chg)
          if (invertArrow) {
            return dir === 'positive' ? '↓' + absChg + '%' : '↑' + absChg + '%'
          }
          return dir === 'positive' ? '↑' + absChg + '%' : '↓' + absChg + '%'
        }
        overviewRes.countChangeText = fmtChange(overviewRes.count)
        overviewRes.countPositive = overviewRes.count && overviewRes.count.direction === 'positive'
        overviewRes.kwhChangeText = fmtChange(overviewRes.kwh)
        overviewRes.kwhPositive = overviewRes.kwh && overviewRes.kwh.direction === 'positive'
        overviewRes.costChangeText = fmtChange(overviewRes.cost, true)
        overviewRes.costPositive = overviewRes.cost && overviewRes.cost.direction === 'positive'
        overviewRes.avgPriceChangeText = hasData ? fmtChange(overviewRes.avgPrice, true) : ''
        overviewRes.avgPricePositive = overviewRes.avgPrice && overviewRes.avgPrice.direction === 'positive'
        overviewRes.durationChangeText = fmtChange(overviewRes.duration)
        overviewRes.durationPositive = overviewRes.duration && overviewRes.duration.direction === 'positive'
        overviewRes.perHundredKwhChangeText = hasData ? fmtChange(overviewRes.perHundredKwh, true) : ''
        overviewRes.perHundredKwhPositive = overviewRes.perHundredKwh && overviewRes.perHundredKwh.direction === 'negative'
        overviewRes.perHundredCostChangeText = hasData ? fmtChange(overviewRes.perHundredCost, true) : ''
        overviewRes.perHundredCostPositive = overviewRes.perHundredCost && overviewRes.perHundredCost.direction === 'negative'
      }

      const records = (recentRes || []).map(r => {
        r.timeText = formatRelativeDate(r.startTime) + ' ' + formatDate(r.startTime, 'HH:mm') + ' · ' + (r.chargeType === 'fast' ? '快充' : r.chargeType === 'slow' ? '慢充' : '超充')
        return r
      })

      this.setData({
        defaultVehicle,
        lastChargeKwh,
        lastChargeTimeText,
        overview: overviewRes || {
          count: { value: 0, change: 0, direction: 'same' },
          kwh: { value: 0, change: 0, direction: 'same' },
          cost: { value: 0, change: 0, direction: 'same' },
          avgPrice: { value: 0, change: 0, direction: 'same' },
          duration: { value: 0, change: 0, direction: 'same' },
          perHundredKwh: { value: 0, change: 0, direction: 'same' },
          perHundredCost: { value: 0, change: 0, direction: 'same' },
          costDisplay: '-',
          avgPriceDisplay: '-',
          durationDisplay: '-',
          perHundredKwhDisplay: '-',
          perHundredCostDisplay: '-',
          countChangeText: '',
          kwhChangeText: '',
          costChangeText: '',
          avgPriceChangeText: '',
          durationChangeText: '',
          perHundredKwhChangeText: '',
          perHundredCostChangeText: '',
        },
        recentRecords: records,
        calendarDays: calendarRes.days || [],
        calendarKwh: calendarRes.kwh || {},
        calendarCount: calendarRes.count || 0,
        calendarTotalKwh: calendarRes.totalKwh || 0,
        loading: false,
      })
    } catch (err) {
      console.error('loadData error', err)
      this.setData({ loading: false })
    }
  },

  onCalendarMonthChange(e) {
    const { year, month } = e.detail
    callCloud('stats', { action: 'calendar', year, month }).then(res => {
      this.setData({
        calendarDays: res.days || [],
        calendarKwh: res.kwh || {},
        calendarCount: res.count || 0,
        calendarTotalKwh: res.totalKwh || 0,
      })
    })
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/profile/profile' })
  },

  goToAnalytics() {
    wx.switchTab({ url: '/pages/analytics/analytics' })
  },

  goToHistory() {
    wx.switchTab({ url: '/pages/history/history' })
  },

  goToAddRecord() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(function () {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
      return
    }
    wx.navigateTo({ url: '/pages/add-record/add-record' })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/record-detail/record-detail?id=' + id })
  },

  onPullDownRefresh() {
    this.loadData().then(() => wx.stopPullDownRefresh())
  },
})
