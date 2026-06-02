/**
 * 本地模拟数据，osim 环境下替代云函数返回
 */
const IS_OSIM = true

// 生成近期日期
function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60))
  return d
}

const MOCK_OPENID = 'mock_openid_001'

const MOCK_USER = {
  _id: 'user_001',
  _openid: MOCK_OPENID,
  nickName: '充电达人',
  avatarUrl: '',
  phone: '',
  defaultVehicleId: 'vehicle_001',
  settings: {
    notification: true,
    budgetLimit: 800,
    theme: 'light',
  },
  createdAt: new Date('2025-01-15'),
  updatedAt: new Date(),
}

const MOCK_VEHICLES = [
  {
    _id: 'vehicle_001',
    _openid: MOCK_OPENID,
    brand: '特斯拉',
    model: 'Model 3',
    trim: '后轮驱动版',
    batteryCapacity: 60,
    plateNumber: '京A·12345',
    isDefault: true,
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date(),
  },
  {
    _id: 'vehicle_002',
    _openid: MOCK_OPENID,
    brand: '蔚来',
    model: 'ES6',
    trim: '75kWh版',
    batteryCapacity: 75,
    plateNumber: '京B·67890',
    isDefault: false,
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date(),
  },
]

const MOCK_RECORDS = [
  {
    _id: 'record_001',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '特来电·望京SOHO站',
    chargeType: 'super',
    startTime: daysAgo(0),
    endTime: new Date(daysAgo(0).getTime() + 35 * 60000),
    startSOC: 20,
    endSOC: 80,
    chargeKwh: 36,
    cost: 25.2,
    mileage: 0,
    remark: '超充速度快',
    duration: 35,
    unitPrice: 0.7,
    avgPower: 61.7,
    socDelta: 60,
    chargeLoss: 0,
    createdAt: daysAgo(0),
  },
  {
    _id: 'record_002',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '星星充电·朝阳大悦城站',
    chargeType: 'fast',
    startTime: daysAgo(2),
    endTime: new Date(daysAgo(2).getTime() + 55 * 60000),
    startSOC: 30,
    endSOC: 85,
    chargeKwh: 33,
    cost: 23.1,
    mileage: 0,
    remark: '',
    duration: 55,
    unitPrice: 0.7,
    avgPower: 36,
    socDelta: 55,
    chargeLoss: 0,
    createdAt: daysAgo(2),
  },
  {
    _id: 'record_003',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_002',
    stationName: '国家电网·中关村站',
    chargeType: 'slow',
    startTime: daysAgo(5),
    endTime: new Date(daysAgo(5).getTime() + 240 * 60000),
    startSOC: 15,
    endSOC: 90,
    chargeKwh: 56.25,
    cost: 33.75,
    mileage: 0,
    remark: '慢充便宜',
    duration: 240,
    unitPrice: 0.6,
    avgPower: 14.1,
    socDelta: 75,
    chargeLoss: 0,
    createdAt: daysAgo(5),
  },
  {
    _id: 'record_004',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '特来电·望京SOHO站',
    chargeType: 'fast',
    startTime: daysAgo(8),
    endTime: new Date(daysAgo(8).getTime() + 48 * 60000),
    startSOC: 25,
    endSOC: 90,
    chargeKwh: 39,
    cost: 27.3,
    mileage: 0,
    remark: '',
    duration: 48,
    unitPrice: 0.7,
    avgPower: 48.8,
    socDelta: 65,
    chargeLoss: 0,
    createdAt: daysAgo(8),
  },
  {
    _id: 'record_005',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_002',
    stationName: '星星充电·国贸站',
    chargeType: 'super',
    startTime: daysAgo(12),
    endTime: new Date(daysAgo(12).getTime() + 40 * 60000),
    startSOC: 18,
    endSOC: 75,
    chargeKwh: 42.75,
    cost: 34.2,
    mileage: 0,
    remark: '国贸超充站很方便',
    duration: 40,
    unitPrice: 0.8,
    avgPower: 64.1,
    socDelta: 57,
    chargeLoss: 0,
    createdAt: daysAgo(12),
  },
  {
    _id: 'record_006',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '国家电网·回龙观站',
    chargeType: 'slow',
    startTime: daysAgo(16),
    endTime: new Date(daysAgo(16).getTime() + 180 * 60000),
    startSOC: 10,
    endSOC: 80,
    chargeKwh: 42,
    cost: 25.2,
    mileage: 0,
    remark: '',
    duration: 180,
    unitPrice: 0.6,
    avgPower: 14,
    socDelta: 70,
    chargeLoss: 0,
    createdAt: daysAgo(16),
  },
  {
    _id: 'record_007',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '特来电·望京SOHO站',
    chargeType: 'fast',
    startTime: daysAgo(20),
    endTime: new Date(daysAgo(20).getTime() + 50 * 60000),
    startSOC: 22,
    endSOC: 88,
    chargeKwh: 39.6,
    cost: 27.72,
    mileage: 0,
    remark: '日常补能',
    duration: 50,
    unitPrice: 0.7,
    avgPower: 47.5,
    socDelta: 66,
    chargeLoss: 0,
    createdAt: daysAgo(20),
  },
  {
    _id: 'record_008',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_002',
    stationName: '星星充电·朝阳大悦城站',
    chargeType: 'fast',
    startTime: daysAgo(25),
    endTime: new Date(daysAgo(25).getTime() + 60 * 60000),
    startSOC: 28,
    endSOC: 92,
    chargeKwh: 48,
    cost: 33.6,
    mileage: 0,
    remark: '',
    duration: 60,
    unitPrice: 0.7,
    avgPower: 48,
    socDelta: 64,
    chargeLoss: 0,
    createdAt: daysAgo(25),
  },
  {
    _id: 'record_009',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '国家电网·西二旗站',
    chargeType: 'slow',
    startTime: daysAgo(30),
    endTime: new Date(daysAgo(30).getTime() + 300 * 60000),
    startSOC: 8,
    endSOC: 95,
    chargeKwh: 52.2,
    cost: 31.32,
    mileage: 0,
    remark: '夜间谷电充电',
    duration: 300,
    unitPrice: 0.6,
    avgPower: 10.4,
    socDelta: 87,
    chargeLoss: 0,
    createdAt: daysAgo(30),
  },
  {
    _id: 'record_010',
    _openid: MOCK_OPENID,
    vehicleId: 'vehicle_001',
    stationName: '特来电·望京SOHO站',
    chargeType: 'super',
    startTime: daysAgo(35),
    endTime: new Date(daysAgo(35).getTime() + 30 * 60000),
    startSOC: 15,
    endSOC: 70,
    chargeKwh: 33,
    cost: 26.4,
    mileage: 0,
    remark: '',
    duration: 30,
    unitPrice: 0.8,
    avgPower: 66,
    socDelta: 55,
    chargeLoss: 0,
    createdAt: daysAgo(35),
  },
]

// 当前登录用户的 openid
let _currentOpenid = MOCK_OPENID

// 本地存储 key（按用户隔离）
function storageKey(base) {
  return base + '_' + _currentOpenid
}

const STORAGE_KEYS = {
  vehicles: 'mock_vehicles',
  records: 'mock_records',
  user: 'mock_user',
  initialized: 'mock_initialized',
}

function getStore(key, fallback) {
  try {
    const val = wx.getStorageSync(key)
    return val || fallback
  } catch (e) {
    return fallback
  }
}

function setStore(key, val) {
  try {
    wx.setStorageSync(key, val)
  } catch (e) {
    console.error('mock setStore error', e)
  }
}

function setOpenid(openid) {
  _currentOpenid = openid || MOCK_OPENID
}

function ensureInit() {
  if (!getStore(storageKey(STORAGE_KEYS.initialized), false)) {
    setStore(storageKey(STORAGE_KEYS.vehicles), MOCK_VEHICLES)
    setStore(storageKey(STORAGE_KEYS.records), MOCK_RECORDS)
    setStore(storageKey(STORAGE_KEYS.user), MOCK_USER)
    setStore(storageKey(STORAGE_KEYS.initialized), true)
  }
}

function getRecords() {
  ensureInit()
  return getStore(storageKey(STORAGE_KEYS.records), MOCK_RECORDS)
}

function setRecords(records) {
  setStore(storageKey(STORAGE_KEYS.records), records)
}

function getVehicles() {
  ensureInit()
  return getStore(storageKey(STORAGE_KEYS.vehicles), MOCK_VEHICLES)
}

function setVehicles(vehicles) {
  setStore(storageKey(STORAGE_KEYS.vehicles), vehicles)
}

function getUser() {
  ensureInit()
  return getStore(storageKey(STORAGE_KEYS.user), MOCK_USER)
}

function setUser(user) {
  setStore(storageKey(STORAGE_KEYS.user), user)
}

// ============ 各云函数 action 模拟 ============

function mockLogin() {
  const user = getUser()
  return {
    openid: _currentOpenid,
    userInfo: user,
  }
}

function mockVehicle(action, data) {
  switch (action) {
    case 'list': {
      return getVehicles()
    }
    case 'create': {
      const vehicles = getVehicles()
      if (data.isDefault) {
        vehicles.forEach(function (v) { v.isDefault = false })
      }
      const newVehicle = {
        _id: 'vehicle_' + Date.now(),
        _openid: MOCK_OPENID,
        brand: data.brand || '',
        model: data.model || '',
        trim: data.trim || '',
        batteryCapacity: data.batteryCapacity || 0,
        plateNumber: data.plateNumber || '',
        isDefault: data.isDefault || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      vehicles.push(newVehicle)
      setVehicles(vehicles)
      return { vehicleId: newVehicle._id }
    }
    case 'update': {
      if (!data.vehicleId) return Promise.reject({ code: -1, msg: '缺少vehicleId' })
      const vehicles = getVehicles()
      const idx = vehicles.findIndex(function (v) { return v._id === data.vehicleId })
      if (idx >= 0) {
        if (data.isDefault) {
          vehicles.forEach(function (v) { v.isDefault = false })
        }
        Object.assign(vehicles[idx], data, { updatedAt: new Date() })
        delete vehicles[idx].vehicleId
        setVehicles(vehicles)
      }
      return {}
    }
    case 'delete': {
      if (!data.vehicleId) return Promise.reject({ code: -1, msg: '缺少vehicleId' })
      const vehicles = getVehicles().filter(function (v) { return v._id !== data.vehicleId })
      setVehicles(vehicles)
      return {}
    }
    default:
      return Promise.reject({ code: -1, msg: '未知action' })
  }
}

function mockRecord(action, data) {
  switch (action) {
    case 'list': {
      const page = (data && data.page) || 1
      const pageSize = (data && data.pageSize) || 20
      let records = getRecords()

      if (data && data.chargeType) {
        records = records.filter(function (r) { return r.chargeType === data.chargeType })
      }

      records.sort(function (a, b) { return new Date(b.startTime) - new Date(a.startTime) })
      const total = records.length
      const start = (page - 1) * pageSize
      const list = records.slice(start, start + pageSize)

      return { list: list, total: total, page: page, pageSize: pageSize }
    }
    case 'detail': {
      if (!data.recordId) return Promise.reject({ code: -1, msg: '缺少recordId' })
      const records = getRecords()
      const record = records.find(function (r) { return r._id === data.recordId })
      if (!record) return Promise.reject({ code: -1, msg: '记录不存在' })
      if (record.vehicleId) {
        const vehicles = getVehicles()
        const vehicle = vehicles.find(function (v) { return v._id === record.vehicleId })
        if (vehicle) record.vehicleInfo = vehicle
      }
      return record
    }
    case 'create': {
      const records = getRecords()
      const startMs = data.startTime ? new Date(data.startTime).getTime() : NaN
      const endMs = data.endTime ? new Date(data.endTime).getTime() : NaN
      const duration = (!isNaN(startMs) && !isNaN(endMs))
        ? Math.max(0, Math.round((endMs - startMs) / 60000)) : 0
      const unitPrice = data.cost && data.chargeKwh && data.chargeKwh > 0
        ? Math.round((data.cost / data.chargeKwh) * 100) / 100 : 0
      const avgPower = data.chargeKwh && duration > 0
        ? Math.round((data.chargeKwh / (duration / 60)) * 10) / 10 : 0
      const socDelta = (data.startSOC != null && data.endSOC != null && data.startSOC !== 0 && data.endSOC !== 0)
        ? data.endSOC - data.startSOC : 0

      const newRecord = {
        _id: 'record_' + Date.now(),
        _openid: MOCK_OPENID,
        vehicleId: data.vehicleId || '',
        stationName: data.stationName || '',
        chargeType: data.chargeType || 'fast',
        startTime: data.startTime ? new Date(data.startTime) : new Date(),
        endTime: data.endTime ? new Date(data.endTime) : new Date(),
        startSOC: data.startSOC != null ? data.startSOC : 0,
        endSOC: data.endSOC != null ? data.endSOC : 0,
        chargeKwh: data.chargeKwh || 0,
        cost: data.cost || 0,
        mileage: data.mileage || 0,
        remark: data.remark || '',
        duration: duration,
        unitPrice: unitPrice,
        avgPower: avgPower,
        socDelta: socDelta,
        chargeLoss: 0,
        createdAt: new Date(),
      }
      records.push(newRecord)
      setRecords(records)
      return { recordId: newRecord._id }
    }
    case 'update': {
      if (!data.recordId) return Promise.reject({ code: -1, msg: '缺少recordId' })
      const records = getRecords()
      const idx = records.findIndex(function (r) { return r._id === data.recordId })
      if (idx >= 0) {
        const startMs = data.startTime ? new Date(data.startTime).getTime() : NaN
        const endMs = data.endTime ? new Date(data.endTime).getTime() : NaN
        const duration = (!isNaN(startMs) && !isNaN(endMs))
          ? Math.max(0, Math.round((endMs - startMs) / 60000))
          : records[idx].duration || 0
        const unitPrice = data.cost && data.chargeKwh && data.chargeKwh > 0
          ? Math.round((data.cost / data.chargeKwh) * 100) / 100 : records[idx].unitPrice || 0
        const avgPower = data.chargeKwh && duration > 0
          ? Math.round((data.chargeKwh / (duration / 60)) * 10) / 10 : records[idx].avgPower || 0
        const socDelta = (data.startSOC != null && data.endSOC != null && data.startSOC !== 0 && data.endSOC !== 0)
          ? data.endSOC - data.startSOC : records[idx].socDelta || 0

        Object.assign(records[idx], data, {
          duration: duration,
          unitPrice: unitPrice,
          avgPower: avgPower,
          socDelta: socDelta,
          updatedAt: new Date(),
        })
        delete records[idx].recordId
        setRecords(records)
      }
      return {}
    }
    case 'delete': {
      if (!data.recordId) return Promise.reject({ code: -1, msg: '缺少recordId' })
      const records = getRecords().filter(function (r) { return r._id !== data.recordId })
      setRecords(records)
      return {}
    }
    default:
      return Promise.reject({ code: -1, msg: '未知action' })
  }
}

function getPeriodRange(period) {
  const now = new Date()
  var start, end
  if (period === 'year') {
    start = new Date(now.getFullYear(), 0, 1)
    end = new Date(now.getFullYear() + 1, 0, 1)
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  }
  return { start: start, end: end }
}

function getPrevPeriodRange(period) {
  const now = new Date()
  var start, end
  if (period === 'year') {
    start = new Date(now.getFullYear() - 1, 0, 1)
    end = new Date(now.getFullYear(), 0, 1)
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    end = new Date(now.getFullYear(), now.getMonth(), 1)
  }
  return { start: start, end: end }
}

function calcChange(curVal, prevVal, lowerIsBetter) {
  if (!prevVal || prevVal === 0) return { value: curVal, change: 0, direction: 'same' }
  var pct = ((curVal - prevVal) / prevVal * 100)
  var direction
  if (pct > 0) direction = lowerIsBetter ? 'negative' : 'positive'
  else if (pct < 0) direction = lowerIsBetter ? 'positive' : 'negative'
  else direction = 'same'
  return { value: curVal, change: Math.round(pct * 10) / 10, direction: direction }
}

function mockStats(action, event) {
  var period = (event && event.period) || 'month'
  var year = (event && event.year) || new Date().getFullYear()
  var month = (event && event.month) || (new Date().getMonth() + 1)

  switch (action) {
    case 'overview': {
      var range = getPeriodRange(period)
      var prevRange = getPrevPeriodRange(period)
      var records = getRecords()
      var cur = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= range.start && t < range.end
      })
      var prev = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= prevRange.start && t < prevRange.end
      })

      var sumField = function (arr, field) {
        return arr.reduce(function (s, r) { return s + (r[field] || 0) }, 0)
      }
      var curKwh = sumField(cur, 'chargeKwh')
      var curCost = sumField(cur, 'cost')
      var curDuration = sumField(cur, 'duration')
      var prevKwh = sumField(prev, 'chargeKwh')
      var prevCost = sumField(prev, 'cost')
      var prevDuration = sumField(prev, 'duration')
      var curAvgPrice = curKwh > 0 ? Math.round((curCost / curKwh) * 100) / 100 : 0
      var prevAvgPrice = prevKwh > 0 ? Math.round((prevCost / prevKwh) * 100) / 100 : 0

      return {
        count: calcChange(cur.length, prev.length, false),
        kwh: calcChange(curKwh, prevKwh, false),
        cost: calcChange(curCost, prevCost, true),
        avgPrice: calcChange(curAvgPrice, prevAvgPrice, true),
        duration: calcChange(curDuration, prevDuration, false),
        perHundredKwh: calcChange(0, 0, true),
        perHundredCost: calcChange(0, 0, true),
      }
    }
    case 'trend': {
      var start = new Date(year, 0, 1)
      var end = new Date(year + 1, 0, 1)
      var records = getRecords()
      var filtered = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= start && t < end
      })

      var months = []
      for (var i = 0; i < 12; i++) {
        months.push({ month: i + 1, kwh: 0, cost: 0, count: 0 })
      }
      filtered.forEach(function (r) {
        var m = new Date(r.startTime).getMonth()
        months[m].kwh += r.chargeKwh || 0
        months[m].cost += r.cost || 0
        months[m].count++
      })
      return months
    }
    case 'timeDistribution': {
      var range = getPeriodRange(period)
      var records = getRecords()
      var filtered = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= range.start && t < range.end
      })

      var slots = [
        { label: '0-6点', range: [0, 6], count: 0 },
        { label: '6-12点', range: [6, 12], count: 0 },
        { label: '12-18点', range: [12, 18], count: 0 },
        { label: '18-24点', range: [18, 24], count: 0 },
      ]
      filtered.forEach(function (r) {
        var h = new Date(r.startTime).getHours()
        for (var i = 0; i < slots.length; i++) {
          if (h >= slots[i].range[0] && h < slots[i].range[1]) {
            slots[i].count++
            break
          }
        }
      })
      var total = filtered.length || 1
      slots.forEach(function (s) { s.pct = Math.round(s.count / total * 100) })
      return slots
    }
    case 'typeDistribution': {
      var range = getPeriodRange(period)
      var records = getRecords()
      var filtered = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= range.start && t < range.end
      })

      var types = { super: 0, fast: 0, slow: 0 }
      filtered.forEach(function (r) {
        if (types[r.chargeType] !== undefined) types[r.chargeType]++
      })
      var total = filtered.length || 1
      return {
        super: { count: types.super, pct: Math.round(types.super / total * 100) },
        fast: { count: types.fast, pct: Math.round(types.fast / total * 100) },
        slow: { count: types.slow, pct: Math.round(types.slow / total * 100) },
        total: filtered.length,
      }
    }
    case 'topStations': {
      var range = getPeriodRange(period)
      var records = getRecords()
      var filtered = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= range.start && t < range.end
      })

      var stationMap = {}
      filtered.forEach(function (r) {
        var name = r.stationName || '未知'
        if (!stationMap[name]) stationMap[name] = { name: name, count: 0, kwh: 0, cost: 0 }
        stationMap[name].count++
        stationMap[name].kwh += r.chargeKwh || 0
        stationMap[name].cost += r.cost || 0
      })
      return Object.values(stationMap)
        .sort(function (a, b) { return b.count - a.count })
        .slice(0, 5)
    }
    case 'calendar': {
      var start = new Date(year, month - 1, 1)
      var end = new Date(year, month, 1)
      var records = getRecords()
      var filtered = records.filter(function (r) {
        var t = new Date(r.startTime)
        return t >= start && t < end
      })

      var days = []
      var kwh = {}
      filtered.forEach(function (r) {
        var d = new Date(r.startTime).getDate()
        if (days.indexOf(d) === -1) days.push(d)
        kwh[d] = (kwh[d] || 0) + (r.chargeKwh || 0)
      })
      var totalKwh = Object.values(kwh).reduce(function (s, v) { return s + v }, 0)
      return {
        days: days.sort(function (a, b) { return a - b }),
        kwh: kwh,
        totalKwh: Math.round(totalKwh * 10) / 10,
        count: filtered.length,
      }
    }
    case 'recentRecords': {
      var limit = (event && event.limit) || 2
      var records = getRecords()
      records.sort(function (a, b) { return new Date(b.startTime) - new Date(a.startTime) })
      return records.slice(0, limit)
    }
    default:
      return Promise.reject({ code: -1, msg: '未知action' })
  }
}

/**
 * 模拟 callCloud 调用
 * @param {string} name - 云函数名
 * @param {object} data - 调用参数
 */
var callMock = function (name, data) {
  var result
  var action = data && data.action
  var innerData = data && data.data

  switch (name) {
    case 'login':
      if (data && data.nickName) {
        setOpenid('mock_' + data.nickName)
        var user = getUser()
        user.nickName = data.nickName
        if (data.avatarUrl) user.avatarUrl = data.avatarUrl
        setUser(user)
      }
      result = mockLogin()
      break
    case 'vehicle':
      result = mockVehicle(action, innerData)
      break
    case 'record':
      result = mockRecord(action, innerData)
      break
    case 'stats':
      result = mockStats(action, data)
      break
    default:
      return Promise.reject({ code: -1, msg: '未知云函数: ' + name })
  }

  // 如果 result 是 Promise reject，直接返回
  if (result && typeof result.then === 'function') return result

  return Promise.resolve(result)
}

module.exports = {
  callMock: callMock,
  ensureInit: ensureInit,
  setOpenid: setOpenid,
  // 暴露存储操作以便重置
  STORAGE_KEYS: STORAGE_KEYS,
  getRecords: getRecords,
  setRecords: setRecords,
  getVehicles: getVehicles,
  setVehicles: setVehicles,
  getUser: getUser,
  setUser: setUser,
  MOCK_RECORDS: MOCK_RECORDS,
  MOCK_VEHICLES: MOCK_VEHICLES,
  MOCK_USER: MOCK_USER,
}
