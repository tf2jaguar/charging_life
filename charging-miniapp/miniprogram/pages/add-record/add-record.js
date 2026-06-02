const { callCloud } = require('../../utils/cloud')
const { formatDuration, toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    vehicles: [],
    vehicleIndex: 0,
    stationName: '',
    chargeType: 'fast',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    durationText: '--',
    chargeKwh: '',
    cost: '',
    unitPriceText: '--',
    avgPowerText: '--',
    startSOC: '',
    endSOC: '',
    socDeltaText: '--',
    mileage: '',
    remark: '',
    submitting: false,
  },

  onLoad() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(function () {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
      return
    }
    this.loadVehicles()
    this.setDefaultTimes()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  async loadVehicles() {
    try {
      const vehicles = await callCloud('vehicle', { action: 'list' })
      this.setData({ vehicles: vehicles || [] })
    } catch (e) {
      console.error(e)
    }
  },

  setDefaultTimes() {
    const now = new Date()
    const oneHourAgo = new Date(now - 3600000)
    this.setData({
      startDate: this.formatDatePart(oneHourAgo),
      startTime: this.formatTimePart(oneHourAgo),
      endDate: this.formatDatePart(now),
      endTime: this.formatTimePart(now),
    })
    this.calcDuration()
  },

  formatDatePart(date) {
    const pad = n => (n < 10 ? '0' + n : '' + n)
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
  },

  formatTimePart(date) {
    const pad = n => (n < 10 ? '0' + n : '' + n)
    return pad(date.getHours()) + ':' + pad(date.getMinutes())
  },

  getFullTimeStr(dateStr, timeStr) {
    if (!dateStr) return ''
    return dateStr + 'T' + (timeStr || '00:00')
  },

  onVehicleChange(e) {
    this.setData({ vehicleIndex: e.detail.value })
  },

  onStationInput(e) {
    this.setData({ stationName: e.detail.value })
  },

  onChargeTypeChange(e) {
    this.setData({ chargeType: e.detail.value })
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value })
    this.calcDuration()
  },

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value })
    this.calcDuration()
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value })
    this.calcDuration()
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value })
    this.calcDuration()
  },

  calcDuration() {
    const startStr = this.getFullTimeStr(this.data.startDate, this.data.startTime)
    const endStr = this.getFullTimeStr(this.data.endDate, this.data.endTime)
    if (!startStr || !endStr) return
    const start = new Date(startStr)
    const end = new Date(endStr)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return
    const minutes = Math.max(0, Math.round((end - start) / 60000))
    this.setData({ durationText: formatDuration(minutes) || '--' })
    this.calcDerived(minutes)
  },

  onChargeKwhInput(e) {
    this.setData({ chargeKwh: e.detail.value })
    this.calcDerived()
  },

  onCostInput(e) {
    this.setData({ cost: e.detail.value })
    this.calcDerived()
  },

  calcDerived(minutes) {
    const kwh = parseFloat(this.data.chargeKwh) || 0
    const cost = parseFloat(this.data.cost) || 0
    if (!minutes) {
      const startStr = this.getFullTimeStr(this.data.startDate, this.data.startTime)
      const endStr = this.getFullTimeStr(this.data.endDate, this.data.endTime)
      if (!startStr || !endStr) return
      const start = new Date(startStr)
      const end = new Date(endStr)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return
      minutes = Math.max(0, Math.round((end - start) / 60000))
    }

    const unitPrice = kwh > 0 ? cost / kwh : 0
    const avgPower = minutes > 0 ? kwh / (minutes / 60) : 0

    this.setData({
      unitPriceText: unitPrice > 0 ? '¥' + toFixed(unitPrice) + '/kWh' : '--',
      avgPowerText: avgPower > 0 ? toFixed(avgPower, 1) + ' kW' : '--',
    })
  },

  onStartSOCInput(e) {
    const raw = e.detail.value.replace(/[^\d]/g, '')
    this.setData({ startSOC: raw })
    this.calcSocDelta()
  },

  onEndSOCInput(e) {
    const raw = e.detail.value.replace(/[^\d]/g, '')
    this.setData({ endSOC: raw })
    this.calcSocDelta()
  },

  calcSocDelta() {
    const start = parseInt(this.data.startSOC)
    const end = parseInt(this.data.endSOC)
    if (!isNaN(start) && !isNaN(end)) {
      const delta = end - start
      this.setData({ socDeltaText: (delta >= 0 ? '+' : '') + delta + '%' })
    } else {
      this.setData({ socDeltaText: '--' })
    }
  },

  onMileageInput(e) {
    this.setData({ mileage: e.detail.value })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  async onSubmit() {
    const d = this.data
    if (!d.startDate) {
      wx.showToast({ title: '请选择充电日期', icon: 'none' })
      return
    }
    if (!d.chargeKwh || parseFloat(d.chargeKwh) <= 0) {
      wx.showToast({ title: '请输入充电量', icon: 'none' })
      return
    }
    if (!d.cost || parseFloat(d.cost) <= 0) {
      wx.showToast({ title: '请输入充电费用', icon: 'none' })
      return
    }

    this.setData({ submitting: true })

    try {
      const vehicle = d.vehicles[d.vehicleIndex]
      const startSOC = parseInt(d.startSOC)
      const endSOC = parseInt(d.endSOC)
      await callCloud('record', {
        action: 'create',
        data: {
          vehicleId: vehicle ? vehicle._id : '',
          stationName: d.stationName || '',
          chargeType: d.chargeType,
          startTime: this.getFullTimeStr(d.startDate, d.startTime),
          endTime: this.getFullTimeStr(d.endDate, d.endTime),
          startSOC: isNaN(startSOC) ? 0 : startSOC,
          endSOC: isNaN(endSOC) ? 0 : endSOC,
          chargeKwh: parseFloat(d.chargeKwh),
          cost: parseFloat(d.cost),
          mileage: parseFloat(d.mileage) || 0,
          batteryCapacity: vehicle ? vehicle.batteryCapacity : 0,
          remark: d.remark || '',
        },
      })
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => wx.switchTab({ url: '/pages/dashboard/dashboard' }), 1000)
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' })
      console.error(err)
    } finally {
      this.setData({ submitting: false })
    }
  },
})
