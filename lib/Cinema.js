'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')
const _ = require('lodash')

module.exports = class Cinema {
  constructor (url, relevantDays) {
    this.url = url
    this.map = {
      friday: '05',
      saturday: '06',
      sunday: '07'
    }
    this.relevantDays = relevantDays
    this.moviesPlaying = {}
    this.possibleEvenings = []
    this.checkTables = []
  }
  async getMovies () {
    const $ = cheerio.load(await scraper.scrape(this.url))
    // Loops through available movies and adds their ID and name to object.
    $('#movies').find('option').each((i, el) => {
      if (!$(el).prop('disabled')) {
        let value = $(el).val()
        let name = $(el).text()
        this.moviesPlaying[value] = name
      }
    })
  }

  async matchTimes () {
    // Maps days to the relevant strings to search for
    const mappedDay = (string) => this.map[string]
    // Loops through available days and adds available movie times to object.
    let movieIDs = Object.keys(this.moviesPlaying)
    for (let day of this.relevantDays) {
      let times = []
      for (let ID of movieIDs) {
        let movieData = await scraper.scrape(`${this.url}/check?day=${mappedDay(day)}&movie=${ID}`)
        movieData = await JSON.parse(movieData)
        movieData.filter(movie => movie.status === 1)
          .forEach(movie => {
            let evening = {}
            evening.day = day
            evening.movieStarts = parseInt(movie.time.substr(0, 2))
            evening.movieTitle = this.moviesPlaying[movie.movie]
            evening.dinnerTime = evening.movieStarts + 2
            this.possibleEvenings.push(evening)
            times.push(evening.dinnerTime)
          })
      }
      let obj = {}
      obj.day = day
      obj.hours = _.sortBy(_.uniq(times))
      this.checkTables.push(obj)
    }
  }
}
