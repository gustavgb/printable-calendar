import fs from 'fs'
import path from 'path'
import {
  addDays,
  format,
  getDay,
  getWeek,
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

let date = startOfWeek(new Date(process.argv[2] || Date.now()), { weekStartsOn: 1 })
const weeks = []

while (1) {
  const weekNo = getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 })

  let week = weeks[weeks.length - 1]
  if (!week || week.weekNo !== weekNo) {
    if (weeks.length === 26) {
      break
    }

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
            <span class="dayName">${day.day}</span>
            <span class="date">${day.date}</span>
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
    'calendar.html'
  ),
  generateHtml(weeks)
)
