Component({
  properties: {
    show: { type: Boolean, value: false },
    title: { type: String, value: '确认删除' },
    message: { type: String, value: '删除后无法恢复，确定要删除吗？' },
  },

  methods: {
    onCancel() {
      this.triggerEvent('cancel')
    },

    onConfirm() {
      this.triggerEvent('confirm')
    },

    onMaskClick() {
      this.triggerEvent('cancel')
    },
  },
})
