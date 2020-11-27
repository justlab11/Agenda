//
// jQuery.ajax({
//         url: "https://canvas.instructure.com/api/v1/calendar_events",
//         beforeSend: function(xhr) {
//              xhr.setRequestHeader("Authorization", "Bearer 25~LvJV1cHR3ODCUd5fbMEzQ9w15cgnFpA6FNE2EPJ86RFOEEMUKMH1rkQk01hofEoF")
//         }, success: function(data){
//             console.log(data);
//             //process the JSON data etc
//         }
// })

// i wrote almost 0 of this code myself
// const fetch = require('node-fetch')
// const url = "https://udel.instructure.com//api/v1/calendar_events?type=event&type=assignment&end_date=2020-12-01&context_codes[]=course_1535513&context_codes[]=course_1537097";
//
// const options = {
//   method: 'GET',
//   headers: {
//     Authorization: "Bearer 25~LvJV1cHR3ODCUd5fbMEzQ9w15cgnFpA6FNE2EPJ86RFOEEMUKMH1rkQk01hofEoF"
//   }
// };
//
// fetch(url, options)
//   .then( res => res.json() )
//   .then( data => console.log(data) );

async function getWeek() {
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
  console.log(canvas_data)

  let assignments = []
  for (let i=0; i < canvas_data.length; i++) {
    assignments.push([
       canvas_data[i].context_name.slice(4, 11),
       canvas_data[i].assignment.due_at,
       canvas_data[i].title.trim(),
       false
     ])
  }

  await save_data('o', 'assignments', assignments)
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

getWeek()

function quicksort(data) {
  if (data.length < 1) return [];
  var left = []
  var right = []
  var pivot = data[0]

  for (var i = 1; i < data.length; i++) {
    if (data[i] < pivot) {
      left.push(data[i]);
    } else {
      right.push(data[i])
    }
  }

  return [].concat(quicksort(left), pivot, quicksort(right));
}
