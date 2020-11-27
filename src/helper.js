const wait=ms=>new Promise(resolve => setTimeout(resolve, ms));
var win = null;
const path = require('path')
const { BrowserWindow } = require('electron').remote

export function make_window(file, width, height) {
  const modalPath = path.join('file://', __dirname, file)
  if (win) {
    win.focus()
    return
  }
  win = new BrowserWindow({
    // frame: false,
    alwaysOnTop: true,
    resizable: false,
    width: width,
    height: height,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  win.on('close', function () { win = null })
  win.loadURL(modalPath)
  win.show()
}

function url_maker(courses) { // makes the url
  let today = new Date(); // set current date
  let nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // set date 1 week from current date
  var day = String(nextWeek.getDate()).padStart(2, '0'); // gets the day of next week
  var month = String(nextWeek.getMonth() + 1).padStart(2, '0'); // gets the month of next week
  var year = nextWeek.getFullYear(); // gets the year of next week
  let end_date = `${year}-${month}-${day}`; // formats the day of the week
  let course_url = ""; // makes blank string for courses portion of the url
  for (let i=0; i < courses.length; i++) { // loop through the courses
    if (courses[i].length == 7) { // make sure the courses are in the correct format
      course_url += `&context_codes[]=course_${courses[i]}` // append this to the end
    }
  }
  return `https://udel.instructure.com//api/v1/calendar_events?type=event&type=assignment&end_date=${end_date}${course_url}`; // return this monstrosity
}

export async function save_data(type, key, value) {
  const fs = require('fs')
  let calendar = require('./calendar')
  // let calendar = JSON.parse(fs.readFileSync("./src/calendar.json"))
  wait(150);
  switch (type) {
    case 'p':  // push data
      calendar[key].push(value)
      break;

    case 'o': // overwrite data
      calendar[key] = value
      break;
  }
  console.log(calendar)
  fs.writeFile("./src/calendar.json", JSON.stringify(calendar), err => {

        if (err) throw err; // show error

        console.log("Done writing"); // Success
    });
}

export function organize_data(data) {
  if (data.length < 1) return [];

  var left = []
  var right = []
  var pivot = data[0]

  for (var i=1; i < data.length; i++) {
    if (data[i][1].getTime() < pivot[1].getTime()) {
      left.push(data[i])
    } else {
      right.push(data[i])
    }
  }

  return [].concat(organize_data(left), [pivot], organize_data(right))
}

export async function getCanvasWeek() {
  const fetch = require('node-fetch') // used to fetch data
  const fs = require('fs'); // used to read JSON
  let calendar = JSON.parse(fs.readFileSync('./src/calendar.json')); // reads the JSON
  const url = url_maker(calendar['courses']); // makes the url

  let auth = calendar.canvas_key; // gets the authorization key
  if (auth === "") {console.error('No Auth Key Given'); return} // checks that there is an authorization key

  const options = {
    method: 'GET', // want to get data
    headers: {
      Authorization: `Bearer ${auth}` // give the authorization key
    }
  };

  let canvas_data = await fetch(url, options) // get a JSON of the data
                                   .then( res => res.json() )

  let assignments = []
  for (let i=0; i < canvas_data.length; i++) {
    assignments.push([
       canvas_data[i].context_name.slice(4, 11),
       canvas_data[i].assignment.due_at,
       canvas_data[i].title.trim(),
       false
     ])
  }
  wait(500)
  console.log('starting save')
  await save_data('o', 'assignments', assignments)
  console.log('returning array')
  if (JSON.stringify(calendar.custom_events) == JSON.stringify([])) {
    console.log('returning assignments')
    return assignments
  } else {
    return assignments.concat(calendar.custom_events)
  }
}

export function format_date(date) {
  var week = ['Sun', 'Mon','Tues', 'Wed', 'Thur', 'Fri', 'Sat']
  var day_val = date.getDate();
  var month_val = date.getMonth() + 1;
  var year_val = date.getFullYear() % 100
  var day = week[date.getDay()];

  return `${day} - ${month_val}/${day_val}/${year_val}`
}
