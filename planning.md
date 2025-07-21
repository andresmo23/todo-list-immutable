# 🎯 Plano técnico de my-immutable-todo

## 🔧 Funcionalidades
- [x] Agregar tarea
- [x] Eliminar tarea
- [x] Editar tarea
- [ ] Priorizar tarea
- [x] Marcar como completada
- [x] Mostrar en pantalla lo que hay en el array
- [x] Guardar tareas en localstorage

## 🧠 Estructura del estado
Cada tarea será:
{
    id: string,
    task: string,
    completed: boolean
}

## 🛠 Funciones planeadas
- [x] addTask() -- agregar tarea al array
- [x] removeTaskById() -- eliminar tarea por id
- [x] renderTask() -- mostrar lo que hay en el array en pantalla
- [x] toggleTaskCompleted() -- marcar tarea como completada y cambiar el estilo de la tarea
- [x] showErrorMessage() -- mostrar mensaje de error en pantalla

## 👓 Variables globales
- [x] Referencias necesarias al DOM
- [x] un arreglo vació con scoope global que será actualizada en diferentes momentos del archivo

## 🧩 Rama: editar-tarea
### Objetivo: Nuevas funcionalidades
- [x] Crear función genérica createButton() para generar botones con parámetros
- [x] Reemplazar createTaskButtons(taskId) por una función que use createButton() y genere completar, eliminar, editar y priorizar
- [x] updateTaskText() -- implementar lógica de edición de tarea 
- [ ] Implementar lógica de priorización de tarea
- [ ] Cambiar estilo visual de tareas priorizadas

## 📚 Notas de arquitectura
Se busca mantener el principio DRY al evitar duplicación de lógica en la creación de botones

Las nuevas funciones deben integrarse con renderTasks() sin romper el flujo actual

Los botones deben tener aria-label y data-name para facilitar su identificación en listeners