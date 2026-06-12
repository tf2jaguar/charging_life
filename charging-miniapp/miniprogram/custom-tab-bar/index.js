Component({
  data: {
    show: true,
    selected: 0,
    list: [
      {
        pagePath: '/pages/dashboard/dashboard',
        text: '首页',
        icon: 'home',
      },
      {
        pagePath: '/pages/history/history',
        text: '记录',
        icon: 'clock',
      },
      {
        pagePath: '/pages/add-record/add-record',
        text: '录入',
        icon: 'plus',
        isCenter: true,
      },
      {
        pagePath: '/pages/analytics/analytics',
        text: '分析',
        icon: 'chart',
      },
      {
        pagePath: '/pages/profile/profile',
        text: '我的',
        icon: 'user',
      },
    ],
  },

  methods: {
    switchTab(e) {
      const idx = e.currentTarget.dataset.index
      const item = this.data.list[idx]

      if (item.isCenter) {
        wx.navigateTo({ url: item.pagePath })
        return
      }

      wx.switchTab({ url: item.pagePath })
    },
  },
})
