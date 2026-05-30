const { callCloud } = require('./cloud')
const { IS_OSIM } = require('./env')

let _userInfo = null
let _openid = null

const getUserInfo = function () {
  return _userInfo
}

const getOpenId = function () {
  return _openid
}

const login = function () {
  if (IS_OSIM) {
    // osim 环境直接返回 mock 数据，不调用云函数
    var mockResult = require('./mock-data')
    var user = mockResult.getUser()
    _openid = 'mock_openid_001'
    _userInfo = user
    var app = getApp()
    if (app) {
      app.globalData.userInfo = _userInfo
      app.globalData.openid = _openid
    }
    return Promise.resolve({ openid: _openid, userInfo: _userInfo })
  }
  return wx.cloud.callFunction({
    name: 'login',
    data: {},
  }).then(function (res) {
    if (res.result) {
      _openid = res.result.openid
      _userInfo = res.result.userInfo || null
      const app = getApp()
      if (app) {
        app.globalData.userInfo = _userInfo
        app.globalData.openid = _openid
      }
      return res.result
    }
    return Promise.reject(res)
  })
}

const ensureLogin = function () {
  if (_openid) return Promise.resolve({ openid: _openid, userInfo: _userInfo })
  return login()
}

module.exports = {
  getUserInfo: getUserInfo,
  getOpenId: getOpenId,
  login: login,
  ensureLogin: ensureLogin,
}
