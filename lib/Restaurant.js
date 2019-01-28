'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')

/**
* Represents a restaurant booking site.
*
* @class Restaurant
*/
module.exports = class Restaurant {
  /**
   * Creates an instance of Restaurant.
   *
   * @param {string} url URL of the site.
   * @param {Object} relevantTimes An object: {
   * day {string}: the relevant day to search for tables
   * hours {array}: the relevant hours to search for tables}.
   */
  constructor (url, relevantTimes) {
    this.url = url
    this.credentials = {
      path: 'login',
      query: {
        username: 'zeke',
        password: 'coys'
      }
    }
    this.relevantTimes = relevantTimes
    this.availableTables = []
  }
  /**
   * Scrapes site for free tables given available days and hours
   *
   */
  async getTables () {
    process.stdout.write('Finding free tables...')
    let baseClass = '.WordSection'
    let maps = {
      friday: 2,
      saturday: 4,
      sunday: 6
    }
    const $ = cheerio.load(await scraper.getLogin(this.url, this.credentials))
    for (let time of this.relevantTimes) {
      $(baseClass + maps[time['day']]).find('input').each((i, el) => {
        let from = parseInt($(el).val().substr(3, 2))
        let to = parseInt($(el).val().substr(5, 2))
        time.hours.forEach(hour => {
          if (hour <= from) {
            let table = {}
            table.day = time.day
            table.from = from
            table.to = to
            this.availableTables.push(table)
          }
        })
      })
    }
    process.stdout.write('OK\n')
  }
}
