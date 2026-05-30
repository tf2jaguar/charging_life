const { IS_OSIM } = require('./utils/env')
const { ensureInit } = require('./utils/mock-data')

App({
  onLaunch: function () {
    if (IS_OSIM) {
      console.log('[osim] 使用本地模拟数据')
      ensureInit()
    } else if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {
      userInfo: null,
      defaultVehicle: null,
    }
  },

  globalData: {
    userInfo: null,
    defaultVehicle: null,
  }
})
