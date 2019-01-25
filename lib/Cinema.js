'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')

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
    this.dinnerTimes = []
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
    let mappedDays = this.relevantDays.map(day => this.map[day])
    // Loops through available days and adds available movie times to object.
    let movieIDs = Object.keys(this.moviesPlaying)
    for (let day of mappedDays) {
      for (let ID of movieIDs) {
        let movieData = await scraper.scrape(`${this.url}/check?day=${day}&movie=${ID}`)
        movieData = await JSON.parse(movieData)
        movieData.filter(movie => movie.status === 1)
          .forEach(movie => {
            let dinnerTime = {}
            dinnerTime.day = Object.keys(this.map).find(key => this.map[key] === movie.day)
            dinnerTime.movieStarts = parseInt(movie.time.substr(0, 2))
            dinnerTime.movieName = this.moviesPlaying[movie.movie]
            dinnerTime.dinnerTime = dinnerTime.movieStarts + 2
            this.dinnerTimes.push(dinnerTime)
          })
      }
    }

    console.log(this.dinnerTimes)
  }
}
