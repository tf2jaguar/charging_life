Component({
  properties: {
    value: {
      type: String,
      value: 'fast',
    },
  },

  data: {
    types: [
      { key: 'super', label: '超充', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', borderActive: '#8B5CF6', icon: '/assets/icons/flashlight-puper.svg' },
      { key: 'fast', label: '快充', color: '#0891B2', bg: 'rgba(8,145,178,0.05)', borderActive: '#0891B2', icon: '/assets/icons/flashlight-blue.svg' },
      { key: 'slow', label: '慢充', color: '#10B981', bg: 'rgba(16,185,129,0.08)', borderActive: '#10B981', icon: '/assets/icons/flashlight-green.svg' },
    ],
  },

  methods: {
    onSelect(e) {
      const key = e.currentTarget.dataset.key
      this.setData({ value: key })
      this.triggerEvent('change', { value: key })
    },
  },
})
