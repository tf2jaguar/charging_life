const { callCloud } = require('../../utils/cloud')
const { formatDuration, calcUnitPrice, calcAvgPower, toFixed } = require('../../utils/util')

Page({
  data: {
    vehicles: [],
    vehicleIndex: 0,
    stationName: '',
    chargeType: 'fast',
    startTime: '',
    endTime: '',
    durationText: '--',
    chargeKwh: '',
    cost: '',
    unitPriceText: '--',
    avgPowerText: '--',
    startSOC: 35,
    endSOC: 90,
    socDelta: 55,
    mileage: '',
    remark: '',
    submitting: false,
  },

  onLoad() {
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
      startTime: this.formatDateTimeLocal(oneHourAgo),
      endTime: this.formatDateTimeLocal(now),
    })
    this.calcDuration()
  },

  formatDateTimeLocal(date) {
    const pad = n => (n < 10 ? '0' + n : '' + n)
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes())
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

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value })
    this.calcDuration()
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value })
    this.calcDuration()
  },

  calcDuration() {
    if (!this.data.startTime || !this.data.endTime) return
    const start = new Date(this.data.startTime)
    const end = new Date(this.data.endTime)
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
      if (!this.data.startTime || !this.data.endTime) return
      minutes = Math.max(0, Math.round((new Date(this.data.endTime) - new Date(this.data.startTime)) / 60000))
    }

    const unitPrice = kwh > 0 ? cost / kwh : 0
    const avgPower = minutes > 0 ? kwh / (minutes / 60) : 0

    this.setData({
      unitPriceText: unitPrice > 0 ? '¥' + toFixed(unitPrice) + '/kWh' : '--',
      avgPowerText: avgPower > 0 ? toFixed(avgPower, 1) + ' kW' : '--',
    })
  },

  onStartSOCChange(e) {
    const val = parseInt(e.detail.value)
    this.setData({ startSOC: val, socDelta: this.data.endSOC - val })
  },

  onEndSOCChange(e) {
    const val = parseInt(e.detail.value)
    this.setData({ endSOC: val, socDelta: val - this.data.startSOC })
  },

  onMileageInput(e) {
    this.setData({ mileage: e.detail.value })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  async onSubmit() {
    const d = this.data
    if (!d.stationName) {
      wx.showToast({ title: '请输入充电站名称', icon: 'none' })
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
      await callCloud('record', {
        action: 'create',
        data: {
          vehicleId: vehicle ? vehicle._id : '',
          stationName: d.stationName,
          chargeType: d.chargeType,
          startTime: d.startTime,
          endTime: d.endTime,
          startSOC: d.startSOC,
          endSOC: d.endSOC,
          chargeKwh: parseFloat(d.chargeKwh),
          cost: parseFloat(d.cost),
          mileage: parseFloat(d.mileage) || 0,
          batteryCapacity: vehicle ? vehicle.batteryCapacity : 0,
          remark: d.remark,
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
