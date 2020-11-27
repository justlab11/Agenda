import { make_window, getCanvasWeek, organize_data, format_date } from './helper.js'

const remote = require('electron').remote
const addbtn = document.getElementById('append')
const settingsbtn = document.getElementById('settings')
const exitbtn = document.getElementById('exit')

addbtn.addEventListener('click', function (event) {
  make_window('pop-up.html', 600, 300)
})

settingsbtn.addEventListener('click', function (event) {
  make_window('settings.html', 780, 350)
})

exitbtn.addEventListener('click', function (event) {
  var window = remote.getCurrentWindow();
  window.close();
})

window.createAgenda = async function createAgenda() {
  let data = await getCanvasWeek(); // get the data
  for (let i=0; i < data.length; i++) {
    data[i][1] = new Date(data[i][1])
  }
  data = organize_data(data) // format the data by date
  let main = document.getElementById('agenda')
  for (let i=0; i < data.length; i++) {
    var btn = document.createElement('button')
    btn.className = data[i][3] ? 'btn finished':'btn'
    var div = document.createElement('div')
    div.className = 'topic'
    var h2 = document.createElement('h2')
    h2.className = 'left'
    var course = document.createTextNode(data[i][0])
    h2.appendChild(course)
    div.appendChild(h2)
    var h4 = document.createElement('h4')
    h4.className = 'right'
    var date = document.createTextNode(format_date(data[i][1]))
    h4.appendChild(date)
    div.appendChild(h4)
    btn.appendChild(div)
    var h3 = document.createElement('h3')
    var text = document.createTextNode(data[i][2])
    h3.appendChild(text)
    btn.appendChild(h3)
    main.appendChild(btn)
  }

  window.strike()
}

window.strike = function strike() {
  var agenda = document.getElementById('agenda');
  var btns = agenda.getElementsByClassName('btn');
  for (let i=0; i < btns.length; i++) {
    btns[i].addEventListener('click', function() {
      if (this.className.indexOf(' finished') == -1) {
        this.className += ' finished';
      } else {
        this.className = this.className.replace(' finished', '')
      }
    });
  }
}

window.createAgenda()
