const { callCloud } = require('../../utils/cloud')
const { toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

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
      const [overview, timeDist, typeDist, topStations, trend] = await Promise.all([
        callCloud('stats', { action: 'overview', period }),
        callCloud('stats', { action: 'timeDistribution', period }),
        callCloud('stats', { action: 'typeDistribution', period }),
        callCloud('stats', { action: 'topStations', period }),
        callCloud('stats', { action: 'trend' }),
      ])

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
