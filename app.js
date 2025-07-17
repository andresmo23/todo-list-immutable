// referencias al DOM
const taskInput = document.querySelector(".todo-app__input");
const taskAddButton = document.querySelector(".todo-app__button--add");
const taskList = document.querySelector(".todo-app__list");
const themeButton = document.getElementById("theme-toggle");

// estado global
let tasks = [];
tasks = loadTasksFromStorage();
renderTasks();

// funciones puras

// función: agregar nueva tarea al estado
function addTask(taskText) {
  const newTask = {
    id: crypto.randomUUID(),
    text: taskText,
    completed: false,
  };

  return [...tasks, newTask];
}

// función: remover tarea del arreglo sin involucrar el arreglo original
function removeTaskById(taskId) {
  return tasks.filter((task) => task.id !== taskId);
}

// función: modificar el estado de completado de una tarea según su id
function toggleTaskCompleted(taskId) {
  return tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task));
}

// función: crear botones de acción para cada tarea (completar y eliminar) (especifico)
function createTaskButtons(taskId) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("todo-app__actions");

  const completeBtn = document.createElement("button");
  completeBtn.classList.add("todo-app__button", "todo-app__button--complete");
  completeBtn.setAttribute("aria-label", "Completar tarea");
  completeBtn.dataset.name = "complete";
  completeBtn.dataset.id = taskId;
  completeBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("todo-app__button", "todo-app__button--delete");
  deleteBtn.setAttribute("aria-label", "Eliminar tarea");
  deleteBtn.dataset.name = "delete";
  deleteBtn.dataset.id = taskId;
  deleteBtn.innerHTML = `<i class="fa-solid fa-trash"></i>`;

  buttonContainer.appendChild(completeBtn);
  buttonContainer.appendChild(deleteBtn);

  return buttonContainer;
}

// funciones de almacenamiento

// función: para guardar tareas en el localstorage
function saveTasksToStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// función: para cargar desde el localstorage
function loadTasksFromStorage() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

// TODO: esta función y los demas componentes necesarios se utilizarán en otra rama
// función: crear botón genérico basado en parámetros
/* function createButton(label, className, name, taskId, iconHTML) {
  const button = document.createElement("button");
  button.classList.add("todo-app__button", className);
  button.setAttribute("aria-label", label);
  button.name = name;
  button.dataset.id = taskId;
  button.innerHTML = iconHTML;
  return button;
} */

// funciones de UI

// función: renderiza todas las tareas en la interfaz
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("todo-app__task");
    taskItem.setAttribute("role", "listitem");
    taskItem.dataset.id = task.id;

    // console.log("Render #", task.text, task.completed);

    const textLabel = document.createElement("span");
    textLabel.classList.add("todo-app__task-text");
    textLabel.textContent = task.text;

    if (task.completed) {
      setTimeout(() => {
        taskItem.classList.add("todo-app__task--completed");
      }, 10);
    } else {
      setTimeout(() => {
        taskItem.classList.remove("todo-app__task--completed");
      }, 10);
    }

    const statusLabel = document.createElement("span");
    statusLabel.classList.add("todo-app__task-status");
    statusLabel.textContent = task.completed ? "Completa" : "Incompleta";

    const buttonsContainer = createTaskButtons(task.id);

    taskItem.appendChild(textLabel);
    taskItem.appendChild(statusLabel);
    taskItem.appendChild(buttonsContainer);

    taskList.appendChild(taskItem);
  });
}

// función: mostrar un mensaje de error en pantalla
function showErrorMessage(message) {
  const existing = document.querySelector(".todo-app__task--message");
  if (existing) existing.remove();

  setTimeout(() => {
    const error = document.querySelector(".todo-app__task--message");
    if (error) error.remove();
  }, 3000);

  const messageShow = document.createElement("p");
  messageShow.classList.add("todo-app__task--message");
  messageShow.textContent = message;
  taskList.appendChild(messageShow);
}

// listener de eventos

taskAddButton.disabled = true;

// Deshabilitar el boton si el input está vació
taskInput.addEventListener("input", () => {
  taskAddButton.disabled = !taskInput.value.trim();
});

// Evento para el boton agregar:
taskAddButton.addEventListener("click", () => {
  const inputText = taskInput.value.trim();

  // Verifica que el input no esté vacio
  if (!inputText) {
    showErrorMessage("Debes ingresar una tarea.");
    return;
  }

  // Verifica que no se agreguen tareas duplicadas
  const isDuplicated = tasks.some((task) => task.text.toLowerCase() === inputText.toLowerCase());
  if (isDuplicated) {
    showErrorMessage("Esa tarea ya fue agregada.");
    return;
  }

  // Mostrar el error por 3 segundos
  setTimeout(() => {
    const error = document.querySelector(".todo-app__task--message");
    if (error) error.remove();
  }, 3000);

  const updatedTasks = addTask(inputText);
  tasks = updatedTasks;
  saveTasksToStorage();
  renderTasks();

  taskInput.value = "";
});

// Delegacion de eventos para capturar que hace cada boton
taskList.addEventListener("click", (event) => {
  // verificar si se hizo clic en un boton con icono dentro
  const button = event.target.closest("button");
  if (!button) return;

  const taskId = button.dataset.id;
  const action = button.dataset.name;

  if (action === "delete") {
    const updatedTasks = removeTaskById(taskId);
    tasks = updatedTasks;
    saveTasksToStorage();
    renderTasks();
    return;
  }

  if (action === "complete") {
    const updatedTasks = toggleTaskCompleted(taskId);
    tasks = updatedTasks;
    saveTasksToStorage();

    const li = button.closest("li");
    li.classList.toggle("todo-app__task--completed");

    const statusLabel = li.querySelector(".todo-app__task-status");
    const task = tasks.find((t) => t.id === taskId);
    statusLabel.textContent = task.completed ? "Completa" : "Incompleta";

    return;
  }
});

// Verificar si hay un tema guardado
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeButton.querySelector("i").classList.replace("fa-moon", "fa-sun");
}

// cambiar tema
themeButton.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");

  // cambia el icono visual
  const icon = themeButton.querySelector("i");
  icon.classList.toggle("fa-moon", !isDark);
  icon.classList.toggle("fa-sun", isDark);

  // guardar preferencia del usuario
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
