const { callCloud } = require('../../utils/cloud')
const { formatRelativeDate, formatDate, formatDuration, toFixed } = require('../../utils/util')
const auth = require('../../utils/auth')

Page({
  data: {
    filters: ['全部', '本周', '本月', '快充', '慢充'],
    activeFilter: 0,
    records: [],
    groupedRecords: [],
    totalCount: 0,
    totalKwh: 0,
    totalCost: 0,
    page: 1,
    hasMore: true,
    loading: true,
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    this.setData({ page: 1, records: [], hasMore: true })

    if (!auth.isLoggedIn()) {
      this.setData({ loading: false })
      return
    }
    this.loadRecords()
  },

  async loadRecords() {
    this.setData({ loading: true })
    try {
      const res = await callCloud('record', {
        action: 'list',
        data: { page: this.data.page, pageSize: 20 },
      })

      let allRecords = this.data.page === 1 ? (res.list || []) : this.data.records.concat(res.list || [])

      allRecords = allRecords.map(r => {
        r.timeText = formatRelativeDate(r.startTime) + ' ' + formatDate(r.startTime, 'HH:mm') + ' · ' + formatDuration(r.duration)
        return r
      })

      let filtered = this.applyFilter(allRecords)

      const totalCount = filtered.length
      const totalKwh = filtered.reduce((s, r) => s + (r.chargeKwh || 0), 0)
      const totalCost = filtered.reduce((s, r) => s + (r.cost || 0), 0)

      this.setData({
        records: allRecords,
        groupedRecords: this.groupByDate(filtered),
        totalCount,
        totalKwh: toFixed(totalKwh, 1),
        totalCost: toFixed(totalCost),
        hasMore: allRecords.length < res.total,
        loading: false,
      })
    } catch (err) {
      console.error(err)
      this.setData({ loading: false })
    }
  },

  applyFilter(records) {
    const filter = this.data.activeFilter
    if (filter === 0) return records

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    if (filter === 1) {
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
      return records.filter(r => new Date(r.startTime) >= weekStart)
    }
    if (filter === 2) {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      return records.filter(r => new Date(r.startTime) >= monthStart)
    }
    if (filter === 3) return records.filter(r => r.chargeType === 'fast' || r.chargeType === 'super')
    if (filter === 4) return records.filter(r => r.chargeType === 'slow')
    return records
  },

  groupByDate(records) {
    const groups = {}
    records.forEach(r => {
      const label = formatRelativeDate(r.startTime)
      if (!groups[label]) groups[label] = []
      groups[label].push(r)
    })
    return Object.keys(groups).map(label => ({ label, records: groups[label] }))
  },

  onFilterTap(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ activeFilter: idx })
    const filtered = this.applyFilter(this.data.records)
    this.setData({
      groupedRecords: this.groupByDate(filtered),
      totalCount: filtered.length,
      totalKwh: toFixed(filtered.reduce((s, r) => s + (r.chargeKwh || 0), 0), 1),
      totalCost: toFixed(filtered.reduce((s, r) => s + (r.cost || 0), 0)),
    })
  },

  onLoadMore() {
    if (!this.data.hasMore) return
    this.setData({ page: this.data.page + 1 })
    this.loadRecords()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, records: [] })
    this.loadRecords().then(() => wx.stopPullDownRefresh())
  },
})
