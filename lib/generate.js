import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  addDays,
  format,
  getDay,
  getWeek,
  getYear,
  startOfWeek,
} from "date-fns";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const template = fs.readFileSync(
  path.resolve(__dirname, "./template.html"),
  "utf-8"
);

const days = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsday",
  "Fredag",
  "Lørdag",
  "Søndag",
];

let date = startOfWeek(new Date(process.argv[2] || Date.now()), {
  weekStartsOn: 1,
});
const weeks = [];

while (1) {
  const weekNo = getWeek(date, { weekStartsOn: 1, firstWeekContainsDate: 4 });

  let week = weeks[weeks.length - 1];
  if (!week || week.weekNo !== weekNo) {
    if (weeks.length === 26) {
      break;
    }

    weeks.push({
      weekNo,
      year: getYear(date),
      days: [],
    });
    week = weeks[weeks.length - 1];
  }

  const dayNum = (getDay(date) + 6) % 7;

  week.days.push({
    day: days[dayNum],
    dayNum,
    date: format(date, "d/M"),
  });

  date = addDays(date, 1);
}

function generateWeekSliceHtml(week, days) {
  return `<div class="page">
  ${days
    .map(
      (day) => `<div class="day ${day.dayNum > 4 ? "narrow" : "wide"}">
  <span class="dayName">${day.day}</span>
  <span class="date">${day.date}</span>
  ${day.dayNum === 6 ? `<span class="weekNo">Uge ${week.weekNo}</span>` : ""}
  </div>`
    )
    .join("")}
</div>`;
}

function generateWeekHtml(week) {
  return (
    generateWeekSliceHtml(week, week.days.slice(0, 3)) +
    generateWeekSliceHtml(week, week.days.slice(3, 7))
  );
}

function generateHtml(weeks) {
  return template
    .replace(
      "{{title}}",
      `week ${weeks[0].weekNo}-${weeks[weeks.length - 1].weekNo}`
    )
    .replace("{{period}}", function () {
      const firstYear = weeks[0].year;
      const lastYear = weeks[weeks.length - 1].year;

      if (firstYear !== lastYear) {
        return `${firstYear} - ${lastYear}`;
      }

      return firstYear;
    })
    .replace(
      "{{content}}",
      `
    <div id="pages">
      ${weeks.map(generateWeekHtml).join("")}
    </div>`
    );
}

async function printToPdf(html) {
  // Based on https://www.bannerbear.com/blog/how-to-convert-html-into-pdf-with-node-js-and-puppeteer/
  // Create a browser instance
  const browser = await puppeteer.launch({
    headless: "new",
  });

  // Create a new page
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  // Download the PDF
  const pdf = await page.pdf({
    path: path.resolve(process.cwd(), "out", "calendar.pdf"),
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
    printBackground: true,
    format: "A6",
  });

  // Close the browser instance
  await browser.close();
}

printToPdf(generateHtml(weeks));