const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { action, data } = event

  try {
    switch (action) {
      case 'create': {
        if (data.isDefault) {
          await db.collection('vehicles')
            .where({ _openid: openid, isDefault: true })
            .update({ data: { isDefault: false, updatedAt: db.serverDate() } })
        }

        const vehicle = {
          _openid: openid,
          brand: data.brand || '',
          model: data.model || '',
          trim: data.trim || '',
          batteryCapacity: data.batteryCapacity || 0,
          plateNumber: data.plateNumber || '',
          isDefault: data.isDefault || false,
          createdAt: db.serverDate(),
          updatedAt: db.serverDate(),
        }
        const res = await db.collection('vehicles').add({ data: vehicle })

        if (data.isDefault) {
          const userRes = await db.collection('users').where({ _openid: openid }).get()
          if (userRes.data.length > 0) {
            await db.collection('users').doc(userRes.data[0]._id).update({
              data: { defaultVehicleId: res._id, updatedAt: db.serverDate() }
            })
          }
        }

        return { code: 0, data: { vehicleId: res._id } }
      }

      case 'update': {
        if (!data.vehicleId) return { code: -1, msg: '缺少vehicleId' }
        if (data.isDefault) {
          await db.collection('vehicles')
            .where({ _openid: openid, isDefault: true })
            .update({ data: { isDefault: false, updatedAt: db.serverDate() } })
        }
        const updateData = { ...data, updatedAt: db.serverDate() }
        delete updateData.vehicleId
        delete updateData._id
        delete updateData._openid
        await db.collection('vehicles').doc(data.vehicleId).update({ data: updateData })

        if (data.isDefault) {
          const userRes = await db.collection('users').where({ _openid: openid }).get()
          if (userRes.data.length > 0) {
            await db.collection('users').doc(userRes.data[0]._id).update({
              data: { defaultVehicleId: data.vehicleId, updatedAt: db.serverDate() }
            })
          }
        }
        return { code: 0, data: {} }
      }

      case 'delete': {
        if (!data.vehicleId) return { code: -1, msg: '缺少vehicleId' }
        const vRes = await db.collection('vehicles').doc(data.vehicleId).get()
        if (vRes.data._openid !== openid) {
          return { code: -1, msg: '无权删除' }
        }
        await db.collection('vehicles').doc(data.vehicleId).remove()
        return { code: 0, data: {} }
      }

      case 'list': {
        const vehicles = await db.collection('vehicles')
          .where({ _openid: openid })
          .orderBy('isDefault', 'desc')
          .orderBy('createdAt', 'asc')
          .get()
        return { code: 0, data: vehicles.data }
      }

      default:
        return { code: -1, msg: '未知action' }
    }
  } catch (err) {
    return { code: -1, msg: err.message }
  }
}
