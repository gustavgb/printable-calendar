import fs from 'fs'
import path from 'path'
import {
  addDays,
  format,
  getDay,
  getWeek,
  getYear,
  startOfWeek
} from 'date-fns'

const template = fs.readFileSync(
  path.resolve(process.cwd(), './template.html'),
  'utf-8'
)

const days = [
  'Søndag',
  'Mandag',
  'Tirsdag',
  'Onsdag',
  'Torsday',
  'Fredag',
  'Lørdag'
]

let date = startOfWeek(new Date(), { weekStartsOn: 1 })
const firstHalf = []
const secondHalf = []
const thisYear = getYear(date)
let weeks = firstHalf

while (1) {
  const weekNo = getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 })

  if (weekNo > 26 && secondHalf.length === 0 && weeks.length >= 8) {
    weeks = secondHalf
  }

  let week = weeks[weeks.length - 1]
  if (!week || week.weekNo !== weekNo) {
    weeks.push({
      weekNo,
      days: []
    })
    week = weeks[weeks.length - 1]
  }

  week.days.push({
    day: days[getDay(date)],
    date: format(date, 'd/M')
  })

  date = addDays(date, 1)

  if (getYear(date) !== thisYear) {
    break
  }
}

console.log(firstHalf, secondHalf)
