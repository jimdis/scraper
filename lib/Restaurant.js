'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')

module.exports = class Restaurant {
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
  async getTables () {
    try {
      // let baseURL = this.url.slice(0, this.url.lastIndexOf('/'))
      // let $ = cheerio.load(await scraper.scrape(this.url))
      // let url = ($('form').prop('action'))
      const $ = cheerio.load(await scraper.getLogin(this.url, this.credentials))
      //  = (await scraper.scrape(url, cookie))
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
      }
      // await this._matchFreeTables(`${this.url}/${login.url}`, login.cookie)
    } catch (e) { console.error(e) }
  }
  async _matchFreeTables (url, cookie) {
    const $ = cheerio.load(await scraper.scrape(url, cookie))
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
    }
  }
}
