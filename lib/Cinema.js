'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')

module.exports = class Cinema {
  constructor (url, relevantDays) {
    this.url = url
    this.relevantDays = relevantDays
    this.moviesPlaying = {}
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
    let mappedDays = this.relevantDays.map(day => {
      if (day === 'friday') return '05'
      if (day === 'saturday') return '06'
      if (day === 'sunday') return '07'
    })
    // Loops through available days and adds available movie times to object.
    let movieIDs = Object.keys(this.moviesPlaying)
    for (let day of mappedDays) {
      for (let ID of movieIDs) {
        let movieData = await scraper.scrape(`${this.url}/check?day=${day}&movie=${ID}`)
        movieData = await JSON.parse(movieData)
        movieData.filter(movie => movie.status === 1)
          .forEach(movie => console.log(movie))
      }
    }
  }
}
