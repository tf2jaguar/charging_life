const { callCloud } = require('../../utils/cloud')
const { toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')
const app = getApp()

Page({
  data: {
    period: 'month',
    periodOptions: ['本月', '本年'],
    coreStats: null,
    trend: [],
    timeDist: [],
    typeDist: null,
    efficiency: null,
    topStations: [],
    loading: true,
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 })
    }

    if (!auth.isLoggedIn()) {
      this.setData({ loading: false })
      return
    }
    this.loadAll()
  },

  async loadAll() {
    this.setData({ loading: true })
    try {
      const period = this.data.period
      const vehicleId = app.getCurrentVehicleId()
      const [overview, timeDist, typeDist, topStations, trend] = await Promise.all([
        callCloud('stats', { action: 'overview', period, vehicleId }),
        callCloud('stats', { action: 'timeDistribution', period, vehicleId }),
        callCloud('stats', { action: 'typeDistribution', period, vehicleId }),
        callCloud('stats', { action: 'topStations', period, vehicleId }),
        callCloud('stats', { action: 'trend', vehicleId }),
      ])

      if (overview) {
        overview.kwhDisplay = toFixed(overview.kwh.value, 2)
        overview.costDisplay = toFixed(overview.cost.value, 2)
        overview.avgPriceDisplay = toFixed(overview.avgPrice.value, 2)
        overview.durationDisplay = toFixed(overview.duration.value, 2)
        overview.avgKwhDisplay = toFixed(overview.kwh.value / (overview.count.value || 1), 2)
      }

      this.setData({
        coreStats: overview,
        timeDist,
        typeDist,
        topStations,
        trend: trend || [],
        maxKwh: Math.max(...(trend || []).map(m => m.kwh), 1),
        maxCost: Math.max(...(trend || []).map(m => m.cost), 1),
        loading: false,
      })
    } catch (err) {
      console.error(err)
      this.setData({ loading: false })
    }
  },

  onPeriodChange(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ period: idx === 0 ? 'month' : 'year' })
    this.loadAll()
  },
})
