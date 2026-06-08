const { callCloud } = require('../../utils/cloud')
const { getGreeting, formatRelativeDate, formatDate, formatDuration, toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')
const app = getApp()

Page({
  data: {
    greeting: '',
    nickName: '未登录',
    defaultVehicle: null,
    vehicles: [],
    currentVehicleId: null,
    showVehiclePicker: false,
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

    try {
      await auth.initOpenId()
    } catch (e) { /* ignore */ }

    if (!auth.isLoggedIn()) {
      this.setData({
        loading: false,
        nickName: '未登录',
        defaultVehicle: null,
        vehicles: [],
        currentVehicleId: null,
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
      const userInfo = auth.getUserInfo()
      if (userInfo && userInfo.nickName) {
        this.setData({ nickName: userInfo.nickName })
      }

      let vehicleId = app.getCurrentVehicleId()
      const vehicles = await callCloud('vehicle', { action: 'list' })
      const defaultVehicle = vehicleId
        ? (vehicles || []).find(v => v._id === vehicleId) || (vehicles || []).find(v => v.isDefault) || (vehicles && vehicles[0]) || null
        : (vehicles || []).find(v => v.isDefault) || (vehicles && vehicles[0]) || null
      if (defaultVehicle) {
        vehicleId = defaultVehicle._id
      }

      const [overviewRes, recentRes, calendarRes] = await Promise.all([
        callCloud('stats', { action: 'overview', period: 'month', vehicleId }),
        callCloud('stats', { action: 'recentRecords', limit: 2, vehicleId }),
        callCloud('stats', { action: 'calendar', vehicleId }),
      ])
      const lastRecord = (recentRes && recentRes[0]) || null
      const lastChargeKwh = lastRecord ? toFixed(lastRecord.chargeKwh, 1) : ''
      const lastChargeTimeText = lastRecord ? formatRelativeDate(lastRecord.startTime) : ''

      // 格式化概览数据
      if (overviewRes) {
        const hasData = overviewRes.count && overviewRes.count.value > 0
        overviewRes.costDisplay = hasData ? toFixed(overviewRes.cost.value) : '-'
        overviewRes.avgPriceDisplay = hasData ? toFixed(overviewRes.avgPrice.value) : '-'
        overviewRes.durationDisplay = hasData && overviewRes.duration.value ? toFixed(overviewRes.duration.value / 60, 1) : '-'
        overviewRes.perHundredKwhDisplay = hasData && overviewRes.perHundredKwh.value > 0 ? toFixed(overviewRes.perHundredKwh.value, 1) : '-'
        overviewRes.perHundredCostDisplay = hasData && overviewRes.perHundredCost.value > 0 ? toFixed(overviewRes.perHundredCost.value) : '-'

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
        vehicles: vehicles || [],
        currentVehicleId: vehicleId,
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
    const vehicleId = app.getCurrentVehicleId()
    callCloud('stats', { action: 'calendar', year, month, vehicleId }).then(res => {
      this.setData({
        calendarDays: res.days || [],
        calendarKwh: res.kwh || {},
        calendarCount: res.count || 0,
        calendarTotalKwh: res.totalKwh || 0,
      })
    })
  },

  onVehicleCardTap() {
    this.setData({ showVehiclePicker: true })
  },

  onVehiclePickerClose() {
    this.setData({ showVehiclePicker: false })
  },

  onSelectVehicle(e) {
    const { id } = e.currentTarget.dataset
    app.setCurrentVehicleId(id)
    this.setData({ showVehiclePicker: false, currentVehicleId: id })

    const selVehicle = id ? this.data.vehicles.find(v => v._id === id) : null
    wx.showToast({ title: selVehicle ? selVehicle.brand + ' ' + selVehicle.model : '全部车辆', icon: 'none' })
    this.loadData()
  },

  onPickerMaskTap() {
    this.setData({ showVehiclePicker: false })
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
      wx.switchTab({ url: '/pages/profile/profile' })
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
