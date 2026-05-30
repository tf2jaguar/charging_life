Component({
  properties: {
    startSOC: { type: Number, value: 35 },
    endSOC: { type: Number, value: 90 },
  },

  observers: {
    'startSOC, endSOC': function (s, e) {
      this.setData({ delta: e - s })
    },
  },

  data: {
    delta: 55,
  },
})
