let dayDisplay = $("#currentDay");
let saveBtn = $(".btn");
let taskSect = $("#task-list");
let today = dayjs().format("dddd, MMMM D YYYY");


let hour = dayjs().hour()

// compares the time and provides the class names for styling
function whatTime(currentTime, taskTime) {
  if (currentTime == taskTime) {
    return "present";
  } else if (Math.sign(taskTime - currentTime) === 1) {
    return "future";
  } else {
    return "past";
  }
}

// takes 24 hour time and converts it while appending am/pm
function amOrPm(time) {
  if (time === 24) {
    return "12am";
  } else if (time > 12) {
    return `${time % 12}pm`;
  } else {
    return `${time}am`;
  }
}

// get any taskes from memory
//currently returns array of arrays
function getTasks(array) {
  taskStorage = [];
  for (let i = 0; i < array.length; i++) {
    let time = JSON.parse(array[i]).toString();
    timeBlockId = `hour-${time}`;
    let task = localStorage.getItem(timeBlockId);
    taskStorage.push([time, task]);
  }
  return taskStorage;
}

// creates the elements to display tasks
// uses an array of arrays at the moment
function createTasks(array) {
  for (let i = 0; i < array.length; i++) {
    let time = array[i][0];
    let task = array[i][1];

    let relativeTime = whatTime(hour, time);
    let taskArt = $("<article>")
      .addClass(`row time-block ${relativeTime}`)
      .attr("id", `hour-${Number(time)}`);
    let taskP = $("<div>")
      .addClass("col-2 col-md-1 hour text-center py-3")
      .text(amOrPm(time));
    let taskTa = $("<textarea>")
      .addClass("col-8 col-md-10 description")
      .text(task);
    let saveBtn = $("<button>")
      .addClass("btn saveBtn col-2 col-md-1")
      .attr("aria-label", "save");
    let btnImg = $("<i>").addClass("fas fa-save").attr("aria-hidden", "true");

    saveBtn.append(btnImg);
    taskArt.append(taskP, taskTa, saveBtn);
    taskSect.append(taskArt);

    // listens for when the user hits the save button
    // puting the click listener here so that it will catch any created buttons
    saveBtn.on("click", function () {
      console.log("test");
      let task = $(this).parent().children("textArea").val().trim();
      console.log("task:", task);
      let timeBlock = $(this).parent().attr("id");
      JSON.stringify(task, timeBlock);
      localStorage.setItem(timeBlock, task);
    });
  }
}

// display the current date in the header of the page.
dayDisplay.text(today);

// adjust this array for any additional time slots
// array expects 24 hour time but will convert on display
// there are no checks for valid whole numbers
// any number past 24 will display as its mod 12 per amOrPm() function
workDayHours = [9, 10, 11, 12, 13, 14, 15, 16, 17];

let storedTasks = getTasks(workDayHours);

createTasks(storedTasks);
