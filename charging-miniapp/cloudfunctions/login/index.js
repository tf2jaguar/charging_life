const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const userRes = await db.collection('users').where({ _openid: openid }).get()

    if (userRes.data.length === 0) {
      await db.collection('users').add({
        data: {
          _openid: openid,
          nickName: event.nickName || '充电达人',
          avatarUrl: event.avatarUrl || '',
          phone: '',
          defaultVehicleId: '',
          settings: {
            notification: true,
            budgetLimit: 800,
            theme: 'light',
          },
          createdAt: db.serverDate(),
          updatedAt: db.serverDate(),
        },
      })
    }

    const user = (await db.collection('users').where({ _openid: openid }).get()).data[0]

    let defaultVehicle = null
    if (user.defaultVehicleId) {
      const vehicleRes = await db.collection('vehicles').doc(user.defaultVehicleId).get()
      defaultVehicle = vehicleRes.data
    }

    return {
      code: 0,
      data: {
        openid: openid,
        userInfo: user,
        defaultVehicle: defaultVehicle,
      },
    }
  } catch (err) {
    return { code: -1, msg: err.message }
  }
}
