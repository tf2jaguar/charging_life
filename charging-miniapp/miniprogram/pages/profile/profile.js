const { callCloud } = require('../../utils/cloud')
const { toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    userInfo: null,
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

      const [vehicles, statsRes] = await Promise.all([
        callCloud('vehicle', { action: 'list' }),
        callCloud('stats', { action: 'overview', period: 'year' }),
      ])

      this.setData({
        userInfo,
        nickName: userInfo ? userInfo.nickName || '充电达人' : '充电达人',
        vehicles: vehicles || [],
        totalKwh: statsRes && statsRes.kwh ? toFixed(statsRes.kwh.value, 1) : '0',
        totalCost: statsRes && statsRes.cost ? '¥' + toFixed(statsRes.cost.value) : '¥0',
        totalDays: statsRes && statsRes.count ? statsRes.count.value : 0,
        settings: userInfo && userInfo.settings ? userInfo.settings : this.data.settings,
      })
    } catch (err) {
      console.error(err)
    }
  },

  goToAddCar() {
    wx.navigateTo({ url: '/pages/add-car/add-car' })
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
          wx.clearStorageSync()
          wx.reLaunch({ url: '/pages/dashboard/dashboard' })
        }
      },
    })
  },
})
