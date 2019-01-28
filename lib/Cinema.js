'use strict'

const cheerio = require('cheerio')
const scraper = require('./scraper')
const _ = require('lodash')

/**
* Represents a movie booking site.
*
* @class Cinema
*/
module.exports = class Cinema {
  /**
   * Creates an instance of Cinema.
   *
   * @param {string} url URL of the site.
   * @param {Array} relevantDays The relevant days (strings) to search for movies.
   *
   */
  constructor (url, relevantDays) {
    this.url = url
    this.map = {
      friday: '05',
      saturday: '06',
      sunday: '07'
    }
    this.relevantDays = relevantDays
    this.matchedMovies = []
    this.checkTables = []
  }
  /**
   * Scrapes site for movie names and IDs
   *
   */
  async getMovies () {
    process.stdout.write('Finding available movies...')
    const $ = cheerio.load(await scraper.fetch(this.url))
    let moviesPlaying = {}
    // Loops through available movies and adds their ID and name to object.
    $('#movies').find('option').each((i, el) => {
      if (!$(el).prop('disabled')) {
        let value = $(el).val()
        let name = $(el).text()
        moviesPlaying[value] = name
      }
    })
    await this._matchTimes(moviesPlaying)
  }
  /**
  * Matches available movies with available days and saves possible dinner times.
  *
  * @param {Object} moviesPlaying ID and names of movies playing.
  */
  async _matchTimes (moviesPlaying) {
    // Maps days to the relevant strings to search for
    const mappedDay = (string) => this.map[string]
    // Loops through available days and adds available movie times to object.
    let movieIDs = Object.keys(moviesPlaying)
    for (let day of this.relevantDays) {
      let times = []
      for (let ID of movieIDs) {
        let movieData = await scraper.fetch(`${this.url}/check?day=${mappedDay(day)}&movie=${ID}`)
        movieData = await JSON.parse(movieData)
        movieData.filter(movie => movie.status === 1)
          .forEach(movie => {
            let match = {}
            match.day = day
            match.movieStarts = parseInt(movie.time.substr(0, 2))
            match.movieTitle = moviesPlaying[movie.movie]
            match.dinnerTime = match.movieStarts + 2
            this.matchedMovies.push(match)
            times.push(match.dinnerTime)
          })
      }
      // Structures data to make it easy to search for dinner tables.
      let dinner = {}
      dinner.day = day
      dinner.hours = _.sortBy(_.uniq(times))
      this.checkTables.push(dinner)
    }
    process.stdout.write('OK\n')
  }
}
