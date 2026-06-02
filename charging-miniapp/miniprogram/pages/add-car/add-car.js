const { callCloud } = require('../../utils/cloud')
const { vehicleData } = require('../../utils/constants')
const auth = require('../../utils/auth')

Page({
  data: {
    brands: [],
    models: [],
    trims: [],
    batteryOptions: [],
    brandIndex: -1,
    modelIndex: -1,
    trimIndex: -1,
    batteryIndex: -1,
    plateNumber: '',
    isDefault: true,
    submitting: false,
    batteryHint: false,
  },

  onLoad() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(function () {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
      return
    }
    this.setData({
      brands: Object.keys(vehicleData),
    })
  },

  onBrandChange(e) {
    const idx = e.detail.value
    const brand = this.data.brands[idx]
    const models = Object.keys(vehicleData[brand])
    this.setData({
      brandIndex: idx,
      models,
      modelIndex: -1,
      trims: [],
      trimIndex: -1,
      batteryOptions: [],
      batteryIndex: -1,
      batteryHint: false,
    })
  },

  onModelChange(e) {
    const idx = e.detail.value
    const brand = this.data.brands[this.data.brandIndex]
    const model = this.data.models[idx]
    const trims = Object.keys(vehicleData[brand][model])
    this.setData({
      modelIndex: idx,
      trims,
      trimIndex: -1,
      batteryOptions: [],
      batteryIndex: -1,
      batteryHint: false,
    })
  },

  onTrimChange(e) {
    const idx = e.detail.value
    const brand = this.data.brands[this.data.brandIndex]
    const model = this.data.models[this.data.modelIndex]
    const trim = this.data.trims[idx]
    const battery = vehicleData[brand][model][trim]

    const alternatives = [50, 60, 70, 75, 80, 85, 90, 100].filter(v => v !== battery)
    const batteryOptions = [battery + ' kWh', ...alternatives.map(v => v + ' kWh')]

    this.setData({
      trimIndex: idx,
      batteryOptions,
      batteryIndex: 0,
      batteryHint: true,
    })
  },

  onBatteryChange(e) {
    this.setData({ batteryIndex: e.detail.value })
  },

  onPlateInput(e) {
    this.setData({ plateNumber: e.detail.value })
  },

  onDefaultToggle(e) {
    this.setData({ isDefault: e.detail.value })
  },

  async onSubmit() {
    const d = this.data
    if (d.brandIndex < 0 || d.modelIndex < 0 || d.trimIndex < 0) {
      wx.showToast({ title: '请选择完整的车辆信息', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    try {
      const brand = d.brands[d.brandIndex]
      const model = d.models[d.modelIndex]
      const trim = d.trims[d.trimIndex]
      const batteryStr = d.batteryOptions[d.batteryIndex]
      const batteryCapacity = parseFloat(batteryStr)

      await callCloud('vehicle', {
        action: 'create',
        data: {
          brand,
          model,
          trim,
          batteryCapacity,
          plateNumber: d.plateNumber,
          isDefault: d.isDefault,
        },
      })
      wx.showToast({ title: '保存成功', icon: 'success' })
      setTimeout(() => wx.navigateBack({ delta: 1 }), 1000)
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' })
      console.error(err)
    } finally {
      this.setData({ submitting: false })
    }
  },
})
