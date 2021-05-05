/**
 * класс для контроля таймаутов,
 * нужен чтобы можно было остановить все запущенные таймауты в один миг
 */
window.timerHub = {
  timers: {},
  setTimeout: function (groupName, fn, time) {
    groupName = groupName || '@'
    var timer = setTimeout(fn, time)
    // console.log(this.timers)
    if (!Object.prototype.hasOwnProperty.call(this.timers, groupName)) {
      this.timers[groupName] = { isStopped: false, list: [] }
    }
    this.timers[groupName].list.push(timer)
  },
  isStopped: function (groupName) {
    groupName = groupName || '@'
    if (!Object.prototype.hasOwnProperty.call(this.timers, groupName)) {
      return true
    }
    return this.timers[groupName].isStopped
  },
  stop: function (groupName) {
    groupName = groupName || '@'
    if (!Object.prototype.hasOwnProperty.call(this.timers, groupName)) {
      return
    }
    this.timers[groupName].isStopped = true
    this.timers[groupName].list.map((t) => {
      if (!t) return t
      clearTimeout(t)
      return undefined
    })
  },
}
