'use strict'

type Item = { time:number, value:number }

export class MovingAverage {
  private ma = 0 // moving average
  private v = 0  // variance
  private d = 0  // deviation
  private f = 0  // forecast

  private previousTime?: number
  private timespan: number
  private items: Item[] = []
  private lastVal = 0

  constructor(timespan:number, items:Item[] = []) {
    if (typeof timespan !== 'number') {
      throw new Error('must provide a timespan to the moving average constructor')
    }

    if (timespan <= 0) {
      throw new Error('must provide a timespan > 0 to the moving average constructor')
    }

    this.timespan = timespan

    items.forEach(({ time, value }) => {
      this.push(time, value)
    })
  }

  public push(time:number, value:number) {
    this.items.push({ time, value })

    if (this.previousTime) {
      // calculate moving average
      const a = this.alpha(time, this.previousTime)
      const diff = value - this.ma
      const incr = a * diff
      this.ma = a * value + (1 - a) * this.ma
      // calculate variance & deviation
      this.v = (1 - a) * (this.v + diff * incr)
      this.d = Math.sqrt(this.v)
      // calculate forecast
      this.f = this.ma + a * diff
    } else {
      this.ma = value
    }
    
    this.previousTime = time
    this.lastVal = value
  }

  public movingAverage () {
    return this.ma
  }

  // Variance
  public variance () {
    return this.v
  }

  public deviation () {
    return this.d
  }

  public forecast () {
    return this.f
  }

  public size() {
    return this.items.length
  }

  public getItems() {
    return this.items.map(({time, value}) => ({ time, value }))
  }

  public startTime() {
    return this.items.length > 0 ? this.items[0].time : 0
  }

  public lastValue() {
    return this.lastVal
  }

  public reset(timespan:number, items:Item[] = []) {
    if (typeof timespan !== 'number') {
      throw new Error('must provide a timespan to the moving average constructor')
    }

    if (timespan <= 0) {
      throw new Error('must provide a timespan > 0 to the moving average constructor')
    }

    this.ma = 0 // moving average
    this.v = 0  // variance
    this.d = 0  // deviation
    this.f = 0  // forecast
  
    this.previousTime = undefined
    this.items = []
    this.timespan = timespan

    items.forEach(({ time, value }) => {
      this.push(time, value)
    })
  }

  private alpha(t:number, pt:number) {
    return 1 - (Math.exp(-(t - pt) / this.timespan))
  }
}
