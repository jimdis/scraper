'use strict'

const EventEmitter = require('events')
const cheerio = require('cheerio')
const scraper = require('./scraper')
const _ = require('lodash')

module.exports = class CalendarMatcher extends EventEmitter {
  constructor (url) {
    super()
    this.baseURL = url
    this.baseLinks = []
    this.calendars = ''
    this.movies = ''
    this.restaurants = ''
    this.availableDays = []
  }
  async getLinks (url) {
    let html = await scraper.scrape(url)
    let baseURL = url.slice(0, url.lastIndexOf('/') + 1)
    const $ = cheerio.load(html)
    let links = []
    $('body').find('a').each((i, el) => {
      let link = $(el).attr('href')
      if (link.substr(0, 4) === 'http') {
        links.push(link)
      } else { links.push(`${baseURL}${link}`) }
    })
    if (links.length < 1) return (new Error('The data passed contains no links'))
    return links
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
  matchDays (arr) {
    return _.intersection(...arr)
  }
  async getMovies (url) {
    let checkDays = this.availableDays.map(day => {
      if (day === 'friday') return '05'
      if (day === 'saturday') return '06'
      if (day === 'sunday') return '07'
    })
    let movieNames = await scraper.scrape(this.baseLinks[1])
    const $ = cheerio.load(movieNames)
    let movies = {}
    $('#movies').find('option').each((i, el) => {
      if (!$(el).prop('disabled')) {
        let value = $(el).val()
        let name = $(el).text()
        movies[value] = name
      }
    })

    for (let day of checkDays) {
      let movieData = await scraper.scrape(`${this.baseLinks[1]}/check?day=${day}&movie=01`)
      movieData = await JSON.parse(movieData)
      movieData.filter(movie => movie.status === 1)
        .forEach(movie => console.log(`${movies['01']} is available at ${movie.time}`))
    }
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
