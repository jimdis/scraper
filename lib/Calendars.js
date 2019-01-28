'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')
const _ = require('lodash')

/**
* Represents a calendars site.
*
* @class Calendars
*/
module.exports = class Calendars {
  /**
   * Creates an instance of Calendars.
   *
   * @param {string} url URL of the site.
   *
   */
  constructor (url) {
    this.url = url
    this.availableDays = []
  }
  /**
   * Scrapes calendars found in URL for available days.
   *
   */
  async getDays () {
    process.stdout.write('Matching calendars...')
    let calendars = await scraper.getLinks(this.url)
    let freeDays = []
    for (let calendar of calendars) {
      let $ = cheerio.load(await scraper.fetch(calendar))
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
    if (this.availableDays.length < 1) throw new Error(`Sorry, no available days could be found in calendars at ${this.url}`)
    process.stdout.write('OK\n')
  }
}
