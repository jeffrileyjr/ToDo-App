// variable for our task input
const todoInput = document.getElementById("todo-input");
// variable for our container
const todoList = document.querySelector(".todoList");
// variable for count of completed tasks
const completedCount = document.querySelector(".completedCount");
// empty array to hold our todo tasks
let tasks = [];
var elem = null;

function isBefore(el1, el2) {
    // loop checks if el2 is above el1 or not, if above then append el1 before el2, else append below
    for (
        var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling
    )
        if (cur === el2) return true;
    return false;
}

// adding eventlistener on our todoInput variable to get value when enter is hit
todoInput.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        // add our task to the todo list
        tasks.push({
            value: e.target.value,
            checked: false,
        });
        newTask(e.target.value);
        // clear input after enter is hit
        todoInput.value = "";
        countCompleted();
    }
});

function newTask(value) {
    // take the value from the input to make our task element
    const task = document.createElement("div");
    const taskText = document.createElement("p");
    const taskCheckbox = document.createElement("input");
    const taskCheckboxLabel = document.createElement("label");
    const deleteTask = document.createElement("span");

    let todoObj = tasks.find((todo) => todo.value === value);
    // we set the text content of our task to be the value from the input
    taskText.textContent = value;
    taskCheckbox.type = "checkbox";
    taskCheckbox.name = "checkbox";
    // need to set up the label so it can work with the checkbox
    taskCheckboxLabel.htmlFor = "checkbox";
    // add eventlistener to the label so we can delete it
    taskCheckboxLabel.addEventListener("click", function (e) {
        if (taskCheckbox.checked) {
            taskCheckbox.checked = false;
            taskText.style.textDecoration = "none";
            taskText.style.color = "var(--fontcolor)";
            taskCheckboxLabel.classList.remove("active");
            updateTasks(value, false);
            countCompleted();
        } else {
            updateTasks(value, true);
            taskCheckbox.checked = true;
            taskText.style.textDecoration = "line-through";
            taskText.style.color = "var(--activeFont)";
            taskCheckboxLabel.classList.add("active");
            countCompleted();
        }
    });

    deleteTask.addEventListener("click", function (e) {
        e.target.parentElement.classList.add('animate__animated', 'animate__bounceOutLeft')
        setTimeout(function () {
            e.target.parentElement.remove();
        }, 450)
        
        // update our array with a new array that does not contain deleted task object, this removes it from the dom and our array
        tasks = tasks.filter((todo) => todo !== todoObj);
        countCompleted();
    });

    task.classList.add("todo");
    taskCheckboxLabel.classList.add("circle");
    deleteTask.classList.add("cross");
    // append to our taskdiv.
    task.appendChild(taskCheckbox);
    task.appendChild(taskCheckboxLabel);
    task.appendChild(taskText);
    task.appendChild(deleteTask);

    task.draggable = true;
    task.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', null);
        elem = e.target;
    });
    task.addEventListener('dragover', (e) => {
        let el1;
        e.preventDefault();
        if (e.target.classList.contains('todo')) {
            el1 = e.target;
        } else {
            el1 = e.target.parentElement;
        }
        if (isBefore(elem, el1)) {
            el1.parentNode.insertBefore(elem, el1);
        } else {
            el1.parentNode.insertBefore(elem, el1.nextSibling);
        }
    });
    task.addEventListener('dragend', () => {
        elem = null;
        let index = tasks.findIndex((t) => t.value === value);
        // if a task is moved next to another, we rearrange the array in the same position, if it's at the end we move the task to the end of the array
        tasks.splice(index, 1);
        if (task.nextSibling) {
            let index1 = tasks.findIndex(
                (t) => t.value === task.nextSibling.querySelector('p').textContent
            );
            tasks.splice(index1, 0, {
                value: value,
                checked: task.querySelector('input').checked,
            });
        } else {
            tasks.push({
                value: value,
                checked: task.querySelector('input').checked,
            });
        };
    });
    // then we append our task div to our todo container
    todoList.appendChild(task);
}

function updateTasks(value, checked) {
    tasks.forEach((t) => {
        if (t.value === value) {
            t.checked = checked;
        }
    })
}

function countCompleted() {
    // filter out the tasks that are unchecked and then get the length for the count
    completedCount.textContent = `${
    tasks.filter((todo) => todo.checked === false).length
  } items left`;
}

function toggleTheme() {
    // toggles the light theme on the body when clicked
    document.body.classList.toggle("light-theme");
}

function clearCompleted() {
    document.querySelectorAll(".todo").forEach((todo) => {
        if (todo.querySelector("input").checked) {
            todo.remove();
        }
    });
}

function showAll() {
    document.querySelectorAll(".filters div").forEach((d, i) => {
        if (i === 0) {
            d.classList.add("filterActive");
        } else {
            d.classList.remove("filterActive");
        }
    });
    document.querySelectorAll(".todo").forEach((todo) => {
        if (todo.querySelector("input").checked) {
            todo.style.display = "grid";
        }
    });
}

function filterActive() {
    document.querySelectorAll(".filters div").forEach((d, i) => {
        if (i === 1) {
            d.classList.add("filterActive");
        } else {
            d.classList.remove("filterActive");
        }
    });
    document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "grid";
        if (todo.querySelector("input").checked) {
            todo.style.display = "none";
        }
    });
}

function filterCompleted() {
    document.querySelectorAll(".filters div").forEach((d, i) => {
        if (i === 2) {
            d.classList.add("filterActive");
        } else {
            d.classList.remove("filterActive");
        }
    });
    document.querySelectorAll(".todo").forEach((todo) => {
        todo.style.display = "grid";
        if (!todo.querySelector("input").checked) {
            todo.style.display = "none";
        }
    });
}