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

function generateHtml (weeks) {
  return template
    .replace(
      '{{title}}',
      `week ${weeks[0].weekNo}-${weeks[weeks.length - 1].weekNo}`
    )
    .replace(
      '{{content}}',
      `
    <div id="pages">
      ${weeks
        .map(
          (week, index) => `
      <div class="page ${index % 2 === 0 ? 'odd' : 'even'}">
        <div class="weekNoCol"><div class="weekNo">Uge ${
          week.weekNo
        }</div></div>
        <div class="days">
          ${week.days
            .map(
              day => `
          <div class="day">
            <span class="date">${day.date}</span>
            <span class="dayName">${day.day}</span>
          </div>`
            )
            .join('')}
        </div>
      </div>`
        )
        .join('')}
    </div>`
    )
}

fs.writeFileSync(
  path.resolve(
    process.cwd(),
    'out',
    `week${firstHalf[0].weekNo}-${firstHalf[firstHalf.length - 1].weekNo}.html`
  ),
  generateHtml(firstHalf)
)

if (secondHalf.length > 0) {
  fs.writeFileSync(
    path.resolve(
      process.cwd(),
      'out',
      `week${secondHalf[0].weekNo}-${
        secondHalf[secondHalf.length - 1].weekNo
      }.html`
    ),
    generateHtml(secondHalf)
  )
}
