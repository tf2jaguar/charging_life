const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

function getPeriodRange(period) {
  const now = new Date()
  let start, end
  if (period === 'year') {
    start = new Date(now.getFullYear(), 0, 1)
    end = new Date(now.getFullYear() + 1, 0, 1)
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1)
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  }
  return { start, end }
}

function getPrevPeriodRange(period) {
  const now = new Date()
  let start, end
  if (period === 'year') {
    start = new Date(now.getFullYear() - 1, 0, 1)
    end = new Date(now.getFullYear(), 0, 1)
  } else {
    start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    end = new Date(now.getFullYear(), now.getMonth(), 1)
  }
  return { start, end }
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { action, period, year, month } = event
  const periodVal = period || 'month'

  try {
    switch (action) {
      case 'overview': {
        const { start, end } = getPeriodRange(periodVal)
        const { start: prevStart, end: prevEnd } = getPrevPeriodRange(periodVal)

        const [curRes, prevRes] = await Promise.all([
          db.collection('records')
            .where({ _openid: openid, startTime: _.gte(start).and(_.lt(end)) })
            .get(),
          db.collection('records')
            .where({ _openid: openid, startTime: _.gte(prevStart).and(_.lt(prevEnd)) })
            .get(),
        ])

        const cur = curRes.data
        const prev = prevRes.data

        const sumField = (arr, field) => arr.reduce((s, r) => s + (r[field] || 0), 0)
        const curKwh = sumField(cur, 'chargeKwh')
        const curCost = sumField(cur, 'cost')
        const curDuration = sumField(cur, 'duration')
        const prevKwh = sumField(prev, 'chargeKwh')
        const prevCost = sumField(prev, 'cost')
        const prevDuration = sumField(prev, 'duration')

        const curAvgPrice = curKwh > 0 ? Math.round((curCost / curKwh) * 100) / 100 : 0
        const prevAvgPrice = prevKwh > 0 ? Math.round((prevCost / prevKwh) * 100) / 100 : 0

        const curPer100 = cur.reduce((s, r) => s + (r.perHundredKwh || 0), 0) / (cur.length || 1)
        const curPer100Cost = cur.reduce((s, r) => s + (r.perHundredCost || 0), 0) / (cur.length || 1)

        function calcChange(curVal, prevVal, lowerIsBetter) {
          if (!prevVal || prevVal === 0) return { value: curVal, change: 0, direction: 'same' }
          const pct = ((curVal - prevVal) / prevVal * 100)
          let direction
          if (pct > 0) direction = lowerIsBetter ? 'negative' : 'positive'
          else if (pct < 0) direction = lowerIsBetter ? 'positive' : 'negative'
          else direction = 'same'
          return { value: curVal, change: Math.round(pct * 10) / 10, direction }
        }

        return {
          code: 0,
          data: {
            count: calcChange(cur.length, prev.length, false),
            kwh: calcChange(curKwh, prevKwh, false),
            cost: calcChange(curCost, prevCost, true),
            avgPrice: calcChange(curAvgPrice, prevAvgPrice, true),
            duration: calcChange(curDuration, prevDuration, false),
            perHundredKwh: calcChange(curPer100, curPer100, true),
            perHundredCost: calcChange(curPer100Cost, curPer100Cost, true),
          },
        }
      }

      case 'trend': {
        const now = new Date()
        const yearVal = year || now.getFullYear()
        const start = new Date(yearVal, 0, 1)
        const end = new Date(yearVal + 1, 0, 1)

        const res = await db.collection('records')
          .where({ _openid: openid, startTime: _.gte(start).and(_.lt(end)) })
          .get()

        const months = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          kwh: 0,
          cost: 0,
          count: 0,
        }))
        res.data.forEach(r => {
          const m = new Date(r.startTime).getMonth()
          months[m].kwh += r.chargeKwh || 0
          months[m].cost += r.cost || 0
          months[m].count++
        })

        return { code: 0, data: months }
      }

      case 'timeDistribution': {
        const { start, end } = getPeriodRange(periodVal)
        const res = await db.collection('records')
          .where({ _openid: openid, startTime: _.gte(start).and(_.lt(end)) })
          .get()

        const slots = [
          { label: '0-6点', range: [0, 6], count: 0 },
          { label: '6-12点', range: [6, 12], count: 0 },
          { label: '12-18点', range: [12, 18], count: 0 },
          { label: '18-24点', range: [18, 24], count: 0 },
        ]

        res.data.forEach(r => {
          const h = new Date(r.startTime).getHours()
          for (const s of slots) {
            if (h >= s.range[0] && h < s.range[1]) { s.count++; break }
          }
        })

        const total = res.data.length || 1
        slots.forEach(s => { s.pct = Math.round(s.count / total * 100) })

        return { code: 0, data: slots }
      }

      case 'typeDistribution': {
        const { start, end } = getPeriodRange(periodVal)
        const res = await db.collection('records')
          .where({ _openid: openid, startTime: _.gte(start).and(_.lt(end)) })
          .get()

        const types = { super: 0, fast: 0, slow: 0 }
        res.data.forEach(r => { if (types[r.chargeType] !== undefined) types[r.chargeType]++ })
        const total = res.data.length || 1

        return {
          code: 0,
          data: {
            super: { count: types.super, pct: Math.round(types.super / total * 100) },
            fast: { count: types.fast, pct: Math.round(types.fast / total * 100) },
            slow: { count: types.slow, pct: Math.round(types.slow / total * 100) },
            total: res.data.length,
          },
        }
      }

      case 'topStations': {
        const { start, end } = getPeriodRange(periodVal)
        const res = await db.collection('records')
          .where({ _openid: openid, startTime: _.gte(start).and(_.lt(end)) })
          .get()

        const stationMap = {}
        res.data.forEach(r => {
          const name = r.stationName || '未知'
          if (!stationMap[name]) stationMap[name] = { name, count: 0, kwh: 0, cost: 0 }
          stationMap[name].count++
          stationMap[name].kwh += r.chargeKwh || 0
          stationMap[name].cost += r.cost || 0
        })

        const stations = Object.values(stationMap)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        return { code: 0, data: stations }
      }

      case 'calendar': {
        const y = year || new Date().getFullYear()
        const m = month || (new Date().getMonth() + 1)
        const start = new Date(y, m - 1, 1)
        const end = new Date(y, m, 1)

        const res = await db.collection('records')
          .where({ _openid: openid, startTime: _.gte(start).and(_.lt(end)) })
          .get()

        const days = []
        const kwh = {}
        res.data.forEach(r => {
          const d = new Date(r.startTime).getDate()
          if (!days.includes(d)) days.push(d)
          kwh[d] = (kwh[d] || 0) + (r.chargeKwh || 0)
        })

        const totalKwh = Object.values(kwh).reduce((s, v) => s + v, 0)

        return {
          code: 0,
          data: {
            days: days.sort((a, b) => a - b),
            kwh: kwh,
            totalKwh: Math.round(totalKwh * 10) / 10,
            count: res.data.length,
          },
        }
      }

      case 'recentRecords': {
        const limit = event.limit || 2
        const res = await db.collection('records')
          .where({ _openid: openid })
          .orderBy('startTime', 'desc')
          .limit(limit)
          .get()
        return { code: 0, data: res.data }
      }

      default:
        return { code: -1, msg: '未知action' }
    }
  } catch (err) {
    return { code: -1, msg: err.message }
  }
}
