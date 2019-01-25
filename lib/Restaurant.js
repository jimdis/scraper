'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')

module.exports = class Restaurant {
  constructor (url, relevantTimes) {
    this.url = `${url}/login/booking`
    this.cookie = 'qi88ZyOC0BVAZDoD6yKSpSessionId=s%3ALndIMqxhNwkunKLcYSIi6m75zbFh2usy.fz297k%2BnV%2BVhGq2YjHH0ChzOu6kkrPVBi4SWkFEqsOc'
    this.relevantTimes = relevantTimes
  }
  async getFreeTables () {
    // const $ = cheerio.load(await scraper.scrape(this.url, this.cookie))
    let baseClass = 'WordSection'
    let maps = {
      friday: [1, 2],
      saturday: [3, 4],
      sunday: [5, 6]
    }
    for (let time of this.relevantTimes) {
      console.log(maps[time['day']])
    }
  }
}
