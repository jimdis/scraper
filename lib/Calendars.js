'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')
const _ = require('lodash')

module.exports = class Calendars {
  constructor (url) {
    this.url = url
    this.availableDays = []
  }
  async getDays () {
    let calendars = await scraper.getLinks(this.url)
    let freeDays = []
    for (let calendar of calendars) {
      let $ = cheerio.load(await scraper.scrape(calendar))
      let days = []
      // Loops through table cells to match "ok" with day
      $('body').find('th').each((i, el) => {
        let day = $(el).text().toLowerCase()
        let status = $('body').find('td').slice(i, i + 1).text().toLowerCase()
        if (status === 'ok') days.push(day)
      })
      freeDays.push(days)
    }
    this.availableDays = _.intersection(...freeDays)
  }
}
