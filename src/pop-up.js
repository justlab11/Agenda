import { save_data } from './helper.js'
const remote = require('electron').remote // make sure electron exists
const wait=ms=>new Promise(resolve => setTimeout(resolve, ms));

// window.close = function close() {
//   var window = remote.getCurrentWindow(); // finds the current window
//   window.close(); // closes the current window
// }

window.log_custom = async function log_custom() {
  let class_val = document.getElementById('class').value
  let date_val = document.getElementById('date').value
  let assign_val = document.getElementById('assignment').value
  var window = remote.getCurrentWindow();

  if (class_val == "" || date_val == "" || assign_val == "") {
    window.close();
    return
  }

  let a = await save_data(['custom_events'], [[class_val, date_val, assign_val, false]])

  wait(1000)
  window.getParentWindow().reload()
  window.close(); // closes the current window

}

window.log_settings = async function log_settings() {
  let auth = document.getElementById('key').value
  let courses_raw = document.getElementsByClassName('settings')
  let courses = []
  for (let i=0; i < courses_raw.length; i++) {
    courses.push(courses_raw[i].value)
  }

  let a = await save_data(['canvas_key', 'courses'], [auth, courses])
  wait(1000)
  var window = remote.getCurrentWindow(); // finds the current window
  window.getParentWindow().reload()
  window.close(); // closes the current window
}

window.fetch_settings = function fetch_settings() {
  const fs = require('fs'); // used to read JSON
  let calendar = JSON.parse(fs.readFileSync('./src/calendar.json')); // reads the JSON
  wait(150);

  var auth = calendar.canvas_key;
  var auth_input = document.getElementById('key')
  auth_input.value = auth

  var courses = calendar.courses
  var course_inputs = document.getElementsByClassName('settings')
  for (let i=0; i < courses.length; i++) {
    course_inputs[i].value = courses[i]
  }
}

window.fetch_settings()
