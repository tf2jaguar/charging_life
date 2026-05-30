Component({
  properties: {
    value: {
      type: String,
      value: 'fast',
    },
  },

  data: {
    types: [
      { key: 'super', label: '超充', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', borderActive: '#8B5CF6' },
      { key: 'fast', label: '快充', color: '#0891B2', bg: 'rgba(8,145,178,0.05)', borderActive: '#0891B2' },
      { key: 'slow', label: '慢充', color: '#10B981', bg: 'rgba(16,185,129,0.08)', borderActive: '#10B981' },
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
