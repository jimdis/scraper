'use strict'

const message = [

  'Fetching calendars...',
  'Checking for available movies...',
  'Checking for free tables...',
  'OK',
  'DONE!'
]

const logResults = (movies, tables) => {
  const fixName = (str) => str.charAt(0).toUpperCase() + str.slice(1)
  tables.forEach(table => {
    movies.filter(movie => movie.dinnerTime === table.from && movie.day === table.day)
      .forEach(movie => {
        console.log(`\nOn ${fixName(movie.day)} there is a free table between ${table.from}:00 to ${table.to}:00,
after you have seen "${movie.movieTitle}" which starts at ${movie.movieStarts}:00.\n`)
      })
  })
}

module.exports = {
  logResults: logResults,
  message: message
}
