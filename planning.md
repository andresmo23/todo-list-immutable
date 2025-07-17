# 🎯 Plano técnico de my-immutable-todo

## 🔧 Funcionalidades
- [x] Agregar tarea
- [x] Eliminar tarea
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
- [x] createTaskButtons() -- crear botones
- [x] showErrorMessage() -- mostrar mensaje de error en pantalla

## 👓 Variables globales
- [x] Referencias necesarias al DOM
- [x] un arreglo vació con scoope global que será actualizada en diferentes momentos del archivo

# Ruta logica para crear proyectos paso a paso

1. Visualizar el resultado que querés
Antes de escribir código, pensá:

   - ¿Qué debe hacer el usuario?

   - ¿Qué debe mostrar la pantalla?

   - ¿Qué datos necesito guardar?

📌 Esto te ayuda a saber qué funcionalidades vas a tener y cuál es el estado que vas a manejar.

2. Arquitectura base del archivo
Esto es como preparar el terreno antes de construir 🏗️

   - Crear index.html, styles.css, app.js

   - Declarar clases e IDs limpios (BEM)

   - Escribir el planning.md con funcionalidades y funciones


3. Referencias al DOM
Esto va primero en el app.js porque las funciones lo van a usar

4. Declarar el estado inicial
El array vacío, que irá cambiando a medida que el usuario interactúe

5. Crear funciones puras
Antes de conectar con la interfaz, definí la lógica

Esto te permite probar y entender cómo cambia el estado sin preocuparte del DOM.

6. Crear funciones de UI
Con el estado ya estructurado se pueden crear funciones que muestren en pantalla 

7. Escribir listeners de eventos
Ahora que tenés las funciones listas, los eventos solo las llaman y actualizan el estado

8. Validaciones y detalles
Una vez que lo básico funciona, pensá en mejorar la experiencia:

   - Evitar tareas vacías

   - Mostrar mensajes de error

   - Animaciones si querés

   - Guardar en localStorage