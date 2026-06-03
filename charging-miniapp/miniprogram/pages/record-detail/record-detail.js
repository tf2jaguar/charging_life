const { callCloud } = require('../../utils/cloud')
const { formatDate, formatDuration, toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    recordId: '',
    record: null,
    isEditMode: false,
    showDeleteModal: false,
    // 编辑字段
    editStationName: '',
    editChargeType: 'fast',
    editStartTime: '',
    editEndTime: '',
    editChargeKwh: '',
    editCost: '',
    editStartSOC: 0,
    editEndSOC: 0,
    editMileage: '',
    editRemark: '',
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ recordId: options.id })
      this.loadDetail(options.id)
    }
  },

  async loadDetail(id) {
    try {
      const record = await callCloud('record', { action: 'detail', data: { recordId: id } })
      this.setData({
        record,
        editStationName: record.stationName,
        editChargeType: record.chargeType,
        editStartTime: this.formatDateTimeLocal(record.startTime),
        editEndTime: this.formatDateTimeLocal(record.endTime),
        editChargeKwh: record.chargeKwh,
        editCost: record.cost,
        editStartSOC: record.startSOC,
        editEndSOC: record.endSOC,
        editMileage: record.mileage,
        editRemark: record.remark,
      })
    } catch (err) {
      console.error(err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  formatDateTimeLocal(date) {
    if (!date) return ''
    const d = new Date(date)
    const pad = n => (n < 10 ? '0' + n : '' + n)
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
      ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
  },

  enterEditMode() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      setTimeout(function () {
        wx.switchTab({ url: '/pages/profile/profile' })
      }, 1000)
      return
    }
    this.setData({ isEditMode: true })
  },

  exitEditMode() {
    this.setData({ isEditMode: false })
  },

  onEditStationInput(e) { this.setData({ editStationName: e.detail.value }) },
  onEditChargeTypeChange(e) { this.setData({ editChargeType: e.detail.value }) },
  onEditStartSOCChange(e) { this.setData({ editStartSOC: parseInt(e.detail.value) }) },
  onEditEndSOCChange(e) { this.setData({ editEndSOC: parseInt(e.detail.value) }) },
  onEditChargeKwhInput(e) { this.setData({ editChargeKwh: e.detail.value }) },
  onEditCostInput(e) { this.setData({ editCost: e.detail.value }) },
  onEditMileageInput(e) { this.setData({ editMileage: e.detail.value }) },
  onEditRemarkInput(e) { this.setData({ editRemark: e.detail.value }) },

  async saveRecord() {
    const d = this.data
    try {
      await callCloud('record', {
        action: 'update',
        data: {
          recordId: d.recordId,
          stationName: d.editStationName,
          chargeType: d.editChargeType,
          startSOC: d.editStartSOC,
          endSOC: d.editEndSOC,
          chargeKwh: parseFloat(d.editChargeKwh) || 0,
          cost: parseFloat(d.editCost) || 0,
          mileage: parseFloat(d.editMileage) || 0,
          remark: d.editRemark,
          batteryCapacity: d.record.vehicleInfo ? d.record.vehicleInfo.batteryCapacity : 0,
        },
      })
      wx.showToast({ title: '保存成功', icon: 'success' })
      this.setData({ isEditMode: false })
      this.loadDetail(d.recordId)
    } catch (err) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  confirmDelete() {
    this.setData({ showDeleteModal: true })
  },

  onCancelDelete() {
    this.setData({ showDeleteModal: false })
  },

  async onDeleteConfirm() {
    try {
      await callCloud('record', { action: 'delete', data: { recordId: this.data.recordId } })
      wx.showToast({ title: '记录已删除', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack({ delta: 1 })
      }, 1000)
    } catch (err) {
      wx.showToast({ title: '删除失败', icon: 'none' })
    }
    this.setData({ showDeleteModal: false })
  },
})
