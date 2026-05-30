const { callCloud } = require('../../utils/cloud')
const { getGreeting, formatRelativeDate, formatDate, formatDuration, toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    greeting: '',
    nickName: '充电达人',
    defaultVehicle: null,
    lastChargeKwh: '',
    lastChargeTimeText: '',
    overview: null,
    recentRecords: [],
    calendarDays: [],
    calendarKwh: {},
    calendarCount: 0,
    calendarTotalKwh: 0,
    loading: true,
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 })
    }
    this.loadData()
  },

  async loadData() {
    this.setData({ loading: true, greeting: getGreeting() })
    try {
      await auth.ensureLogin()
      const userInfo = auth.getUserInfo()
      if (userInfo) {
        this.setData({ nickName: userInfo.nickName || '充电达人' })
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
        overviewRes.costDisplay = toFixed(overviewRes.cost.value)
        overviewRes.avgPriceDisplay = toFixed(overviewRes.avgPrice.value)
        overviewRes.durationDisplay = overviewRes.duration.value ? toFixed(overviewRes.duration.value / 60, 1) : '0'
        overviewRes.perHundredKwhDisplay = toFixed(overviewRes.perHundredKwh.value, 1)
        overviewRes.perHundredCostDisplay = toFixed(overviewRes.perHundredCost.value)
      }

      const records = (recentRes || []).map(r => {
        r.timeText = formatRelativeDate(r.startTime) + ' ' + formatDate(r.startTime, 'HH:mm') + ' · ' + (r.chargeType === 'fast' ? '快充' : r.chargeType === 'slow' ? '慢充' : '超充')
        return r
      })

      this.setData({
        defaultVehicle,
        lastChargeKwh,
        lastChargeTimeText,
        overview: overviewRes,
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
