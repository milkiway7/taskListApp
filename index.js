const inputEl = document.querySelector("#input-el");
const dateEl = document.querySelector("#date-el");
const btnEl = document.querySelector("#save-btn");
const taskEl = document.querySelector("#task-el");
const clearBtn = document.querySelector("#clear-el");
let dataFromLocalStorage = JSON.parse(localStorage.getItem("todo"));
let taskObj = {};
let objCount = 0;

// if there is data in local storage applay it to taskObj;
if (dataFromLocalStorage) {
  taskObj = dataFromLocalStorage;
  objCount = Object.keys(taskObj).length;
  render();
}
btnEl.addEventListener("click", () => {
  if (dateEl.value && inputEl.value) {
    nestObj();
    localStorage.setItem("todo", JSON.stringify(taskObj));
    render();
  }
});

// create nested obj in taskObj
function nestObj() {
  objCount++;
  taskObj[objCount] = {};
  taskObj[objCount].id = "t" + objCount;
  taskObj[objCount].date = dateEl.value;
  taskObj[objCount].make = [inputEl.value];
  dateEl.value = "";
  inputEl.value = "";
}

// render values from taskObj

function render() {
  let renderVal = "";
  for (let key in taskObj) {
    let index = taskObj[key].id;
    renderVal += `
    <div id = '${index}'>
    <h4>${taskObj[key].date}</h4>`;
    // render all tasks
    for (let task of taskObj[key].make) {
      renderVal += `
      <div class = 'one-task'>
      <p>- ${task}</p>
      <div data-value = "${task}" class="del-one-task" onclick = 'delOneTask(${index}.id,this.getAttribute("data-value"))'></div>
      </div>
      `;
    }
    renderVal += `<button id = 'btn${index} 'type = 'button' onclick = 'addTask(input${index}.id,this.id,${index}.id)'>Add task</button>
    <input type = 'text' id='input${index}'>
    <button type = 'button' onclick = 'remove(${index}.id)'>Remove</button>
    </div>`;
  }
  taskEl.innerHTML = renderVal;
}

// clear all task list
clearBtn.addEventListener("click", () => {
  localStorage.clear();
  taskObj = {};
  objCount = 0;
  render();
});

// remove all day's tasks
function remove(element_id) {
  for (let prop in taskObj) {
    if (taskObj[prop].id === element_id) {
      delete taskObj[prop];
    }
  }
  let objArr = Object.entries(taskObj);
  objCount = 0;
  for (let index of objArr) {
    objCount++;
    index[0] = objCount;
    index[1].id = "t" + objCount;
  }
  taskObj = Object.fromEntries(objArr);
  localStorage.setItem("todo", JSON.stringify(taskObj));
  dataFromLocalStorage = JSON.parse(localStorage.getItem("todo"));
  render();
}

// add task to existing task-div
function addTask(inp_id, btn_id, div_id) {
  $("#" + inp_id).css("display", "block");
  let btnNewTask = document.getElementById(`${btn_id}`);
  let newInput = document.getElementById(`${inp_id}`);
  btnNewTask.innerHTML = "Save";
  if (newInput.value) {
    btnNewTask.addEventListener("click", () => {
      for (let key in taskObj) {
        if (div_id === taskObj[key].id) {
          taskObj[key].make.push(newInput.value);
        }
      }
      localStorage.setItem("todo", JSON.stringify(taskObj));
      dataFromLocalStorage = JSON.parse(localStorage.getItem("todo"));
      console.log(taskObj);
      render();
    });
  }
}
// remove 1 task from day's tasks

function delOneTask(div_id, data) {
  for (let key in taskObj) {
    if (div_id === taskObj[key].id) {
      taskObj[key].make.splice(taskObj[key].make.indexOf(data), 1);
    }
  }
  localStorage.setItem("todo", JSON.stringify(taskObj));
  dataFromLocalStorage = JSON.parse(localStorage.getItem("todo"));
  render();
}
