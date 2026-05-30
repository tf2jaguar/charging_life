/**
 * 环境检测工具
 * osim 环境下使用本地模拟数据，其他环境使用云函数
 */

const isOsimEnv = function () {
  // osim 是微信开发者工具模拟器环境
  try {
    const accountInfo = wx.getAccountInfoSync()
    // 开发版或体验版时使用本地数据
    const envVersion = accountInfo.miniProgram.envVersion
    return envVersion === 'develop' || envVersion === 'trial'
  } catch (e) {
    // 如果获取不到账户信息，尝试通过系统信息判断
    try {
      const systemInfo = wx.getSystemInfoSync()
      // 在开发者工具中 platform 为 devtools
      return systemInfo.platform === 'devtools'
    } catch (e2) {
      return false
    }
  }
}

const IS_OSIM = isOsimEnv()

module.exports = {
  isOsimEnv: isOsimEnv,
  IS_OSIM: IS_OSIM,
}
