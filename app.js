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
    prioritized: false,
    createdAt: new Date().getTime(),
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

// función: actualizar el texto de una tarea
function updateTaskText(tasksArray, taskId, newText) {
  return tasksArray.map((task) => (task.id === taskId ? { ...task, text: newText } : task));
}

// función: cambiar el estado priorizado del objeto tarea
function togglePrioritized(tasksArray, taskId) {
  const updatedArray = tasksArray.map((task) =>
    task.id === taskId ? { ...task, prioritized: !task.prioritized } : task
  );

  const sortedArray = updatedArray.sort((a, b) => {
    if (a.prioritized !== b.prioritized) {
      return (b.prioritized ? 1 : 0) - (a.prioritized ? 1 : 0);
    }

    return a.createdAt - b.createdAt;
  });

  return sortedArray;
}

// función: crear botón genérico basado en parámetros
function createButton(label, className, name, taskId, iconHTML) {
  const button = document.createElement("button");
  button.classList.add("todo-app__button", className);
  button.setAttribute("aria-label", label);
  button.dataset.name = name;
  button.dataset.id = taskId;
  button.innerHTML = iconHTML;
  return button;
}

// función: genera los botones llamando a createButton() y pasandole los argumentos propios
function generateTaskButtons(taskId) {
  const completeButton = createButton(
    "Tarea completada",
    "todo-app__button--complete",
    "complete",
    taskId,
    `<i class="fa-solid fa-check"></i>`
  );

  const deleteButton = createButton(
    "Eliminar tarea",
    "todo-app__button--delete",
    "delete",
    taskId,
    `<i class="fa-solid fa-trash"></i>`
  );

  const editButton = createButton(
    "Editar tarea",
    "todo-app__button--edit",
    "edit",
    taskId,
    `<i class="fa-solid fa-pen-to-square"></i>`
  );

  const prioritizeButton = createButton(
    "Priorizar tarea",
    "todo-app__button--prioritize",
    "prioritize",
    taskId,
    `<i class="fa-solid fa-arrow-up"></i>`
  );

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("todo-app__actions");

  actionContainer.appendChild(completeButton);
  actionContainer.appendChild(deleteButton);
  actionContainer.appendChild(editButton);
  actionContainer.appendChild(prioritizeButton);

  return actionContainer;
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

// funciones de UI

// función: renderiza todas las tareas en la interfaz
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    taskItem.classList.add("todo-app__task");
    taskItem.setAttribute("role", "listitem");
    taskItem.dataset.id = task.id;

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

    if (task.prioritized) {
      taskItem.classList.add("todo-app__task--prioritized");
    }

    const statusLabel = document.createElement("span");
    statusLabel.classList.add("todo-app__task-status");
    statusLabel.textContent = task.completed ? "Completa" : "Incompleta";

    const buttonsContainer = generateTaskButtons(task.id);

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

  if (action === "edit") {
    const li = button.closest("li");
    const taskText = li.querySelector(".todo-app__task-text").textContent;

    const input = document.createElement("input");
    input.value = taskText;
    input.classList.add("todo-app__edit-input");

    const helpText = document.createElement("span");
    helpText.classList.add("todo-app__edit-help");
    helpText.textContent = "Presiona Enter para guardar o haz clic en cancelar";

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("todo-app__button", "todo-app__button--cancel");
    cancelButton.setAttribute("aria-label", "Cancelar edición");
    cancelButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    const editContainer = document.createElement("div");
    editContainer.classList.add("todo-app__edit-container");

    editContainer.appendChild(input);
    editContainer.appendChild(helpText);
    editContainer.appendChild(cancelButton);

    li.replaceChild(editContainer, li.querySelector(".todo-app__task-text"));

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const newText = input.value.trim();
        if (newText === "") {
          showErrorMessage("No puedes guardar una tarea vacía.");
          return;
        }

        tasks = updateTaskText(tasks, taskId, newText);
        saveTasksToStorage();
        renderTasks();
      }
    });

    cancelButton.addEventListener("click", () => renderTasks());
  }

  if (action === "prioritize") {
    tasks = togglePrioritized(tasks, taskId);
    saveTasksToStorage();
    renderTasks();
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
