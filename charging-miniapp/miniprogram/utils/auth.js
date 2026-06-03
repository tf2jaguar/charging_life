const { callCloud } = require('./cloud')

let _userInfo = null
let _openid = null
let _explicitLogin = false

const getUserInfo = function () {
  return _userInfo
}

const getOpenId = function () {
  return _openid
}

const login = function () {
  return wx.cloud.callFunction({
    name: 'login',
    data: {},
  }).then(function (res) {
    if (res.result) {
      _openid = res.result.openid
      _userInfo = res.result.userInfo || null
      var app = getApp()
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

const isLoggedIn = function () {
  return _explicitLogin
}

const requireLogin = function () {
  return _explicitLogin
}

const logout = function () {
  _userInfo = null
  _openid = null
  _explicitLogin = false
  var app = getApp()
  if (app) {
    app.globalData.userInfo = null
    app.globalData.openid = null
  }
}

const updateUserInfo = function (info) {
  if (_userInfo) {
    Object.assign(_userInfo, info)
  } else {
    _userInfo = info
  }
  _explicitLogin = true
  var app = getApp()
  if (app) {
    app.globalData.userInfo = _userInfo
  }
}

module.exports = {
  getUserInfo: getUserInfo,
  getOpenId: getOpenId,
  login: login,
  ensureLogin: ensureLogin,
  isLoggedIn: isLoggedIn,
  requireLogin: requireLogin,
  logout: logout,
  updateUserInfo: updateUserInfo,
}
