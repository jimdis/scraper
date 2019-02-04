/**
 * The starting point of the application.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const Calendar = require('./lib/Calendars')
const Cinema = require('./lib/Cinema')
const Restaurant = require('./lib/Restaurant')
const scraper = require('./lib/scraper')
const output = require('./lib/output')

const url = process.argv.slice(2).toString()

if (!url) {
  console.error('ERROR: Please provide a relevant url as an argument.')
  process.exit(0)
}

// Scrapes urls for relevant data and outputs matched tables and movies.
; (async () => {
  console.log('Starting the application')
  try {
    // Get links from url provided in argument.
    process.stdout.write('Fetching links...')
    let links = await scraper.getLinks(url)
    links = {
      calendar: links[0],
      cinema: links[1],
      restaurant: links[2]
    }
    process.stdout.write('OK\n')
    // Instantiate and populate classes for each link.
    const calendar = new Calendar(links.calendar)
    await calendar.getDays()
    const cinema = new Cinema(links.cinema, calendar.availableDays)
    await cinema.getMovies()
    const restaurant = new Restaurant(links.restaurant, cinema.checkTables)
    await restaurant.getTables()
    // Output matched result.
    output.logResults(cinema.matchedMovies, restaurant.availableTables)
  } catch (e) { console.error(e) }
})()
