import { save_data } from './helper.js'
const remote = require('electron').remote // make sure electron exists
const wait=ms=>new Promise(resolve => setTimeout(resolve, ms));
const cancelbtn = document.getElementById('cancel') // finds the cancel button

cancelbtn.addEventListener('click', function (event) {
  var window = remote.getCurrentWindow(); // finds the current window
  window.close(); // closes the current window
})

window.log_custom = async function log_custom() {
  let class_val = document.getElementById('class').value
  let date_val = document.getElementById('date').value
  let assign_val = document.getElementById('assignment').value
  await save_data('p', 'custom_events', [class_val, date_val, assign_val, false])
  var window = remote.getCurrentWindow(); // finds the current window
  window.close(); // closes the current window
}

window.log_settings = async function log_settings() {
  let auth = document.getElementById('key').value
  let courses_raw = document.getElementsByClassName('settings')
  let courses = []
  for (let i=0; i < courses_raw.length; i++) {
    courses.push(courses_raw[i].value)
  }

  await save_data('o', 'canvas_key', auth)
  await save_data('o', 'courses', courses)

  var window = remote.getCurrentWindow(); // finds the current window
  window.close(); // closes the current window
}
