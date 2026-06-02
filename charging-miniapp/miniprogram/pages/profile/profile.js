const { callCloud } = require('../../utils/cloud')
const { toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    userInfo: null,
    isLoggedIn: false,
    nickName: '充电达人',
    vehicles: [],
    totalKwh: 0,
    totalCost: 0,
    totalDays: 0,
    settings: {
      notification: true,
      budgetLimit: 800,
      theme: 'light',
    },
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 4 })
    }
    this.loadData()
  },

  async loadData() {
    try {
      await auth.ensureLogin()
      const userInfo = auth.getUserInfo()
      const loggedIn = auth.isLoggedIn()

      if (loggedIn) {
        const [vehicles, statsRes] = await Promise.all([
          callCloud('vehicle', { action: 'list' }),
          callCloud('stats', { action: 'overview', period: 'year' }),
        ])

        this.setData({
          userInfo,
          isLoggedIn: true,
          nickName: userInfo ? userInfo.nickName || '充电达人' : '充电达人',
          vehicles: vehicles || [],
          totalKwh: statsRes && statsRes.kwh ? toFixed(statsRes.kwh.value, 1) : '-',
          totalCost: statsRes && statsRes.cost ? '¥' + toFixed(statsRes.cost.value) : '-',
          totalDays: statsRes && statsRes.count && statsRes.count.value > 0 ? statsRes.count.value : '-',
          settings: userInfo && userInfo.settings ? userInfo.settings : this.data.settings,
        })
      } else {
        this.setData({
          userInfo: null,
          isLoggedIn: false,
          nickName: '未登录',
          vehicles: [],
          totalKwh: '-',
          totalCost: '-',
          totalDays: '-',
        })
      }
    } catch (err) {
      console.error(err)
    }
  },

  async onGetUserProfile() {
    try {
      const { userInfo: wxUserInfo } = await wx.getUserProfile({
        desc: '用于完善个人资料',
      })

      await auth.ensureLogin()

      const nickName = wxUserInfo.nickName || '充电达人'
      const avatarUrl = wxUserInfo.avatarUrl || ''

      auth.updateUserInfo({ nickName: nickName, avatarUrl: avatarUrl })

      await callCloud('login', {
        nickName: nickName,
        avatarUrl: avatarUrl,
      })

      this.setData({
        userInfo: { nickName, avatarUrl },
        isLoggedIn: true,
        nickName: nickName,
      })

      wx.showToast({ title: '登录成功', icon: 'success' })
      this.loadData()
    } catch (err) {
      console.error('login error', err)
      if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
        wx.showToast({ title: '登录失败', icon: 'none' })
      }
    }
  },

  goToAddCar() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      wx.switchTab({ url: '/pages/profile/profile' })
      return
    }
    wx.navigateTo({ url: '/pages/add-car/add-car' })
  },

  onImportData() {
    if (!auth.isLoggedIn()) {
      wx.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['json'],
      success: (res) => {
        const filePath = res.tempFiles[0].path
        this.doImport(filePath)
      },
      fail: () => {},
    })
  },

  async doImport(filePath) {
    wx.showLoading({ title: '导入中...', mask: true })
    try {
      const fs = wx.getFileSystemManager()
      const content = fs.readFileSync(filePath, 'utf-8')
      const data = JSON.parse(content)

      const vehicles = data.vehicles || []
      const records = data.records || []
      if (vehicles.length === 0 && records.length === 0) {
        wx.hideLoading()
        wx.showToast({ title: '文件中无有效数据', icon: 'none' })
        return
      }

      wx.showLoading({ title: '导入车辆 0/' + vehicles.length, mask: true })
      const vehicleIdMap = {}
      for (let i = 0; i < vehicles.length; i++) {
        const v = vehicles[i]
        wx.showLoading({ title: '导入车辆 ' + (i + 1) + '/' + vehicles.length, mask: true })
        try {
          const res = await callCloud('vehicle', {
            action: 'create',
            data: {
              brand: v.brand || '',
              model: v.model || '',
              trim: v.trim || '',
              batteryCapacity: v.batteryCapacity || 0,
              plateNumber: v.plateNumber || '',
              isDefault: v.isDefault || false,
            },
          })
          if (v._id) vehicleIdMap[v._id] = res.vehicleId
        } catch (e) {
          console.error('导入车辆失败', v, e)
        }
      }

      const validRecords = records.filter(r => r.chargeKwh > 0 && r.cost > 0)
      wx.showLoading({ title: '导入记录 0/' + validRecords.length, mask: true })
      for (let i = 0; i < validRecords.length; i++) {
        const r = validRecords[i]
        wx.showLoading({ title: '导入记录 ' + (i + 1) + '/' + validRecords.length, mask: true })
        try {
          await callCloud('record', {
            action: 'create',
            data: {
              vehicleId: (r.vehicleId && vehicleIdMap[r.vehicleId]) || r.vehicleId || '',
              stationName: r.stationName || '',
              chargeType: r.chargeType || 'fast',
              startTime: r.startTime || '',
              endTime: r.endTime || '',
              startSOC: r.startSOC || 0,
              endSOC: r.endSOC || 0,
              chargeKwh: r.chargeKwh || 0,
              cost: r.cost || 0,
              mileage: r.mileage || 0,
              batteryCapacity: r.batteryCapacity || 0,
              remark: r.remark || '',
            },
          })
        } catch (e) {
          console.error('导入记录失败', r, e)
        }
      }

      wx.hideLoading()
      wx.showModal({
        title: '导入完成',
        content: '成功导入 ' + vehicles.length + ' 辆车辆、' + validRecords.length + ' 条充电记录',
        showCancel: false,
        success: () => this.loadData(),
      })
    } catch (err) {
      wx.hideLoading()
      console.error('import error', err)
      wx.showToast({ title: '导入失败，请检查文件格式', icon: 'none' })
    }
  },

  onNotificationToggle(e) {
    const val = e.detail.value
    this.setData({ 'settings.notification': val })
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout()
          wx.reLaunch({ url: '/pages/dashboard/dashboard' })
        }
      },
    })
  },
})
