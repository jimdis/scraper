'use strict'

const Calendar = require('./lib/Calendars')
const Cinema = require('./lib/Cinema')
const Restaurant = require('./lib/Restaurant')
const scraper = require('./lib/scraper')

const url = 'http://vhost3.lnu.se:20080/weekend'

;(async () => {
  try {
    let links = await scraper.getLinks(url)
    links = {
      calendar: links[0],
      cinema: links[1],
      restaurant: links[2]
    }
    // const calendar = new Calendar(links.calendar)
    // await calendar.matchDays()
    // const cinema = new Cinema(links.cinema, calendar.availableDays)
    // await cinema.getMovies()
    // await cinema.matchTimes()
    let times = [
      { day: 'friday', hours: [18, 20] },
      { day: 'saturday', hours: [18] }
    ]
    const restaurant = new Restaurant(links.restaurant, times)
    restaurant.getFreeTables()
    // console.log(cinema.moviesPlaying)
  } catch (e) { console.error(e) }
})()

// try {
//   calendars.getLinks
// }

// const matchCalendars = async () => {
//   try {
//     matcher.baseLinks = await matcher.getLinks(matcher.baseURL)
//     matcher.calendars = await matcher.getLinks(matcher.baseLinks[0])
//     let freeDays = []
//     for (let calendar of matcher.calendars) {
//       let days = await matcher.getDays(calendar)
//       freeDays.push(days)
//     }
//     matcher.availableDays = matcher.matchDays(freeDays)
//     matcher.getMovies()
//   } catch (e) { console.error(e) }
// }

// matchCalendars()

// const getMatch = async (url) => {
//   let html = await scraper.scrape(url)
//   const mainLinks = await query.getLinks(html)
//   html = await scraper.scrape(mainLinks[0])
//   // let calendarLinks = await query.getLinks(html)
//   console.log(html)
// }

// getMatch(url)

// scraper.scrape('http://vhost3.lnu.se:20080/weekend')
//   .then(res => query.getLinks(res))
//   .then(res => {
//     sites = res
//   })
//   .then(res => console.log(res))
//   .catch(e => console.error(e))
