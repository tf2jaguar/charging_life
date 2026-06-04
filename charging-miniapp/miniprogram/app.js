App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
    this.globalData = {
      userInfo: null,
      openid: null,
      defaultVehicle: null,
    }

    var auth = require('./utils/auth')
    auth.initOpenId().catch(function (err) {
      console.error('initOpenId failed', err)
    })
  },

  globalData: {
    userInfo: null,
    openid: null,
    defaultVehicle: null,
  }
})
