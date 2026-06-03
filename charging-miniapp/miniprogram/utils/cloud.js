const callCloud = function (name, data) {
  var action = data && data.action
  console.info('[callCloud] name=%s, action=%s', name, action || '')
  return wx.cloud.callFunction({
    name: name,
    data: data,
  }).then(function (res) {
    if (res.result && res.result.code === 0) {
      return res.result.data
    }
    return Promise.reject(res.result || { code: -1, msg: '调用失败' })
  })
}

const getCollection = function (name) {
  return wx.cloud.database().collection(name)
}

module.exports = {
  callCloud: callCloud,
  getCollection: getCollection,
}
