'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')

module.exports = class Restaurant {
  constructor (url, relevantTimes) {
    this.url = `${url}/login/booking`
    this.cookie = 'qi88ZyOC0BVAZDoD6yKSpSessionId=s%3ALndIMqxhNwkunKLcYSIi6m75zbFh2usy.fz297k%2BnV%2BVhGq2YjHH0ChzOu6kkrPVBi4SWkFEqsOc'
    this.relevantTimes = relevantTimes
    this.availableTables = []
  }
  async getFreeTables () {
    const $ = cheerio.load(await scraper.scrape(this.url, this.cookie))
    let baseClass = '.WordSection'
    let maps = {
      friday: 2,
      saturday: 4,
      sunday: 6
    }
    for (let time of this.relevantTimes) {
      $(baseClass + maps[time['day']]).find('input').each((i, el) => {
        let from = parseInt($(el).val().substr(3, 2))
        let to = parseInt($(el).val().substr(5, 2))
        time.hours.forEach(hour => {
          if (hour === from) {
            let table = {}
            table.day = time.day
            table.from = from
            table.to = to
            this.availableTables.push(table)
          }
        })
      })
      console.log(this.availableTables)
    }
  }
}
