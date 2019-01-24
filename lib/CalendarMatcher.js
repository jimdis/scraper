'use strict'

const EventEmitter = require('events')
const cheerio = require('cheerio')
const scraper = require('./scraper')

module.exports = class CalendarMatcher extends EventEmitter {
  constructor (url) {
    super()
    this.baseURL = url
    this.baseLinks = []
    this.calendars = ''
    this.movies = ''
    this.restaurants = ''
  }
  async getLinks (url) {
    let baseURL = url.slice(0, url.lastIndexOf('/') + 1)
    let html = await scraper.scrape(url)
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(html)
      let links = []
      $('body').find('a').each((i, el) => {
        let link = $(el).attr('href')
        if (link.substr(0, 4) === 'http') {
          links.push(link)
        } else { links.push(`${baseURL}${link}`) }
      })
      if (links.length < 1) return reject(new Error('The data passed contains no links'))
      resolve(links)
    })
  }

  async getDays (url) {
    let html = await scraper.scrape(url)
    const $ = cheerio.load(html)
    let days = []
    $('body').find('th').each((i, el) => {
      let day = $(el).text().toLowerCase()
      let status = $('body').find('td').slice(i, i + 1).text().toLowerCase()
      if (status === 'ok') days.push(day)
    })
    return days
  }
  // addFile (FILE) {
  //   this.files.push(FILE)
  // }
  // // searches for 'phrase' in this.files and emits the event "found" whenever it finds the phrase in a file.
  // find (phrase) {
  //   this.files.forEach(file => {
  //     fs.readFile(file, 'utf-8').then(res => {
  //       let match = res.match(phrase) ? res.match(phrase)[0] : null
  //       if (match) this.emit('found', `Matched ${match} in file ${file}`)
  //     })
  //       .catch((err) => this.emit('error', `An error ocurred: ${err}`))
  //   })
  // }
}
